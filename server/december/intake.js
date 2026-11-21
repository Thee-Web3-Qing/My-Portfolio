import { confirmPayment, db, environment } from '../../api/_lib/payments.js'
import { ADDONS, calculateDecemberQuote } from '../../src/data/december.js'

const clean = (value, max=500) => typeof value === 'string' ? value.trim().slice(0,max) : ''
const isURL = (value) => !value || (value.length <= 1200 && (/^https:\/\//i.test(value) || /^\/api\/december\/image\?id=[0-9a-f-]{36}$/i.test(value)))
const emailOK = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const FIELDS = {
  businessName:120, businessDescription:2200, assetFolderUrl:1200, logoUrl:1200,
  instagramUrl:500, websiteDomain:240, whatsappNumber:60, brandColors:240,
  festiveOffer:800, deliveryInformation:1100, orderDeadline:300, contactAddress:750,
  policies:1300, additionalNotes:1700,
}
function normaliseData(raw) {
  const item={}
  for(const [key,size] of Object.entries(FIELDS)) item[key]=clean(raw[key],size)
  item.assetsSubmittedComplete=raw.assetsSubmittedComplete === true
  item.items=Array.isArray(raw.items) ? raw.items.map((x)=>({
    name:clean(x.name,120),price:clean(x.price,60),description:clean(x.description,600),
    imageUrl:clean(x.imageUrl,1200),
  })).filter(x=>x.name||x.price||x.description||x.imageUrl) : []
  return item
}

export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store')
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  if(!process.env.DATABASE_URL) return res.status(503).json({error:'Intake database is not configured'})
  const body=req.body && typeof req.body==='object' ? req.body : {}
  const reference=clean(body.reference,120)
  const email=clean(body.email,160).toLowerCase()
  if(!/^QDEC-[a-z0-9]{32}$/i.test(reference) || !emailOK(email)) return res.status(400).json({error:'Enter your Paystack payment reference and the email used at checkout.'})
  try {
    const sql=db()
    const orders=await sql`SELECT reference,customer_email,business_name,configuration,status FROM payment_orders
      WHERE reference=${reference} AND environment=${environment()} AND product='december-website' LIMIT 1`
    if(!orders.length || clean(orders[0].customer_email,160).toLowerCase()!==email) return res.status(404).json({error:'We could not find a matching payment reference and email.'})
    const verification=await confirmPayment(reference,environment())
    if(!verification.paid) return res.status(409).json({error:'This payment has not yet been verified. Please check the payment status page before submitting business information.'})
    const order=orders[0]
    const configuration=order.configuration && typeof order.configuration==='object' ? order.configuration : {}
    const original=calculateDecemberQuote({industry:configuration.industry,layout:configuration.layout,addons:configuration.addons,images:configuration.images})
    const context={reference,business:order.business_name,industry:original.industry.label,
      layout:original.layout.label,addons:original.selectedAddons.map(x=>x.name),maxItems:configuration.addons?.includes('expanded-catalogue')?30:12}
    if(body.action==='lookup'){
      const rows=await sql`SELECT * FROM december_business_intakes WHERE payment_reference=${reference} LIMIT 1`
      const saved=rows[0] || null
      return res.status(200).json({success:true,context,
        submission:saved?{
          businessName:saved.business_name,businessDescription:saved.business_description,assetFolderUrl:saved.asset_folder_url,
          logoUrl:saved.logo_url,instagramUrl:saved.instagram_url,websiteDomain:saved.website_domain,
          whatsappNumber:saved.whatsapp_number,brandColors:saved.brand_colors,festiveOffer:saved.festive_offer,
          deliveryInformation:saved.delivery_information,orderDeadline:saved.order_deadline,
          contactAddress:saved.contact_address,policies:saved.policies,additionalNotes:saved.additional_notes,
          items:saved.items,assetsSubmittedComplete:saved.assets_submitted_complete,
          reviewStatus:saved.review_status,submittedAt:saved.submitted_at,assetsConfirmedAt:saved.assets_confirmed_at
        }:null})
    }
    if(body.action!=='submit') return res.status(400).json({error:'Invalid form action'})
    const intake=normaliseData(body.details||{})
    if(intake.businessName.length<2 || intake.businessDescription.length<20 || intake.whatsappNumber.replace(/\D/g,'').length<10) {
      return res.status(400).json({error:'Enter a business name, a useful business description, and an order contact number.'})
    }
    if(intake.items.length>context.maxItems) return res.status(400).json({error:'Your current plan supports up to '+context.maxItems+' listed items.'})
    if(!isURL(intake.logoUrl)||!isURL(intake.assetFolderUrl)||!isURL(intake.instagramUrl)||intake.items.some(x=>!isURL(x.imageUrl))) {
      return res.status(400).json({error:'Use complete https:// links for logos, shared assets and product images.'})
    }
    const result=await sql`INSERT INTO december_business_intakes
      (payment_reference,contact_email,business_name,business_description,logo_url,asset_folder_url,
       instagram_url,website_domain,whatsapp_number,brand_colors,festive_offer,delivery_information,
       order_deadline,contact_address,policies,additional_notes,items,assets_submitted_complete,review_status)
      VALUES (${reference},${email},${intake.businessName},${intake.businessDescription},${intake.logoUrl},
       ${intake.assetFolderUrl},${intake.instagramUrl},${intake.websiteDomain},${intake.whatsappNumber},
       ${intake.brandColors},${intake.festiveOffer},${intake.deliveryInformation},
       ${intake.orderDeadline},${intake.contactAddress},${intake.policies},${intake.additionalNotes},
       ${JSON.stringify(intake.items)}::jsonb,${intake.assetsSubmittedComplete},
       ${intake.assetsSubmittedComplete?'awaiting_review':'needs_assets'})
      ON CONFLICT (payment_reference) DO UPDATE SET
       business_name=EXCLUDED.business_name,business_description=EXCLUDED.business_description,
       logo_url=EXCLUDED.logo_url,asset_folder_url=EXCLUDED.asset_folder_url,
       instagram_url=EXCLUDED.instagram_url,website_domain=EXCLUDED.website_domain,
       whatsapp_number=EXCLUDED.whatsapp_number,brand_colors=EXCLUDED.brand_colors,
       festive_offer=EXCLUDED.festive_offer,delivery_information=EXCLUDED.delivery_information,
       order_deadline=EXCLUDED.order_deadline,contact_address=EXCLUDED.contact_address,
       policies=EXCLUDED.policies,additional_notes=EXCLUDED.additional_notes,
       items=EXCLUDED.items,assets_submitted_complete=EXCLUDED.assets_submitted_complete,
       review_status=EXCLUDED.review_status,assets_confirmed_at=NULL,updated_at=now()
      RETURNING payment_reference,review_status,submitted_at,updated_at`
    return res.status(200).json({success:true,reviewStatus:result[0].review_status,
      message:intake.assetsSubmittedComplete
        ? 'Business information received. Your files and details will be checked before the 3–7 day delivery period starts.'
        : 'Your business information is saved. Return with the same payment reference and email when the remaining assets are ready.'})
  } catch(err) {
    console.error('December intake failed',err?.message)
    return res.status(502).json({error:'Unable to save your business information. Please try again.'})
  }
}
