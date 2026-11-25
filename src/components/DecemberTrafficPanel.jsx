import { useEffect, useMemo, useState } from 'react'
import { INTERNAL_KEY } from './DecemberTrafficTracker.jsx'
import './DecemberTrafficPanel.css'

const n=x=>Number(x||0).toLocaleString('en-NG')
const periodLabels={1:'Last 24 hours',2:'Last 48 hours',7:'Last 7 days',14:'Last 14 days',30:'Last 30 days'}
const labelSource=x=>(x==='direct'?'Direct / unidentified':x==='instagram'?'Instagram':x==='tiktok'?'TikTok':x==='facebook'?'Facebook':x==='google'?'Google Search':x?.replace(/[-_]/g,' ')||'Other')
function Card({name,value,note}){return <div className="da-traffic-stat"><span>{name}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>}
function Bars({title,items,getValue,getLabel,empty='No visits recorded yet.'}){
 const max=Math.max(1,...items.map(getValue))
 return <div className="da-traffic-panel"><h3>{title}</h3>{!items.length?<p className="da-traffic-muted">{empty}</p>:<div className="da-traffic-bars">{items.map((item,index)=><div className="da-traffic-bar-row" key={index}><div><span>{getLabel(item)}</span><b>{n(getValue(item))}</b></div><div className="da-traffic-track"><div style={{width:Math.min(100,Math.max(2,100*getValue(item)/max))+'%'}}/></div></div>)}</div>}</div>
}
export default function DecemberTrafficPanel({orders=[]}){
 const [days,setDays]=useState(2)
 const [data,setData]=useState(null)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [refresh,setRefresh]=useState(0)
 const [excluded,setExcluded]=useState(()=>{try{return localStorage.getItem(INTERNAL_KEY)==='true'}catch{return false}})
 useEffect(()=>{
  let cancelled=false
  setLoading(true)
  fetch('/api/admin/orders?view=traffic&days='+days,{credentials:'same-origin',cache:'no-store'})
    .then(async r=>{const data=await r.json().catch(()=>({}));if(!r.ok)throw Error(data.error||'Could not load visit report');return data})
    .then(payload=>{if(!cancelled){setData(payload);setError('')}})
    .catch(e=>{if(!cancelled)setError(e.message)})
    .finally(()=>{if(!cancelled)setLoading(false)})
  return()=>{cancelled=true}
 },[days,refresh])
 const totals=data?.totals||{}
 const livePayments=useMemo(()=>orders.filter(o=>{
  if(o.product!=='december-website'||o.environment!=='live'||o.status!=='paid')return false
  const time=new Date(o.paid_at||o.created_at).getTime()
  return Number.isFinite(time)&&time>=Date.now()-days*86400000
 }).length,[orders,days])
 const visitors=Number(totals.landing_visitors||0)
 const paymentRate=visitors>0?(100*livePayments/visitors).toFixed(1)+'%':'Not available'
 const toggleInternal=value=>{
  setExcluded(value)
  try{if(value)localStorage.setItem(INTERNAL_KEY,'true');else localStorage.removeItem(INTERNAL_KEY)}catch{}
 }
 return <section className="da-traffic-section" aria-label="December sales website analytics">
   <div className="da-traffic-heading">
    <div><p className="da-eyebrow">CAMPAIGN PERFORMANCE / DECEMBER SALES</p><h2>Website visitors.</h2><p>See how many people reach the sales page, which ads can be identified and what they do next.</p></div>
    <div className="da-traffic-actions"><label>Period<select value={days} onChange={e=>setDays(Number(e.target.value))}>{Object.entries(periodLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><button type="button" onClick={()=>setRefresh(n=>n+1)} disabled={loading}>{loading?'Checking…':'Refresh stats'}</button></div>
   </div>
   <div className="da-traffic-stats">
    <Card name="DECEMBER PAGE VIEWS" value={loading&&!data?'…':n(totals.landing_views)} note="Loads of /december"/>
    <Card name="ESTIMATED UNIQUE VISITORS" value={loading&&!data?'…':n(totals.landing_visitors)} note="Distinct browsers, approximately"/>
    <Card name="PREVIEW SELECTIONS" value={loading&&!data?'…':n(totals.preview_selections)} note="Category or design selections"/>
    <Card name="CHECKOUT STARTS" value={loading&&!data?'…':n(totals.checkout_attempts)} note="Visitors pressing Pay with Paystack"/>
    <Card name="PAYSTACK REDIRECTS" value={loading&&!data?'…':n(totals.payment_redirects)} note="Secure payment page opened"/>
    <Card name="WHATSAPP CLICKS" value={loading&&!data?'…':n(totals.whatsapp_clicks)} note="People opening the chat link; not confirmed enquiries"/>
    <Card name="REMINDER SIGN-UP EVENTS" value={loading&&!data?'…':n(totals.reminder_signup_events)} note="Successful form submissions; unique contacts appear below"/>
    <Card name="VERIFIED LIVE PAYMENTS" value={n(livePayments)} note="Confirmed by Paystack"/>
    <Card name="VISITOR TO PAID CONVERSION" value={paymentRate} note="Verified live clients / estimated visitors"/>
    <Card name="ALL WEBSITE PAGE VIEWS" value={loading&&!data?'…':n(totals.all_views)} note="All public pages, excluding iframe previews"/>
   </div>
   {error&&<p className="da-traffic-error" role="alert">Traffic reporting: {error}. Existing payment records remain available.</p>}
   {data&&<div className="da-traffic-detail-grid">
    <Bars title="Where December visitors came from" items={data.sources||[]} getValue={x=>x.visitors} getLabel={x=>labelSource(x.source)+(x.campaign?' · '+x.campaign:'')} empty="No attributable landing visits recorded."/>
    <Bars title="Most selected design previews" items={data.previews||[]} getValue={x=>x.selections} getLabel={x=>(x.industry||'Unknown')+' / '+(x.layout||'Unknown')}/>
    <Bars title="Most visited pages" items={data.topPages||[]} getValue={x=>x.views} getLabel={x=>x.path}/>
    <Bars title="December traffic by Lagos date" items={data.days||[]} getValue={x=>x.visitors} getLabel={x=>x.day}/>
   </div>}
   <div className="da-traffic-footer">
    <p><strong>Tracking starts after this feature is deployed.</strong> Earlier Instagram and TikTok visitors cannot be reconstructed from this database. Sources are based on UTM campaign links or available referrers. A direct visit can also mean an ad without tracking parameters. Repeat visits, blocked scripts and private browsing affect estimates.</p>
    <label><input type="checkbox" checked={excluded} onChange={e=>toggleInternal(e.target.checked)}/> Exclude visits from this browser while I test the website</label>
   </div>
 </section>
}
