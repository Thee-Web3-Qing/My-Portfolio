
import { INDUSTRIES, getLayoutsForIndustry } from '../../src/data/december.js'

const OWNER_EMAIL = () => process.env.DECEMBER_PROJECT_NOTIFY_TO?.trim() || 'qinglidah@gmail.com'
const SENDER_EMAIL = () => process.env.DECEMBER_PROJECT_NOTIFY_FROM?.trim() || 'Qing Projects <classroom@qingthecreator.xyz>'
const escapeHtml = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const str = (v,n=120) => String(v ?? '').trim().slice(0,n)
const moneyKobo = v => '₦' + (Number(v||0)/100).toLocaleString('en-NG',{maximumFractionDigits:2})
const money = v => '₦' + Number(v||0).toLocaleString('en-NG',{maximumFractionDigits:2})
function orderConfig(order){
 if(order?.configuration && typeof order.configuration==='object')return order.configuration
 try{return JSON.parse(order?.configuration||'{}')}catch{return {}}
}
const row = (name,value) => '<tr><td style="padding:9px 10px 9px 0;color:#736b65;vertical-align:top;font:12px Arial,sans-serif;white-space:nowrap">'+escapeHtml(name)+'</td><td style="padding:9px 0;color:#26201c;font:600 13px/1.45 Arial,sans-serif;overflow-wrap:anywhere">'+escapeHtml(value||'Not supplied')+'</td></tr>'

export function renderPaidProjectEmail(order){
 const reference=str(order.reference,120)
 if(!/^QDEC-[a-f0-9]{32}$/i.test(reference))throw Error('Invalid project reference')
 const config=orderConfig(order)
 const industry=INDUSTRIES.find(x=>x.id===config.industry)
 const layout=getLayoutsForIndustry(config.industry).find(x=>x.id===config.layout)
 const name=str(order.customer_name,100)
 const business=str(order.business_name||name,120)
 const email=str(order.customer_email,160)
 const phone=str(order.customer_whatsapp,45)
 const notes=str(config.customer_note,1000)||'None supplied at checkout.'
 const lineItems=Array.isArray(config.line_items)?config.line_items.slice(0,40).filter(x=>typeof x?.name==='string'&&Number.isFinite(Number(x.price))).map(x=>({name:str(x.name,160),price:Number(x.price)})):[]
 const received=Number(order.amount_kobo||0)
 const total=Number(order.quote_total_kobo||0)
 const balance=Math.max(0,total-received)
 const plan=order.payment_mode==='deposit'?'60% deposit':'Full payment'
 const paidAt=order.paid_at?new Date(order.paid_at):null
 const paidOn=paidAt&&Number.isFinite(paidAt.getTime())?paidAt.toLocaleString('en-GB',{timeZone:'Africa/Lagos',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})+' WAT':'Recently verified'
 const viewUrl='https://qingthecreator.xyz/admin?project='+encodeURIComponent(reference)
 const details=[
  ['Customer',name],['Business',business],['Email',email],['WhatsApp',phone],
  ['Industry',industry?.label||str(config.industry,50)],['Website design',layout?.label||str(config.layout,50)],
  ['Payment type',plan],['Amount paid',moneyKobo(received)],['Full quote',moneyKobo(total)],
  ['Remaining balance',moneyKobo(balance)],['Generated images requested',String(Math.max(0,Number(config.images)||0))],
  ['Paid at',paidOn],['Payment reference',reference]
 ]
 const itemText=lineItems.length?lineItems.map(x=>'- '+x.name+': '+money(x.price)).join('\n'):'No itemised feature list was stored.'
 const itemHtml=lineItems.length?lineItems.map(x=>'<tr><td style="padding:9px 0;border-bottom:1px solid #eee8e2;font:13px/1.45 Arial,sans-serif">'+escapeHtml(x.name)+'</td><td style="padding:9px 0;border-bottom:1px solid #eee8e2;white-space:nowrap;text-align:right;font:700 13px Arial,sans-serif">'+escapeHtml(money(x.price))+'</td></tr>').join(''):'<tr><td style="padding:10px 0;color:#786e67;font:12px Arial,sans-serif">See the admin for the original purchase details.</td></tr>'
 const subject='New paid website project: '+business.slice(0,63)+' | '+moneyKobo(received)
 const text=[
  'VERIFIED LIVE WEBSITE PROJECT PAYMENT','',...details.map(([k,v])=>k+': '+v),'',
  'SELECTED WEBSITE FEATURES',itemText,'','CLIENT NOTE',notes,'',
  'The full business brief, catalogue and brand assets are requested AFTER payment. Open this project to see the latest submissions.','',
  'VIEW PROJECT: '+viewUrl,'','The admin page requires your existing administrator login.'
 ].join('\n')
 const html='<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:#f4f1ed;color:#28221e;font-family:Arial,sans-serif">'
 +'<div style="max-width:640px;margin:auto;padding:28px 14px 45px"><div style="padding:29px;background:#24201e;color:#fff;border-radius:12px 12px 0 0">'
 +'<p style="font:bold 10px Arial,sans-serif;letter-spacing:2px;color:#efb3a9;margin:0 0 14px">QING THE CREATOR / NEW PROJECT</p>'
 +'<h1 style="margin:0;font:normal 38px/1.08 Georgia,serif">A client just paid.</h1>'
 +'<p style="margin:14px 0 0;font:13px Arial,sans-serif;color:#ded5ce">Paystack-verified live website payment</p></div>'
 +'<div style="background:#fff;padding:27px;border:1px solid #e2d9d2;border-top:0;border-radius:0 0 12px 12px">'
 +'<p style="margin:0;font:bold 11px Arial,sans-serif;color:#b3322e;letter-spacing:1px">PAYMENT CONFIRMED</p>'
 +'<h2 style="font:normal 27px/1.2 Georgia,serif;margin:13px 0 7px;overflow-wrap:anywhere">'+escapeHtml(business)+'</h2>'
 +'<p style="font:700 25px Georgia,serif;margin:8px 0 24px">'+escapeHtml(moneyKobo(received))+' <span style="font:12px Arial,sans-serif;color:#7b7068">received</span></p>'
 +'<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #eee7e0;border-bottom:1px solid #eee7e0">'+details.map(([k,v])=>row(k,v)).join('')+'</table>'
 +'<h3 style="margin:27px 0 10px;font:normal 23px Georgia,serif">What the client requested</h3>'
 +'<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">'+itemHtml+'</table>'
 +'<div style="background:#faf5f1;padding:18px;margin:22px 0;border-left:3px solid #bb342e"><p style="margin:0 0 8px;font:bold 10px Arial,sans-serif;letter-spacing:1px;color:#a23630">CLIENT NOTE</p>'
 +'<p style="white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.7 Arial,sans-serif;margin:0">'+escapeHtml(notes)+'</p></div>'
 +'<p style="color:#746a62;font:12px/1.7 Arial,sans-serif;margin:21px 0">The full business brief, product listings and brand assets are collected after payment. Visit the project to see the latest information.</p>'
 +'<a href="'+escapeHtml(viewUrl)+'" style="display:block;background:#ba362f;color:#fff;text-decoration:none;text-align:center;border-radius:7px;padding:17px;font:bold 14px Arial,sans-serif">View project</a>'
 +'<p style="font:11px/1.6 Arial,sans-serif;color:#82766c;margin:16px 0 0">If you are not signed in, you will be asked for your administrator code before the project opens.</p>'
 +'</div></div></body></html>'
 return {subject,html,text,viewUrl}
}

let ready
async function ensureNotificationTable(sql){
 if(!ready){
  ready=sql`CREATE TABLE IF NOT EXISTS december_project_payment_notifications (
    payment_reference varchar(120) PRIMARY KEY,
    claimed_at timestamptz,
    sent_at timestamptz,
    provider_email_id text,
    last_error text,
    attempts integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`.catch(error=>{ready=null;throw error})
 }
 return ready
}

async function sendNotification(order){
 const key=process.env.RESEND_API_KEY
 if(!key)throw Error('Resend API key is unavailable')
 const contents=renderPaidProjectEmail(order)
 const response=await fetch('https://api.resend.com/emails',{
  method:'POST',
  headers:{
   Authorization:'Bearer '+key,
   'Content-Type':'application/json',
   'Idempotency-Key':'december-paid-project/'+order.reference
  },
  signal:AbortSignal.timeout(12000),
  body:JSON.stringify({
   from:SENDER_EMAIL(),to:[OWNER_EMAIL()],
   reply_to:order.customer_email,
   subject:contents.subject,html:contents.html,text:contents.text
  })
 })
 const payload=await response.json().catch(()=>({}))
 if(!response.ok || !payload.id)throw Error(String(payload.message||'Resend returned '+response.status).slice(0,300))
 return String(payload.id)
}

/** create=true only for a NEW verified paid transition.
 * Subsequent verifications may retry UNSENT records but cannot backfill old paid orders. */
export async function notifyVerifiedProjectPayment(sql,order,{create=false}={}){
 if(process.env.VERCEL_ENV!=='production'||order?.product!=='december-website'||order?.environment!=='live'||order?.status!=='paid')return false
 const reference=str(order.reference,120)
 if(!/^QDEC-[a-f0-9]{32}$/i.test(reference))return false
 try{
  await ensureNotificationTable(sql)
  if(create){
   await sql`INSERT INTO december_project_payment_notifications (payment_reference)
     VALUES (${reference}) ON CONFLICT (payment_reference) DO NOTHING`
  }
  const claimed=await sql`UPDATE december_project_payment_notifications
    SET claimed_at=now(),last_error=NULL,attempts=attempts+1,updated_at=now()
    WHERE payment_reference=${reference} AND sent_at IS NULL
    AND (claimed_at IS NULL OR claimed_at < now()-interval '10 minutes')
    RETURNING payment_reference`
  if(!claimed.length)return false
  try{
   const id=await sendNotification(order)
   await sql`UPDATE december_project_payment_notifications
     SET sent_at=now(),provider_email_id=${id},last_error=NULL,updated_at=now()
     WHERE payment_reference=${reference}`
   return true
  }catch(error){
   const detail=str(error?.message||'Email delivery failed',450)
   try{
    await sql`UPDATE december_project_payment_notifications
      SET claimed_at=NULL,last_error=${detail},updated_at=now()
      WHERE payment_reference=${reference} AND sent_at IS NULL`
   }catch(dbError){
    console.error('Project email retry-state update failed:',dbError?.message)
   }
   console.error('Project payment email delivery failed:',{reference,detail})
   return false
  }
 }catch(error){
  console.error('Project notification setup failed:',{reference,message:str(error?.message||error,250)})
  return false
 }
}
