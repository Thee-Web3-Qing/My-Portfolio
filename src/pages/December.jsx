import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { INDUSTRIES, LAYOUTS, calculateDecemberQuote, getIndustryGroups, getSharedGroups, money } from '../data/december.js'
import './December.css'

const Arrow = () => <span aria-hidden="true">↗</span>

function IndustryPreview({ industry, layout }) {
  return (
    <div className={'dec-browser dec-browser-' + layout.id} style={{ '--dec-industry-accent': industry.colour, '--dec-industry-backdrop': industry.backdrop }}>
      <div className="dec-browser-chrome"><span /><span /><span /><p>yourbusiness.com</p></div>
      <div className="dec-browser-header"><strong>{industry.exampleBrand}</strong><span>Home&nbsp;&nbsp; Collection&nbsp;&nbsp; Contact</span><span className="dec-browser-menu">☰</span></div>
      <div className="dec-browser-content">
        <div className="dec-browser-feature">
          <span>DECEMBER COLLECTION • 2026</span>
          <h3>{industry.kicker}</h3>
          <p>Made for your customers. Styled for your brand.</p>
          <b>Explore {industry.category.toLowerCase()} <Arrow /></b>
        </div>
        <div className="dec-browser-art">
          <div className="dec-art-circle" />
          <div className="dec-art-sculpture" />
          <span>YOUR<br />VISUALS<br />HERE.</span>
        </div>
      </div>
      <div className="dec-browser-products">
        {industry.sample.map((item, index) => <div key={item}>
          <div className={'dec-browser-product-image dec-tone-' + index}><span>{String(index + 1).padStart(2, '0')}</span></div>
          <p>{item}</p>
        </div>)}
      </div>
    </div>
  )
}

function Summary({ quote, paymentMode, setPaymentMode, small = false }) {
  return (
    <div className={'dec-summary' + (small ? ' dec-summary-small' : '')}>
      <p className="dec-kicker">Your estimate · NGN</p>
      <h3>{money(quote.total)}</h3>
      <div className="dec-summary-choice">
        <span>Industry: <strong>{quote.industry.label}</strong></span>
        <span>Layout: <strong>{quote.layout.label}</strong></span>
      </div>
      <div className="dec-summary-lines">
        <div><span>Branded website + 12 listings</span><strong>{money(quote.base)}</strong></div>
        {quote.selectedAddons.map(item => <div key={item.id}><span>{item.name}</span><strong>{money(item.price)}</strong></div>)}
        {quote.images > 0 && <div><span>{quote.images} AI product {quote.images === 1 ? 'image' : 'images'} × {money(quote.imageUnitPrice)}</span><strong>{money(quote.imagesSubtotal)}</strong></div>}
      </div>
      <div className="dec-summary-subtotal"><span>Project subtotal</span><strong>{money(quote.total)}</strong></div>
      <div className="dec-summary-payment">
        <p>Choose how to pay</p>
        <label className={paymentMode === 'deposit' ? 'is-active' : ''}><input type="radio" name={small ? 'mobile-payment' : 'desktop-payment'} checked={paymentMode === 'deposit'} onChange={() => setPaymentMode('deposit')} /><span>60% deposit <small>Pay {money(quote.deposit)} today</small></span></label>
        <label className={paymentMode === 'full' ? 'is-active' : ''}><input type="radio" name={small ? 'mobile-payment' : 'desktop-payment'} checked={paymentMode === 'full'} onChange={() => setPaymentMode('full')} /><span>Pay in full <small>Pay {money(quote.total)} today</small></span></label>
      </div>
      <div className="dec-summary-today"><span>Due today</span><strong>{money(paymentMode === 'deposit' ? quote.deposit : quote.total)}</strong></div>
      {paymentMode === 'deposit' && <p className="dec-summary-note">Balance before launch: {money(quote.balance)}.</p>}
    </div>
  )
}

export default function December() {
  const [industryId, setIndustryId] = useState(() => {
    const query = new URLSearchParams(window.location.search).get('industry')
    return INDUSTRIES.some(x=>x.id===query) ? query : 'fashion'
  })
  const [layoutId, setLayoutId] = useState(() => {
    const query = new URLSearchParams(window.location.search).get('layout')
    return LAYOUTS.some(x=>x.id===query) ? query : 'editorial'
  })
  const [addons, setAddons] = useState([])
  const [images, setImages] = useState(0)
  const [paymentMode, setPaymentMode] = useState('deposit')
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', business: '', note: '' })
  const [status, setStatus] = useState('idle')
  const [checkoutEnabled, setCheckoutEnabled] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [builderVisible, setBuilderVisible] = useState(false)
  const [previewDevice, setPreviewDevice] = useState('desktop')
  const quote = useMemo(() => calculateDecemberQuote({ industry: industryId, layout: layoutId, addons, images }), [industryId, layoutId, addons, images])
  const industry = quote.industry
  const layout = quote.layout

  useEffect(() => {
    fetch('/api/december/status').then(res => res.json()).then(data => setCheckoutEnabled(data.available === true)).catch(() => setCheckoutEnabled(false))
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference') || params.get('trxref')
    if (!reference) return
    let cancelled = false
    setStatus('verifying')
    fetch('/api/december/verify?reference=' + encodeURIComponent(reference))
      .then(async res => { const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Could not verify payment.'); return data })
      .then(data => { if (!cancelled) { setReceipt(data); setStatus(data.paid ? 'paid' : 'pending'); setFeedback(data.paid ? 'Your payment has been confirmed. We will follow up using your Paystack contact details.' : 'Your payment is not yet confirmed. Please check again later if you were charged.') } })
      .catch(error => { if (!cancelled) { setStatus('error'); setFeedback(error.message) } })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const target = document.querySelector('.dec-builder')
    if (!target || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setBuilderVisible(entry.isIntersecting), { rootMargin: '-100px 0px -60px 0px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])
  const selectedSet = new Set(addons)
  const industryGroups = getIndustryGroups(industryId)
  const sharedGroups = getSharedGroups(industryId)
  const featureCount = industryGroups.reduce((sum, group) => sum + group.items.length, 0)
  const previewUrl = '/' + industryId + layoutId
  const updateCustomer = event => setCustomer(previous => ({ ...previous, [event.target.name]: event.target.value }))
  const toggleAddon = id => setAddons(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id])

  const emailSummary = [
    'December website request',
    'Industry: ' + industry.label,
    'Layout: ' + layout.label,
    'Business: ' + customer.business,
    'Name: ' + customer.name,
    'Email: ' + customer.email,
    'Phone: ' + customer.phone,
    'Add-ons: ' + (quote.selectedAddons.map(item => item.name).join(', ') || 'None'),
    'AI images: ' + quote.images,
    'Estimated total: ' + money(quote.total),
    'Payment preference: ' + (paymentMode === 'deposit' ? '60% deposit' : 'Full payment'),
    'Other notes: ' + customer.note,
  ].join('\n')

  async function beginCheckout(event) {
    event.preventDefault()
    if (!checkoutEnabled || status === 'loading') return
    setStatus('loading')
    setFeedback('')
    try {
      const response = await fetch('/api/december/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: industryId, layout: layoutId, addons: quote.selectedAddons.map(item => item.id), images: quote.images, paymentMode, customer }),
      })
      const data = await response.json()
      if (!response.ok || !data.authorization_url) throw new Error(data.error || 'Payment could not be started.')
      const checkoutUrl = new URL(data.authorization_url)
      if (checkoutUrl.protocol !== 'https:' || !(checkoutUrl.hostname === 'paystack.com' || checkoutUrl.hostname.endsWith('.paystack.com'))) throw new Error('Unexpected checkout provider.')
      window.location.assign(checkoutUrl.href)
    } catch (error) {
      setFeedback(error.message || 'Payment could not be started. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="december-page">
      <div className="dec-announcement"><span className="dec-live-dot" /> LIMITED DECEMBER 2026 BOOKINGS <span className="dec-announcement-separator">✳</span> MADE FOR SMALL BUSINESSES</div>
      <section className="dec-hero">
        <div className="dec-hero-text">
          <p className="dec-overline">QING THE CREATOR / THE DECEMBER EDIT</p>
          <h1>A beautiful website.<br /><em>A busy December.</em></h1>
          <p>Give customers one place to browse what you sell, see your prices and send an order. Pick your industry, choose your layout and add only what you need.</p>
          <div className="dec-hero-actions">
            <a href="#build-your-site" className="dec-btn dec-btn-light">Build my website <Arrow /></a>
            <span>Starting at <strong>₦120,000</strong></span>
          </div>
          <div className="dec-hero-meta"><span>01 / Select your business</span><span>02 / Make it yours</span><span>03 / Reserve your slot</span><span>Delivery: 3–7 days after assets are confirmed</span></div>
        </div>
        <div className="dec-hero-visual" aria-hidden="true">
          <div className="dec-hero-visual-orbit" />
          <div className="dec-hero-stamp">THE<br />DECEMBER<br />EDIT <span>✳</span></div>
          <div className="dec-floating-window">
            <div className="dec-floating-top"><i /><i /><i /><span>yourbrand.com</span></div>
            <div className="dec-floating-contents"><div><small>SEASON 2026</small><strong>Good things<br />are in store.</strong><span>DISCOVER COLLECTION ↗</span></div><div className="dec-floating-art"><i /></div></div>
            <div className="dec-floating-thumbs"><span /><span /><span /></div>
          </div>
          <div className="dec-hero-asterisk">✳</div>
        </div>
      </section>

      <div className="dec-ticker"><div>LOOK GOOD ONLINE <span>✳</span> SELL WITH LESS BACK-AND-FORTH <span>✳</span> YOUR BRAND, YOUR WEBSITE <span>✳</span> LOOK GOOD ONLINE <span>✳</span> </div></div>

      <section className="dec-intro" id="build-your-site">
        <p className="dec-kicker">BUILD YOUR OWN PACKAGE</p>
        <h2>Different businesses.<br /><em>Different needs.</em> Same starting point.</h2>
        <p>Your industry decides the content and layout inspiration, not the starting price. Every package includes mobile responsiveness, up to 12 listings, a featured December offer, WhatsApp ordering or enquiries, delivery or booking information, and one revision round.</p>
      </section>

      <div className="dec-builder">
        <div className="dec-builder-main">
          <section className="dec-builder-step">
            <div className="dec-step-title"><span>01</span><div><p className="dec-kicker">PICK YOUR INDUSTRY</p><h2>What do you sell?</h2></div></div>
            <div className="dec-industry-grid">
              {INDUSTRIES.map((item, index) => <button type="button" key={item.id} className={'dec-industry-card' + (industryId === item.id ? ' is-active' : '')} onClick={() => setIndustryId(item.id)} style={{ '--dec-card-accent': item.colour, '--dec-card-bg': item.backdrop }} aria-pressed={industryId === item.id}>
                <span className="dec-industry-number">0{index + 1}</span>
                <span className="dec-industry-symbol" aria-hidden="true">{['✿', '◒', '✳', '✧', '✺', '◇', '⌂'][index]}</span>
                <strong>{item.label}</strong>
                <span>{item.feature}</span>
                <i>{industryId === item.id ? '✓ Selected' : 'Choose this ↗'}</i>
              </button>)}
            </div>
          </section>

          <section className="dec-builder-step" id="dec-designs">
            <div className="dec-step-title"><span>02</span><div><p className="dec-kicker">CHOOSE YOUR LOOK</p><h2>One brand. Three directions.</h2></div></div>
            <p className="dec-section-description">All three starting layouts are included in the ₦120,000 website price. Select Custom homepage design below only if you want a completely different homepage arrangement.</p>
            <div className="dec-layout-choices">
              {LAYOUTS.map((item, index) => <button type="button" key={item.id} className={'dec-layout-option' + (layoutId === item.id ? ' is-active' : '')} onClick={() => setLayoutId(item.id)} aria-pressed={layoutId === item.id}>
                <span className={'dec-layout-doodle dec-layout-doodle-' + item.id}><i /><i /><i /></span>
                <strong>{item.label} <span>{String(index + 1).padStart(2, '0')}</span></strong>
                <small>{item.description}</small>
              </button>)}
            </div>
            <div className="dec-preview-wrap">
              <div className="dec-preview-header"><span><i /> LIVE WEBSITE PREVIEW</span><span>{industry.label} / {layout.label}</span></div>
              <div className="dec-preview-device-bar">
                <div className="dec-preview-address"><span className="dec-preview-browser-dots"><i/><i/><i/></span><span>{industryId}{layoutId}.sample</span></div>
                <div className="dec-preview-device-controls" aria-label="Preview screen size">
                  <button type="button" aria-pressed={previewDevice === 'desktop'} className={previewDevice === 'desktop' ? 'is-active' : ''} onClick={() => setPreviewDevice('desktop')}>Desktop</button>
                  <button type="button" aria-pressed={previewDevice === 'mobile'} className={previewDevice === 'mobile' ? 'is-active' : ''} onClick={() => setPreviewDevice('mobile')}>Mobile</button>
                </div>
              </div>
              <div className={'dec-real-preview-stage dec-real-preview-stage-' + previewDevice}>
                <div className={'dec-real-preview-frame dec-real-preview-frame-' + previewDevice}>
                  <iframe key={industryId + '-' + layoutId} title={industry.label + ' ' + layout.label + ' interactive website sample'} loading="lazy" src={previewUrl} />
                </div>
              </div>
              <div className="dec-real-preview-actions"><a className="dec-real-preview-open" href={previewUrl} target="_blank" rel="noreferrer">Open larger preview ↗</a><a href="#dec-features">Choose optional features ↓</a></div>
              <p>The selected website loads inside this preview. Product names, prices and photographs are illustrative and will be replaced with your supplied business resources.</p>
            </div>
          </section>

          <section className="dec-builder-step" id="dec-features">
            <div className="dec-step-title"><span>03</span><div><p className="dec-kicker">OPTIONAL FEATURE ADD-ONS</p><h2>Choose what your business needs.</h2></div></div>
            <p className="dec-section-description">You're viewing <strong>{industry.label}</strong> features. Switch industries above to see a different set of options without leaving this page. Everything here is optional, and the prices already include the December 5% discount.</p>
            <div className="dec-feature-headline"><span>FEATURES FOR {industry.label.toUpperCase()}</span><strong>{featureCount} industry-specific options</strong></div>
            {industryGroups.map((group, groupIndex) => (
              <details key={industryId + '-' + group.title} className="dec-feature-group" open={groupIndex === 0}>
                <summary><span>{String(groupIndex + 1).padStart(2, '0')}</span><span><strong>{group.title}</strong><small>{group.description}</small></span><b aria-hidden="true">+</b></summary>
                <div className="dec-feature-group-items">
                  {group.items.map(item => <label key={item.id} className={'dec-addon' + (selectedSet.has(item.id) ? ' is-active' : '')}>
                    <input type="checkbox" checked={selectedSet.has(item.id)} onChange={() => toggleAddon(item.id)} />
                    <span className="dec-check">✓</span><span className="dec-addon-copy"><strong>{item.name}</strong><small>{item.description}</small></span><b>+{money(item.price)}</b>
                  </label>)}
                </div>
              </details>
            ))}
            <div className="dec-feature-headline dec-feature-shared"><span>AVAILABLE FOR MOST BUSINESSES</span><strong>Shared website upgrades</strong></div>
            {sharedGroups.map((group, groupIndex) => (
              <details key={industryId + '-shared-' + group.title} className="dec-feature-group">
                <summary><span>{String(groupIndex + 1 + industryGroups.length).padStart(2, '0')}</span><span><strong>{group.title}</strong><small>{group.description}</small></span><b aria-hidden="true">+</b></summary>
                <div className="dec-feature-group-items">
                  {group.items.map(item => <label key={item.id} className={'dec-addon' + (selectedSet.has(item.id) ? ' is-active' : '')}>
                    <input type="checkbox" checked={selectedSet.has(item.id)} onChange={() => toggleAddon(item.id)} />
                    <span className="dec-check">✓</span><span className="dec-addon-copy"><strong>{item.name}</strong><small>{item.description}</small></span><b>+{money(item.price)}</b>
                  </label>)}
                </div>
              </details>
            ))}
            <div className="dec-photo-addon">
              <div className="dec-photo-top"><span className="dec-photo-graphic" aria-hidden="true">✳</span><div><p className="dec-kicker">OPTIONAL AI PHOTO STUDIO</p><h3>Product images that look ready for a campaign.</h3><p>AI-reimagined product photos from the reference photos you supply. We keep important product details intact wherever possible, but you approve the results before use.</p></div></div>
              <div className="dec-photo-controls">
                <label htmlFor="dec-photo-count">How many images?</label>
                <div className="dec-quantity">
                  <button type="button" aria-label="Remove one image" onClick={() => setImages(previous => Math.max(0, previous - 1))}>−</button>
                  <input id="dec-photo-count" type="number" min="0" max="200" value={images} onChange={event => setImages(Math.max(0, Math.min(200, Number(event.target.value) || 0)))} />
                  <button type="button" aria-label="Add one image" onClick={() => setImages(previous => Math.min(200, previous + 1))}>+</button>
                </div>
                <div className="dec-photo-total"><strong>{money(quote.imagesSubtotal)}</strong><small>{images ? money(quote.imageUnitPrice) + ' per image' : '₦500 per image'}</small></div>
              </div>
              <div className="dec-photo-rates"><span className={images > 0 && images < 10 ? 'is-active' : ''}>1–9 images <b>₦500 each</b></span><span className={images >= 10 && images < 30 ? 'is-active' : ''}>10–29 images <b>10% off</b></span><span className={images >= 30 ? 'is-active' : ''}>30+ images <b>20% off</b></span></div>
            </div>
          </section>

          <div className="dec-delivery-note"><span>DELIVERY TIMELINE</span><strong>3–7 days after your assets are confirmed.</strong><p>After payment, keep your Paystack reference. You will use it to fill in the business information form and share your product prices, images and other resources. The build timeline starts after we review and confirm that everything required is complete.</p><Link to="/december/details">Already paid? Submit business information ↗</Link></div>
      <section className="dec-builder-step" id="dec-checkout">
            <div className="dec-step-title"><span>04</span><div><p className="dec-kicker">RESERVE YOUR SLOT</p><h2>Ready to make it real?</h2></div></div>
            {status === 'paid' && <div className="dec-notice dec-notice-success" role="status"><strong>Payment verified ✓</strong><p>{feedback}</p><p>Reference: {receipt?.reference}</p><p>Amount received: {money((receipt?.amount || 0) / 100)}</p></div>}
            {status === 'pending' && <div className="dec-notice" role="status">{feedback}</div>}
            {(status === 'error') && <div className="dec-notice dec-notice-error" role="alert">{feedback}</div>}
            <form className="dec-form" onSubmit={beginCheckout}>
              <div className="dec-form-grid">
                <label>Your full name <input required name="name" autoComplete="name" maxLength={100} value={customer.name} onChange={updateCustomer} placeholder="Your name" /></label>
                <label>Your business name <input required name="business" maxLength={120} value={customer.business} onChange={updateCustomer} placeholder="e.g. Atelier by Ada" /></label>
                <label>Email address <input required type="email" name="email" autoComplete="email" maxLength={160} value={customer.email} onChange={updateCustomer} placeholder="you@yourbrand.com" /></label>
                <label>WhatsApp number <input required type="tel" name="phone" autoComplete="tel" maxLength={30} value={customer.phone} onChange={updateCustomer} placeholder="+234..." /></label>
              </div>
              <label className="dec-form-note">Anything I should know? <textarea name="note" maxLength={1000} rows={3} value={customer.note} onChange={updateCustomer} placeholder="Launch date, special requests, etc." /></label>
              <div className="dec-mobile-summary"><Summary quote={quote} paymentMode={paymentMode} setPaymentMode={setPaymentMode} small /></div>
              <div className="dec-checkout-actions">
                <button className="dec-btn dec-btn-dark" type="submit" disabled={!checkoutEnabled || status === 'loading' || status === 'verifying'}>{status === 'loading' ? 'Opening secure checkout…' : checkoutEnabled ? 'Pay with Paystack ↗' : 'Paystack setup pending'} </button>
                <a href={'mailto:qinglidah@gmail.com?subject=' + encodeURIComponent('December website enquiry') + '&body=' + encodeURIComponent(emailSummary)} className="dec-link-text">Email me this quote ↗</a>
              </div>
              {!checkoutEnabled && <p className="dec-checkout-warning">Online checkout is currently unavailable. You can still email your selected quote.</p>}
              <p className="dec-checkout-nextstep">AFTER PAYMENT: Keep your Paystack transaction reference. You will need it, alongside your payment email, to submit business information and product assets.</p>
              <p className="dec-form-fineprint">Your selected total covers the website build and chosen extras. Domain registration, hosting, third-party charges and maintenance are quoted separately. A 60% deposit reserves your slot; the balance is due before launch. Build time is approximately 3–7 days after we confirm all required product images, information and other resources are complete.</p>
            </form>
          </section>
        </div>
        <aside className={"dec-sidebar"+(builderVisible?" is-visible":"")} aria-label="Your website price and selected features"><div className="dec-sidebar-sticky"><Summary quote={quote} paymentMode={paymentMode} setPaymentMode={setPaymentMode} /><a href="#dec-checkout" className="dec-btn dec-btn-dark">Continue to checkout ↗</a><p>All prices are quoted in NGN. No hidden industry fees.</p></div></aside>
      </div>
      <div className={"dec-floating-mobile-checkout" + (builderVisible ? " dec-floating-checkout-in-builder" : "")} role="region" aria-label="Your checkout total">
        <div><span>Your website estimate</span><strong>{money(quote.total)}</strong><small>Due today: {money(paymentMode === 'deposit' ? quote.deposit : quote.total)}</small></div>
        <a href="#dec-checkout" className="dec-floating-mobile-button">Checkout ↗</a>
      </div>
      <section className="dec-bottom-cta"><span>NOT JUST FOR THE HOLIDAYS</span><h2>Built for December.<br /><em>Useful all year.</em></h2><p>Your December banners can come down in January. Your website stays.</p><Link to="/products">See what I've built <Arrow /></Link></section>
    </div>
  )
}

export function DecemberShortcut() {
  const { industry, stage } = useParams()
  const valid = INDUSTRIES.some(item => item.id === industry)
  const section = stage === 'features' ? '#dec-features' : stage === 'checkout' ? '#dec-checkout' : '#dec-designs'
  return <Navigate to={'/december' + (valid ? '?industry=' + industry : '') + section} replace />
}
