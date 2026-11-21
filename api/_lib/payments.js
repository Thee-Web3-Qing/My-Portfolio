import { neon } from '@neondatabase/serverless'
import { calculateDecemberQuote } from '../../src/data/december.js'
import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto'

export const PAYSTACK_ORIGIN = 'https://api.paystack.co'
export const environment = () => process.env.VERCEL_ENV === 'production' ? 'live' : 'test'
export const configuredKey = (mode = environment()) => {
  const key = mode === 'live' ? process.env.PAYSTACK_LIVE_API_KEY : process.env.PAYSTACK_TEST_API_KEY
  if (!key || !key.startsWith(mode === 'live' ? 'sk_live_' : 'sk_test_')) return null
  return key
}
export const db = () => {
  if (!process.env.DATABASE_URL) throw new Error('Database is not configured')
  return neon(process.env.DATABASE_URL)
}
export function callbackUrl() {
  if (environment() === 'live') return 'https://www.qingthecreator.xyz/payment/callback'
  const hostname = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
  if (!hostname || !/^[a-z0-9.-]+\.vercel\.app$/.test(hostname)) throw new Error('Preview callback domain is not configured')
  return 'https://' + hostname + '/payment/callback'
}
export function makeReference(product) {
  return (product === 'qing-class' ? 'QCLASS' : 'QDEC') + '-' + randomUUID().replace(/-/g, '')
}
export function safeMetadata(value) {
  try { return typeof value === 'string' ? JSON.parse(value) : (value || {}) } catch { return {} }
}
export async function paystackGet(path, mode) {
  const key = configuredKey(mode)
  if (!key) throw new Error('Paystack key is unavailable')
  const response = await fetch(PAYSTACK_ORIGIN + path, {
    headers: { Authorization: 'Bearer ' + key },
    signal: AbortSignal.timeout(18000),
  })
  const payload = await response.json()
  if (!response.ok || !payload.status || !payload.data) throw new Error('Paystack verification failed')
  return payload.data
}
export async function initializePayment({ reference, email, amountKobo, metadata }) {
  const key = configuredKey()
  if (!key) throw new Error('Paystack checkout is not configured for this environment')
  const response = await fetch(PAYSTACK_ORIGIN + '/transaction/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    signal: AbortSignal.timeout(18000),
    body: JSON.stringify({ reference, email, amount: amountKobo, currency:'NGN', callback_url: callbackUrl(),
      metadata: JSON.stringify(metadata) }),
  })
  const payload = await response.json()
  if (!response.ok || !payload.status || !payload.data?.authorization_url || payload.data?.reference !== reference) {
    throw new Error('Paystack could not initialize this checkout')
  }
  return payload.data.authorization_url
}
export function verifySignature(rawBody, signature, mode) {
  const key = configuredKey(mode)
  if (!key || typeof signature !== 'string' || !/^[a-f0-9]{128}$/i.test(signature)) return false
  const digest = createHmac('sha512', key).update(rawBody).digest('hex')
  const a = Buffer.from(digest, 'hex')
  const b = Buffer.from(signature, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}
export async function confirmPayment(reference, mode = environment()) {
  if (!/^[A-Za-z0-9._-]{6,120}$/.test(reference)) throw new Error('Invalid payment reference')
  const sql = db()
  const orders = await sql`SELECT * FROM payment_orders WHERE reference = ${reference} AND environment = ${mode} LIMIT 1`
  if (!orders.length) return { found:false, paid:false, reference }
  const order = orders[0]
  if (order.status === 'paid') return publicStatus(order)
  const transaction = await paystackGet('/transaction/verify/' + encodeURIComponent(reference), mode)
  const valid = transaction.reference === reference && transaction.status === 'success' &&
    transaction.currency === 'NGN' && Number(transaction.amount) === Number(order.amount_kobo) &&
    Number(transaction.amount) > 0 &&
    (String(transaction.customer?.email || '').toLowerCase() === String(order.customer_email).toLowerCase())
  if (!valid) return { found:true, paid:false, reference, status:transaction.status === 'success' ? 'unverified' : 'pending' }
  if (order.product === 'qing-class') {
    const info = safeMetadata(order.configuration)
    const details = info.registration || {}
    const registrationEmail = String(order.customer_email).trim().toLowerCase()
    const phone = String(order.customer_whatsapp || '').replace(/\D/g,'')
    const telegram = String(details.telegram || '').trim().replace(/^@+/, '').toLowerCase()
    const reason = String(details.reason || '')
    await sql`
      INSERT INTO class_registrations
        (full_name, whatsapp, telegram_username, email, reason, reason_category,
         mentorship_interest, amount_paid, currency, payment_source, payment_reference,
         transaction_reference, fraud_score, fraud_status, fraud_checks, payment_status)
      VALUES
        (${order.customer_name}, ${phone}, ${telegram}, ${registrationEmail},
         ${reason}, ${String(details.reasonCategory || 'Other')},
         ${String(details.mentorship || 'Not answered')}, ${Number(order.amount_kobo)/100},
         'NGN', 'Paystack', ${reference}, ${reference}, 100, 'verified',
         ${JSON.stringify({provider:'paystack',environment:mode,verified:true})}::jsonb, 'pending')
      ON CONFLICT DO NOTHING
    `
  }

  const confirmed = await sql`
    UPDATE payment_orders SET status='paid',paid_at=COALESCE(paid_at,now()),updated_at=now()
    WHERE reference=${reference} AND environment=${mode} AND status='pending'
    RETURNING reference, product, environment, customer_name, customer_email, customer_whatsapp,
              amount_kobo, quote_total_kobo, payment_mode, configuration, status
  `
  const paidOrder = confirmed[0] || order
  // Receiving payment never issues a classroom access code; approval remains separate.
  return publicStatus(paidOrder)
}
export function publicStatus(order) {
  const paid = order.status === 'paid'
  const config = safeMetadata(order.configuration)
  const quote = order.product === 'december-website'
    ? calculateDecemberQuote({ industry:config.industry, layout:config.layout, addons:config.addons, images:config.images })
    : null
  // Orders are quoted at checkout time. Never rewrite a customer's historical
  // invoice if the December add-on catalogue changes later.
  const orderSnapshot = Array.isArray(config.line_items) ? config.line_items.filter(item=>
    typeof item?.name==='string' && Number.isFinite(Number(item.price)) && Number(item.price)>=0
  ).map(item=>({name:item.name,price:Number(item.price)})) : []
  const items = order.product==='december-website'
    ? orderSnapshot.length ? orderSnapshot : [
        { name:'Branded website (12 listings)', price:quote?.base || 120000 },
        ...(quote?.selectedAddons || []).map(x=>({name:x.name,price:x.price})),
        ...(quote?.images>0?[{name:quote.images+' AI product images × ₦'+quote.imageUnitPrice,price:quote.imagesSubtotal}]:[]),
      ]
    : [{name:'Vibecoding Starter Class',price:Number(order.quote_total_kobo)/100}]
  return { items, industry:quote?.industry.label || null, layout:quote?.layout.label || null,
    found:true, paid, reference:order.reference, product:order.product,
    amount:paid ? Number(order.amount_kobo) : 0,
    total:Number(order.quote_total_kobo)/100,
    paymentMode:order.payment_mode,
    balance:paid && order.payment_mode === 'deposit'
      ? Math.max(0,(Number(order.quote_total_kobo)-Number(order.amount_kobo))/100) : 0,
    status:order.status,
  }
}
