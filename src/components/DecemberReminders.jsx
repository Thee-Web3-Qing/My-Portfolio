import { useCallback, useEffect, useState } from 'react'
import { trackDecemberEvent } from './DecemberTrafficTracker.jsx'
import './DecemberReminders.css'

const subject='Still thinking about your December website?'
const adminApi='/api/admin/orders?view=reminders'
async function readResponse(res){
 const data=await res.json().catch(()=>({}))
 if(!res.ok)throw Error(data.error||'Something went wrong. Please try again.')
 return data
}

export function DecemberReminderSignup({industry,layout}){
 const [email,setEmail]=useState('')
 const [consent,setConsent]=useState(false)
 const [busy,setBusy]=useState(false)
 const [result,setResult]=useState(null)
 async function subscribe(event){
  event.preventDefault()
  if(busy||!consent)return
  const companyWebsite=new FormData(event.currentTarget).get('companyWebsite')
  setBusy(true)
  setResult(null)
  try{
   await fetch('/api/december/reminders',{
    method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',
    body:JSON.stringify({email,consent,industry,layout,companyWebsite})
   }).then(readResponse)
   trackDecemberEvent('reminder_signup',{industry,layout})
   setResult({text:'Your request is saved. If you haven’t already booked or opted out, I can send you one reminder.',ok:true})
   setEmail('')
   setConsent(false)
  }catch(err){setResult({text:err.message,ok:false})}
  finally{setBusy(false)}
 }
 return <section className="dec-reminder" id="dec-reminder" aria-labelledby="dec-reminder-title">
   <p className="dec-kicker">NOT READY TO BOOK?</p>
   <h3 id="dec-reminder-title">Want one email reminder?</h3>
   <p>Pick up where you left off when you’re ready. This won’t reserve a slot or sign you up for a mailing list.</p>
   <form onSubmit={subscribe}>
    <label className="dec-reminder-email">Email for the reminder<input required type="email" maxLength={160} autoComplete="email" name="reminder-email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@yourbrand.com"/></label>
    <div hidden><label>Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="dec-reminder-consent"><input type="checkbox" checked={consent} required onChange={e=>setConsent(e.target.checked)}/> <span>I agree to receive one email from Qing about the December website offer. I can unsubscribe from the email.</span></label>
    <button className="dec-btn dec-btn-dark" type="submit" disabled={busy}>{busy?'Saving…':'Remind me'}</button>
   </form>
   {result&&<p role={result.ok?'status':'alert'}>{result.text}</p>}
 </section>
}

function leadStatus(lead){
 return lead.unsubscribed_at?'Unsubscribed':lead.paid?'Already paid':lead.sent_at?'Reminder sent':lead.expired?'Expired':lead.sending?'Attempted / check delivery':'Eligible'
}
export function DecemberReminderPanel(){
 const [data,setData]=useState(null)
 const [loading,setLoading]=useState(false)
 const [notice,setNotice]=useState('')
 const [error,setError]=useState('')
 const [selected,setSelected]=useState(null)
 const [sending,setSending]=useState(false)
 const refresh=useCallback(async()=>{
  setLoading(true)
  try{
   const payload=await fetch(adminApi,{credentials:'same-origin',cache:'no-store'}).then(readResponse)
   setData(payload)
   setError('')
  }catch(err){setError(err.message)}
  finally{setLoading(false)}
 },[])
 useEffect(()=>{refresh()},[refresh])
 async function send(){
  if(!selected||sending)return
  setSending(true)
  setError('')
  setNotice('')
  try{
   await fetch(adminApi,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({action:'send',id:selected.id})}).then(readResponse)
   setNotice('The email provider accepted this reminder.')
   setSelected(null)
  }catch(err){setError(err.message);setSelected(null)}
  finally{setSending(false);await refresh()}
 }
 const leads=Array.isArray(data?.leads)?data.leads:[]
 return <section className="da-reminder" aria-labelledby="da-reminder-title">
  <div className="da-reminder-head">
   <div><p className="da-eyebrow">DECEMBER SALES / EXPRESS OPT-IN</p><h2 id="da-reminder-title">Email reminders.</h2><p>Send one reminder to visitors who asked for it. Anonymous visits and checkout emails are not subscribed.</p></div>
   <button type="button" onClick={()=>{setNotice('');refresh()}} disabled={loading||sending}>{loading?'Checking…':'Refresh leads'}</button>
  </div>
  {data&&!data.sendReady&&<p role="status">Sending is disabled here. It requires production email to be configured.</p>}
  {notice&&<p role="status">{notice}</p>}
  {error&&<p className="da-traffic-error" role="alert">{error}</p>}
  {data&&!leads.length&&<p>No one has asked for a reminder yet.</p>}
  {!!leads.length&&<ul className="da-reminder-list">{leads.map(lead=>{
   const status=leadStatus(lead)
   return <li key={lead.id}><div><strong>{lead.email}</strong><small>{[lead.industryLabel,lead.layoutLabel].filter(Boolean).join(' / ')||'December offer'} · {new Date(lead.consent_at).toLocaleDateString('en-NG',{timeZone:'Africa/Lagos'})}</small></div><span>{status}</span><button type="button" disabled={status!=='Eligible'||!data?.sendReady||sending||loading} onClick={()=>{setSelected(lead);setNotice('')}}>Review reminder</button></li>
  })}</ul>}
  {selected&&<div className="da-reminder-review" role="region" aria-label="Review your reminder">
   <p><strong>To:</strong> {selected.email}</p>
   <p><strong>Subject:</strong> {subject}</p>
   <p>You asked for one reminder about the December website offer.</p>
   {selected.industryLabel&&<p>You were looking at {selected.industryLabel}{selected.layoutLabel?' / '+selected.layoutLabel:''}.</p>}
   <p>If you’re still deciding, you can revisit the website builder, compare layouts and see what’s included before you book.</p>
   <p>The email includes a link back to the builder and a link to unsubscribe.</p>
   <button type="button" disabled={sending} onClick={send}>{sending?'Sending…':'Send one email'}</button>{' '}
   <button type="button" disabled={sending} onClick={()=>setSelected(null)}>Cancel</button>
  </div>}
 </section>
}
