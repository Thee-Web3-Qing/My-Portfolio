import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { db, environment } from './payments.js'
import { needAdmin, originAllowed } from './decemberAdmin.js'
import { INDUSTRIES, getLayoutsForIndustry } from '../../src/data/december.js'

const origin='https://qingthecreator.xyz'
const idPattern=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i
const cap=100
let schema

function ensure(sql){
 if(!schema) schema=sql`CREATE TABLE IF NOT EXISTS december_reminder_leads (
  id uuid PRIMARY KEY,
  email varchar(160) UNIQUE NOT NULL,
  industry varchar(40) NOT NULL DEFAULT '',
  layout varchar(40) NOT NULL DEFAULT '',
  consent_version varchar(32) NOT NULL,
  consent_at timestamptz NOT NULL DEFAULT now(),
  claimed_at timestamptz,
  sent_at timestamptz,
  provider_id text,
  unsubscribed_at timestamptz
 )`.catch(err=>{schema=null;throw err})
 return schema
}
export function normalizeReminderEmail(value){
 if(typeof value!=='string'||value.length>180)return ''
 const email=value.trim().toLowerCase()
 if(email.length>160||!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(email))return ''
 const [local]=email.split('@')
 return local.length<=64&&!local.startsWith('.')&&!local.endsWith('.')&&!local.includes('..')?email:''
}
export function getReminderSelection(industry,layout){
 const item=INDUSTRIES.find(i=>i.id===industry)
 const design=item&&getLayoutsForIndustry(item.id).find(l=>l.id===layout)
 return {industry:item?.id||'',layout:design?.id||'',industryLabel:item?.label||'',layoutLabel:design?.label||''}
}
function secret(){
 const value=process.env.DECEMBER_ADMIN_SESSION_SECRET
 return typeof value==='string'&&value.length>=40?value:''
}
export function makeReminderUnsubscribeToken(id,key){
 return createHmac('sha256',key).update('december-reminder-unsubscribe:'+id).digest('hex')
}
export function isReminderUnsubscribeToken(id,token,key){
 if(typeof id!=='string'||!idPattern.test(id)||typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token)||!key)return false
 return timingSafeEqual(Buffer.from(token,'hex'),Buffer.from(makeReminderUnsubscribeToken(id,key),'hex'))
}
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

export function buildDecemberReminder(lead,key){
 const choice=getReminderSelection(lead.industry,lead.layout)
 const page=new URL('/december',origin)
 if(choice.industry)page.searchParams.set('industry',choice.industry)
 if(choice.layout)page.searchParams.set('layout',choice.layout)
 page.hash='build-your-site'
 const unsub=new URL('/api/december/reminders',origin)
 unsub.searchParams.set('id',lead.id)
 unsub.searchParams.set('token',makeReminderUnsubscribeToken(lead.id,key))
 const subject='Still thinking about your December website?'
 const intro='You asked for one reminder about the December website offer.'
 const pick=choice.industryLabel?'You were looking at '+choice.industryLabel+(choice.layoutLabel?' / '+choice.layoutLabel:'')+'.':''
 const body='If you’re still deciding, you can revisit the website builder, compare layouts and see what’s included before you book.'
 const text=[intro,pick,body,'Revisit the offer: '+page,'Thanks, Qing','Stop December reminders: '+unsub].filter(Boolean).join('\n\n')
 const html='<main style="max-width:580px;margin:30px auto;padding:24px;font:16px/1.6 Arial,sans-serif;color:#29201b"><p>QING THE CREATOR / DECEMBER WEBSITE OFFER</p><h1>'+esc(subject)+'</h1><p>'+esc(intro)+'</p>'+(pick?'<p>'+esc(pick)+'</p>':'')+'<p>'+esc(body)+'</p><p><a href="'+esc(page)+'">Revisit the offer</a></p><p>Thanks,<br>Qing</p><p style="font-size:13px"><a href="'+esc(unsub)+'">Stop December reminders</a></p></main>'
 return {subject,text,html,unsubscribeUrl:String(unsub)}
}
const baseHeaders=res=>{
 res.setHeader('Cache-Control','no-store')
 res.setHeader('X-Robots-Tag','noindex, nofollow')
 res.setHeader('Referrer-Policy','no-referrer')
}
const methodNotAllowed=(res,allow)=>{res.setHeader('Allow',allow);return res.status(405).json({error:'Method not allowed'})}
const accepted=res=>res.status(202).json({saved:true})
const jsonBody=req=>req.body&&typeof req.body==='object'&&!Array.isArray(req.body)&&JSON.stringify(req.body).length<=1500?req.body:null
const recipientAddress=value=>normalizeReminderEmail(value).replace(/^(.*?)@googlemail\.com$/,'$1@gmail.com').replace(/^([^@]+)@gmail\.com$/,(_,local)=>local.split('+')[0].replace(/\./g,'')+'@gmail.com')

function renderUnsubscribe(res,status,inner){
 res.setHeader('Content-Type','text/html; charset=utf-8')
 res.setHeader('Content-Security-Policy',"default-src 'none'; form-action 'self'; frame-ancestors 'none'; style-src 'unsafe-inline'")
 return res.status(status).send('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>December website reminders</title><main style="max-width:35rem;margin:12vh auto;padding:1.5rem;font:1rem/1.5 system-ui;color:#261d18">'+inner+'</main></html>')
}

export async function publicDecemberReminders(req,res){
 baseHeaders(res)
 if(req.method==='GET'||(req.method==='POST'&&req.query?.id)){
  const {id,token}=req.query||{}
  if(!isReminderUnsubscribeToken(id,token,secret()))return renderUnsubscribe(res,404,'<h1>This reminder link is not valid.</h1>')
  if(req.method==='GET'){
   const action='/api/december/reminders?id='+encodeURIComponent(id)+'&amp;token='+encodeURIComponent(token)
   return renderUnsubscribe(res,200,'<h1>Stop December reminders?</h1><p>This only affects the December website offer.</p><form method="post" action="'+action+'"><button type="submit">Unsubscribe</button></form>')
  }
  try{
   const sql=db()
   await ensure(sql)
   await sql`UPDATE december_reminder_leads SET unsubscribed_at=coalesce(unsubscribed_at,now()) WHERE id=${id}::uuid`
   return renderUnsubscribe(res,200,'<h1>You’re unsubscribed.</h1><p>You won’t receive any more December website reminders.</p>')
  }catch{
   return renderUnsubscribe(res,503,'<h1>Could not unsubscribe just now.</h1><p>Please try again in a moment.</p>')
  }
 }
 if(req.method!=='POST')return methodNotAllowed(res,'GET, POST')
 if(!originAllowed(req)||req.headers['sec-fetch-site']==='cross-site')return res.status(403).json({error:'Same-origin access only'})
 const body=jsonBody(req)
 const address=normalizeReminderEmail(body?.email)
 if(!body||body.consent!==true||!address)return res.status(400).json({error:'Enter a valid email and agree to receive one reminder.'})
 if(body.companyWebsite)return accepted(res) // Honeypot; no notification or storage.
 const selection=getReminderSelection(body.industry,body.layout)
 const email=recipientAddress(address)
 if(!normalizeReminderEmail(email))return res.status(400).json({error:'Enter a valid email.'})
 try{
  const sql=db()
  await ensure(sql)
  await sql`INSERT INTO december_reminder_leads (id,email,industry,layout,consent_version)
   VALUES (${randomUUID()},${email},${selection.industry},${selection.layout},'one-reminder-v1')
   ON CONFLICT (email) DO NOTHING`
  return accepted(res)
 }catch(err){
  console.error('December reminder opt-in failed',err?.code||'database')
  return res.status(503).json({error:'Could not save that reminder. Please try again.'})
 }
}

async function sendReminder(lead){
 const {subject,text,html,unsubscribeUrl}=buildDecemberReminder(lead,secret())
 const response=await fetch('https://api.resend.com/emails',{
  method:'POST',
  signal:AbortSignal.timeout(12000),
  headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json',
   'Idempotency-Key':'december-reminder-'+lead.id},
  body:JSON.stringify({from:process.env.DECEMBER_EMAIL_FROM||'Qing The Creator <classroom@qingthecreator.xyz>',
   to:[lead.email],reply_to:'qinglidah@gmail.com',subject,text,html,
   headers:{'List-Unsubscribe':'<'+unsubscribeUrl+'>','List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}})
 })
 const data=await response.json().catch(()=>({}))
 if(!response.ok||typeof data.id!=='string')throw Error('Reminder provider did not confirm acceptance')
 return data.id
}

export async function adminDecemberReminders(req,res){
 baseHeaders(res)
 if(!['POST','GET'].includes(req.method))return methodNotAllowed(res,'GET, POST')
 try{if(!needAdmin(req,res,req.method))return}catch{return res.status(401).json({error:'Admin login required'})}
 const sendReady=environment()==='live'&&Boolean(process.env.RESEND_API_KEY)&&Boolean(secret())
 if(req.method==='POST'){
  const body=jsonBody(req)
  if(body?.action!=='send'||typeof body.id!=='string'||!idPattern.test(body.id))
   return res.status(400).json({error:'Select an opted-in lead to send a reminder.'})
  if(!sendReady)return res.status(503).json({error:'Reminder sending is only available with production email configured.'})
 }
 try{
  const sql=db()
  await ensure(sql)
  if(req.method==='GET'){
   const rows=await sql`SELECT l.id,l.email,l.industry,l.layout,l.consent_at,l.sent_at,l.unsubscribed_at,
    (l.claimed_at IS NOT NULL AND l.sent_at IS NULL) AS sending,
    (l.consent_at < now() - interval '30 days') AS expired,
    EXISTS(SELECT 1 FROM payment_orders p WHERE p.environment='live' AND p.product='december-website'
     AND p.status='paid' AND (CASE
       WHEN split_part(lower(trim(p.customer_email)),'@',2) IN ('gmail.com','googlemail.com')
       THEN replace(split_part(split_part(lower(trim(p.customer_email)),'@',1),'+',1),'.','') || '@gmail.com'
       ELSE lower(trim(p.customer_email)) END)=l.email) AS paid
    FROM december_reminder_leads l ORDER BY l.consent_at DESC LIMIT ${cap}`
   return res.status(200).json({leads:rows.map(row=>({...row,...getReminderSelection(row.industry,row.layout)})),sendReady})
  }
  const {id}=req.body
  const claimed=await sql`UPDATE december_reminder_leads l SET claimed_at=now()
   WHERE l.id=${id}::uuid AND l.unsubscribed_at IS NULL AND l.sent_at IS NULL
    AND l.consent_at>=now()-interval '30 days'
    AND l.claimed_at IS NULL
    AND NOT EXISTS(SELECT 1 FROM payment_orders p WHERE p.environment='live' AND p.product='december-website'
      AND p.status='paid' AND (CASE
       WHEN split_part(lower(trim(p.customer_email)),'@',2) IN ('gmail.com','googlemail.com')
       THEN replace(split_part(split_part(lower(trim(p.customer_email)),'@',1),'+',1),'.','') || '@gmail.com'
       ELSE lower(trim(p.customer_email)) END)=l.email)
    RETURNING l.id,l.email,l.industry,l.layout`
  if(!claimed.length)return res.status(409).json({error:'No reminder sent. This person is paid, opted out, expired, already sent or currently processing.'})
  const latest=await sql`SELECT l.id FROM december_reminder_leads l WHERE l.id=${id}::uuid
    AND l.unsubscribed_at IS NULL AND l.sent_at IS NULL
    AND NOT EXISTS(SELECT 1 FROM payment_orders p WHERE p.environment='live' AND p.product='december-website'
      AND p.status='paid' AND (CASE
       WHEN split_part(lower(trim(p.customer_email)),'@',2) IN ('gmail.com','googlemail.com')
       THEN replace(split_part(split_part(lower(trim(p.customer_email)),'@',1),'+',1),'.','') || '@gmail.com'
       ELSE lower(trim(p.customer_email)) END)=l.email)`
  if(!latest.length)return res.status(409).json({error:'No reminder sent. The lead is no longer eligible.'})
  // Keep an uncertain provider attempt claimed; blindly retrying after
  // the provider's idempotency window could send a second reminder.
  const providerId=await sendReminder(claimed[0])
  await sql`UPDATE december_reminder_leads SET sent_at=now(),provider_id=${providerId} WHERE id=${id}::uuid`
  return res.status(200).json({sent:true})
 }catch(err){
  console.error('December reminder administration failed',err?.code||'service')
  return res.status(503).json({error:'The reminder request could not be confirmed. Refresh the list before trying again.'})
 }
}
