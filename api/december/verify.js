import { calculateDecemberQuote } from '../../src/data/december.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) return res.status(503).json({ error: 'Payment verification is not configured.' })
  const reference = String(req.query?.reference || '').trim()
  if (!/^[A-Za-z0-9._-]{6,120}$/.test(reference)) return res.status(400).json({ error: 'Invalid payment reference.' })
  try {
    const response = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(reference), {
      headers: { Authorization: 'Bearer ' + key },
      signal: AbortSignal.timeout(18000),
    })
    const result = await response.json()
    if (!response.ok || !result.status || !result.data) return res.status(502).json({ error: 'Unable to verify this payment reference.' })
    const data = result.data
    let metadata = data.metadata || {}
    if (typeof metadata === 'string') {
      try { metadata = JSON.parse(metadata) } catch { metadata = {} }
    }
    if (metadata.campaign !== 'december-2026' || !metadata.config || !['full', 'deposit'].includes(metadata.payment_mode)) {
      return res.status(400).json({ error: 'This is not a December website checkout.' })
    }
    const quote = calculateDecemberQuote(metadata.config)
    const expectedKobo = (metadata.payment_mode === 'deposit' ? quote.deposit : quote.total) * 100
    const verified = data.reference === reference && data.status === 'success' && data.currency === 'NGN' && Number(data.amount) === expectedKobo && Number(metadata.quoted_total_ngn) === quote.total
    return res.status(200).json({
      paid: verified,
      reference,
      amount: verified ? expectedKobo : 0,
      total: quote.total,
      paymentMode: metadata.payment_mode,
      balance: verified && metadata.payment_mode === 'deposit' ? quote.balance : 0,
    })
  } catch {
    return res.status(502).json({ error: 'Verification is temporarily unavailable. Your payment may still be processing.' })
  }
}
