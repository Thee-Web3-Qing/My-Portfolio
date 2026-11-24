import { neon } from '@neondatabase/serverless'
import { getClassPricing } from './_lib/classPricing.js'

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }
  try {
    if (!process.env.DATABASE_URL) {
      return response.status(503).json({ error: 'Pricing database is not configured' })
    }
    const sql = neon(process.env.DATABASE_URL)
    return response.status(200).json(await getClassPricing(sql))
  } catch (error) {
    console.error('Class pricing lookup failed', error)
    return response.status(502).json({ error: 'Pricing is temporarily unavailable' })
  }
}
