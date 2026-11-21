import { enabledOrderModes, needAdmin, ordersDb } from '../../api/_lib/decemberAdmin.js'
import { confirmPayment, paystackGet } from '../../api/_lib/payments.js'

const validRef = value => /^QDEC-[a-f0-9]{32}$/i.test(value)

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  if (!needAdmin(req, res, 'POST')) return

  const mode = String(req.body?.environment || '')
  const reference = String(req.body?.reference || '').trim()
  if (!enabledOrderModes().includes(mode) || !validRef(reference)) {
    return res.status(400).json({error:'Choose a valid website payment reference and environment.'})
  }

  try {
    const sql = ordersDb(mode)
    const rows = await sql`SELECT reference, status, amount_kobo, customer_email
      FROM payment_orders
      WHERE reference = ${reference} AND environment = ${mode} AND product = 'december-website'
      LIMIT 1`
    if (!rows.length) return res.status(404).json({error:'Website order not found in that environment.'})

    const verification = await confirmPayment(reference, mode)
    if (verification.paid) {
      return res.status(200).json({
        paid:true,reference,environment:mode,providerStatus:'success',
        message:'Paystack confirmed this payment. Project progress can now be updated.'
      })
    }

    // Detailed diagnostics are available only to an authenticated admin.
    // We expose comparisons, never the customer's email or payment credentials.
    const transaction = await paystackGet('/transaction/verify/' + encodeURIComponent(reference), mode)
    const checks = {
      reference:transaction.reference === reference,
      environment:transaction.domain === mode,
      currency:transaction.currency === 'NGN',
      amount:Number(transaction.amount) === Number(rows[0].amount_kobo),
      customerEmail:String(transaction.customer?.email||'').toLowerCase() === String(rows[0].customer_email||'').toLowerCase(),
    }
    const failures = Object.keys(checks).filter(key=>!checks[key])
    const paidAtPaystack = transaction.status === 'success'
    const message = paidAtPaystack
      ? 'Paystack reports success but the transaction details do not match the saved order: ' + failures.join(', ') + '.'
      : 'Paystack currently reports "' + String(transaction.status||'unknown') + '". No verified payment has been recorded.'

    return res.status(200).json({
      paid:false,reference,environment:mode,providerStatus:String(transaction.status||'unknown'),
      checks,failedChecks:failures,message
    })
  } catch (error) {
    console.error('Admin Paystack reconciliation failed:', error?.message)
    return res.status(502).json({error:'Paystack could not verify this transaction at the moment. Its recorded payment status has not been changed.'})
  }
}
