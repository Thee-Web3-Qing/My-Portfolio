import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './DecemberAdmin.css'

const money=kobo=>'₦'+(Number(kobo||0)/100).toLocaleString('en-NG',{minimumFractionDigits:0,maximumFractionDigits:0})
const date=x=>x?new Date(x).toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'}):'Not set'
const stages=[
 ['awaiting_assets','Awaiting business assets'],['assets_under_review','Reviewing submitted assets'],
 ['queued','Queued for production'],['designing','Designing'],['building','Website in development'],
 ['review','Client review'],['revisions','Making revisions'],['ready_to_launch','Ready to launch'],
 ['launched','Launched'],['on_hold','On hold']
]
const stageName=value=>stages.find(x=>x[0]===value)?.[1]||'Awaiting resources'
const digits=x=>String(x||'').replace(/\D/g,'')
const safeLink=x=>typeof x==='string'&&/^https:\/\//i.test(x)?x:null

export default function DecemberAdmin(){
 const [auth,setAuth]=useState(null)
 const [code,setCode]=useState('')
 const [loginError,setLoginError]=useState('')
 const [busy,setBusy]=useState(false)
 const [orders,setOrders]=useState([])
 const [stats,setStats]=useState(null)
 const [notice,setNotice]=useState('')
 const [filter,setFilter]=useState('all')
 const [paymentFilter,setPaymentFilter]=useState('all')
 const [search,setSearch]=useState('')
 const [active,setActive]=useState('')
 const [saving,setSaving]=useState(false)
 const [rechecking,setRechecking]=useState(false)
 const [paymentDiagnosis,setPaymentDiagnosis]=useState(null)
 const [progress,setProgress]=useState({
  stage:'awaiting_assets',percent:0,publicNote:'',privateNote:'',eta:'',assetsConfirmed:false
 })
 const [modes,setModes]=useState([])
 const loadOrders=useCallback(async({silent=false}={})=>{
  setBusy(true);if(!silent)setNotice('')
  try{
   const response=await fetch('/api/admin/orders',{cache:'no-store',credentials:'same-origin'})
   const json=await response.json().catch(()=>({}))
   if(response.status===401){setAuth(false);return}
   if(!response.ok)throw Error(json.error||'Could not load orders')
   setOrders(Array.isArray(json.orders)?json.orders:[])
   setStats(json.summary||{})
   setModes(json.modes||[])
  }catch(err){setNotice(err.message)}
  finally{setBusy(false)}
 },[])
 useEffect(()=>{
  let cancelled=false
  fetch('/api/admin/session',{cache:'no-store',credentials:'same-origin'})
   .then(r=>r.json()).then(j=>{if(!cancelled){setAuth(!!j.authenticated);setModes(j.modes||[])}})
   .catch(()=>{if(!cancelled)setAuth(false)})
  return()=>{cancelled=true}
 },[])
 useEffect(()=>{if(auth)loadOrders()},[auth,loadOrders])
 const visible=useMemo(()=>orders.filter(o=>{
  if(filter!=='all'&&o.environment!==filter)return false
  if(paymentFilter==='paid'&&o.status!=='paid')return false
  if(paymentFilter==='pending'&&o.status==='paid')return false
  const words=[o.reference,o.customer_name,o.business_name,o.intake_name,o.customer_email,o.customer_whatsapp,o.product].join(' ').toLowerCase()
  return words.includes(search.trim().toLowerCase())
 }),[orders,filter,paymentFilter,search])
 const chosen=orders.find(o=>o.reference===active)||null
 const choose=order=>{
  setActive(order.reference)
  setNotice('')
  setPaymentDiagnosis(null)
  setProgress({
   stage:order.stage||'awaiting_assets',percent:Number(order.percent_complete||0),
   publicNote:order.public_note||'We are working on your website. Check back here for the next update.',
   privateNote:order.private_note||'',
   eta:order.estimated_completion_date?String(order.estimated_completion_date).slice(0,10):'',
   assetsConfirmed:!!order.assets_confirmed_at
  })
 }
 async function login(event){
  event.preventDefault();setBusy(true);setLoginError('')
  try{
   const response=await fetch('/api/admin/session',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'login',code})})
   const json=await response.json().catch(()=>({}))
   if(!response.ok||!json.authenticated)throw Error(json.error||'Admin login failed')
   setCode('');setModes(json.modes||[]);setAuth(true)
  }catch(error){setLoginError(error.message)}
  finally{setBusy(false)}
 }
 async function logout(){
  await fetch('/api/admin/session',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logout'})})
  setAuth(false);setOrders([]);setActive('')
 }
 async function recheckPayment(order){
  if(!order||order.status==='paid'||rechecking)return
  setRechecking(true);setPaymentDiagnosis(null);setNotice('')
  try{
   const response=await fetch('/api/admin/orders',{
    method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({environment:order.environment,reference:order.reference})
   })
   const result=await response.json().catch(()=>({}))
   if(!response.ok)throw Error(result.error||'Paystack could not confirm the payment.')
   setPaymentDiagnosis(result)
   await loadOrders({silent:true})
   setNotice(result.message)
  }catch(error){setNotice(error.message)}
  finally{setRechecking(false)}
 }
 async function updateProgress(e){
  e.preventDefault()
  if(!chosen||chosen.status!=='paid')return
  setSaving(true);setNotice('')
  try{
   const response=await fetch('/api/admin/progress',{
    method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      environment:chosen.environment,reference:chosen.reference,
      stage:progress.stage,percent:Number(progress.percent),
      publicNote:progress.publicNote,privateNote:progress.privateNote,
      eta:progress.eta,assetsConfirmed:progress.assetsConfirmed
    })
   })
   const json=await response.json().catch(()=>({}))
   if(!response.ok)throw Error(json.error||'Unable to save progress')
   await loadOrders({silent:true})
   setNotice('✓ '+json.message)
  }catch(error){setNotice(error.message)}
  finally{setSaving(false)}
 }
 if(auth===null)return <section className="da-wrap da-loading"><p>Checking administrator session…</p></section>
 if(!auth)return <div className="da-wrap da-login-wrap">
  <div className="da-login">
   <p className="da-eyebrow">QING THE CREATOR / PRIVATE ADMIN</p>
   <h1>Client studio.<br/><em>Authorised access.</em></h1>
   <p>View verified live and test payments, manage client information and update website project progress.</p>
   <form onSubmit={login}><label htmlFor="da-secret">Administrator access code</label>
    <input id="da-secret" type="password" autoComplete="off" required value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter admin code"/>
    <button disabled={busy}>{busy?'Signing in…':'Unlock admin dashboard ↗'}</button></form>
   {loginError&&<p className="da-error" role="alert">{loginError}</p>}
   <p className="da-security">Your code is checked securely on the server. Admin sessions expire automatically.</p>
  </div>
 </div>
 return <div className="da-wrap da-dashboard">
  <header className="da-head"><div><p className="da-eyebrow">DECEMBER 2026 / PRIVATE CONTROL ROOM</p><h1>Your client<br/><em>workspace.</em></h1></div>
    <div className="da-head-actions"><button onClick={loadOrders} disabled={busy}>Refresh orders ↻</button><button onClick={logout}>Lock dashboard ↗</button></div>
  </header>
  <div className="da-stats"><div><span>TOTAL TRANSACTIONS</span><strong>{orders.length}</strong></div>
   <div><span>VERIFIED PAID</span><strong>{stats?.paid||0}</strong></div>
   <div><span>UNCONFIRMED TEST CHECKOUTS</span><strong>{stats?.pending||0}</strong></div>
   <div><span>WEBSITE PROJECTS</span><strong>{stats?.websiteOrders||0}</strong></div></div>
  <div className="da-layout">
   <section className="da-orders">
    <div className="da-orders-head"><div><h2>Transactions</h2><p>Live shows verified payments only. Test also shows unconfirmed simulations for troubleshooting. Recent payments are checked with Paystack when this page loads.</p></div><span>{visible.length} shown</span></div>
    <div className="da-filters">
      <label>Payment environment<select value={filter} onChange={e=>setFilter(e.target.value)}>
        <option value="all">All environments</option>{modes.map(m=><option key={m} value={m}>{m==='live'?'Live payments':'Test payments'}</option>)}
      </select></label>
      <label>Payment status<select value={paymentFilter} onChange={e=>setPaymentFilter(e.target.value)}><option value="all">All statuses</option><option value="paid">Verified paid</option><option value="pending">Pending / unpaid</option></select></label>
      <label className="da-search">Find a client<input placeholder="Search name, business, reference, phone…" value={search} onChange={e=>setSearch(e.target.value)}/></label>
    </div>
    <div className="da-order-list">{visible.map(order=><button type="button" className={'da-order-card'+(chosen?.reference===order.reference?' is-selected':'')} key={order.reference} onClick={()=>choose(order)}>
      <div className="da-order-row"><strong>{order.business_name||order.customer_name||'Unnamed order'}</strong><span className={'da-env da-env-'+order.environment}>{order.environment==='live'?'LIVE':'TEST'}</span></div>
      <div className="da-order-row"><span className="da-order-product">{order.product==='december-website'?'Website order':'Class payment'}</span><b>{money(order.amount_kobo)}</b></div>
      <div className="da-order-row"><small>{date(order.created_at)}</small><span className={'da-status'+(order.status==='paid'?' da-paid':'')}>{order.status==='paid'?'✓ Verified paid':'● Pending'}</span></div>
      <code>{order.reference}</code>
    </button>)}
    {!visible.length&&<p className="da-empty">{busy?'Loading payment records…':'No transactions match these filters.'}</p>}</div>
   </section>
   <section className="da-details">
     {!chosen?<div className="da-select-empty"><span>✳</span><h2>Select a client.</h2><p>Choose a transaction to see purchase details, WhatsApp contacts, business resources and project progress.</p></div>:<>
      <div className="da-details-title"><div><span className="da-eyebrow">CLIENT RECORD / {chosen.environment.toUpperCase()}</span><h2>{chosen.business_name||chosen.customer_name}</h2><p>{chosen.customer_name} · {chosen.customer_email}</p></div><span className={'da-status'+(chosen.status==='paid'?' da-paid':'')}>{chosen.status==='paid'?'Verified payment':'Payment pending'}</span></div>
      <div className="da-reference"><span>PAYMENT REFERENCE</span><strong>{chosen.reference}</strong><button onClick={()=>navigator.clipboard?.writeText(chosen.reference)}>Copy ↗</button></div>
      {chosen.status!=='paid'&&chosen.environment==='test'&&<div className="da-pending-review">
        <strong>This is an unconfirmed test checkout, not a paid client project.</strong>
        <p>Paystack may have displayed a success screen, but the matching test transaction hasn't been verified in our database yet.</p>
        <button type="button" disabled={rechecking} onClick={()=>recheckPayment(chosen)}>{rechecking?'Checking Paystack…':'Verify this test payment with Paystack ↻'}</button>
        {paymentDiagnosis&&paymentDiagnosis.reference===chosen.reference&&
          <p role="status"><b>Paystack status: {paymentDiagnosis.providerStatus}</b>. {paymentDiagnosis.message}</p>}
      </div>}
      <div className="da-payment-info">
       <div><span>Amount received</span><strong>{chosen.status==='paid'?money(chosen.amount_kobo):'Not confirmed'}</strong></div>
       <div><span>Total quote</span><strong>{money(chosen.quote_total_kobo)}</strong></div>
       <div><span>Outstanding balance</span><strong>{chosen.status==='paid'?money(Math.max(0,Number(chosen.quote_total_kobo)-Number(chosen.amount_kobo))):'Not yet paid'}</strong></div>
       <div><span>Payment mode</span><strong>{chosen.payment_mode==='deposit'?'60% deposit':'Full payment'}</strong></div>
      </div>
      <div className="da-contact"><span className="da-section-label">CONTACT INFORMATION</span>
       <p><strong>Email:</strong> <a href={'mailto:'+chosen.customer_email}>{chosen.customer_email}</a></p>
       <p><strong>WhatsApp:</strong> {chosen.intake_whatsapp||chosen.customer_whatsapp||'Not supplied'}</p>
       {!!digits(chosen.intake_whatsapp||chosen.customer_whatsapp)&&<a className="da-whatsapp" target="_blank" rel="noreferrer" href={'https://wa.me/'+digits(chosen.intake_whatsapp||chosen.customer_whatsapp)+'?text='+encodeURIComponent('Hi! Following up on your website order '+chosen.reference+'.')}>Message customer on WhatsApp ↗</a>}
      </div>
      <div className="da-purchases"><span className="da-section-label">WHAT THEY PAID FOR</span>
       <p>Type: <b>{chosen.product}</b> · Industry: <b>{chosen.configuration?.industry||'—'}</b> · Layout: <b>{chosen.configuration?.layout||'—'}</b></p>
       {(chosen.items_purchased?.length?chosen.items_purchased:[]).map((item,i)=><div className="da-lineitem" key={i}><span>{item.name}</span><strong>₦{Number(item.price).toLocaleString('en-NG')}</strong></div>)}
       {!(chosen.items_purchased||[]).length&&<p>Older order without itemised checkout snapshot. The original total above remains the authoritative amount.</p>}
       <p><strong>Checkout note:</strong> {chosen.configuration?.customer_note||'None supplied'}</p>
      </div>
      {chosen.product==='december-website'&&<>
       <section className="da-intake"><span className="da-section-label">SUBMITTED BUSINESS INFORMATION</span>
        {!chosen.intake_submitted_at?<p>The customer has not completed their information form yet.</p>:<>
          <p><b>Business:</b> {chosen.intake_name}</p><p><b>Description:</b> {chosen.business_description}</p>
          <p><b>Order WhatsApp:</b> {chosen.intake_whatsapp||'Not supplied'}</p>
          <p><b>Brand colours:</b> {chosen.brand_colors||'Not supplied'}</p>
          <p><b>December offer:</b> {chosen.festive_offer||'Not supplied'}</p>
          <p><b>Delivery/pickup:</b> {chosen.delivery_information||'Not supplied'}</p>
          <p><b>Deadline:</b> {chosen.order_deadline||'Not supplied'}</p>
          <p><b>Address/areas:</b> {chosen.contact_address||'Not supplied'}</p>
          <p><b>Policies:</b> {chosen.policies||'Not supplied'}</p>
          <p><b>Additional notes:</b> {chosen.additional_notes||'None'}</p>
          <p><b>Submitted:</b> {date(chosen.intake_submitted_at)} · <b>Resources ready:</b> {chosen.assets_submitted_complete?'Customer says yes':'Not yet'}</p>
          {['asset_folder_url','logo_url','instagram_url'].map(field=>safeLink(chosen[field])&&<p key={field}><b>{field.replaceAll('_',' ')}:</b> <a target="_blank" rel="noreferrer" href={chosen[field]}>Open shared resource ↗</a></p>)}
          <h3>Product and service catalogue</h3>{chosen.submitted_items?.length?chosen.submitted_items.map((item,i)=><div className="da-lineitem" key={i}><span><strong>{item.name}</strong><small>{item.description}</small>{safeLink(item.imageUrl)&&<a target="_blank" rel="noreferrer" href={item.imageUrl}>Product image ↗</a>}</span><b>{item.price}</b></div>):<p>No listings submitted yet.</p>}
         </>}
       </section>
       <form className="da-progress-editor" onSubmit={updateProgress}>
         <span className="da-section-label">UPDATE CLIENT PROJECT PROGRESS</span>
         <p>This public status will be visible to the customer using their payment reference. Private notes remain visible only here.</p>
         <div className="da-progress-form-grid">
           <label>Project stage<select value={progress.stage} onChange={e=>setProgress(p=>({...p,stage:e.target.value}))}>{stages.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
           <label>Completion percentage<input type="number" min="0" max="100" required value={progress.percent} onChange={e=>setProgress(p=>({...p,percent:e.target.value}))}/></label>
           <label className="da-full">Customer-facing progress update<textarea rows={3} required minLength={5} maxLength={1500} value={progress.publicNote} onChange={e=>setProgress(p=>({...p,publicNote:e.target.value}))}/></label>
           <label className="da-full">Private production notes<textarea rows={3} maxLength={2500} value={progress.privateNote} onChange={e=>setProgress(p=>({...p,privateNote:e.target.value}))}/></label>
           <label>Estimated completion date<input type="date" value={progress.eta} onChange={e=>setProgress(p=>({...p,eta:e.target.value}))}/></label>
           <label className="da-confirm"><input type="checkbox" checked={progress.assetsConfirmed} onChange={e=>setProgress(p=>({...p,assetsConfirmed:e.target.checked}))}/> <span>I've reviewed and confirmed all required client resources.</span></label>
         </div>
         <button type="submit" disabled={saving||chosen.status!=='paid'}>{saving?'Saving…':chosen.status!=='paid'?'Verify payment to unlock updates':'Save project progress ↗'}</button>
         {chosen.status!=='paid'&&<small>Progress updates are locked until the transaction has been successfully verified with Paystack. Use the verification button above to refresh its status.</small>}
         <Link target="_blank" to={'/december/track?reference='+encodeURIComponent(chosen.reference)+(chosen.environment==='test'?'&mode=test':'')}>Open the customer's progress page ↗</Link>
       </form>
      </>}
     </>}
   </section>
  </div>
  {notice&&<div role="status" className="da-notice">{notice}</div>}
 </div>
}
