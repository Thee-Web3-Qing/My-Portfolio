import { confirmPayment, db, environment } from '../_lib/payments.js'
const clean=x=>typeof x==='string'?x.trim():''
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store')
 res.setHeader('X-Robots-Tag','noindex, nofollow')
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'})
 const reference=clean(req.query?.reference)
 if(!/^QDEC-[0-9a-f]{32}$/i.test(reference))return res.status(400).json({error:'Enter your complete website payment reference.'})
 try{
  const verification=await confirmPayment(reference,environment())
  if(!verification.found)return res.status(404).json({error:'No matching December website order was found for this environment.'})
  if(verification.product && verification.product!=='december-website')return res.status(404).json({error:'No matching website project'})
  if(!verification.paid)return res.status(200).json({
    found:true,paid:false,reference,stage:'payment_pending',percent:0,
    publicNote:'Paystack has not yet confirmed this payment. Please check your Paystack receipt before attempting another payment.'
  })
  const sql=db()
  const rows=await sql`SELECT o.reference,o.product,o.status,o.created_at,
    p.stage,p.percent_complete,p.public_note,p.estimated_completion_date,p.assets_confirmed_at,p.updated_at,
    i.assets_submitted_complete,i.submitted_at
    FROM payment_orders o
    LEFT JOIN december_project_progress p ON p.payment_reference=o.reference
    LEFT JOIN december_business_intakes i ON i.payment_reference=o.reference
    WHERE o.reference=${reference} AND o.environment=${environment()} AND o.product='december-website'
    LIMIT 1`
  if(!rows.length)return res.status(404).json({error:'Website order not found'})
  const o=rows[0]
  const stage=o.stage||(!o.submitted_at?'awaiting_assets':o.assets_submitted_complete?'assets_under_review':'awaiting_assets')
  const note=o.public_note||(!o.submitted_at?
    'Your payment is confirmed. Please complete your business information and submit your product photos to begin.':
    o.assets_submitted_complete?'Your information has been submitted and is awaiting review.':
    'We have saved your details. Please supply the missing resources so the review can begin.')
  return res.status(200).json({
    found:true,paid:true,reference,stage,percent:Number(o.percent_complete||0),
    publicNote:note,updatedAt:o.updated_at||o.submitted_at||o.created_at,
    estimatedCompletion:o.estimated_completion_date||null,
    assetsConfirmedAt:o.assets_confirmed_at||null,hasBusinessInfo:!!o.submitted_at
  })
 }catch(error){
  console.error('December progress lookup failed',error?.message)
  return res.status(502).json({error:'Unable to check progress right now. Please try again.'})
 }
}
