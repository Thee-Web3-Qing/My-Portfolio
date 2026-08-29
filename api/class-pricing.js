const PRICE_TIERS = [1000, 2000, 4000, 8000, 16000]

const buildPricing = (count) => {
  const acceptedCount = Math.max(0, Number(count) || 0)
  const soldOut = acceptedCount >= 500
  const tierIndex = soldOut ? PRICE_TIERS.length - 1 : Math.floor(acceptedCount / 100)
  const filledInTier = soldOut ? 100 : acceptedCount % 100

  return {
    acceptedCount,
    soldOut,
    tierIndex,
    price: PRICE_TIERS[tierIndex],
    filledInTier,
    remainingInTier: soldOut ? 0 : 100 - filledInTier,
  }
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const pricingSourceUrl = process.env.CLASS_PRICING_SOURCE_URL
    if (pricingSourceUrl) {
      const pricingSource = await fetch(pricingSourceUrl, { cache: 'no-store' })
      if (!pricingSource.ok) throw new Error(`Pricing source returned ${pricingSource.status}`)

      const pricing = await pricingSource.json()
      if (!Number.isFinite(Number(pricing.acceptedCount))) {
        throw new Error('Pricing source did not return an accepted-payment count')
      }

      return response.status(200).json(buildPricing(pricing.acceptedCount))
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseSecret) {
      return response.status(503).json({ error: 'Pricing is temporarily unavailable' })
    }

    const registrations = await fetch(
      `${supabaseUrl.replace(/\/$/, '')}/rest/v1/class_registrations?select=id&payment_status=eq.confirmed`,
      {
        method: 'HEAD',
        headers: {
          apikey: supabaseSecret,
          Authorization: `Bearer ${supabaseSecret}`,
          Prefer: 'count=exact',
        },
      },
    )

    if (!registrations.ok) {
      throw new Error(`Supabase returned ${registrations.status}`)
    }

    const contentRange = registrations.headers.get('content-range') || ''
    const total = Number(contentRange.split('/').pop())

    if (!Number.isFinite(total)) {
      throw new Error('Supabase did not return an accepted-payment count')
    }

    return response.status(200).json(buildPricing(total))
  } catch (error) {
    console.error('Class pricing lookup failed', error)
    return response.status(502).json({ error: 'Pricing is temporarily unavailable' })
  }
}
