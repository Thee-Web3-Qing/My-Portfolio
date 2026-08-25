import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

const cleanText = (value) => value
  .toLowerCase()
  .replace(/[|]/g, 'i')
  .replace(/\s+/g, ' ')
  .trim()

const fileHash = async (file) => {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const recogniseImage = async (source, onProgress) => {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng', 1, {
    logger: (message) => {
      if (message.status === 'recognizing text') onProgress?.(Math.round(message.progress * 100))
    },
  })
  try {
    const result = await worker.recognize(source)
    return result.data.text || ''
  } finally {
    await worker.terminate()
  }
}

const readPdf = async (file, onProgress) => {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  const pages = Math.min(pdf.numPages, 2)
  let text = ''

  for (let pageNumber = 1; pageNumber <= pages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    text += ` ${content.items.map((item) => ('str' in item ? item.str : '')).join(' ')}`
  }

  if (text.replace(/\s/g, '').length >= 60) return text

  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 1.7 })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  const context = canvas.getContext('2d')
  await page.render({ canvasContext: context, viewport }).promise
  return recogniseImage(canvas, onProgress)
}

const amountPattern = (amount) => {
  const digits = String(amount)
  const grouped = Number(amount).toLocaleString('en-NG')
  return new RegExp(`(?:₦|ngn|\\bn)?\\s*(?:${digits}|${grouped.replace(',', '[\\s,.]?')})(?:[.,]00)?\\b`, 'i')
}

const evaluateText = (rawText, expectedAmount) => {
  const text = cleanText(rawText)
  const compactDigits = text.replace(/\D/g, '')
  const checks = {
    recipient: /oluwashe+dah/.test(text) && /giwa/.test(text),
    account: compactDigits.includes('8124320659'),
    amount: amountPattern(expectedAmount).test(text),
    successful: /successful|success|completed|approved|payment received|received by bank|paid and submitted/.test(text),
    dateOrTime: /\b\d{1,2}[:.]\d{2}\s*(?:am|pm)?\b|\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}/.test(text),
    reference: /(?:transaction|session|reference|receipt|transfer)\s*(?:id|no|number|reference)?\s*[:#-]?\s*[a-z0-9-]{6,}/.test(text),
    bankContext: /moniepoint|bank|transfer|transaction|payment/.test(text),
  }
  const weights = { recipient: 25, account: 15, amount: 20, successful: 15, dateOrTime: 10, reference: 10, bankContext: 5 }
  const score = Object.entries(checks).reduce((total, [key, found]) => total + (found ? weights[key] : 0), 0)
  const essentialMatch = checks.recipient && checks.amount && checks.successful
  const status = score >= 70 && essentialMatch ? 'passed' : 'review'
  const labels = {
    recipient: 'Recipient name', account: 'Recipient account number', amount: `₦${Number(expectedAmount).toLocaleString('en-NG')} amount`, successful: 'Successful payment status',
    dateOrTime: 'Transaction date or time', reference: 'Transaction or reference ID', bankContext: 'Bank or transfer details',
  }
  const missing = Object.entries(checks).filter(([, found]) => !found).map(([key]) => labels[key])
  return { checks, score, status, missing, detectedCount: Object.values(checks).filter(Boolean).length, totalChecks: Object.keys(checks).length }
}

export const screenReceipt = async (file, onProgress, expectedAmount = 1000) => {
  const hash = await fileHash(file)
  try {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    const text = isPdf ? await readPdf(file, onProgress) : await recogniseImage(file, onProgress)
    return { ...evaluateText(text, expectedAmount), hash, scanCompleted: true, expectedAmount }
  } catch (error) {
    console.error('Receipt screening failed', error)
    return {
      checks: {}, score: 0, status: 'review', missing: ['Automatic text scan unavailable'],
      detectedCount: 0, totalChecks: 7, hash, scanCompleted: false, expectedAmount,
    }
  }
}