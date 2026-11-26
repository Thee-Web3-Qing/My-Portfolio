import { useEffect, useState } from 'react'
import { WORKFLOWS, workflowMoney } from '../data/workflows.js'
import './Workflow.css'

const artwork = {
  tech:[394,461,315,175],
  script:[734,462,281,172],
  motion:[46,814,464,128],
  vox:[538,814,285,128],
}
function Artwork({workflow, className=''}) {
  if(workflow.theme==='corporate') return <img className={'wf-finance-image '+className} src="/workflow-assets/finance.jpg" alt="Finance and corporate workflow sample, showing an edited website preview" loading="lazy"/>
  const region=artwork[workflow.theme]
  return <svg className={'wf-artwork '+className} viewBox={region.join(' ')} preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="/workflow-assets/editorial.png" width="1448" height="1086"/></svg>
}
function Sample({workflow}) {
  return <div className={'wf-sample wf-'+workflow.theme}>
    <Artwork workflow={workflow}/>
    <span className="wf-image-number">{workflow.number} / {String(WORKFLOWS.length).padStart(2,'0')}</span>
    {workflow.samples.length>0&&<a className="wf-play" href={workflow.samples[0].url} target="_blank" rel="noreferrer" aria-label={'Watch '+workflow.name+' sample'}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5v14l12-7z"/></svg></a>}
  </div>
}

export default function Workflow(){
  const [selected,setSelected]=useState([])
  const [customer,setCustomer]=useState({name:'',email:'',phone:''})
  const [available,setAvailable]=useState(null)
  const [mode,setMode]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const chosen=WORKFLOWS.filter(w=>selected.includes(w.id))
  const total=chosen.reduce((sum,w)=>sum+w.price,0)
  useEffect(()=>{let active=true;fetch('/api/workflow',{cache:'no-store'}).then(r=>r.json()).then(r=>{if(active){setAvailable(r.available===true);setMode(r.mode||'')}}).catch(()=>{if(active)setAvailable(false)});return()=>{active=false}},[])
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
      <div className="wf-hero-copy"><p className="wf-kicker">QING THE CREATOR / THE CREATIVE WORKFLOW LIBRARY</p><h1>Creative workflows for <em>videos, motion</em> and writing.</h1><p className="wf-lead">Buy my creative process, not just the final video. Explore the workflows behind my editing, motion design, illustration and scripts, and find the one that fits your work.</p><div className="wf-hero-actions"><a href="#workflow-library" className="wf-primary">Choose a workflow ↗</a><a href="#workflow-checkout" className="wf-secondary">Pay with Paystack</a></div></div>
      <div className="wf-hero-image"><svg viewBox="757 58 690 298" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="/workflow-assets/editorial.png" width="1448" height="1086"/></svg><div className="wf-edition"><span>THE CREATIVE EDIT</span><b>01 / 05</b></div></div>
    </section>
    <section id="workflow-library" className="wf-library">
      <header><div><p className="wf-kicker">01 / THE WORKFLOW LIBRARY</p><h2>Choose your <em>craft.</em></h2></div><p>Explore the sample videos, pick a workflow and add it to your selection. Each is sold separately.</p></header>
      <div className="wf-shop">
        <div className="wf-grid">{WORKFLOWS.map(w=><article className={'wf-card'+(selected.includes(w.id)?' wf-selected':'')} key={w.id}><Sample workflow={w}/><div className="wf-card-body"><p className="wf-kicker">{w.category} / {w.theme==='tech'?'Illustration':w.theme==='motion'?'Motion design':w.theme==='corporate'?'Corporate':w.theme==='script'?'Storytelling':'Documentary'}</p><h3>{w.name}</h3><p>{w.description}</p><div className="wf-sample-links">{w.samples.length?w.samples.map((s,i)=><a key={s.url} href={s.url} target="_blank" rel="noreferrer"><span aria-hidden="true">▶</span> {s.label||'Sample '+(i+1)}</a>):<span>Samples coming soon</span>}</div><div className="wf-card-bottom"><strong>{workflowMoney(w.price)}</strong><button type="button" disabled={busy} aria-pressed={selected.includes(w.id)} aria-label={(selected.includes(w.id)?'Remove ':'Select ')+w.name} onClick={()=>toggle(w.id)} className="wf-select"><span>{selected.includes(w.id)?'Selected':'Add'}</span><b aria-hidden="true">{selected.includes(w.id)?'✓':'+'}</b></button></div></div></article>)}</div>
        <aside className="wf-summary" id="workflow-checkout"><div className="wf-summary-head"><div><p className="wf-kicker">02 / CHECKOUT</p><h3>Your selection.</h3></div><span className="wf-count">{chosen.length}</span></div>
          {chosen.length?chosen.map(w=><div className="wf-summary-row" key={w.id}><div className="wf-mini"><Artwork workflow={w}/></div><div><span>{w.name}</span><b>{workflowMoney(w.price)}</b></div><button type="button" aria-label={'Remove '+w.name} disabled={busy} onClick={()=>toggle(w.id)}>×</button></div>):<p className="wf-empty">Your selection is empty. Add a workflow to begin.</p>}
          <div className="wf-total"><span>Total</span><strong>{workflowMoney(total)}</strong></div>
          <form className="wf-form" onSubmit={checkout}><label>Full name<input required maxLength={100} autoComplete="name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></label><label>Email address<input required type="email" maxLength={160} autoComplete="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/></label><label>WhatsApp (optional)<input type="tel" maxLength={30} autoComplete="tel" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/></label>{mode==='test'&&<p role="status">Test checkout. No real payment will be collected.</p>}{available===false&&<p role="alert">Online checkout is temporarily unavailable.</p>}{error&&<p role="alert">{error}</p>}<button className="wf-primary" type="submit" disabled={!total||available!==true||busy}>{busy?'Opening Paystack…':available===null?'Checking payment availability…':'Checkout with Paystack ↗'}</button></form>
          <p className="wf-note">Secure payment through Paystack. After verification, keep your reference and contact Qing to receive the purchased workflow.</p>
        </aside>
      </div>
    </section>
    {total>0&&<a className="wf-floating" href="#workflow-checkout"><span>{chosen.length} selected · {workflowMoney(total)}</span><b>Checkout ↗</b></a>}
  </div>
}
