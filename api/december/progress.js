import { confirmPayment, dbForMode, environment } from '../_lib/payments.js'

export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store')
 res.setHeader('X-Robots-Tag','noindex, nofollow')
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'})
 const reference=String(req.query?.reference||'').trim()
 const requested=String(req.query?.mode||environment())
 const mode=requested==='test'?'test':requested==='live'?'live':''
 if(!/^QDEC-[a-f0-9]{32}$/i.test(reference)||!mode)
  return res.status(400).json({error:'Enter your valid website payment reference.'})

 try{
  const sql=dbForMode(mode)
  const orderCheck=await sql`SELECT product FROM payment_orders
    WHERE reference=${reference} AND environment=${mode} LIMIT 1`
  if(!orderCheck.length||orderCheck[0].product!=='december-website')
   return res.status(404).json({error:'Website order not found in this payment environment.'})
  const verification=await confirmPayment(reference,mode)
  if(!verification.paid)
   return res.status(200).json({
    found:true,paid:false,reference,environment:mode,
    stage:'payment_pending',percent:0,
    publicNote:'Paystack has not confirmed this transaction. Check your payment receipt before retrying a payment.'
   })

  const rows=await sql`SELECT o.reference,o.created_at,
    p.stage,p.percent_complete,p.public_note,p.estimated_completion_date,
    p.assets_confirmed_at,p.updated_at,
    i.assets_submitted_complete,i.submitted_at
    FROM payment_orders o
    LEFT JOIN december_project_progress p ON p.payment_reference=o.reference
    LEFT JOIN december_business_intakes i ON i.payment_reference=o.reference
    WHERE o.reference=${reference} AND o.environment=${mode}
     AND o.status='paid' AND o.product='december-website'
    LIMIT 1`
  if(!rows.length)return res.status(404).json({error:'Website project not found'})
  const order=rows[0]
  const stage=order.stage||(!order.submitted_at?'awaiting_assets':order.assets_submitted_complete?'assets_under_review':'awaiting_assets')
  const defaultNote=!order.submitted_at?
    'Your payment is confirmed. Please send your business information and product photos to get started.':
    order.assets_submitted_complete?'Your submitted resources are awaiting review.':
    'We have saved your business information. Complete the remaining materials to begin the build.'
  return res.status(200).json({
   found:true,paid:true,reference,environment:mode,stage,
   percent:Number(order.percent_complete||0),
   publicNote:order.public_note||defaultNote,
   updatedAt:order.updated_at||order.submitted_at||order.created_at,
   estimatedCompletion:order.estimated_completion_date||null,
   assetsConfirmedAt:order.assets_confirmed_at||null,
   hasBusinessInfo:!!order.submitted_at,
  })
 }catch(error){
  console.error('December project status lookup failed:',error?.message)
  return res.status(502).json({error:'Unable to retrieve your project status right now. Please try again.'})
 }
}
