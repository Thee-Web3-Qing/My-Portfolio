import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './PaymentCallback.css'

const naira=n=>'₦'+Number(n||0).toLocaleString('en-NG')

export default function PaymentCallback(){
 const location=useLocation()
 const params=new URLSearchParams(location.search)
 const reference=params.get('reference')||params.get('trxref')||''
 const [data,setData]=useState(null)
 const [error,setError]=useState(reference?'':'Payment reference was missing from the callback URL.')
 const [checking,setChecking]=useState(false)
 const [copied,setCopied]=useState(false)
 const check=useCallback(async ()=>{
  if(!reference)return
  setChecking(true);setError('')
  try{
   const response=await fetch('/api/paystack/verify?reference='+encodeURIComponent(reference),{cache:'no-store'})
   const result=await response.json().catch(()=>({}))
   if(!response.ok)throw Error(result.error||'Verification could not be completed.')
   setData(result)
  }catch(err){setError(err.message||'Payment verification is currently unavailable.')}
  finally{setChecking(false)}
 },[reference])
 useEffect(()=>{check()},[check])
 useEffect(()=>{
  if(data?.paid && data.product==='december-website' && reference){
   // The Paystack verify API has confirmed the amount and customer email.
   // Go straight to the prefilled business information form.
   window.location.replace('/december/details?reference='+encodeURIComponent(reference))
  }
 },[data?.paid,data?.product,reference])
 useEffect(()=>{
  if(data?.paid||!reference)return
  let calls=0
  const timer=window.setInterval(()=>{if(++calls>=6)window.clearInterval(timer);else check()},8500)
  return()=>window.clearInterval(timer)
 },[data?.paid,reference,check])
 const isClass=data?.product==='qing-class'||reference.startsWith('QCLASS-')
 const back=isClass?'/class':'/december'
 const saveRef=async()=>{try{await navigator.clipboard.writeText(reference);setCopied(true)}catch{setCopied(false)}}
 return <section className="dec-callback">
  <p className="dec-callback-kicker">QING THE CREATOR / PAYMENT STATUS</p>
  <h1>{error?'We couldn’t check your payment.':checking&&!data?'Checking your payment…':data?.paid?'Payment confirmed.': 'Payment not confirmed yet.'}</h1>
  <p className="dec-callback-intro">{data?.paid
    ?isClass?(data.welcomeEmailSent
      ?'Your class fee has been received. We sent your access code, Classroom link and Telegram group details to your payment email.'
      :'Your class fee has been received and your access is ready. We are preparing your welcome email. Check your inbox and spam folder shortly, then use the button below to check again if needed.')
    :'Your December website payment is verified. The next step is to complete your business information and provide your product photos, logo and resources.'
    :'Your payment has not yet been verified. If you completed the checkout, keep your reference and try the verification button again. Never pay twice without checking your transaction first.'}</p>
  {error&&<p className="dec-callback-error" role="alert">{error}</p>}
  {reference&&<div className="dec-callback-reference"><span>YOUR PAYSTACK REFERENCE</span><strong>{reference}</strong><button onClick={saveRef}>{copied?'COPIED ✓':'COPY REFERENCE ↗'}</button><p>Keep this reference. You will need it to return to your website order and complete or update your business information.</p></div>}
  {data?.paid && data.items?.length>0 && <section className="dec-receipt-items"><div><strong>WHAT YOU SELECTED</strong><span>{data.industry || 'Class registration'}{data.layout?' / '+data.layout:''}</span></div>{data.items.map((item,i)=><p key={i}><span>{item.name}</span><b>{naira(item.price)}</b></p>)}<footer><span>Full project price</span><strong>{naira(data.total)}</strong></footer></section>}
  {data?.paid&&<div className="dec-callback-amount"><span>Amount verified</span><strong>{naira(data.amount/100)}</strong>{data.balance>0&&<span>Balance before launch: <b>{naira(data.balance)}</b></span>}</div>}
  {data?.paid&&!isClass&&<div className="dec-callback-next"><span>YOUR NEXT STEP</span><h2>Tell us about your business.</h2><p>Complete the business information form with your product/service catalogue, brand logo, contact number, image folder and December specials. The website is delivered in approximately <b>3–7 days after all required assets have been reviewed and confirmed complete.</b></p><Link to={'/december/details?reference='+encodeURIComponent(reference)}>Complete business information ↗</Link></div>}
  <div className="dec-callback-links">
   {data?.paid&&isClass&&!data.welcomeEmailSent&&<button onClick={check} disabled={checking}>{checking?'Checking email…':'Check welcome email status ↗'}</button>}
   {!data?.paid&&<button onClick={check} disabled={checking}>{checking?'Checking status…':'Check payment status again ↗'}</button>}
   <Link to={back}>Back to {isClass?'class registration':'December sale'} ↗</Link>
   <a href={'mailto:qinglidah@gmail.com?subject='+encodeURIComponent('Paystack transaction '+reference)}>Contact Qing ↗</a>
  </div>
 </section>
}
