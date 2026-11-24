import { safeMetadata } from './payments.js'

// A production-only notification for verified December website orders.
// "View project" never grants access: the private admin session is still required.
export const OWNER_PROJECT_EMAIL = 'qinglidah@gmail.com'
const ADMIN_ORIGIN = 'https://qingthecreator.xyz'
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]))
const naira = amount => '₦' + Number(amount || 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })
const label = value => String(value || 'Not supplied').trim()
const plain = value => label(value).slice(0, 1200)
const capitalize = value => String(value || '').split(/[-_ ]+/).filter(Boolean).map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')

export function buildDecemberProjectEmail(order) {
  const details = safeMetadata(order.configuration)
  const reference = label(order.reference)
  if (!/^QDEC-[a-z0-9]{32}$/i.test(reference)) throw Error('Invalid December project reference')
  const adminUrl = ADMIN_ORIGIN + '/admin?project=' + encodeURIComponent(reference)
  const customer = label(order.customer_name)
  const business = label(order.business_name)
  const email = label(order.customer_email)
  const phone = label(order.customer_whatsapp)
  const industry = capitalize(details.industry)
  const style = capitalize(details.layout)
  const note = plain(details.customer_note || 'No additional notes supplied.')
  const images = Number(details.images || 0)
  const mode = order.payment_mode === 'deposit' ? '60% deposit' : 'Paid in full'
  const amount = naira(Number(order.amount_kobo) / 100)
  const total = naira(Number(order.quote_total_kobo) / 100)
  const balance = order.payment_mode === 'deposit'
    ? naira(Math.max(0, (Number(order.quote_total_kobo) - Number(order.amount_kobo)) / 100))
    : '₦0'
  const items = Array.isArray(details.line_items) ? details.line_items.filter(i=>typeof i?.name==='string' && Number.isFinite(Number(i.price))) : []
  const itemLines = items.map(i=>plain(i.name)+' — '+naira(i.price))
  const subject = 'New paid website project: ' + business.slice(0, 90)
  const lines = [
    'A new December website project has been paid for and verified with Paystack.',
    '',
    'Client: ' + customer,
    'Business: ' + business,
    'Client email: ' + email,
    'WhatsApp: ' + phone,
    'Industry: ' + (industry || 'Not supplied'),
    'Website layout: ' + (style || 'Not supplied'),
    'AI images: ' + images,
    '',
    'Selected package and features:',
    ...(itemLines.length ? itemLines : ['See the original saved quote in the admin']),
    '',
    'Payment: ' + mode,
    'Amount received: ' + amount,
    'Project total: ' + total,
    'Remaining balance: ' + balance,
    'Paystack reference: ' + reference,
    '',
    'Client request or note:',
    note,
    '',
    'View project: ' + adminUrl,
    '',
    'You will be asked to sign in if your admin session has expired. The client may submit their detailed assets and content form after payment.'
  ]
  const row = (name,value) => '<tr><td style="padding:10px 4px;color:#82766d;border-bottom:1px solid #eee7de;font-size:13px;vertical-align:top">' + escapeHtml(name) + '</td><td style="padding:10px 4px;color:#241e1a;border-bottom:1px solid #eee7de;font-size:13px;font-weight:600;vertical-align:top">' + escapeHtml(value) + '</td></tr>'
  const selectedHtml = items.length ? '<ul style="padding-left:18px;margin:12px 0 22px">' + items.map(i=>'<li style="margin:8px 0;color:#40362e">' + escapeHtml(plain(i.name)) + ' <strong>(' + escapeHtml(naira(i.price)) + ')</strong></li>').join('') + '</ul>' : '<p>Check the original quote inside the admin.</p>'
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f5f1eb;color:#241e1a;font-family:Arial,Helvetica,sans-serif"><div style="max-width:640px;margin:auto;padding:26px 16px"><div style="background:#211c1a;color:#fff;padding:30px 26px;border-radius:15px 15px 0 0"><p style="font-size:11px;letter-spacing:2px;margin:0 0 12px;color:#dcb7a3">QING THE CREATOR / NEW PROJECT</p><h1 style="font:normal 32px Georgia,serif;line-height:1.15;margin:0">A new website project is paid.</h1><p style="line-height:1.6;font-size:14px;color:#e7d9cf">Paystack has confirmed the customer's payment.</p></div><div style="padding:25px 26px;background:#fff;border:1px solid #e8ddd1"><h2 style="font:normal 28px Georgia,serif;margin:0 0 20px">${escapeHtml(business)}</h2><table style="border-collapse:collapse;width:100%">${row('Client',customer)}${row('Email',email)}${row('WhatsApp',phone)}${row('Industry',industry)}${row('Design',style)}${row('AI images',String(images))}${row('Payment type',mode)}${row('Amount received',amount)}${row('Project total',total)}${row('Remaining balance',balance)}${row('Payment reference',reference)}</table><h3 style="margin:28px 0 10px;font-size:15px">Selected package and features</h3>${selectedHtml}<h3 style="margin:28px 0 10px;font-size:15px">Client request</h3><p style="padding:15px;background:#f8f3ee;border-radius:9px;white-space:pre-wrap;font-size:13px;line-height:1.6">${escapeHtml(note)}</p><a href="${escapeHtml(adminUrl)}" style="display:block;margin-top:24px;background:#e53236;color:#fff;text-decoration:none;text-align:center;padding:17px 20px;border-radius:10px;font-size:14px;font-weight:bold">View project</a><p style="font-size:11px;color:#847970;line-height:1.65;margin-top:16px">This link opens the selected project in your private admin. You will need your usual administrator login if you are not signed in. Detailed product photos and business assets may be submitted after payment.</p></div><div style="text-align:center;padding:20px;color:#85796d;font-size:11px">Automated verified payment notice · Qing The Creator</div></div></body></html>`
  return {subject, text:lines.join('\n'), html, adminUrl}
}

let readyPromise
function ensureTable(sql){
  if(!readyPromise){
    readyPromise = sql`CREATE TABLE IF NOT EXISTS december_project_payment_notifications (
      reference varchar(120) PRIMARY KEY,
      claimed_at timestamptz,
      sent_at timestamptz,
      provider_message_id text,
      last_error text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`.catch(error=>{readyPromise=null;throw error})
  }
  return readyPromise
}
async function sendOwnerEmail(order){
  if(!process.env.RESEND_API_KEY)throw Error('RESEND_API_KEY is missing')
  const {subject,text,html}=buildDecemberProjectEmail(order)
  const result=await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{
      Authorization:'Bearer '+process.env.RESEND_API_KEY,
      'Content-Type':'application/json',
      'Idempotency-Key':'december-project-'+order.reference,
    },
    signal:AbortSignal.timeout(12000),
    body:JSON.stringify({
      from:process.env.DECEMBER_EMAIL_FROM || 'Qing The Creator <classroom@qingthecreator.xyz>',
      to:[OWNER_PROJECT_EMAIL],
      reply_to:order.customer_email,
      subject,html,text
    })
  })
  const payload=await result.json().catch(()=>({}))
  if(!result.ok || !payload.id)throw Error(payload.message || 'Resend returned '+result.status)
  return payload.id
}

// Called after authoritative Paystack confirmation, including when the
// callback and webhook both process the same transaction. A DB claim and
// Resend idempotency key prevent duplicate notifications.
export async function finalizeDecemberProjectEmail(sql,reference,mode){
  if(mode!=='live')return {projectEmailSent:false,skipped:true}
  if(!process.env.RESEND_API_KEY){
    console.error('December payment notification cannot send: RESEND_API_KEY missing')
    return {projectEmailSent:false}
  }
  let claimed=false
  try{
    await ensureTable(sql)
    const rows=await sql`SELECT reference,product,environment,status,customer_name,customer_email,
      customer_whatsapp,business_name,amount_kobo,quote_total_kobo,payment_mode,configuration
      FROM payment_orders WHERE reference=${reference}
        AND environment='live' AND product='december-website' AND status='paid' LIMIT 1`
    if(!rows.length)return {projectEmailSent:false,skipped:true}
    const claim=await sql`INSERT INTO december_project_payment_notifications(reference,claimed_at)
      VALUES(${reference},now())
      ON CONFLICT(reference) DO UPDATE SET claimed_at=now(),last_error=NULL
      WHERE december_project_payment_notifications.sent_at IS NULL
      AND (december_project_payment_notifications.claimed_at IS NULL
        OR december_project_payment_notifications.claimed_at < now()-interval '10 minutes')
      RETURNING reference`
    if(!claim.length){
      const sent=await sql`SELECT sent_at FROM december_project_payment_notifications WHERE reference=${reference}`
      return {projectEmailSent:Boolean(sent[0]?.sent_at)}
    }
    claimed=true
    const id=await sendOwnerEmail(rows[0])
    await sql`UPDATE december_project_payment_notifications SET sent_at=now(),
      provider_message_id=${id},last_error=NULL WHERE reference=${reference}`
    return {projectEmailSent:true}
  }catch(error){
    const detail=String(error?.message || error || 'Unknown email delivery error').slice(0,500)
    console.error('December project email notification failed',{reference,detail})
    if(claimed){
      try{
        await sql`UPDATE december_project_payment_notifications
          SET claimed_at=NULL,last_error=${detail}
          WHERE reference=${reference} AND sent_at IS NULL`
      }catch(dbError){console.error('December email claim release failed',dbError?.message)}
    }
    // Email outages must not turn a confirmed customer payment into a failed transaction.
    return {projectEmailSent:false}
  }
}
