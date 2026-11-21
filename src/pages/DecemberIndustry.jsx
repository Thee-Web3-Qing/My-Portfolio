import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ADDONS, BASE_PRICE, INDUSTRIES, LAYOUTS, calculateDecemberQuote, getIndustryGroups, getSharedGroups, money } from '../data/december.js'
import { getPreviewRoute } from '../data/decemberPreviewRoutes.js'
import { demoCatalogue } from '../data/decemberDemos.js'
import './DecemberSales.css'

const blankCustomer = {name:'',business:'',email:'',phone:'',note:''}
const stageLinks = [
  {key:'overview',label:'Designs',number:'01'},
  {key:'features',label:'Features',number:'02'},
  {key:'checkout',label:'Checkout',number:'03'},
]
const storageKey = industry => 'qing:december-2026:'+industry
const chooseDraft = (industry,query) => {
  let saved={}
  try { saved=JSON.parse(window.sessionStorage.getItem(storageKey(industry))||'{}')||{} } catch { /* no stored selection */ }
  const layout=new URLSearchParams(query).get('layout')
  return {
    layout: LAYOUTS.some(x=>x.id===layout) ? layout : (LAYOUTS.some(x=>x.id===saved.layout) ? saved.layout : 'editorial'),
    addons: Array.isArray(saved.addons) ? saved.addons.filter(x=>typeof x==='string').slice(0,64) : [],
    images:Number.isInteger(saved.images) ? Math.max(0,Math.min(200,saved.images)):0,
    paymentMode:['deposit','full'].includes(saved.paymentMode) ? saved.paymentMode:'deposit',
    customer:{...blankCustomer,...(saved.customer&&typeof saved.customer==='object'?saved.customer:{})},
  }
}

function LineItemSummary({quote,paymentMode,setPaymentMode}){
  return <>
    <div className="ds-price-top"><span>YOUR WEBSITE PACKAGE</span><strong>{money(quote.total)}</strong></div>
    <div className="ds-price-meta"><p><span>Industry</span><b>{quote.industry.label}</b></p><p><span>Design</span><b>{quote.layout.label}</b></p></div>
    <div className="ds-price-items">
      <div><span>Branded website · 12 listings</span><b>{money(BASE_PRICE)}</b></div>
      {quote.selectedAddons.map(x=><div key={x.id}><span>{x.name}</span><b>{money(x.price)}</b></div>)}
      {quote.images>0&&<div><span>{quote.images} AI product photos × {money(quote.imageUnitPrice)}</span><b>{money(quote.imagesSubtotal)}</b></div>}
    </div>
    <div className="ds-price-subtotal"><span>PROJECT TOTAL</span><strong>{money(quote.total)}</strong></div>
    <fieldset className="ds-pay-choice"><legend>PAYMENT OPTION</legend>
      <label className={paymentMode==='deposit'?'chosen':''}><input type="radio" checked={paymentMode==='deposit'} onChange={()=>setPaymentMode('deposit')}/><span>60% deposit <small>{money(quote.deposit)} due now</small></span></label>
      <label className={paymentMode==='full'?'chosen':''}><input type="radio" checked={paymentMode==='full'} onChange={()=>setPaymentMode('full')}/><span>Pay in full <small>{money(quote.total)} due now</small></span></label>
    </fieldset>
    <div className="ds-price-due"><span>DUE TODAY</span><strong>{money(paymentMode==='deposit'?quote.deposit:quote.total)}</strong></div>
    {paymentMode==='deposit'&&<p className="ds-price-balance">Remaining before launch: {money(quote.balance)}.</p>}
  </>
}

function FeatureOption({feature,checked,onChange}){
 return <label className={'ds-feature'+(checked?' selected':'')}>
   <input type="checkbox" checked={checked} onChange={()=>onChange(feature.id)}/>
   <span className="ds-feature-check" aria-hidden="true">{checked?'✓':'+'}</span>
   <span className="ds-feature-body"><strong>{feature.name}</strong><small>{feature.description}</small></span>
   <b>+{money(feature.price)}</b>
 </label>
}

function IndustrySwitch({industryId}){
 return <div className="ds-switch-wrap">
  <div className="ds-switch-label"><span>SWITCH BUSINESS TYPE</span><Link to="/december">View all industries ↗</Link></div>
  <nav className="ds-switch" aria-label="Business industries">
   {INDUSTRIES.map(item=><Link key={item.id} className={item.id===industryId?'current':''} to={'/december/'+item.id} aria-current={item.id===industryId?'page':undefined}>{item.label}</Link>)}
  </nav>
 </div>
}

function PhotoStudio({images,onChange,quote}){
 return <div className="ds-photo-studio">
  <div><span>OPTIONAL / AI PRODUCT PHOTOGRAPHY</span><h3>Give your product photos a little more polish.</h3><p>Supply the source photos, then request AI-reimagined images for a more consistent product catalogue. You will review the results before they are used.</p></div>
  <div className="ds-photo-controls"><label htmlFor="ds-image-count">Images to create</label>
   <div className="ds-image-quantity"><button type="button" onClick={()=>onChange(Math.max(0,images-1))} aria-label="Remove one image">−</button>
    <input id="ds-image-count" aria-label="Number of AI photos" type="number" min={0} max={200} value={images} onChange={e=>onChange(Math.min(200,Math.max(0,Number(e.target.value)||0)))}/>
    <button type="button" onClick={()=>onChange(Math.min(200,images+1))} aria-label="Add one image">+</button>
   </div>
   <strong>{money(quote.imagesSubtotal)}</strong>
  </div>
  <div className="ds-photo-rates"><span className={images>=1&&images<10?'current':''}>1–9 images <b>₦500 each</b></span><span className={images>=10&&images<30?'current':''}>10–29 <b>10% off</b></span><span className={images>=30?'current':''}>30+ <b>20% off</b></span></div>
 </div>
}

function IndustryContent({industryId}){
 const industry=INDUSTRIES.find(x=>x.id===industryId)
 const {stage:stageParam}=useParams()
 const stage=['features','checkout'].includes(stageParam)?stageParam:'overview'
 const navigate=useNavigate()
 const location=useLocation()
 const [draft,setDraft]=useState(()=>chooseDraft(industryId,location.search))
 const [availability,setAvailability]=useState(false)
 const [isPaying,setPaying]=useState(false)
 const [paymentError,setPaymentError]=useState('')
 const [mobileOpen,setMobileOpen]=useState(false)
 const quote=useMemo(()=>calculateDecemberQuote({industry:industryId,layout:draft.layout,addons:draft.addons,images:draft.images}),[industryId,draft.layout,draft.addons,draft.images])
 const selected=new Set(draft.addons)
 const industryGroups=getIndustryGroups(industryId)
 const sharedGroups=getSharedGroups()
 const project=demoCatalogue[industryId]

 useEffect(()=>{try{window.sessionStorage.setItem(storageKey(industryId),JSON.stringify(draft))}catch{}},[industryId,draft])
 useEffect(()=>{fetch('/api/december/status').then(r=>r.json()).then(x=>setAvailability(x.available===true)).catch(()=>setAvailability(false))},[])
 useEffect(()=>{setMobileOpen(false)},[stage])
 useEffect(()=>{
  const qs=new URLSearchParams(location.search)
  const preset=qs.get('layout')
  if(LAYOUTS.some(x=>x.id===preset)&&draft.layout!==preset)setDraft(prev=>({...prev,layout:preset}))
 },[location.search])
 useEffect(()=>{
  if(!mobileOpen)return
  const onKey=e=>{if(e.key==='Escape')setMobileOpen(false)}
  document.addEventListener('keydown',onKey)
  return()=>document.removeEventListener('keydown',onKey)
 },[mobileOpen])
 const set=(key,value)=>setDraft(prev=>({...prev,[key]:value}))
 const toggle=id=>setDraft(prev=>({...prev,addons:prev.addons.includes(id)?prev.addons.filter(x=>x!==id):[...prev.addons,id]}))
 const updateCustomer=(event)=>setDraft(prev=>({...prev,customer:{...prev.customer,[event.target.name]:event.target.value}}))
 const to=step=>'/december/'+industryId+(step==='overview'?'':'/'+step)
 const next=stage==='overview'?'features':'checkout'

 async function pay(event){
  event.preventDefault()
  if(!availability||isPaying)return
  setPaying(true);setPaymentError('')
  try{
   const response=await fetch('/api/december/initialize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    industry:industryId,layout:draft.layout,addons:quote.selectedAddons.map(x=>x.id),images:quote.images,paymentMode:draft.paymentMode,customer:draft.customer,
   })})
   const result=await response.json().catch(()=>({}))
   if(!response.ok||!result.authorization_url)throw Error(result.error||'Paystack could not start checkout.')
   const url=new URL(result.authorization_url)
   if(url.protocol!=='https:'||!(url.hostname==='paystack.com'||url.hostname.endsWith('.paystack.com')))throw Error('Unexpected payment provider.')
   window.location.assign(url.href)
  }catch(error){setPaymentError(error.message||'Please try again.');setPaying(false)}
 }
 function quotePanel(){return <>
   <LineItemSummary quote={quote} paymentMode={draft.paymentMode} setPaymentMode={v=>set('paymentMode',v)}/>
   <Link className="ds-quote-cta" to={to(stage==='overview'?'features':'checkout')} onClick={()=>setMobileOpen(false)}>{stage==='checkout'?'Review payment details':'Continue '+(stage==='overview'?'to features':'to checkout')} ↗</Link>
   <p className="ds-quote-caption">The estimate includes only the items you selected. Domain and recurring third-party fees are separate.</p>
 </>}
 if(!industry){return <div className="ds-root"><div className="ds-unknown"><h1>That business type isn't in this collection yet.</h1><Link to="/december">Explore all seven industries ↗</Link></div></div>}
 return <div className="ds-root ds-industry">
   <div className="ds-ticker"><Link to="/december">← THE DECEMBER EDIT</Link><span>✳</span><span>BUILD YOUR {industry.label.toUpperCase()} WEBSITE</span></div>
   <div className="ds-industry-hero"><div className="ds-industry-hero-copy">
    <p className="ds-eyebrow">THE {industry.label.toUpperCase()} COLLECTION / 2026</p>
    <h1>{industry.kicker}<em>✳</em></h1>
    <p>{industry.feature}. Choose a layout, add the features that actually help your business and pay for only what you select.</p>
    <div className="ds-industry-hero-meta"><span>From {money(BASE_PRICE)}</span><span>3–7 days after assets are confirmed</span></div>
   </div><div className="ds-industry-hero-photo"><img src={project?.hero} alt={industry.label+' editorial sample photography'}/><span>SAMPLE BRAND IMAGERY / YOUR OWN PHOTOS IN THE FINAL SITE</span></div></div>
   <IndustrySwitch industryId={industryId}/>
   <nav className="ds-stage-nav" aria-label="Website package steps">{stageLinks.map(item=><Link key={item.key} className={stage===item.key?'current':''} aria-current={stage===item.key?'step':undefined} to={to(item.key)}><span>{item.number}</span> {item.label}<b>↗</b></Link>)}</nav>

   <div className="ds-order-layout">
     <main className="ds-order-content">
     {stage==='overview'&&<section>
       <div className="ds-step-heading"><span>01 / CHOOSE YOUR LOOK</span><h2>Three starting designs.<br/><em>One business that's yours.</em></h2><p>Your starting website includes responsive pages, up to 12 listed products or services, a December offer, WhatsApp orders/enquiries, contact and delivery or booking details, and one round of revisions.</p></div>
       <div className="ds-layout-grid">{LAYOUTS.map((layout,i)=>{
         const preview=getPreviewRoute(industryId,layout.id)
         return <article key={layout.id} className={'ds-layout-card'+(draft.layout===layout.id?' selected':'')}>
           <div className="ds-layout-number"><span>STYLE {String(i+1).padStart(2,'0')}</span><span>{draft.layout===layout.id?'✓ SELECTED':'STARTING LAYOUT'}</span></div>
           <div className={'ds-layout-art ds-layout-art-'+layout.id}><span/><span/><span/><i>YOUR BRAND</i></div>
           <div className="ds-layout-card-text"><h3>{layout.label}</h3><p>{layout.description}</p></div>
           <div className="ds-layout-card-actions"><button onClick={()=>set('layout',layout.id)}>{draft.layout===layout.id?'Selected ✓':'Select layout ↗'}</button><Link to={preview.url} target="_blank" rel="noopener noreferrer">View sample ↗</Link></div>
           <small>Independent preview route: <code>{preview.url}</code>. {preview.status==='sample'?'Current sample only; the finished interface will replace it.':'Finished storefront preview.'}</small>
         </article>
       })}</div>
       <div className="ds-design-note"><span>ABOUT THE DESIGNS</span><p>The website designs are separate products, not recoloured versions of the same mockup. Your final selected sample will be built as its own standalone interface at <strong>/{industryId}{draft.layout}</strong>.</p></div>
       <div className="ds-next-row"><Link to={to('features')}>Explore {industry.label.toLowerCase()} features ↗</Link></div>
     </section>}

     {stage==='features'&&<section>
       <div className="ds-step-heading"><span>02 / BUILD YOUR FEATURE SET</span><h2>Only the extras<br/><em>your business needs.</em></h2><p>Explore features tailored to {industry.label.toLowerCase()}, then add any shared upgrades you want. All optional prices shown already include the December 5% reduction.</p></div>
       <div className="ds-category-label"><span>CURATED FOR {industry.label.toUpperCase()}</span><b>{industryGroups.reduce((sum,group)=>sum+group.items.length,0)} OPTIONS</b></div>
       {industryGroups.map((group,index)=><section key={group.title} className="ds-feature-group"><details open={index===0}><summary><span>0{index+1}</span><div><h3>{group.title}</h3><p>{group.description}</p></div><b>+</b></summary><div className="ds-feature-list">{group.items.map(feature=><FeatureOption key={feature.id} feature={feature} checked={selected.has(feature.id)} onChange={toggle}/>)}</div></details></section>)}
       <div className="ds-category-label ds-category-shared"><span>SHARED WEBSITE UPGRADES</span><b>OPTIONAL FOR ALL BUSINESSES</b></div>
       {sharedGroups.map((group,index)=><section key={group.title} className="ds-feature-group"><details><summary><span>0{index+3}</span><div><h3>{group.title}</h3><p>{group.description}</p></div><b>+</b></summary><div className="ds-feature-list">{group.items.map(feature=><FeatureOption key={feature.id} feature={feature} checked={selected.has(feature.id)} onChange={toggle}/>)}</div></details></section>)}
       <PhotoStudio images={draft.images} quote={quote} onChange={v=>set('images',v)}/>
       <div className="ds-next-row"><Link to={to('checkout')}>Review my package & checkout ↗</Link></div>
     </section>}

     {stage==='checkout'&&<section>
       <div className="ds-step-heading"><span>03 / SECURE YOUR WEBSITE</span><h2>You're nearly<br/><em>there.</em></h2><p>Review your selected layout and features, enter your business contact details and choose a secure Paystack payment. You can pay a 60% deposit or the full amount.</p></div>
       <div className="ds-checkout-breakdown"><h3>Your selected website</h3><LineItemSummary quote={quote} paymentMode={draft.paymentMode} setPaymentMode={v=>set('paymentMode',v)}/></div>
       <div className="ds-delivery-message"><span>BEFORE YOU PAY</span><h3>Delivery is 3–7 days after your materials are confirmed.</h3><p>After payment, keep your transaction reference. You'll use it and your checkout email to complete the business information form, provide images, prices, logos and other resources. Your delivery window begins after Qing confirms those materials are complete.</p></div>
       <form className="ds-payment-form" onSubmit={pay}>
         <h3>Business contact details</h3><div className="ds-form-grid">
           <label>Your full name<input required maxLength={100} name="name" autoComplete="name" value={draft.customer.name} onChange={updateCustomer} placeholder="Your name"/></label>
           <label>Business name<input required maxLength={120} name="business" value={draft.customer.business} onChange={updateCustomer} placeholder="Your brand name"/></label>
           <label>Payment email<input type="email" required maxLength={160} autoComplete="email" name="email" value={draft.customer.email} onChange={updateCustomer} placeholder="you@business.com"/></label>
           <label>WhatsApp number<input required type="tel" maxLength={30} autoComplete="tel" name="phone" value={draft.customer.phone} onChange={updateCustomer} placeholder="+234..."/></label>
           <label className="ds-form-wide">Any requests or notes?<textarea name="note" maxLength={1000} rows={3} value={draft.customer.note} onChange={updateCustomer} placeholder="Tell me what you're planning for December."/></label>
         </div>
         {paymentError&&<div role="alert" className="ds-pay-error">{paymentError}</div>}
         <button disabled={!availability||isPaying} type="submit" className="ds-pay-now">{isPaying?'Opening Paystack…':availability?'Pay '+money(draft.paymentMode==='deposit'?quote.deposit:quote.total)+' with Paystack ↗':'Paystack setup unavailable'}</button>
         {!availability&&<p className="ds-pay-warning">Online payment is currently unavailable on this preview. No money can be collected until this environment is configured.</p>}
         <p className="ds-pay-fineprint">This quote includes your selected features only. Domain registration, recurring hosting, and third-party subscription fees are quoted separately. Balance payments are due before launch. No classroom purchases are affected.</p>
       </form>
       <div className="ds-next-row"><Link to={to('features')}>← Edit features</Link><Link to="/december/details">Already paid? Submit your business details ↗</Link></div>
     </section>}
     </main>
     <aside className="ds-fixed-quote" aria-label="Your always-visible website estimate">
       <div className="ds-quote-panel">{quotePanel()}</div>
     </aside>
   </div>
   <div className="ds-mobile-quote"><div><span>YOUR ESTIMATE</span><strong>{money(quote.total)}</strong><small>Due now: {money(draft.paymentMode==='deposit'?quote.deposit:quote.total)}</small></div><button aria-expanded={mobileOpen} aria-controls="ds-mobile-quote-sheet" onClick={()=>setMobileOpen(true)}>View my quote ↑</button></div>
   {mobileOpen&&<div className="ds-sheet-screen" onClick={()=>setMobileOpen(false)}>
     <div id="ds-mobile-quote-sheet" role="dialog" aria-modal="true" aria-label="Your selected website and payment estimate" className="ds-mobile-quote-sheet" onClick={e=>e.stopPropagation()}>
       <button className="ds-sheet-close" onClick={()=>setMobileOpen(false)} aria-label="Close price summary">Close ×</button>{quotePanel()}
     </div>
   </div>}
 </div>
}

export default function DecemberIndustry(){
 const {industry}=useParams()
 if(!INDUSTRIES.some(x=>x.id===industry)){
  return <div className="ds-root ds-unknown"><h1>Choose a business category to continue.</h1><Link to="/december">View all industry options ↗</Link></div>
 }
 return <IndustryContent key={industry} industryId={industry}/>
}
