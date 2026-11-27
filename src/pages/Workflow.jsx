import { useEffect, useState } from 'react'
import { SHOWCASE_WORKFLOWS, workflowMoney } from '../data/workflows.js'
import './Workflow.css'
import { DEFAULT_VIDEOS } from '../data/workflowVideos.js'
import WorkflowVideoPlayer from '../components/WorkflowVideoPlayer.jsx'

const qutlineLaunchAd = {id:'kmfdt33pQ9w',title:'Qutline & Qutline Motion | Launch Ad',aspect:'9:16'}
const launchSamples = [
  qutlineLaunchAd,
  {id:'5P2f8rUQMGY',title:'On My Way | Qutline Launch Product Demo',aspect:'16:9'},
]
const launchSampleIds = new Set(launchSamples.map(video=>video.id))

// Keep the featured ads in Launch even if a saved list contains the same link.
function workflowSamples(group, list = []) {
  if(group==='qutline-launch')return [...launchSamples,...list.filter(video=>!launchSampleIds.has(video.id))]
  if(group==='qutline-motion')return list.filter(video=>!launchSampleIds.has(video.id)&&video.id!=='kglhSvLNpjo')
  return list.filter(video=>!launchSampleIds.has(video.id))
}

const artwork = {
  vox:[538,814,285,128],
}
function Artwork({workflow, className=''}) {
  if(workflow.theme==='qutline') return <svg className={'wf-artwork '+className} viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Qutline editorial typography in red and ivory"><rect width="640" height="360" fill="#191719"/><path d="M0 284H640M0 74H640M80 0V360M560 0V360" stroke="#f7f7f5" strokeOpacity=".12"/><circle cx="320" cy="178" r="124" fill="none" stroke="#DA161C" strokeWidth="1.5" opacity=".55"/><text x="320" y="56" fontSize="12" fill="#f7f7f5" textAnchor="middle" fontFamily="monospace" letterSpacing="3">AI EDITORIAL VIDEO EDITOR</text><text x="320" y="189" fontSize="102" fill="#000" opacity=".7" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic">Qutline.</text><text x="320" y="183" fontSize="102" fill="#DA161C" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic">Qutline.</text><text x="320" y="223" fontSize="16" fill="#f7f7f5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">YOUR FOOTAGE. EDITED.</text><g fill="#DA161C">{Array.from({length:33},(_,i)=><rect key={i} x={79+i*15} y={300-(8+(i*17)%29)/2} width="5" height={8+(i*17)%29} rx="2" opacity={i%3===0?1:.45}/>)}</g><text x="320" y="340" fill="#f7f7f5" textAnchor="middle" fontSize="12" fontFamily="monospace">BY QINGTHECREATOR</text></svg>
  if(workflow.theme==='qutline-motion') return <svg className={'wf-artwork '+className} viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Qutline Motion interface animation"><rect width="640" height="360" fill="#E9E8EB"/><rect x="32" y="30" width="576" height="300" rx="24" fill="#FAFAFC" stroke="#D4D3D8"/><text x="64" y="81" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="38" fill="#202124">Qutline Motion.</text><text x="66" y="108" fontFamily="Arial, sans-serif" fontSize="15" fill="#66666F">AI MOTION GRAPHICS / BY QINGTHECREATOR</text><rect x="65" y="132" width="510" height="128" rx="13" fill="#F1F1F5"/><rect x="85" y="149" width="470" height="42" rx="10" fill="white"/><text x="102" y="176" fontFamily="Arial, sans-serif" fontSize="18" fill="#202124">Animate interface</text><rect x="495" y="160" width="44" height="20" rx="10" fill="#34C759"/><circle cx="528" cy="170" r="8" fill="white"/><rect x="85" y="203" width="470" height="40" rx="10" fill="#007AFF"/><text x="320" y="229" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18" fill="white" textAnchor="middle">Create motion</text><path d="M457 211l8 30 5-10 10-4z" fill="#242424" stroke="white" strokeWidth="1"/><text x="320" y="298" fontFamily="Arial, sans-serif" fontSize="15" fill="#66666F" textAnchor="middle">INTERFACE • TYPOGRAPHY • SOUND</text></svg>
  if(workflow.theme==='qutline-launch') return <svg className={'wf-artwork '+className} viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Qutline Launch promotional video composition"><defs><pattern id="launch-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="#ded4c7" strokeWidth="1"/></pattern></defs><rect width="640" height="360" fill="#f6f0e4"/><rect y="265" width="640" height="95" fill="url(#launch-grid)"/><text x="320" y="46" fill="#746b60" textAnchor="middle" fontSize="13" fontFamily="Arial,sans-serif" letterSpacing="2">AI PROMO VIDEO EDITOR</text><text x="320" y="104" fill="#191815" textAnchor="middle" fontSize="48" fontWeight="bold" fontFamily="Arial,sans-serif">Qutline Launch.</text><rect x="58" y="132" width="226" height="115" rx="13" fill="#fffefa" stroke="#ddd3c5"/><text x="78" y="163" fontSize="14" fill="#746b60" fontFamily="Arial,sans-serif">YOUR SCRIPT + MEDIA</text><rect x="78" y="181" width="166" height="9" rx="4" fill="#d9cfc2"/><rect x="78" y="200" width="140" height="9" rx="4" fill="#d9cfc2"/><path d="M294 190H342m-9-8 9 8-9 8" fill="none" stroke="#DA161C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><rect x="356" y="132" width="226" height="115" rx="13" fill="#191815"/><text x="469" y="162" textAnchor="middle" fontSize="14" fill="#fffefa" fontFamily="Arial,sans-serif">YOUR FINISHED PROMO</text><path d="M459 179v35l30-17z" fill="#DA161C"/><rect x="199" y="275" width="242" height="34" rx="17" fill="#DA161C"/><text x="320" y="297" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="Arial,sans-serif">SCRIPT. PROOF. MOTION.</text><text x="320" y="337" fontSize="11" fill="#746b60" textAnchor="middle" fontFamily="Arial,sans-serif" letterSpacing="2">BY QINGTHECREATOR</text></svg>
  const region=artwork[workflow.theme]
  return <svg className={'wf-artwork '+className} viewBox={region.join(' ')} preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="/workflow-assets/editorial.png" width="1448" height="1086"/></svg>
}
function Sample({workflow, index}) {
  return <div className={'wf-sample wf-'+workflow.theme}>
    <Artwork workflow={workflow}/>
    <span className="wf-image-number">{String(index+1).padStart(2,'0')} / {String(SHOWCASE_WORKFLOWS.length).padStart(2,'0')}</span>
    {workflow.samples.length>0&&<a className="wf-play" href={workflow.samples[0].url} target="_blank" rel="noreferrer" aria-label={'Watch '+workflow.name+' sample'}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5v14l12-7z"/></svg></a>}
  </div>
}

export default function Workflow(){
  const [selected,setSelected]=useState([])
  const [videos,setVideos]=useState(DEFAULT_VIDEOS)
  const [playing,setPlaying]=useState('')
  const renderVideos=(group,list)=><div className="wf-video-grid">{list.map(video=>{const key=group+':'+video.id;return <WorkflowVideoPlayer key={key} video={video} active={playing===key} onPlay={(play=true)=>setPlaying(play?key:'')}/>})}</div>
  const [customer,setCustomer]=useState({name:'',email:'',phone:''})
  const [available,setAvailable]=useState(null)
  const [mode,setMode]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const chosen=SHOWCASE_WORKFLOWS.filter(w=>selected.includes(w.id))
  const total=chosen.reduce((sum,w)=>sum+w.price,0)
  useEffect(()=>{let active=true;fetch('/api/workflow',{cache:'no-store'}).then(r=>r.json()).then(r=>{if(active){setAvailable(r.available===true);setMode(r.mode||'');if(r.videos&&typeof r.videos==='object')setVideos(r.videos)}}).catch(()=>{if(active)setAvailable(false)});return()=>{active=false}},[])
  const toggle=id=>setSelected(list=>list.includes(id)?list.filter(x=>x!==id):[...list,id])
  async function checkout(e){
    e.preventDefault()
    if(busy||!selected.length||!available)return
    setBusy(true);setError('')
    try{
      const response=await fetch('/api/workflow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...customer,ids:selected})})
      const result=await response.json()
      if(!response.ok)throw Error(result.error||'Checkout could not be opened.')
      const url=new URL(result.authorization_url)
      if(url.protocol!=='https:'||!(url.hostname==='paystack.com'||url.hostname.endsWith('.paystack.com')))throw Error('Unexpected payment provider.')
      window.location.assign(url.href)
    }catch(err){setError(err.message||'Could not start checkout.');setBusy(false)}
  }
  return <div className="wf-page">
    <section className="wf-hero">
      <div className="wf-hero-copy"><p className="wf-kicker">QING THE CREATOR / THE CREATIVE WORKFLOW LIBRARY</p><h1>Creative workflows for <em>video and motion.</em></h1><p className="wf-lead">Edit talking-head footage with Qutline, animate ideas and interfaces with Qutline Motion, or make an ad with Qutline Launch.</p><div className="wf-hero-actions"><a href="#workflow-library" className="wf-primary">Choose a workflow ↗</a><a href="#workflow-checkout" className="wf-secondary">Pay with Paystack</a></div></div>
      <div className="wf-hero-image"><svg viewBox="757 58 690 298" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="/workflow-assets/editorial.png" width="1448" height="1086"/></svg><div className="wf-edition"><span>THE CREATIVE EDIT</span><b>01 / {String(SHOWCASE_WORKFLOWS.length).padStart(2,'0')}</b></div></div>
    </section>
    {!!videos.showcase?.length&&<section className="wf-showcase"><header><p className="wf-kicker">SELECTED WORK / EDITORIAL</p><h2>See the <em>finished work.</em></h2><p>Watch my editorial video samples directly here.</p></header>{renderVideos('showcase',videos.showcase)}</section>}
    <section id="workflow-library" className="wf-library">
      <header><div><p className="wf-kicker">01 / THE WORKFLOW LIBRARY</p><h2>Choose your <em>craft.</em></h2></div><p>Explore the sample videos, pick a workflow and add it to your selection. Each is sold separately.</p></header>
      <div className="wf-shop">
        <div className="wf-grid">{SHOWCASE_WORKFLOWS.map((w,index)=>{const samples=workflowSamples(w.id,videos[w.id]);return <article className={'wf-card'+(selected.includes(w.id)?' wf-selected':'')} key={w.id}><Sample workflow={w} index={index}/><div className="wf-card-body"><p className="wf-kicker">{w.category} / {w.theme==='qutline-launch'?'Ads & promos':w.theme==='qutline-motion'?'Motion illustrations':w.theme==='qutline'?'Talking-head editing':'Documentary'}</p><h3>{w.name}</h3><p>{w.description}</p>{w.compatibilityLabel&&<div className="wf-compatibility"><strong>{w.compatibilityLabel}</strong><p>{w.compatibilityNote}</p></div>}{!!samples.length&&<div className="wf-card-videos"><p className="wf-kicker">WATCH THE EDIT</p>{renderVideos(w.id,samples)}</div>}<div className="wf-sample-links">{w.samples.length?w.samples.map((s,i)=><a key={s.url} href={s.url} target="_blank" rel="noreferrer"><span aria-hidden="true">▶</span> {s.label||'Sample '+(i+1)}</a>):<span>{w.category==='AI skill'?'Installation ZIPs included':'Samples coming soon'}</span>}</div><div className="wf-card-bottom"><strong>{workflowMoney(w.price)}</strong><button type="button" disabled={busy} aria-pressed={selected.includes(w.id)} aria-label={(selected.includes(w.id)?'Remove ':'Select ')+w.name} onClick={()=>toggle(w.id)} className="wf-select"><span>{selected.includes(w.id)?'Selected':'Add'}</span><b aria-hidden="true">{selected.includes(w.id)?'✓':'+'}</b></button></div></div></article>})}</div>
        <aside className="wf-summary" id="workflow-checkout"><div className="wf-summary-head"><div><p className="wf-kicker">02 / CHECKOUT</p><h3>Your selection.</h3></div><span className="wf-count">{chosen.length}</span></div>
          {chosen.length?chosen.map(w=><div className="wf-summary-row" key={w.id}><div className="wf-mini"><Artwork workflow={w}/></div><div><span>{w.name}</span><b>{workflowMoney(w.price)}</b></div><button type="button" aria-label={'Remove '+w.name} disabled={busy} onClick={()=>toggle(w.id)}>×</button></div>):<p className="wf-empty">Your selection is empty. Add a workflow to begin.</p>}
          <div className="wf-total"><span>Total</span><strong>{workflowMoney(total)}</strong></div>
          {chosen.some(w=>w.compatibilityLabel)&&<div className="wf-checkout-compatibility" role="note"><strong>Check compatibility before paying.</strong>{chosen.filter(w=>w.compatibilityLabel).map(w=><p key={w.id}><b>{w.compatibilityLabel}:</b> {w.id==='qutline'?'Qutline requires image generation for its full visual style. Claude needs an external image generator.':w.id==='qutline-launch'?'Qutline Launch requires compatible rendering tools. Claude needs supplied imagery or an external image generator for generated visuals. Voiceover requires a compatible speech tool or supplied audio.':'Qutline Motion is designed for both platforms; compatible rendering tools are required.'}</p>)}<p>These are installable skills, not standalone editing services. Your AI account must have the required tools.</p></div>}
          <form className="wf-form" onSubmit={checkout}><label>Full name<input required maxLength={100} autoComplete="name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></label><label>Email address<input required type="email" maxLength={160} autoComplete="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/></label><label>WhatsApp (optional)<input type="tel" maxLength={30} autoComplete="tel" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/></label>{mode==='test'&&<p role="status">Test checkout. No real payment will be collected.</p>}{available===false&&<p role="alert">Online checkout is temporarily unavailable.</p>}{error&&<p role="alert">{error}</p>}<button className="wf-primary" type="submit" disabled={!total||available!==true||busy}>{busy?'Opening Paystack…':available===null?'Checking payment availability…':'Checkout with Paystack ↗'}</button></form>
          <p className="wf-note">Secure payment through Paystack. Qutline, Qutline Motion and Qutline Launch installation ZIPs are emailed automatically after verified payment. For other workflows, keep your reference and contact Qing to arrange delivery.</p>
        </aside>
      </div>
    </section>
    {total>0&&<a className="wf-floating" href="#workflow-checkout"><span>{chosen.length} selected · {workflowMoney(total)}</span><b>Checkout ↗</b></a>}
  </div>
}
