export const CLASS_COHORT_SETTING_KEY = 'class_5000_cohort_started_at_epoch'
export const CLASS_BATCH_SIZE = 100
export const CLASS_START_PRICE = 5000
export const CLASS_NEXT_PRICE = 10000

export const buildClassPricing = count => {
  const acceptedCount = Math.max(0, Number(count) || 0)
  const firstCohortComplete = acceptedCount >= CLASS_BATCH_SIZE
  const filledInTier = firstCohortComplete
    ? acceptedCount % CLASS_BATCH_SIZE
    : acceptedCount

  return {
    acceptedCount,
    soldOut: false,
    tierIndex: firstCohortComplete ? 1 : 0,
    price: firstCohortComplete ? CLASS_NEXT_PRICE : CLASS_START_PRICE,
    filledInTier,
    remainingInTier: CLASS_BATCH_SIZE - filledInTier,
    batchSize: CLASS_BATCH_SIZE,
    firstCohortComplete,
  }
}

export const getClassPricing = async sql => {
  const rows = await sql`
    SELECT count(*)::int AS accepted_count
    FROM class_registrations
    WHERE payment_status IN ('confirmed', 'approved')
      AND created_at >= to_timestamp(COALESCE(
        (SELECT integer_value
         FROM classroom_registration_settings
         WHERE key = ${CLASS_COHORT_SETTING_KEY}),
        1795478400
      ))
  `

  return buildClassPricing(rows[0]?.accepted_count)
}
