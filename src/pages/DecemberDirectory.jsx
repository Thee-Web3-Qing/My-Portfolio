import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { INDUSTRIES, money } from '../data/december.js'
import { demoCatalogue } from '../data/decemberDemos.js'
import './DecemberSales.css'

export default function DecemberDirectory() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  useEffect(() => {
    const industry = params.get('industry')
    if (INDUSTRIES.some(x => x.id === industry)) {
      const layout = params.get('layout')
      navigate('/december/' + industry + (layout ? '?layout=' + encodeURIComponent(layout) : ''), {replace:true})
    }
  },[navigate,params])
  return <div className="ds-root ds-directory">
    <div className="ds-ticker"><span>THE DECEMBER EDIT</span><span>✳</span><span>LIMITED WEBSITE BOOKINGS FOR DECEMBER 2026</span></div>
    <section className="ds-directory-hero">
      <div className="ds-directory-hero-copy">
        <p className="ds-eyebrow"><span className="ds-dot"/> QING THE CREATOR / DECEMBER 2026</p>
        <h1>Pick your business.<br/><em>Make it yours.</em></h1>
        <p>Choose a website made for what you sell. Explore the available features for your business, pick a design direction and see your price before checkout.</p>
        <a className="ds-primary-link" href="#industries">Explore business types <span>↗</span></a>
        <div className="ds-hero-facts"><div><span>WEBSITE STARTS AT</span><strong>{money(100000)}</strong></div><div><span>ESTIMATED DELIVERY</span><strong>3–7 days*</strong></div><div><span>UPFRONT OPTION</span><strong>60% deposit</strong></div></div>
      </div>
      <div className="ds-directory-hero-photo"><img src={demoCatalogue.fashion.hero} alt="Editorial fashion photography illustrating a business storefront"/><div><span>YOUR BUSINESS</span><strong>DESERVES<br/>A BETTER<br/>STORE.</strong><small>THE DECEMBER EDIT / 2026</small></div></div>
    </section>
    <section className="ds-directory-section" id="industries">
      <header className="ds-directory-heading"><div><p className="ds-eyebrow">01 / FIND YOUR FIT</p><h2>What kind of<br/><em>business is yours?</em></h2></div><p>Each industry has its own feature catalogue and design options. You only pay for the extras you actually choose.</p></header>
      <div className="ds-directory-grid">
        {INDUSTRIES.map((industry,index)=><Link key={industry.id} to={'/december/'+industry.id} className="ds-directory-card">
          <div className="ds-directory-card-photo"><img loading="lazy" src={demoCatalogue[industry.id]?.hero} alt={industry.label+' sample storefront photography'}/><span>0{index+1} / 07</span></div>
          <div className="ds-directory-card-info"><div><span>{industry.type==='products'?'PRODUCT STOREFRONTS':industry.type==='services'?'SERVICE WEBSITES':'BOOKING ENQUIRIES'}</span><h3>{industry.label}</h3><p>{industry.feature}</p></div><b aria-hidden="true">↗</b></div>
        </Link>)}
      </div>
    </section>
    <section className="ds-how-it-works">
      <p className="ds-eyebrow">02 / THE PROCESS</p>
      <h2>Simple to choose.<br/>Clear to pay for.</h2>
      <div className="ds-process-grid">
        <div><span>01</span><h3>Explore your industry.</h3><p>See which layouts and features make sense for the business you run.</p></div>
        <div><span>02</span><h3>Choose your extras.</h3><p>Select only the optional features you need. Your quote updates as you go.</p></div>
        <div><span>03</span><h3>Reserve and send your details.</h3><p>Pay securely, save your reference and submit product photos, prices and brand resources.</p></div>
      </div>
      <p className="ds-timing-footnote">*The estimated 3–7 day build period starts only after your complete product images, business information and other required resources have been reviewed and confirmed.</p>
    </section>
    <section className="ds-existing-customer"><div><p className="ds-eyebrow">ALREADY PAID?</p><h2>Ready to send your business information?</h2><p>Keep your Paystack reference. You can use it with your payment email to finish or update your website requirements.</p></div><Link to="/december/details">Submit business details ↗</Link></section>
  </div>
}
