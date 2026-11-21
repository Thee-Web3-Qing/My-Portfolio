import { ADDONS, INDUSTRIES, LAYOUTS, calculateDecemberQuote } from '../../src/data/december.js'

const isValidEmail = value => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 160
const isText = (value, max) => typeof value === 'string' && value.trim().length > 1 && value.length <= max

function callbackUrl(req) {
  const host = String(req.headers.host || '').toLowerCase()
  const name = host.split(':')[0]
  const allowed = name === 'qingthecreator.xyz' || name === 'www.qingthecreator.xyz' || name === 'localhost' || name.endsWith('.vercel.app')
  if (!allowed || !/^[a-z0-9.:-]+$/.test(host)) return null
  return new URL('/december', (name === 'localhost' ? 'http://' : 'https://') + host).href
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return res.status(503).json({ error: 'Payment setup is not complete. Please email your quote instead.' })
  const callback_url = callbackUrl(req)
  if (!callback_url) return res.status(400).json({ error: 'Unrecognised website host.' })

  let body
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {} } catch { return res.status(400).json({ error: 'Invalid request.' }) }
  const { industry, layout, addons, images, paymentMode, customer } = body
  if (!INDUSTRIES.some(item => item.id === industry) || !LAYOUTS.some(item => item.id === layout)) return res.status(400).json({ error: 'Choose a valid industry and layout.' })
  if (!Array.isArray(addons) || addons.length > ADDONS.length || addons.some(id => typeof id !== 'string' || !ADDONS.some(item => item.id === id))) return res.status(400).json({ error: 'Invalid add-on selection.' })
  if (!Number.isInteger(images) || images < 0 || images > 200) return res.status(400).json({ error: 'Select between 0 and 200 images.' })
  if (paymentMode !== 'deposit' && paymentMode !== 'full') return res.status(400).json({ error: 'Invalid payment option.' })
  if (!customer || !isText(customer.name, 100) || !isText(customer.business, 120) || !isValidEmail(customer.email) || !isText(customer.phone, 30)) {
    return res.status(400).json({ error: 'Enter your name, business, valid email and WhatsApp number.' })
  }
  const note = typeof customer.note === 'string' ? customer.note.slice(0, 1000) : ''
  const quote = calculateDecemberQuote({ industry, layout, addons, images })
  const paymentAmount = paymentMode === 'deposit' ? quote.deposit : quote.total
  const metadata = {
    campaign: 'december-2026',
    config: { industry, layout, addons: quote.selectedAddons.map(item => item.id), images },
    customer_name: customer.name.trim(),
    business_name: customer.business.trim(),
    whatsapp: customer.phone.trim(),
    note,
    payment_mode: paymentMode,
    quoted_total_ngn: quote.total,
    outstanding_ngn: paymentMode === 'deposit' ? quote.balance : 0,
    custom_fields: [
      { display_name: 'Business', variable_name: 'business', value: customer.business.trim() },
      { display_name: 'Industry', variable_name: 'industry', value: quote.industry.label },
      { display_name: 'Payment choice', variable_name: 'payment_choice', value: paymentMode === 'deposit' ? '60% deposit' : 'Full payment' },
    ],
  }
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + secret, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: customer.email.trim(),
        amount: paymentAmount * 100,
        currency: 'NGN',
        callback_url,
        metadata: JSON.stringify(metadata),
      }),
      signal: AbortSignal.timeout(18000),
    })
    const result = await response.json()
    if (!response.ok || result.status !== true || !result.data?.authorization_url) {
      return res.status(502).json({ error: 'Paystack could not create the checkout. Please try again or email your quote.' })
    }
    return res.status(200).json({ authorization_url: result.data.authorization_url, reference: result.data.reference })
  } catch {
    return res.status(502).json({ error: 'Could not reach Paystack. Please retry shortly.' })
  }
}
