import { useEffect, useMemo, useState } from 'react'
import { screenReceipt } from '../lib/receiptScreening'
import './classClay.css'

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
  ['Data and storage', 'Neon PostgreSQL'],
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
  const [pricingLoaded, setPricingLoaded] = useState(false)
  const [pricing, setPricing] = useState({ acceptedCount: 80, price: 1000, tierIndex: 0, filledInTier: 80, remainingInTier: 20, soldOut: false })

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
        .then((data) => { setPricing((current) => ({ ...current, ...data })); setPricingLoaded(true) })
        .catch(() => { setPricingLoaded(false) })
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
    if (file.size > 5 * 1024 * 1024) {
      event.target.value = ''
      setReceipt(null)
      return setStatus({ type: 'error', message: 'The receipt file must be smaller than 5 MB.' })
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
      const receiptBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result).split(',')[1])
        reader.onerror = () => reject(new Error('Could not read receipt.'))
        reader.readAsDataURL(receipt)
      })
      const response = await fetch('/api/class-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName, whatsapp: cleanPhone, email: cleanEmail,
          reason: form.reason, reasonCategory: category,
          mentorshipInterest: form.mentorship, receiptName: receipt.name,
          receiptType: receipt.type, receiptBase64,
          fraudScore: receiptAnalysis.score, fraudStatus: receiptAnalysis.status,
          fraudChecks: receiptAnalysis.checks, receiptText: receiptAnalysis.extractedText || '',
          receiptHash: receiptAnalysis.hash
        })
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Registration failed.')

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
    <div className="class-page clay-class relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="clay-shell">
        <section className="clay-hero clay-surface" aria-labelledby="class-heading">
          <div className="clay-hero-copy">
            <span className="clay-kicker">Qing’s Vibecoding Starter Class</span>
            <h1 id="class-heading" className="class-display clay-hero-title">Build<br />with <span>AI.</span></h1>
            <p className="clay-hero-lede">Learn the basics of vibecoding, turn your ideas into clear product plans and build useful things without waiting to become a traditional developer first.</p>
            <div className="clay-hero-actions">
              <ClayButton href="#registration" tone="coral">Register now <span aria-hidden="true">↘</span></ClayButton>
              <ClayButton href="#proof" tone="cream">See my build history <span aria-hidden="true">↗</span></ClayButton>
            </div>
            <p className="clay-goal">Goal: teach 500 curious builders</p>
          </div>
          <div className="clay-hero-art">
            <div className="clay-object-tile clay-object-browser" aria-hidden="true"><span className="clay-object-browser-frame"><i /><i /><i /><b>◈</b></span></div>
            <div className="clay-object-tile clay-object-star" aria-hidden="true"><span>✦</span></div>
            <div className="clay-object-tile clay-object-laptop" aria-hidden="true"><span className="clay-laptop-screen"><b>&lt;/&gt;</b></span><span className="clay-laptop-base" /></div>
            <div className="clay-portrait-stage"><img src="/qing-class-clay.jpg" width="1122" height="1402" alt="Clay-style portrait of Qing surrounded by creative tools" className="clay-portrait" fetchPriority="high" /></div>
            <div className="clay-object-tile clay-object-folder" aria-hidden="true"><span className="clay-folder-shape"><i /></span></div>
            <div className="clay-object-tile clay-object-notebook" aria-hidden="true"><span className="clay-notebook-shape"><i /><i /><i /></span></div>
            <div className="clay-object-tile clay-object-code" aria-hidden="true"><span>&lt; / &gt;</span></div>
            <span className="clay-instructor"><small>Instructor</small><strong>Qing The Creator</strong><span>AI product builder and creative technologist.</span></span>
          </div>
        </section>

        <ClayNotice compact>
          <span className="clay-notice-symbol" aria-hidden="true">✳</span>
          <div><strong>Registration is open for payment review.</strong><span>Confirm current payment details directly with Qing before paying.</span></div>
          <a href="#registration" className="clay-notice-link">Read the class update <span aria-hidden="true">↗</span></a>
        </ClayNotice>

        <nav className="clay-jump-nav" aria-label="Class page sections">
          <a href="#proof">Build history</a>
          <a href="#journey">My AI journey</a>
          <a href="#tools">Your toolkit</a>
          <a href="#guides">Free guides</a>
          <a href="#registration">Registration</a>
        </nav>

        <section id="proof" className="clay-section" aria-labelledby="proof-heading">
          <div className="clay-section-head">
            <p className="clay-kicker">The proof is in the shipping</p>
            <h2 id="proof-heading" className="class-display">I learnt AI by building products that had to work.</h2>
          </div>
          <div className="clay-proof-grid">
            <ClayCard tone="peach" className="clay-proof-card"><ClayObject kind="stopwatch" /><span className="clay-eyebrow">Fastest commit window</span><strong className="clay-stat">3m 49s</strong><p>Moment, from its initial repository commit to its first complete landing-page build.</p></ClayCard>
            <ClayCard tone="blue" className="clay-proof-card"><ClayObject kind="calendar" /><span className="clay-eyebrow">Longest active build window</span><strong className="clay-stat">14d 16h</strong><p>The Author’s Room, across marketplace, profile, reading and publishing iterations.</p></ClayCard>
            <ClayCard tone="lilac" className="clay-proof-card"><ClayObject kind="browser" /><span className="clay-eyebrow">Most difficult</span><strong className="clay-proof-name">The Author’s Room</strong><p>Role-based access, book uploads, PDF reading, marketplace flows and several connected user journeys.</p></ClayCard>
            <ClayCard tone="mint" className="clay-proof-card"><ClayObject kind="database" /><span className="clay-eyebrow">Most complex</span><strong className="clay-proof-name">AssetDNA</strong><p>AI evidence analysis, business records, authentication and real-world asset preparation for onchain registration.</p></ClayCard>
          </div>
          <p className="clay-footnote">Timeframes are calculated from the first and latest commits in each repository. They describe the recorded build window, not uninterrupted working hours.</p>
        </section>

        <section id="journey" className="clay-section" aria-labelledby="journey-heading">
          <div className="clay-section-head">
            <p className="clay-kicker">My AI development history</p>
            <h2 id="journey-heading" className="class-display">From using AI to building with it.</h2>
          </div>
          <div className="clay-journey-grid">
            {timeline.map((item, index) => (
              <ClayCard key={item.title} tone={['yellow', 'pink', 'blue', 'mint'][index]} className="clay-journey-card">
                <ClayObject kind={['sheets', 'browser', 'database', 'rocket'][index]} />
                <div className="clay-journey-top"><ClayBadge>{String(index + 1).padStart(2, '0')}</ClayBadge><span>{item.date}</span></div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </ClayCard>
            ))}
          </div>
        </section>

        <section id="tools" className="clay-section" aria-labelledby="tools-heading">
          <div className="clay-section-head">
            <p className="clay-kicker">The working stack</p>
            <h2 id="tools-heading" className="class-display">The tools students should prepare before class.</h2>
          </div>
          <div className="clay-stack-grid">
            {stack.map(([label, value], index) => (
              <ClayCard key={label} tone={['mint', 'blue', 'peach', 'yellow', 'lilac', 'pink'][index]} className="clay-stack-card">
                <ClayObject kind={['bulb', 'laptop', 'folder', 'rocket', 'database', 'terminal'][index]} />
                <ClayBadge>{String(index + 1).padStart(2, '0')}</ClayBadge>
                <span className="clay-eyebrow">{label}</span>
                <h3>{value}</h3>
              </ClayCard>
            ))}
          </div>
          <ClayCard tone="cream" className="clay-subscription clay-enrollment-card">
            <span className="clay-subscription-icon" aria-hidden="true">✎</span>
            <div><h3>Required subscriptions and accounts</h3><p>You need ChatGPT Plus with Codex, or a paid coding assistant through VS Code Copilot or Cursor. You should also create free GitHub, Vercel and Neon accounts before class. Payments and registration are currently on hold.</p></div>
          </ClayCard>
        </section>

        <section id="guides" className="clay-section" aria-labelledby="guides-heading">
          <div className="clay-section-head">
            <p className="clay-kicker">Starting without paid tools</p>
            <h2 id="guides-heading" className="class-display">Use the Poor Man’s Guide first.</h2>
            <p>If you cannot afford the pro subscriptions yet, these two videos show a lighter route into vibecoding so you can begin learning with what you have.</p>
          </div>
          <div className="clay-guide-grid">
            <ClayCard tone="pink" className="clay-guide-card"><ClayObject kind="video" /><ClayBadge>PART 01</ClayBadge><h3>Poor Man’s Guide to Vibecoding</h3><ClayButton href="https://vm.tiktok.com/ZN8Nfs4MY/" tone="coral" external>Watch on TikTok <span aria-hidden="true">↗</span></ClayButton></ClayCard>
            <ClayCard tone="yellow" className="clay-guide-card"><ClayObject kind="video" /><ClayBadge>PART 02</ClayBadge><h3>Continue the beginner setup</h3><ClayButton href="https://vm.tiktok.com/ZN8NPYTdu/" tone="cream" external>Watch on TikTok <span aria-hidden="true">↗</span></ClayButton></ClayCard>
          </div>
        </section>

        <section id="registration" className="clay-section clay-update clay-enrollment">
          <div className="clay-section-head"><p className="clay-kicker">Registration</p><h2 className="class-display">Join the Vibecoding Starter Class.</h2></div>
          <ClayCard tone="mint" className="clay-progress-card clay-enrollment-progress">
            <div className="clay-progress-heading"><span>Batch {pricing.tierIndex + 1}: {formatNaira(pricing.price)}</span><strong>{`${pricing.remainingInTier} spots left`}</strong></div>
            <ClayProgress value={pricing.filledInTier} max={100} />
            <p>{pricing.acceptedCount} enrolled students, including the original 80. The price doubles every 100 students.</p>{!pricingLoaded && <p>Live pricing connection unavailable. Submissions remain disabled until it reconnects.</p>}
          </ClayCard>
          <ClayCard tone="cream" className="clay-subscription">
            <form onSubmit={submit} className="clay-enrollment-form">
              <h3>Secure your spot.</h3>
              <p>Confirm the payment account details directly with Qing before paying. Qing's TV reviews receipts and issues Classroom access codes after approval.</p>
              <label>Full name<input name="fullName" required minLength={3} value={form.fullName} onChange={update} /></label>
              <label>WhatsApp number<input name="whatsapp" required value={form.whatsapp} onChange={update} /></label>
              <label>Email address<input name="email" type="email" required value={form.email} onChange={update} /></label>
              <label>Why do you want to join?<textarea name="reason" required minLength={20} rows={4} value={form.reason} onChange={update} /></label>
              <label>Interested in mentorship?<select name="mentorship" value={form.mentorship} onChange={update}><option value="">Select</option><option>Yes</option><option>No</option><option>Maybe</option></select></label>
              <label>Payment receipt (PDF, JPEG, PNG or WebP, up to 5 MB)<input type="file" required accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={chooseReceipt} /></label>
              {scanning && <p>Screening receipt: {scanProgress}%</p>}
              {receiptAnalysis && <p>Receipt checked. Payment is subject to manual approval.</p>}
              {status.message && <p role="status">{status.message}</p>}
              <button type="submit" className="clay-button clay-button-coral clay-submit-button" disabled={!pricingLoaded || !detailsComplete || !receiptAnalysis || scanning || submitting}>{submitting ? 'Submitting...' : `Submit registration at ${formatNaira(pricing.price)}`}</button>
            </form>
          </ClayCard>
        </section>
      </div>
    </div>
  )
}

function ClayCard({ tone, className = '', children }) {
  return <article className={`clay-surface clay-tone-${tone} ${className}`}>{children}</article>
}

function ClayObject({ kind }) {
  return <span className={`clay-object clay-object-${kind}`} aria-hidden="true"><span className="clay-object-body"><i /><i /><i /><b /></span></span>
}

function ClayBadge({ children }) {
  return <span className="clay-badge">{children}</span>
}

function ClayButton({ href, tone, children, external = false }) {
  return <a className={`clay-button clay-button-${tone}`} href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
}

function ClayNotice({ children, compact = false }) {
  return <aside className={`clay-surface clay-notice ${compact ? 'clay-notice-compact' : ''}`}>{children}</aside>
}

function ClayProgress({ value, max }) {
  const percent = Math.max(0, Math.min(100, Number(value) / max * 100))
  return <div className="clay-progress-track" role="progressbar" aria-label="Accepted students towards 500 student goal" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}><span className="clay-progress-fill" style={{ width: `${percent}%` }} /></div>
}
