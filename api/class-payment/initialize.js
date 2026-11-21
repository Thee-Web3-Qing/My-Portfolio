import { configuredKey, db, environment, initializePayment, makeReference } from '../_lib/payments.js'

const normalisePhone = text => {
  const digits=String(text || '').replace(/\D/g,'')
  if(digits.length===11 && digits.startsWith('0')) return '234'+digits.slice(1)
  if(digits.length===10) return '234'+digits
  return digits
}

export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store')
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  if(!configuredKey() || !process.env.DATABASE_URL) return res.status(503).json({error:'Paystack registration is temporarily unavailable'})
  const b=req.body || {}
  const name=String(b.fullName||'').trim().slice(0,100)
  const email=String(b.email||'').trim().toLowerCase().slice(0,160)
  const phone=normalisePhone(b.whatsapp)
  const telegram=String(b.telegram||'').trim().replace(/^@+/,'').toLowerCase()
  const reason=String(b.reason||'').trim()
  const mentorship=String(b.mentorship||'').slice(0,80)
  const category=String(b.reasonCategory||'Other').slice(0,90)
  if(name.length<3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length<10 ||
    !/^[a-z0-9_]{5,32}$/.test(telegram) || reason.length<20 || reason.length>5000) {
    return res.status(400).json({error:'Complete the required registration fields first'})
  }
  try {
    const sql=db()
    const existing=await sql`
      SELECT id FROM class_registrations
      WHERE lower(btrim(email))=${email} OR whatsapp=${phone} OR lower(btrim(telegram_username))=${telegram}
      LIMIT 1
    `
    if(existing.length) return res.status(409).json({error:'An existing registration matches this email, phone or Telegram username'})
    const counts=await sql`
      SELECT COALESCE((SELECT integer_value FROM classroom_registration_settings WHERE key='legacy_student_offset'),80)::int
      + (SELECT count(*)::int FROM class_registrations WHERE payment_status IN ('confirmed','approved')) AS total
    `
    const amount=1000 * (2 ** Math.floor(Number(counts[0].total) / 100))
    if(!Number.isFinite(amount) || amount>1000000) return res.status(503).json({error:'Current class pricing is unavailable'})
    const amountKobo=amount*100
    const reference=makeReference('qing-class')
    const config={campaign:'qing-class',registration:{telegram,reason,reasonCategory:category,mentorship},
      amount_ngn:amount,student_email:email}
    await sql`
      INSERT INTO payment_orders (reference,product,environment,customer_name,customer_email,customer_whatsapp,
        amount_kobo,quote_total_kobo,payment_mode,configuration)
      VALUES (${reference},'qing-class',${environment()},${name},${email},${phone},
        ${amountKobo},${amountKobo},'full',${JSON.stringify(config)}::jsonb)
    `
    const authorization_url=await initializePayment({reference,email,amountKobo,metadata:{
      product:'qing-class',reference,course:'Vibecoding Starter Class',registration_email:email
    }})
    return res.status(200).json({authorization_url,reference,amount,mode:environment()})
  } catch (error) {
    console.error('Class Paystack initialize failed',error?.message)
    return res.status(502).json({error:'Could not start Paystack checkout for the class'})
  }
}
