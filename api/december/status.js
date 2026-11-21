export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' })
  return res.status(200).json({ available: Boolean(process.env.PAYSTACK_SECRET_KEY) })
}
