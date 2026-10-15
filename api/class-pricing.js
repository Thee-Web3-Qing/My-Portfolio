import { neon } from '@neondatabase/serverless'

const BASELINE = 80
const BATCH_SIZE = 100
const buildPricing = (count) => {
  const acceptedCount = Math.max(BASELINE, Number(count) || BASELINE)
  const tierIndex = Math.floor(acceptedCount / BATCH_SIZE)
  const filledInTier = acceptedCount % BATCH_SIZE
  return {
    acceptedCount,
    soldOut: false,
    tierIndex,
    price: 1000 * (2 ** tierIndex),
    filledInTier,
    remainingInTier: BATCH_SIZE - filledInTier,
  }
}

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
    const rows = await sql`
      SELECT
        COALESCE((SELECT integer_value FROM classroom_registration_settings WHERE key = 'legacy_student_offset'), 80)::int
        + (SELECT count(*)::int FROM class_registrations WHERE payment_status IN ('confirmed', 'approved')) AS accepted_count
    `
    return response.status(200).json(buildPricing(rows[0].accepted_count))
  } catch (error) {
    console.error('Class pricing lookup failed', error)
    return response.status(502).json({ error: 'Pricing is temporarily unavailable' })
  }
}
