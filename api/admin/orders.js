import { needAdmin, enabledOrderModes, ordersDb } from '../_lib/decemberAdmin.js'
import { confirmPayment } from '../_lib/payments.js'

export default async function handler(req,res){
 res.setHeader('X-Robots-Tag','noindex, nofollow')
 if(!needAdmin(req,res))return
 const allowed=enabledOrderModes()
 const requested=String(req.query?.environment||'all')
 const modes=requested==='all'?allowed:allowed.filter(x=>x===requested)
 if(!modes.length)return res.status(400).json({error:'That payment environment is unavailable'})
 try{
  // Recover legitimately completed transactions when a webhook or customer
  // callback was missed. Provider verification is authoritative and idempotent.
  // The bounded scan prevents old abandoned checkouts from causing large
  // Paystack API bursts on every admin page load.
  const reconciliations=await Promise.allSettled(modes.map(async mode=>{
    const sql=ordersDb(mode)
    const waiting=await sql`SELECT reference FROM payment_orders
      WHERE environment=${mode} AND product='december-website'
        AND status='pending' AND created_at > now()-interval '14 days'
      ORDER BY created_at DESC LIMIT 8`
    const attempts=await Promise.allSettled(waiting.map(order=>confirmPayment(order.reference,mode)))
    return {mode,checked:waiting.length,providerErrors:attempts.filter(x=>x.status==='rejected').length}
  }))
  const results=await Promise.all(modes.map(async mode=>{
   const sql=ordersDb(mode)
   const rows=await sql`SELECT
      o.reference,o.product,o.environment,o.customer_name,o.customer_email,o.customer_whatsapp,
      o.business_name,o.amount_kobo,o.quote_total_kobo,o.payment_mode,o.status,o.configuration,
      o.paid_at,o.created_at,o.updated_at,
      i.business_name AS intake_name,i.business_description,i.asset_folder_url,i.logo_url,i.instagram_url,
      i.website_domain,i.whatsapp_number AS intake_whatsapp,i.brand_colors,i.festive_offer,
      i.delivery_information,i.order_deadline,i.contact_address,i.policies,i.additional_notes,
      i.items AS submitted_items,i.assets_submitted_complete,i.review_status AS intake_review_status,
      i.submitted_at AS intake_submitted_at,i.updated_at AS intake_updated_at,
      p.stage,p.percent_complete,p.public_note,p.private_note,p.estimated_completion_date,
      p.assets_confirmed_at,p.updated_at AS progress_updated_at
    FROM payment_orders o
    LEFT JOIN december_business_intakes i ON i.payment_reference=o.reference
    LEFT JOIN december_project_progress p ON p.payment_reference=o.reference
    WHERE o.environment=${mode} AND (${mode}='test' OR o.status='paid')
    ORDER BY o.created_at DESC LIMIT 500`
   return {mode,rows:rows.map(row=>{
    const config=row.configuration||{}
    const items=Array.isArray(config.line_items)?config.line_items:[]
    return {...row,items_purchased:items,configuration:config,
      submitted_items:Array.isArray(row.submitted_items)?row.submitted_items:[]}
   })}
  }))
  const orders=results.flatMap(x=>x.rows).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))
  const summary={
    live:orders.filter(o=>o.environment==='live').length,test:orders.filter(o=>o.environment==='test').length,
    paid:orders.filter(o=>o.status==='paid').length,pending:orders.filter(o=>o.status!=='paid').length,
    websiteOrders:orders.filter(o=>o.product==='december-website').length,
  }
  return res.status(200).json({orders,summary,modes,limitPerEnvironment:500,providerSync:reconciliations.filter(x=>x.status==='fulfilled').map(x=>x.value)})
 }catch(err){
  console.error('Admin orders lookup failed',err?.message)
  return res.status(502).json({error:'Unable to load payment records'})
 }
}
