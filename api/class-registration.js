import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'
import { createHash } from 'node:crypto'
import { createWorker } from 'tesseract.js'


const extractReceiptText = async (bytes, isPdf) => {
  if (isPdf) {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const pdf = await pdfjs.getDocument({data:new Uint8Array(bytes),useSystemFonts:true,disableFontFace:true}).promise
    let text = ''
    for (let i=1;i<=Math.min(pdf.numPages,2);i++) {
      const page=await pdf.getPage(i)
      const content=await page.getTextContent()
      text += ' ' + content.items.map(item=>item.str||'').join(' ')
    }
    return text
  }
  const worker=await createWorker('eng')
  try { return (await worker.recognize(bytes)).data.text || '' }
  finally { await worker.terminate() }
}
const parseReference = text => {
  const match = text.match(/(?:transaction\s*(?:reference|ref|id)|session\s*(?:id|number)|payment\s*(?:reference|ref)|reference\s*(?:number|no|id)?|transfer\s*(?:id|ref))\s*[:#-]?\s*([A-Z0-9][A-Z0-9-]{5,50})/i)
  return match ? match[1].toUpperCase().replace(/-/g,'') : null
}
const checkReceipt = (text, amount) => {
  const lower=text.toLowerCase().replace(/\s+/g,' ')
  const digits=text.replace(/\D/g,'')
  const reference=parseReference(text)
  const amountRx=new RegExp('(?:₦|ngn|\\b)\\s*'+String(amount).replace(/\B(?=(\d{3})+(?!\d))/g,'[,]?')+'(?:[.]00)?\\b','i')
  const checks={
    recipient:/oluwashe+dah/.test(lower)&&/giwa/.test(lower),
    account:digits.includes('8124320659'),
    amount:amountRx.test(lower),
    successful:/successful|success|completed|approved|payment received|paid and submitted/.test(lower),
    dateOrTime:/\b\d{1,2}[:.]\d{2}\s*(?:am|pm)?\b|\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}/.test(lower),
    reference:!!reference,
    bankContext:/moniepoint|bank|transfer|transaction|payment/.test(lower)
  }
  const weights={recipient:25,account:15,amount:20,successful:15,dateOrTime:10,reference:10,bankContext:5}
  const score=Object.entries(checks).reduce((sum,[key,yes])=>sum+(yes?weights[key]:0),0)
  return {checks,score,reference,status:score>=70&&checks.recipient&&checks.amount&&checks.successful?'passed':'review'}
}

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
    let screening
    try {
      const extractedText = await extractReceiptText(bytes,isPdf)
      screening = checkReceipt(extractedText,amount)
    } catch(error) {
      console.error('Server receipt OCR failed',error)
      screening = {checks:{},score:0,reference:null,status:'review'}
    }
    if (screening.reference) {
      const duplicate = await sql`SELECT id FROM class_registrations WHERE transaction_reference = ${screening.reference} LIMIT 1`
      if (duplicate.length) return res.status(409).json({error:'This transaction reference has already been submitted.'})
    }
    const extension = isPdf ? 'pdf' : isPng ? 'png' : isJpg ? 'jpg' : 'webp'
    const receipt = await put(`class-receipts/${hash}.${extension}`, bytes, { access: 'private', addRandomSuffix: true, contentType: isPdf ? 'application/pdf' : isPng ? 'image/png' : isJpg ? 'image/jpeg' : 'image/webp' })
    await sql`INSERT INTO class_registrations (full_name, whatsapp, email, reason, reason_category, mentorship_interest, receipt_path, receipt_name, receipt_size, amount_paid, currency, payment_source, payment_reference, fraud_score, fraud_status, fraud_checks, transaction_reference, payment_status) VALUES (${name}, ${phone}, ${email}, ${reason}, ${String(b.reasonCategory || 'Other')}, ${String(b.mentorshipInterest || 'Not answered')}, ${receipt.pathname}, ${String(b.receiptName || 'receipt')}, ${bytes.length}, ${amount}, 'NGN', 'Portfolio class page', ${hash}, ${screening.score}, ${screening.status}, ${JSON.stringify({checks:screening.checks,serverHash:hash,source:'server_ocr'})}::jsonb, ${screening.reference}, 'pending')`
    return res.status(201).json({ success: true, message: 'Registration submitted for payment review.' })
  } catch (error) {
    console.error('Class registration failed', error)
    if (error?.code === '23505') {
      return res.status(409).json({ error: 'This email address, WhatsApp number, receipt or transaction reference has already been submitted.' })
    }
    return res.status(500).json({ error: 'Could not submit registration. Please try again.' })
  }
}
