import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function PaymentCallback() {
  const location=useLocation()
  const [data,setData]=useState(null)
  const [error,setError]=useState('')
  useEffect(() => {
    const params=new URLSearchParams(location.search)
    const reference=params.get('reference') || params.get('trxref')
    if(!reference) {setError('No payment reference was provided.');return}
    let cancelled=false
    fetch('/api/paystack/verify?reference='+encodeURIComponent(reference),{cache:'no-store'})
      .then(async response => {
        const json=await response.json().catch(()=>({}))
        if(!response.ok) throw new Error(json.error || 'Verification is unavailable')
        return json
      })
      .then(result=>{if(!cancelled)setData(result)})
      .catch(err=>{if(!cancelled)setError(err.message || 'Could not verify payment')})
    return ()=>{cancelled=true}
  },[location.search])

  const link=data?.product==='qing-class'?'/class':'/december'
  return <section style={{maxWidth:860,margin:'4rem auto',padding:'3rem 2rem',background:'#fffefa',border:'1px solid #ded5ce',borderTop:'5px solid #f01820',fontFamily:'Inter,sans-serif'}}>
    <p style={{font:'700 .7rem Space Mono,monospace',color:'#f01820',textTransform:'uppercase'}}>Qing The Creator / Secure checkout</p>
    <h1 style={{font:'700 clamp(2.8rem,7vw,5rem)/1 Georgia,serif',letterSpacing:'-.05em',margin:'1.5rem 0'}}>
      {error?'Payment status unavailable':!data?'Checking your payment…':data.paid?'Payment confirmed.':'Payment not confirmed yet.'}
    </h1>
    {error && <p role="alert">{error} If you were charged, keep your Paystack reference and contact Qing for verification.</p>}
    {data && <>
      <p>{data.paid
        ? data.product==='qing-class'
          ? 'Your class payment has been verified. Registration approval and access-code issuance remain separate.'
          : 'Your website payment has been verified. You will be contacted to collect your brand assets and confirm delivery dates.'
        : 'We have not confirmed this payment. If you were charged, please contact Qing with the reference.'}</p>
      <div style={{borderTop:'1px solid #ddd6d0',borderBottom:'1px solid #ddd6d0',padding:'1.2rem 0',margin:'1.5rem 0'}}>
        <p><strong>Reference:</strong> {data.reference}</p>
        {data.paid && <p><strong>Amount received:</strong> ₦{(data.amount/100).toLocaleString('en-NG')}</p>}
        {data.paid && data.balance>0 && <p><strong>Balance before launch:</strong> ₦{data.balance.toLocaleString('en-NG')}</p>}
      </div>
    </>}
    <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginTop:'2rem'}}>
      <Link to={link} style={{display:'inline-flex',background:'#f01820',padding:'14px 20px',color:'white',borderRadius:999,fontWeight:700}}>Back to {data?.product==='qing-class'?'class':'December websites'} ↗</Link>
      <a href="mailto:qinglidah@gmail.com" style={{padding:'14px 15px',fontWeight:700}}>Contact Qing ↗</a>
    </div>
  </section>
}
