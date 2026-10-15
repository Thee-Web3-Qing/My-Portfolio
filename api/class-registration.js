import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'
import { createHash } from 'node:crypto'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.DATABASE_URL || !process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'Registration is being configured. Please try later.' })
  try {
    const b = req.body || {}
    const name = String(b.fullName || '').trim()
    const email = String(b.email || '').trim().toLowerCase()
    const phone = String(b.whatsapp || '').replace(/\D/g, '')
    const reason = String(b.reason || '').trim()
    if (name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 10 || reason.length < 20) return res.status(400).json({ error: 'Complete all required fields.' })
    const raw = String(b.receiptBase64 || '')
    if (!raw || raw.length > 7_000_000) return res.status(400).json({ error: 'Receipt is required and must be under 5 MB.' })
    const bytes = Buffer.from(raw, 'base64')
    if (!bytes.length || bytes.length > 5 * 1024 * 1024) return res.status(400).json({ error: 'Invalid receipt size.' })
    const mime = String(b.receiptType || '')
    const isPdf = bytes.subarray(0, 5).toString() === '%PDF-'
    const isPng = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    const isJpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    const isWebp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP'
    if (!(isPdf || isPng || isJpg || isWebp)) return res.status(400).json({ error: 'Upload a PDF, PNG, JPEG or WebP receipt.' })
    const hash = createHash('sha256').update(bytes).digest('hex')
    const sql = neon(process.env.DATABASE_URL)
    const existing = await sql`SELECT id FROM class_registrations WHERE lower(email) = ${email} OR whatsapp = ${phone} OR payment_reference = ${hash} LIMIT 1`
    if (existing.length) return res.status(409).json({ error: 'This email, phone number or receipt has already been registered.' })
    const count = await sql`SELECT COALESCE((SELECT integer_value FROM classroom_registration_settings WHERE key = 'legacy_student_offset'), 80)::int + (SELECT count(*)::int FROM class_registrations WHERE payment_status IN ('confirmed','approved')) AS total`
    const amount = 1000 * (2 ** Math.floor(Number(count[0].total) / 100))
    const extension = isPdf ? 'pdf' : isPng ? 'png' : isJpg ? 'jpg' : 'webp'
    const receipt = await put(`class-receipts/${hash}.${extension}`, bytes, { access: 'private', addRandomSuffix: true, contentType: isPdf ? 'application/pdf' : isPng ? 'image/png' : isJpg ? 'image/jpeg' : 'image/webp' })
    await sql`INSERT INTO class_registrations (full_name, whatsapp, email, reason, reason_category, mentorship_interest, receipt_path, receipt_name, receipt_size, amount_paid, currency, payment_source, payment_reference, fraud_score, fraud_status, payment_status) VALUES (${name}, ${phone}, ${email}, ${reason}, ${String(b.reasonCategory || 'Other')}, ${String(b.mentorshipInterest || 'Not answered')}, ${receipt.pathname}, ${String(b.receiptName || 'receipt')}, ${bytes.length}, ${amount}, 'NGN', 'Portfolio class page', ${hash}, ${Number(b.fraudScore) || 0}, 'review', 'pending')`
    return res.status(201).json({ success: true, message: 'Registration submitted for payment review.' })
  } catch (error) {
    console.error('Class registration failed', error)
    return res.status(500).json({ error: 'Could not submit registration. Please try again.' })
  }
}
