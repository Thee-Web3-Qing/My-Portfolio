import { useEffect, useMemo, useState } from 'react'
import './classClay.css'
import './classEditorial.css'

const PRICING_URL = '/api/class-pricing'

const formatNaira = (amount) => `₦${Number(amount).toLocaleString('en-NG')}`

const normaliseTelegram = (value) => value.trim().replace(/^@+/, '').toLowerCase()

const timeline = [
  { date: 'June 2026', title: 'AI agents and automated research', copy: 'Building agentic systems pushed me from simple AI assistance into workflows that organise work, review progress and keep humans in control.' },
  { date: 'August 2026', title: 'Interactive learning and client products', copy: 'Moment, 22Energy and The Author’s Room showed how quickly a clear brief can become a useful, responsive product.' },
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

const classroomScreens = [
  { label: 'Dashboard', image: '/classroom-screens/dashboard.webp', alt: 'The Classroom student dashboard and learning path' },
  { label: 'Task library', image: '/classroom-screens/tasks.webp', alt: 'The Classroom student task library' },
  { label: 'Lesson workspace', image: '/classroom-screens/lesson.webp', alt: 'The Classroom lesson and assignment workspace' },
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
  const [form, setForm] = useState({ fullName: '', whatsapp: '', telegram: '', email: '', reason: '', mentorship: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [pricingLoaded, setPricingLoaded] = useState(false)
  const [activeClassroomScreen, setActiveClassroomScreen] = useState(0)
  const [pricing, setPricing] = useState({ acceptedCount: 0, price: 5000, tierIndex: 0, filledInTier: 0, remainingInTier: 100, batchSize: 100, firstCohortComplete: false, soldOut: false })

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  const telegramValid = /^[a-zA-Z0-9_]{5,32}$/.test(normaliseTelegram(form.telegram))
  const detailsComplete = form.fullName.trim().length >= 3 && form.whatsapp.trim().length >= 10 && telegramValid && emailValid && form.reason.trim().length >= 20
  const missingDetails = [
    form.fullName.trim().length < 3 && 'your full name',
    form.whatsapp.trim().length < 10 && 'a valid WhatsApp number',
    !telegramValid && 'a valid Telegram username',
    !emailValid && 'a valid email address for your registration code',
    form.reason.trim().length < 20 && 'at least 20 characters explaining why you want to join',
  ].filter(Boolean)
  const category = useMemo(() => classifyReason(form.reason), [form.reason])

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

  const submit = async (event) => {
    event.preventDefault()
    if (!detailsComplete || submitting) return
    setSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('/api/class-payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, reasonCategory: category })
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.authorization_url) throw new Error(result.error || 'Could not start class payment.')
      const checkout = new URL(result.authorization_url)
      if (checkout.protocol !== 'https:' || !(checkout.hostname === 'paystack.com' || checkout.hostname.endsWith('.paystack.com'))) throw new Error('Unexpected checkout provider.')
      window.location.assign(checkout.href)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="class-page clay-class editorial-class-page">
      <div className="clay-shell">
        <section className="editorial-class-hero" aria-labelledby="class-heading">
          <div className="editorial-class-intro">
            <p className="editorial-kicker">THE CLASSROOM / A LEARNING EXPERIENCE BY QING</p>
            <h1 id="class-heading">Learn it.<br />Build it.<br /><em>Make it real.</em></h1>
            <p>An inside look at The Classroom, a learning platform built around lessons, practical assignments and a clear path from ideas to working products.</p>
            <div className="editorial-class-actions">
              <a href="https://the-classroom-qing.vercel.app/" target="_blank" rel="noopener noreferrer">Explore The Classroom ↗</a>
              <a href="#registration">Join the class ↓</a>
            </div>
          </div>
          <div className="editorial-class-showcase">
            <div className="editorial-class-browser">
              <div className="editorial-class-browser-bar"><span>● ● ●</span><span>{classroomScreens[activeClassroomScreen].label}</span><a href="https://the-classroom-qing.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Open The Classroom in a new tab">↗</a></div>
              <a className="editorial-class-screen" href="https://the-classroom-qing.vercel.app/" target="_blank" rel="noopener noreferrer">
                <img src={classroomScreens[activeClassroomScreen].image} alt={classroomScreens[activeClassroomScreen].alt} fetchPriority="high" />
              </a>
            </div>
            <div className="editorial-class-screen-controls" aria-label="Classroom screenshots">
              {classroomScreens.map((screen, index) => <button key={screen.label} type="button" className={index === activeClassroomScreen ? 'is-active' : ''} onClick={() => setActiveClassroomScreen(index)}><span>0{index + 1}</span>{screen.label}</button>)}
            </div>
            <div className="editorial-class-caption"><span>THE STUDENT EXPERIENCE</span><span>20 LESSONS · 5 MODULES · PRACTICAL TASKS</span></div>
          </div>
        </section>

        <ClayNotice compact>
          <span className="clay-notice-symbol" aria-hidden="true">✳</span>
          <div><strong>Class registration and secure payment.</strong><span>Complete the form and pay securely through Paystack.</span></div>
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
            <div><h3>Required subscriptions and accounts</h3><p>You need ChatGPT Plus with Codex, or a paid coding assistant through VS Code Copilot or Cursor. You should also create free GitHub, Vercel and Neon accounts before class. Registration is completed through the secure Paystack checkout.</p></div>
          </ClayCard>
        </section>

        <section id="guides" className="clay-section" aria-labelledby="guides-heading">
          <div className="clay-section-head">
            <p className="clay-kicker">Starting without paid tools</p>
            <h2 id="guides-heading" className="class-display">Use the Poor Man’s Guide first.</h2>
            <p>If you cannot afford the pro subscriptions yet, these two videos show a lighter route into vibecoding so you can begin learning with what you have.</p>
          </div>
          <div className="clay-guide-grid">
            <ClayCard tone="pink" className="clay-guide-card">
              <a className="clay-guide-image" href="https://vm.tiktok.com/ZN8Nfs4MY/" target="_blank" rel="noopener noreferrer"><img src="/class-guides/vibecoding-1.webp" alt="Vibecoding 1, Poor Man’s Guide to Vibecoding" loading="lazy" /></a>
              <div className="clay-guide-copy"><ClayBadge>VIBECODING 01</ClayBadge><h3>Poor Man’s Guide to Vibecoding</h3><ClayButton href="https://vm.tiktok.com/ZN8Nfs4MY/" tone="coral" external>Watch on TikTok <span aria-hidden="true">↗</span></ClayButton></div>
            </ClayCard>
            <ClayCard tone="yellow" className="clay-guide-card">
              <a className="clay-guide-image" href="https://vm.tiktok.com/ZN8NPYTdu/" target="_blank" rel="noopener noreferrer"><img src="/class-guides/vibecoding-2.webp" alt="Vibecoding 2, Poor Man’s Guide to Vibecoding" loading="lazy" /></a>
              <div className="clay-guide-copy"><ClayBadge>VIBECODING 02</ClayBadge><h3>Continue the beginner setup</h3><ClayButton href="https://vm.tiktok.com/ZN8NPYTdu/" tone="cream" external>Watch on TikTok <span aria-hidden="true">↗</span></ClayButton></div>
            </ClayCard>
          </div>
        </section>

        <section id="registration" className="clay-section clay-update clay-enrollment">
          <div className="clay-section-head"><p className="clay-kicker">Registration</p><h2 className="class-display">Join the Vibecoding Starter Class.</h2></div>
          <ClayCard tone="mint" className="clay-progress-card clay-enrollment-progress">
            <div className="clay-progress-heading"><span>Current cohort: {formatNaira(pricing.price)}</span><strong>{`${pricing.remainingInTier} spots left`}</strong></div>
            <ClayProgress value={pricing.filledInTier} max={pricing.batchSize || 100} />
            <p><strong>{pricing.filledInTier} of {pricing.batchSize || 100} spots filled at {formatNaira(pricing.price)}.</strong> {pricing.firstCohortComplete ? 'The first ₦5,000 cohort is complete.' : 'When 100 confirmed students join this cohort, registration moves to ₦10,000.'}</p>{!pricingLoaded && <p>Live pricing connection unavailable. Submissions remain disabled until it reconnects.</p>}
          </ClayCard>
          <ClayCard tone="cream" className="clay-subscription">
            <form onSubmit={submit} className="clay-enrollment-form">
              <h3>Secure your spot.</h3>
              <p>Complete your registration details, then continue to Paystack to pay {formatNaira(pricing.price)} securely. Your Classroom access code is issued after payment verification and registration approval.</p>
              <p className="clay-paystack-note">Paystack is the only payment method for this class. You will return to this website after Paystack verifies your payment.</p>
              <label>Full name<input name="fullName" required minLength={3} value={form.fullName} onChange={update} /></label>
              <label>WhatsApp number<input name="whatsapp" required value={form.whatsapp} onChange={update} /></label>
              <label>Telegram username<input name="telegram" required minLength={5} maxLength={33} placeholder="@yourusername" autoCapitalize="none" autoCorrect="off" value={form.telegram} onChange={update} /></label>
              <label>Email address<input name="email" type="email" required value={form.email} onChange={update} /></label>
              <label>Why do you want to join?<textarea name="reason" required minLength={20} rows={4} value={form.reason} onChange={update} /></label>
              <label>Interested in mentorship?<select name="mentorship" value={form.mentorship} onChange={update}><option value="">Select</option><option>Yes</option><option>No</option><option>Maybe</option></select></label>
              {status.message && <p role="status">{status.message}</p>}
              <button type="submit" className="clay-button clay-button-coral clay-submit-button" disabled={!pricingLoaded || !detailsComplete || submitting}>{submitting ? 'Opening secure checkout…' : `Pay ${formatNaira(pricing.price)} with Paystack ↗`}</button>
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

function ClayObject() { return null }

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
