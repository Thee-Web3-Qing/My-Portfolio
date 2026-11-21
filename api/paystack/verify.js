import { confirmPayment, environment } from '../_lib/payments.js'
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store')
  if(req.method !== 'GET') return res.status(405).json({error:'Method not allowed'})
  const reference=String(req.query?.reference||'').trim()
  try {
    const result=await confirmPayment(reference,environment())
    return res.status(result.found?200:404).json(result)
  } catch (error) {
    console.error('Paystack verification failed',error?.message)
    return res.status(502).json({error:'Could not verify this transaction yet. Please check again.'})
  }
}
