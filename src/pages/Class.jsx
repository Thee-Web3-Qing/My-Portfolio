import { useEffect, useMemo, useState } from 'react'
import { screenReceipt } from '../lib/receiptScreening'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vvniehpzrvgmjdatpxrl.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__XVIsG1KQFChirhMMii7rg_dGp-dpYN'
const PRICING_URL = '/api/class-pricing'
const PRICE_TIERS = [1000, 2000, 4000, 8000, 16000]
const REGISTRATION_STORAGE_KEY = 'qing-class-registration-complete'

const formatNaira = (amount) => `₦${Number(amount).toLocaleString('en-NG')}`

const normaliseEmail = (value) => value.trim().toLowerCase()

const normalisePhone = (value) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('0')) return `234${digits.slice(1)}`
  if (digits.length === 10) return `234${digits}`
  return digits
}

const timeline = [
  { date: 'June 2026', title: 'AI agents and automated research', copy: 'Tracium and BountyPilot pushed me from simple AI assistance into systems that score opportunities, review work and keep humans in control.' },
  { date: 'August 2026', title: 'Interactive learning and client products', copy: 'Poysis, Moment, 22Energy and The Author’s Room showed how quickly a clear brief can become a useful, responsive product.' },
  { date: 'August 2026', title: 'AI plus real-world infrastructure', copy: 'AssetDNA combined evidence analysis, business records, authentication and onchain preparation in one product.' },
  { date: 'Now', title: 'Teaching the process', copy: 'My next goal is to help 500 people understand the basics of vibecoding and use AI to bring their own ideas to life.' },
]

const stack = [
  ['AI workspace', 'ChatGPT Plus and Codex'],
  ['Code editor', 'VS Code with Copilot, or Cursor'],
  ['Source control', 'GitHub'],
  ['Deployment', 'Vercel'],
  ['Data and storage', 'Supabase'],
  ['Build layer', 'React, Next.js, TypeScript and Tailwind CSS'],
]

const classifyReason = (value) => {
  const reason = value.toLowerCase()
  if (/client|freelance|customer|agency|service|work/.test(reason)) return 'Client work'
  if (/business|startup|company|brand|idea|product/.test(reason)) return 'Business or product'
  if (/content|creator|video|writing|social/.test(reason)) return 'Content creation'
  if (/job|career|income|earn|skill|employment/.test(reason)) return 'Career or income'
  if (/learn|beginner|curious|creativ|explore|understand/.test(reason)) return 'Learning and creativity'
  return 'Other'
}

export default function Class() {
  const [form, setForm] = useState({ fullName: '', whatsapp: '', email: '', reason: '', mentorship: '' })
  const [receipt, setReceipt] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [receiptAnalysis, setReceiptAnalysis] = useState(null)
  const [pricing, setPricing] = useState({ acceptedCount: 0, price: 1000, tierIndex: 0, filledInTier: 0, remainingInTier: 100, soldOut: false })

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  const detailsComplete = form.fullName.trim().length >= 3 && form.whatsapp.trim().length >= 10 && emailValid && form.reason.trim().length >= 20
  const missingDetails = [
    form.fullName.trim().length < 3 && 'your full name',
    form.whatsapp.trim().length < 10 && 'a valid WhatsApp number',
    !emailValid && 'a valid email address for your registration code',
    form.reason.trim().length < 20 && 'at least 20 characters explaining why you want to join',
  ].filter(Boolean)
  const category = useMemo(() => classifyReason(form.reason), [form.reason])

  useEffect(() => {
    if (!receipt) return undefined
    const url = URL.createObjectURL(receipt)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [receipt])

  useEffect(() => {
    const loadPricing = () => {
      fetch(PRICING_URL, { cache: 'no-store' })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('Pricing unavailable')))
        .then((data) => setPricing((current) => ({ ...current, ...data })))
        .catch(() => {})
    }

    loadPricing()
    window.addEventListener('focus', loadPricing)
    const interval = window.setInterval(loadPricing, 30000)

    return () => {
      window.removeEventListener('focus', loadPricing)
      window.clearInterval(interval)
    }
  }, [])

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const chooseReceipt = async (event) => {
    const file = event.target.files?.[0]
    setStatus({ type: '', message: '' })
    setReceiptAnalysis(null)
    if (!file) return setReceipt(null)
    const fileName = file.name.toLowerCase()
    const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf')
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|heic|heif|webp)$/i.test(fileName)
    if (!isPdf && !isImage) {
      event.target.value = ''
      setReceipt(null)
      return setStatus({ type: 'error', message: 'Please upload the transaction receipt as an image or PDF.' })
    }
    if (file.size > 10 * 1024 * 1024) {
      event.target.value = ''
      setReceipt(null)
      return setStatus({ type: 'error', message: 'The receipt file must be smaller than 10 MB.' })
    }
    setReceipt(file)
    setScanning(true)
    setScanProgress(0)
    const analysis = await screenReceipt(file, setScanProgress, pricing.price || 16000)
    setReceiptAnalysis(analysis)
    setScanning(false)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!detailsComplete || !receipt || !receiptAnalysis || scanning || submitting) return
    setSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      if (window.localStorage.getItem(REGISTRATION_STORAGE_KEY)) {
        throw new Error('You have already registered. Please do not submit another registration. Keep an eye on your email for your registration code after payment approval.')
      }

      const cleanEmail = normaliseEmail(form.email)
      const cleanPhone = normalisePhone(form.whatsapp)
      const duplicateCheck = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_class_registration`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_email: cleanEmail, p_whatsapp: cleanPhone }),
      })

      if (duplicateCheck.ok) {
        const existingRegistration = await duplicateCheck.json()
        if (existingRegistration?.exists) {
          throw new Error('You have already registered with this email address or WhatsApp number. Please do not submit another registration. Keep an eye on your email for your registration code after payment approval.')
        }
      }

      const originalExtension = receipt.name.split('.').pop()?.toLowerCase()
      const safeExtension = originalExtension && /^(pdf|jpe?g|png|heic|heif|webp)$/.test(originalExtension) ? originalExtension : 'jpg'
      const uploadReceipt = (path) => fetch(`${SUPABASE_URL}/storage/v1/object/class-receipts/${path}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': receipt.type || (safeExtension === 'pdf' ? 'application/pdf' : 'image/jpeg'),
          'x-upsert': 'false',
        },
        body: receipt,
      })

      let storagePath = `receipts/${receiptAnalysis.hash}.${safeExtension}`
      let upload = await uploadReceipt(storagePath)
      if (!upload.ok) {
        const uploadFailure = await upload.clone().text()
        const fileAlreadyExists = upload.status === 409 || /already exists|duplicate/i.test(uploadFailure)
        if (fileAlreadyExists) {
          storagePath = `receipts/${receiptAnalysis.hash}-${crypto.randomUUID()}.${safeExtension}`
          upload = await uploadReceipt(storagePath)
        }
      }
      if (!upload.ok) throw new Error('The receipt could not be uploaded. Please check your connection and try again.')

      const registration = {
        full_name: form.fullName.trim(),
        whatsapp: cleanPhone,
        email: cleanEmail,
        reason: form.reason.trim(),
        reason_category: category,
        mentorship_interest: form.mentorship || 'Not answered',
        receipt_path: storagePath,
        receipt_name: `[NGN-${pricing.price}][SCAN-${receiptAnalysis.score}-${receiptAnalysis.status.toUpperCase()}][HASH-${receiptAnalysis.hash}] ${receipt.name}`,
        receipt_size: receipt.size,
        amount_paid: pricing.price,
        currency: 'NGN',
        payment_source: 'Portfolio class page',
        payment_reference: receiptAnalysis.hash.slice(0, 16).toUpperCase(),
      }
      let save = await fetch(`${SUPABASE_URL}/rest/v1/class_registrations`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(registration),
      })
      if (!save.ok) {
        const firstFailure = await save.clone().text()
        if (/amount_paid|currency|payment_source|payment_reference|schema cache/i.test(firstFailure)) {
          const { amount_paid, currency, payment_source, payment_reference, ...legacyRegistration } = registration
          void amount_paid; void currency; void payment_source; void payment_reference
          save = await fetch(`${SUPABASE_URL}/rest/v1/class_registrations`, {
            method: 'POST',
            headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
            body: JSON.stringify(legacyRegistration),
          })
        }
      }
      if (!save.ok) {
        const failure = await save.text()
        if (/class_registration_identities|already registered|registration identity/i.test(failure)) {
          throw new Error('You have already registered with this email address or WhatsApp number. Please do not submit another registration. Keep an eye on your email for your registration code after payment approval.')
        }
        if (/receipt_hash|duplicate key|already exists|duplicate/i.test(failure)) throw new Error('This exact receipt has already been submitted.')
        throw new Error('Your details could not be submitted. Please try again.')
      }

      setStatus({ type: 'success', message: 'Registration received. After your payment is approved, your registration code will be sent to your email. Please keep an eye on your inbox and spam folder.' })
      window.localStorage.setItem(REGISTRATION_STORAGE_KEY, 'true')
      setForm({ fullName: '', whatsapp: '', email: '', reason: '', mentorship: '' })
      setReceipt(null)
      setReceiptAnalysis(null)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="class-page relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
      <section className="max-w-6xl mx-auto px-6 pt-14 sm:pt-24 pb-16 grid lg:grid-cols-[1.05fr_.95fr] gap-12 items-center min-h-[760px]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.28em] text-red-500 mb-5">Qing’s Vibecoding Starter Class</p>
          <h1 className="class-display text-6xl sm:text-7xl lg:text-[6.7rem] font-extrabold leading-[.88] uppercase">
            Build<br />with <span className="text-red-600">AI.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg sm:text-xl text-[#cfc6b9] leading-relaxed">
            Learn the basics of vibecoding, turn your ideas into clear product plans and build useful things without waiting to become a traditional developer first.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#register" className="rounded-full bg-red-600 px-6 py-3 font-mono text-sm uppercase font-bold text-white hover:bg-red-500 transition-colors">{pricing.soldOut ? 'Join waitlist' : `Join for ${formatNaira(pricing.price)}`}</a>
            <a href="#proof" className="rounded-full border border-[#f5eddf]/40 px-6 py-3 font-mono text-sm uppercase text-[#f5eddf] hover:bg-white/10 transition-colors">See my build history</a>
          </div>
          <p className="mt-5 font-mono text-xs uppercase tracking-wider text-[#948a7e]">Goal: teach 500 curious builders</p>
        </div>
        <div className="relative mx-auto w-full max-w-[470px]">
          <div className="absolute -inset-5 border border-red-700/40 translate-x-3 translate-y-3" />
          <div className="relative aspect-[4/5] overflow-hidden border border-[#f5eddf]/30 bg-[#181818]">
            <img src="/qing-class-portrait.jpg" alt="Qing, product builder and class instructor" className="h-full w-full object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/45 to-transparent p-6 pt-28">
              <p className="font-mono text-xs uppercase tracking-widest text-red-500">Instructor</p>
              <p className="class-display text-3xl font-bold">Qing The Creator</p>
              <p className="text-sm text-[#cfc6b9]">AI product builder and creative technologist.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="max-w-6xl mx-auto px-6 py-20 border-t border-[#f5eddf]/15">
        <p className="font-mono text-xs uppercase tracking-[.25em] text-red-500 mb-4">The proof is in the shipping</p>
        <h2 className="class-display text-4xl sm:text-6xl font-bold max-w-4xl">I learnt AI by building products that had to work.</h2>
        <div className="grid md:grid-cols-4 gap-4 mt-10">
          <article className="class-panel p-6 md:col-span-2"><span className="font-mono text-xs text-red-500 uppercase">Fastest commit window</span><strong className="block class-display text-4xl mt-3">3m 49s</strong><p className="text-[#b9afa3] mt-2">Moment, from its initial repository commit to its first complete landing-page build.</p></article>
          <article className="class-panel p-6 md:col-span-2"><span className="font-mono text-xs text-red-500 uppercase">Longest active build window</span><strong className="block class-display text-4xl mt-3">14d 16h</strong><p className="text-[#b9afa3] mt-2">The Author’s Room, across marketplace, profile, reading and publishing iterations.</p></article>
          <article className="class-panel p-6 md:col-span-2"><span className="font-mono text-xs text-red-500 uppercase">Most difficult</span><strong className="block class-display text-3xl mt-3">The Author’s Room</strong><p className="text-[#b9afa3] mt-2">Role-based access, book uploads, PDF reading, marketplace flows and several connected user journeys.</p></article>
          <article className="class-panel p-6 md:col-span-2"><span className="font-mono text-xs text-red-500 uppercase">Most complex</span><strong className="block class-display text-3xl mt-3">AssetDNA</strong><p className="text-[#b9afa3] mt-2">AI evidence analysis, business records, authentication and real-world asset preparation for onchain registration.</p></article>
        </div>
        <p className="mt-4 text-xs text-[#877d72]">Timeframes are calculated from the first and latest commits in each repository. They describe the recorded build window, not uninterrupted working hours.</p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-[.8fr_1.2fr] gap-12 border-t border-[#f5eddf]/15">
        <div><p className="font-mono text-xs uppercase tracking-[.25em] text-red-500 mb-4">My AI development history</p><h2 className="class-display text-4xl sm:text-5xl font-bold">From using AI to building with it.</h2></div>
        <div className="space-y-5">{timeline.map((item, index) => <article key={item.title} className="grid sm:grid-cols-[120px_1fr] gap-4 border-b border-[#f5eddf]/15 pb-5"><span className="font-mono text-xs text-red-500">0{index + 1} · {item.date}</span><div><h3 className="text-xl font-bold">{item.title}</h3><p className="text-[#b9afa3] mt-2 leading-relaxed">{item.copy}</p></div></article>)}</div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-[#f5eddf]/15">
        <p className="font-mono text-xs uppercase tracking-[.25em] text-red-500 mb-4">The working stack</p>
        <h2 className="class-display text-4xl sm:text-5xl font-bold max-w-3xl">The tools students should prepare before class.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#f5eddf]/20 border border-[#f5eddf]/20 mt-10">{stack.map(([label, value]) => <article key={label} className="bg-[#0d0d0d] p-6"><span className="font-mono text-xs uppercase text-red-500">{label}</span><h3 className="text-xl font-bold mt-3">{value}</h3></article>)}</div>
        <div className="mt-8 class-panel p-6"><h3 className="text-xl font-bold">Required subscriptions and accounts</h3><p className="text-[#b9afa3] mt-2">You need ChatGPT Plus with Codex, or a paid coding assistant through VS Code Copilot or Cursor. You should also create free GitHub, Vercel and Supabase accounts before class. The ₦1,000 class fee does not include paid tool subscriptions.</p></div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-8 border-t border-[#f5eddf]/15">
        <div><p className="font-mono text-xs uppercase tracking-[.25em] text-red-500 mb-4">Starting without paid tools</p><h2 className="class-display text-4xl sm:text-5xl font-bold">Use the Poor Man’s Guide first.</h2><p className="text-[#b9afa3] mt-4 max-w-xl">If you cannot afford the pro subscriptions yet, these two videos show a lighter route into vibecoding so you can begin learning with what you have.</p></div>
        <div className="grid gap-4"><a href="https://vm.tiktok.com/ZN8Nfs4MY/" target="_blank" rel="noreferrer" className="class-panel p-6 hover:border-red-600 transition-colors"><span className="font-mono text-xs text-red-500">PART 01</span><h3 className="text-2xl font-bold mt-2">Poor Man’s Guide to Vibecoding</h3><span className="inline-block mt-5 text-sm underline">Watch on TikTok</span></a><a href="https://vm.tiktok.com/ZN8NPYTdu/" target="_blank" rel="noreferrer" className="class-panel p-6 hover:border-red-600 transition-colors"><span className="font-mono text-xs text-red-500">PART 02</span><h3 className="text-2xl font-bold mt-2">Continue the beginner setup</h3><span className="inline-block mt-5 text-sm underline">Watch on TikTok</span></a></div>
      </section>

      <section id="register" className="max-w-6xl mx-auto px-6 py-20 border-t border-[#f5eddf]/15">
        <div className="mb-14">
          <p className="font-mono text-xs uppercase tracking-[.25em] text-red-500 mb-4">500 builders · five price tiers</p>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div><h2 className="class-display text-4xl sm:text-6xl font-bold">The earlier you join, the less you pay.</h2><p className="text-[#b9afa3] mt-3 max-w-2xl">A place is counted only after Qing accepts the payment. Pending and declined registrations do not move the price.</p></div>
            <div className="text-right"><span className="font-mono text-xs uppercase text-[#948a7e]">Accepted students</span><strong className="block class-display text-5xl text-red-500">{pricing.acceptedCount}<small className="text-xl text-[#948a7e]"> / 500</small></strong></div>
          </div>
          <div className="grid sm:grid-cols-5 gap-3 mt-10">{PRICE_TIERS.map((amount, index) => {
            const complete = pricing.acceptedCount >= (index + 1) * 100
            const current = !pricing.soldOut && pricing.tierIndex === index
            return <article key={amount} className={`class-panel p-5 ${current ? 'border-red-600' : ''}`}><span className="font-mono text-xs text-red-500">{index * 100 + 1}–{(index + 1) * 100}</span><strong className="block text-2xl mt-2">{formatNaira(amount)}</strong><span className="text-xs text-[#948a7e]">{complete ? 'Filled' : current ? `${pricing.remainingInTier} places left` : 'Next tier'}</span></article>
          })}</div>
          <div className="mt-7"><div className="flex justify-between gap-4 text-sm"><span>{pricing.soldOut ? 'All 500 places filled' : `Tier ${pricing.tierIndex + 1}: ${formatNaira(pricing.price)}`}</span><span>{pricing.soldOut ? '100 / 100' : `${pricing.filledInTier} / 100 accepted`}</span></div><div className="h-3 bg-[#251e1b] mt-3 overflow-hidden border border-[#f5eddf]/15"><span className="block h-full bg-red-600 transition-all duration-500" style={{ width: `${pricing.soldOut ? 100 : pricing.filledInTier}%` }} /></div><p className="text-xs text-[#877d72] mt-3">When a tier reaches 100 accepted payments, this bar resets to zero for the next tier.</p></div>
        </div>
        <div className="grid lg:grid-cols-[.78fr_1.22fr] gap-10 items-start">
          <div className="lg:sticky lg:top-28"><p className="font-mono text-xs uppercase tracking-[.25em] text-red-500 mb-4">Submission</p><h2 className="class-display text-4xl sm:text-5xl font-bold">Register and submit your receipt.</h2><div className="class-panel p-6 mt-7"><p className="font-mono text-xs uppercase text-red-500">{pricing.soldOut ? 'Registration is currently full' : `Current fee · ${formatNaira(pricing.price)}`}</p><p className="text-2xl font-bold mt-3">Moniepoint</p><p className="class-display text-4xl font-bold mt-1">8124320659</p><p className="text-[#b9afa3] mt-1">Giwa Oluwasheedah</p><p className="text-sm text-[#948a7e] mt-5">Take a screenshot or save the successful transaction receipt as an image or PDF before returning to this form. Your place counts after the payment is accepted.</p></div></div>
          <form onSubmit={submit} className="class-panel p-6 sm:p-8 space-y-6">
            <div><span className="font-mono text-xs text-red-500">STEP 01</span><h3 className="text-2xl font-bold mt-2">Tell me about yourself</h3><p className="text-sm text-[#b9afa3] mt-2">One registration per student. Your email address and WhatsApp number cannot be used to register again.</p></div>
            <label className="block"><span className="block text-sm mb-2">Full name *</span><input className="class-field" name="fullName" value={form.fullName} onChange={update} required placeholder="Your full name" /></label>
            <div className="grid sm:grid-cols-2 gap-4"><label className="block"><span className="block text-sm mb-2">WhatsApp number *</span><input className="class-field" name="whatsapp" value={form.whatsapp} onChange={update} required inputMode="tel" autoComplete="tel" aria-label="WhatsApp number" placeholder="Your WhatsApp number" /></label><label className="block"><span className="block text-sm mb-2">Email address *</span><input className="class-field" name="email" type="email" value={form.email} onChange={update} required autoComplete="email" aria-label="Email address for registration code" placeholder="you@email.com" /></label></div>
            <label className="block"><span className="block text-sm mb-2">Why do you want to join this beginner class? *</span><textarea className="class-field min-h-36 resize-y" name="reason" value={form.reason} onChange={update} required minLength={20} placeholder="Tell me what you want to learn or create." /><span className="flex flex-wrap justify-between gap-2 mt-2 text-xs text-[#887e73]"><span>Your response will be grouped as: {category}.</span><span>{form.reason.trim().length}/20 minimum characters</span></span></label>
            <label className="block"><span className="block text-sm mb-2">Would you like to continue with private mentorship afterwards?</span><select className="class-field" name="mentorship" value={form.mentorship} onChange={update}><option value="">This is optional</option><option value="Yes">Yes, I am interested</option><option value="Maybe">Maybe, tell me more later</option><option value="No">No, the class is enough for now</option></select></label>
            <div className="border-t border-[#f5eddf]/15 pt-6"><span className="font-mono text-xs text-red-500">STEP 02</span><h3 className="text-2xl font-bold mt-2">Upload and preview your receipt</h3><p className="text-sm text-[#b9afa3] mt-2">Choose a screenshot, photo, HEIC image, or PDF. Final submission becomes available after the required details above are complete.</p><label className="mt-5 block border border-dashed border-[#f5eddf]/30 p-5 text-center cursor-pointer hover:border-red-600 transition-colors"><input type="file" accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.heic,.heif,.webp" onChange={chooseReceipt} className="sr-only" /><span className="font-bold">{receipt ? receipt.name : 'Choose receipt image or PDF'}</span><span className="block text-xs text-[#887e73] mt-1">JPG, PNG, HEIC, WEBP, or PDF. Maximum 10 MB.</span></label></div>
            {previewUrl && <div className="border border-[#f5eddf]/20 bg-black p-3"><div className="flex items-center justify-between gap-3 mb-3"><span className="font-mono text-xs text-red-500">RECEIPT PREVIEW</span><a href={previewUrl} target="_blank" rel="noreferrer" className="text-xs underline">Open full screen</a></div>{receipt?.type.startsWith('image/') || /\.(jpe?g|png|heic|heif|webp)$/i.test(receipt?.name || '') ? <img src={previewUrl} alt="Transaction receipt preview" className="w-full max-h-[560px] object-contain bg-white" /> : <object data={previewUrl} type="application/pdf" className="w-full h-[480px] bg-white"><p className="text-black p-4">Your browser cannot display the PDF here. Use the full-screen link above.</p></object>}</div>}
            {scanning && <div className="border border-red-900 bg-red-950/30 p-4"><p className="font-bold">Checking receipt details…</p><div className="mt-3 h-1.5 bg-black overflow-hidden"><span className="block h-full bg-red-600 transition-all" style={{ width: `${Math.max(8, scanProgress)}%` }} /></div><p className="text-xs text-[#b9afa3] mt-2">This may take a moment on an iPhone.</p></div>}
            {receiptAnalysis && !scanning && <div className={`border p-4 ${receiptAnalysis.status === 'passed' ? 'border-green-800 bg-green-950/25' : 'border-amber-800 bg-amber-950/25'}`}><p className="font-bold">{receiptAnalysis.status === 'passed' ? 'Receipt checks completed.' : 'Receipt saved for manual review.'}</p><p className="text-sm text-[#cfc6b9] mt-1">{receiptAnalysis.detectedCount} of {receiptAnalysis.totalChecks} expected payment details were detected. Payment is only confirmed after Qing reviews the receipt against the bank account.</p>{receiptAnalysis.missing.length > 0 && <p className="text-xs text-[#b9afa3] mt-3">Not clearly detected: {receiptAnalysis.missing.join(', ')}.</p>}</div>}
            {status.message && <p role="status" className={`rounded-lg p-4 text-sm ${status.type === 'success' ? 'bg-green-950 text-green-200 border border-green-800' : 'bg-red-950 text-red-200 border border-red-800'}`}>{status.message}</p>}
            {(!detailsComplete || !receipt) && <p className="text-sm text-[#b9afa3]">{missingDetails.length ? `To submit, add ${missingDetails.join(', ')}${receipt ? '.' : ', and your receipt file.'}` : 'Choose your receipt image or PDF to submit your registration.'}</p>}
            <button type="submit" disabled={pricing.soldOut || !detailsComplete || !receipt || !receiptAnalysis || scanning || submitting} className="w-full rounded-full bg-red-600 px-6 py-4 font-mono text-sm uppercase font-bold text-white hover:bg-red-500 disabled:opacity-55 disabled:cursor-not-allowed transition-colors">{pricing.soldOut ? 'All 500 places are filled' : scanning ? 'Checking receipt…' : submitting ? 'Submitting…' : 'Submit registration and receipt'}</button>
          </form>
        </div>
      </section>
    </div>
  )
}
