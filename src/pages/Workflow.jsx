import { useEffect, useState } from 'react'
import { WORKFLOWS, workflowMoney } from '../data/workflows.js'
import './Workflow.css'

function Sample({workflow}) {
  return <div className={'wf-sample wf-'+workflow.theme}>
    <div className="wf-sample-top"><span>{workflow.category.toUpperCase()}</span><span>0{Number(workflow.number)} / 04</span></div>
    <div className="wf-art" aria-hidden="true">
      {workflow.theme==='corporate'?<><div className="wf-chart">{[35,58,43,80,68,100].map((h,i)=><i key={i} style={{height:h+'%'}}/>)}</div><span className="wf-art-label">Clarity. Precision.</span></>:
      workflow.theme==='tech'?<><div className="wf-orbit"><i/><i/><i/><b>AI</b></div><span className="wf-art-label">Ideas in motion.</span></>:
      workflow.theme==='script'?<div className="wf-paper"><b>01 / THE HOOK</b><i/><i/><i/><b>02 / THE STORY</b><i/><i/></div>:
      <><div className="wf-vox-type">WHY<span>?</span></div><div className="wf-vox-rule"/><span className="wf-art-label">A story worth explaining.</span></>}
    </div>
    <div className="wf-sample-bottom">{workflow.samples.length?workflow.samples.map((sample,i)=><a key={sample.url} href={sample.url} target="_blank" rel="noreferrer">{sample.label||'Watch sample '+(i+1)} ↗</a>):<span>Sample videos coming soon</span>}</div>
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
      <div><p className="wf-kicker">QING THE CREATOR / CREATIVE WORKFLOWS</p><h1>Make the work.<br/><em>Keep the craft.</em></h1><p className="wf-lead">Explore my creative workflows for video editing, motion design, illustration and script writing. Select the ones that fit the kind of content you want to create.</p><a href="#workflow-library" className="wf-primary">Explore the workflows ↗</a></div>
      <aside className="wf-hero-side"><div className="wf-timeline"><i/><i/><i/><i/><i/><i/><i/><i/></div><strong>04</strong><span>Creative workflows<br/>Editing &amp; writing</span></aside>
    </section>
    <section id="workflow-library" className="wf-library">
      <header><div><p className="wf-kicker">THE WORKFLOW LIBRARY</p><h2>Find your workflow.</h2></div><p>Choose one or several. Each workflow has its own price.</p></header>
      <div className="wf-grid">{WORKFLOWS.map(w=><article className={'wf-card'+(selected.includes(w.id)?' wf-selected':'')} key={w.id}><Sample workflow={w}/><div className="wf-card-body"><div className="wf-card-heading"><div><p className="wf-kicker">{w.category}</p><h3>{w.name}</h3></div><strong>{workflowMoney(w.price)}</strong></div><p>{w.description}</p><ul>{w.details.map(d=><li key={d}>{d}</li>)}</ul><button type="button" disabled={busy} aria-pressed={selected.includes(w.id)} onClick={()=>toggle(w.id)} className="wf-select">{selected.includes(w.id)?'Selected ✓':'Select workflow +'}<span>{workflowMoney(w.price)}</span></button></div></article>)}</div>
    </section>
    <section className="wf-checkout" id="workflow-checkout">
      <div><p className="wf-kicker">SECURE CHECKOUT</p><h2>Make it yours.</h2><p>Pay securely with Paystack. After payment is verified, keep your reference and contact Qing to arrange delivery. Sample videos are separate from the workflow purchase.</p><form onSubmit={checkout}><label>Full name<input required maxLength={100} autoComplete="name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/></label><label>Email address<input required type="email" maxLength={160} autoComplete="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})}/></label><label>WhatsApp number (optional)<input type="tel" maxLength={30} autoComplete="tel" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})}/></label>{mode==='test'&&<p role="status">Test checkout. No real payment will be collected.</p>}{available===false&&<p role="alert">Online checkout is temporarily unavailable.</p>}{error&&<p role="alert">{error}</p>}<button className="wf-primary" type="submit" disabled={!total||available!==true||busy}>{busy?'Opening Paystack…':available===null?'Checking payment availability…':'Pay '+workflowMoney(total)+' with Paystack ↗'}</button></form></div>
      <aside className="wf-summary"><p className="wf-kicker">YOUR SELECTION</p><h3>{chosen.length} {chosen.length===1?'workflow':'workflows'}</h3>{chosen.length?chosen.map(w=><div className="wf-summary-row" key={w.id}><span>{w.name}</span><b>{workflowMoney(w.price)}</b><button type="button" aria-label={'Remove '+w.name} disabled={busy} onClick={()=>toggle(w.id)}>×</button></div>):<p>No workflows selected yet.</p>}<div className="wf-total"><span>Total</span><strong>{workflowMoney(total)}</strong></div><a href="#workflow-library">Back to the library ↗</a></aside>
    </section>
    {total>0&&<a className="wf-floating" href="#workflow-checkout"><span>{chosen.length} selected · {workflowMoney(total)}</span><b>Checkout ↗</b></a>}
  </div>
}
