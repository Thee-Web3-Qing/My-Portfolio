import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './DecemberProgress.css'

const MILESTONES=[
 ['awaiting_assets','Business information'],['assets_under_review','Resource review'],
 ['queued','Project queued'],['designing','Design'],['building','Development'],
 ['review','Quality review'],['revisions','Revisions'],
 ['ready_to_launch','Ready for launch'],['launched','Launched']
]
const titles={
 payment_pending:'Payment awaiting confirmation',awaiting_assets:'Getting your resources ready',
 assets_under_review:'Reviewing your business information',queued:'Your website is in the queue',
 designing:'Designing your storefront',building:'Building your website',
 review:'Your website is under review',revisions:'Refining the final details',
 ready_to_launch:'Ready for launch',launched:'Your website is launched',on_hold:'Your website is on hold'
}
const formatDate=value=>value?new Date(value).toLocaleDateString('en-NG',{day:'numeric',month:'long',year:'numeric'}):null

export default function DecemberProgress(){
 const [params]=useSearchParams()
 const [reference,setReference]=useState(params.get('reference')||'')
 const mode=params.get('mode')==='test'?'test':null
 const [details,setDetails]=useState(null)
 const [error,setError]=useState('')
 const [busy,setBusy]=useState(false)
 async function lookup(event){
  event?.preventDefault()
  if(!reference.trim())return
  setBusy(true);setError('')
  try{
   const response=await fetch('/api/december/progress?reference='+encodeURIComponent(reference.trim())+(mode==='test'?'&mode=test':''),{cache:'no-store'})
   const json=await response.json().catch(()=>({}))
   if(!response.ok)throw Error(json.error||'Could not find project status')
   setDetails(json)
   window.history.replaceState(null,'','/december/track?reference='+encodeURIComponent(reference.trim())+(mode==='test'?'&mode=test':''))
  }catch(e){setDetails(null);setError(e.message)}
  finally{setBusy(false)}
 }
 useEffect(()=>{if(params.get('reference'))lookup()},[])
 const current=details?.stage
 const stageIndex=MILESTONES.findIndex(x=>x[0]===current)
 return <div className="dp-page">
  <div className="dp-top"><Link to="/december">← December sale</Link><span>{mode==='test'?'TEST WEBSITE / PROJECT TRACKING':'YOUR WEBSITE / PROJECT TRACKING'}</span></div>
  <div className="dp-hero"><span>PROGRESS STUDIO / 2026</span><h1>Every great<br/>website has<br/><em>a process.</em></h1>
   <p>Check your website's progress anytime using the Paystack reference saved after your payment. Your project updates are published by Qing.</p></div>
  <div className="dp-main">
   <form className="dp-search" onSubmit={lookup}><label htmlFor="dp-reference">YOUR PAYMENT REFERENCE</label><div>
     <input required autoComplete="off" id="dp-reference" value={reference} onChange={e=>setReference(e.target.value)} placeholder="QDEC-..."/>
     <button disabled={busy}>{busy?'Checking…':'Check my project ↗'}</button>
   </div></form>
   {error&&<div role="alert" className="dp-error">{error}</div>}
   {details&&<div className="dp-results">
    <div className="dp-result-head"><div><span>{details.paid?'PAYMENT VERIFIED':'PAYMENT NOT YET VERIFIED'}</span><h2>{titles[current]||'Your website is in progress'}</h2><p>{details.publicNote}</p></div>
      <div className="dp-percent"><strong>{details.percent||0}%</strong><span>PROJECT COMPLETE</span></div></div>
    <div className="dp-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={details.percent||0} aria-label="Website completion"><div style={{width:(details.percent||0)+'%'}}/></div>
    <div className="dp-updates"><div><span>LAST UPDATE</span><strong>{formatDate(details.updatedAt)||'Awaiting first update'}</strong></div><div><span>EXPECTED COMPLETION</span><strong>{formatDate(details.estimatedCompletion)||'To be confirmed'}</strong></div><div><span>ASSETS CONFIRMED</span><strong>{details.assetsConfirmedAt?'Yes, '+formatDate(details.assetsConfirmedAt):'Not yet'}</strong></div></div>
    {details.paid&&<section className="dp-milestones"><h3>Where we are</h3><div className="dp-stage-list">{MILESTONES.map(([key,label],i)=><div key={key} className={'dp-stage '+(i<stageIndex?'done':i===stageIndex?'current':'')}><span>{i<stageIndex?'✓':String(i+1).padStart(2,'0')}</span><strong>{label}</strong>{i===stageIndex&&<b>IN PROGRESS</b>}</div>)}</div></section>}
    {!details.hasBusinessInfo&&details.paid&&<div className="dp-next"><h3>We still need your business details.</h3><p>Upload your logo, product photographs, pricing and any other essential materials. The 3–7 day build estimate begins after those resources are confirmed complete.</p><Link to={'/december/details?reference='+encodeURIComponent(reference)}>Submit business information ↗</Link></div>}
    {details.hasBusinessInfo&&details.paid&&<div className="dp-next"><h3>Need to update your business information?</h3><p>Your saved Paystack reference and checkout email let you update product photos and other website resources.</p><Link to={'/december/details?reference='+encodeURIComponent(reference)}>Update business information ↗</Link></div>}
    {!details.paid&&<div className="dp-next"><h3>Don't make another payment yet.</h3><p>Please check your Paystack receipt or contact Qing if a charge appears on your account. The project status updates once Paystack confirms the transaction.</p><a href="mailto:qinglidah@gmail.com">Ask about my payment ↗</a></div>}
   </div>}
  </div>
 </div>
}
