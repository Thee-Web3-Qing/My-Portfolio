import { confirmPayment, configuredKey, environment, verifySignature } from '../_lib/payments.js'

export const config = { api: { bodyParser: false } }

async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body
  if (typeof req.body === 'string') return Buffer.from(req.body)
  const chunks=[]
  let size=0
  for await (const part of req) {
    size+=part.length
    if(size>250000) throw new Error('Webhook body too large')
    chunks.push(part)
  }
  if(chunks.length) return Buffer.concat(chunks)
  // Some Vercel Node runtimes expose a parsed object. Re-serialization is only
  // accepted when the original Paystack HMAC also verifies exactly.
  if (req.body && typeof req.body === 'object') return Buffer.from(JSON.stringify(req.body))
  throw new Error('Raw webhook body unavailable')
}

export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store')
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  const mode=environment()
  if(!configuredKey(mode)) return res.status(503).json({error:'Webhook not configured'})
  let raw
  try { raw=await readBody(req) } catch { return res.status(400).json({error:'Invalid body'}) }
  if(!verifySignature(raw,req.headers['x-paystack-signature'],mode)) return res.status(401).json({error:'Invalid signature'})
  let event
  try { event=JSON.parse(raw.toString('utf8')) } catch { return res.status(400).json({error:'Invalid payload'}) }
  if(event.event!=='charge.success') return res.status(200).json({received:true,ignored:true})
  const reference=String(event.data?.reference || '')
  try {
    const result=await confirmPayment(reference,mode)
    if(!result.found) return res.status(200).json({received:true,matched:false})
    if(!result.paid) return res.status(409).json({received:false,verified:false})
    if(result.qutlineDeliveryRequired&&!result.qutlineDeliverySent) return res.status(503).json({received:false,verified:true,deliveryPending:true})
    return res.status(200).json({received:true})
  } catch (err) {
    console.error('Paystack webhook verification failed',err?.message)
    return res.status(500).json({error:'Webhook processing failed'})
  }
}
