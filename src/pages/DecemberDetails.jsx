import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './DecemberDetails.css'

const emptyItem=()=>({name:'',price:'',description:'',imageUrl:''})
const blank={
  businessName:'',businessDescription:'',assetFolderUrl:'',logoUrl:'',instagramUrl:'',
  websiteDomain:'',whatsappNumber:'',brandColors:'',festiveOffer:'',
  deliveryInformation:'',orderDeadline:'',contactAddress:'',policies:'',
  additionalNotes:'',items:[emptyItem()],assetsSubmittedComplete:false
}
const cards=[
  {id:'identity',title:'Brand identity',description:'Tell us how your business should look and sound.'},
  {id:'products',title:'Products & services',description:'List the items, pricing and photos you want published.'},
  {id:'logistics',title:'Orders & delivery',description:'Set expectations for customers and their orders.'},
]

export default function DecemberDetails(){
  const [params]=useSearchParams()
  const [reference,setReference]=useState(params.get('reference')||'')
  const [email,setEmail]=useState('')
  const [verified,setVerified]=useState(null)
  const [form,setForm]=useState({...blank})
  const [pending,setPending]=useState(false)
  const [uploading,setUploading]=useState('')
  const [message,setMessage]=useState('')
  const [saved,setSaved]=useState(false)
  const update=(field,value)=>{setForm(prev=>({...prev,[field]:value}));setSaved(false)}
  const changeItem=(i,k,val)=>{setForm(prev=>({...prev,items:prev.items.map((item,index)=>i===index?{...item,[k]:val}:item)}));setSaved(false)}
  const addItem=()=>{if(form.items.length<(verified?.maxItems||12))update('items',[...form.items,emptyItem()])}
  const removeItem=i=>update('items',form.items.filter((_,index)=>index!==i).length?form.items.filter((_,index)=>index!==i):[emptyItem()])
  async function uploadPhoto(event,field,index){
    const file=event.target.files?.[0]
    if(!file)return
    if(file.size>2000000){setMessage('That image is over 2 MB. Upload a smaller JPG/PNG/WebP or paste a full-resolution Google Drive link.');return}
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setMessage('Please upload a JPG, PNG or WebP image.');return}
    const key=field==='logoUrl'?'logo':('item-'+index)
    setUploading(key);setMessage('')
    try{
      const base64=await new Promise((resolve,reject)=>{
        const reader=new FileReader()
        reader.onload=()=>resolve(String(reader.result).split(',')[1])
        reader.onerror=()=>reject(Error('Could not read image'))
        reader.readAsDataURL(file)
      })
      const response=await fetch('/api/december/upload',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({reference,email:email.trim().toLowerCase(),name:file.name,data:base64})
      })
      const result=await response.json().catch(()=>({}))
      if(!response.ok||!result.url)throw Error(result.error||'Image upload failed')
      if(field==='logoUrl')update('logoUrl',result.url)
      else changeItem(index,'imageUrl',result.url)
      setMessage(file.name+' uploaded securely. Save the form to keep this image linked to your order.')
    }catch(err){setMessage(err.message||'Could not upload the image.')}
    finally{setUploading('')}
  }

  async function request(action){
    setPending(true);setMessage('')
    try{
      const response=await fetch('/api/december/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,reference:reference.trim(),email:email.trim().toLowerCase(),...(action==='submit'?{details:form}:{})})})
      const json=await response.json().catch(()=>({}))
      if(!response.ok)throw Error(json.error||'Unable to process your request')
      if(action==='lookup'){
        setVerified(json.context)
        if(json.submission){const current=json.submission;setForm({...blank,...current,items:Array.isArray(current.items)&&current.items.length?current.items:[emptyItem()]})}
        else setForm(prev=>({...prev,businessName:json.context.business,items:prev.items?.length?prev.items:[emptyItem()]}))
      }
      if(action==='submit')setSaved(true)
      setMessage(action==='lookup'?'Your verified website order has been found. You can complete or update your details below.':json.message)
    }catch(err){setMessage(err.message||'Please try again.')}
    finally{setPending(false)}
  }
  return <div className="dec-details">
    <div className="dec-details-top"><Link to="/december">← December sale</Link><span>THE CUSTOMER STUDIO / 2026</span></div>
    <header className="dec-details-hero">
      <p>01 / AFTER YOUR PAYMENT</p>
      <h1>Your business.<br/><em>Your website.</em><br/>Your details.</h1>
      <div><p>Keep the Paystack reference shown after checkout. You will use it with your payment email to complete this form, upload your asset links, and update your business information.</p>
      <strong>3–7 DAYS <span>estimated website build time after your product images, content and other resources have been reviewed and confirmed complete.</span></strong></div>
    </header>
    <main className="dec-details-body">
      <section className="dec-verify">
        <div><span>STEP 01</span><h2>Find your order.</h2><p>Enter the Paystack transaction reference you saved and the email you used to pay. We verify your payment before showing the form.</p></div>
        <form onSubmit={e=>{e.preventDefault();request('lookup')}} className="dec-verify-fields">
          <label>Payment reference<input required value={reference} onChange={e=>{setReference(e.target.value);setVerified(null)}} placeholder="QDEC-..." autoComplete="off" /></label>
          <label>Payment email<input required type="email" value={email} onChange={e=>{setEmail(e.target.value);setVerified(null)}} placeholder="you@business.com" /></label>
          <button disabled={pending}>{pending?'Checking payment…':'Verify my payment ↗'}</button>
        </form>
      </section>
      {message&&<div role="status" className={'dec-details-message'+(verified?' success':'')}>{message}</div>}
      {verified&&<div className="dec-verified-banner"><span>✓ PAYMENT VERIFIED</span><strong>{verified.business}</strong><p>{verified.industry} · {verified.layout} layout · Up to {verified.maxItems} items</p><small>Selected extras: {verified.addons.length?verified.addons.join(', '):'None'}</small></div>}
      {verified&&<form className="dec-intake-form" onSubmit={e=>{e.preventDefault();request('submit')}}>
        <section className="dec-intake-section"><div className="dec-intake-heading"><span>02</span><div><h2>{cards[0].title}</h2><p>{cards[0].description}</p></div></div>
          <div className="dec-intake-grid">
            <label>Business / trading name *<input required maxLength={120} value={form.businessName} onChange={e=>update('businessName',e.target.value)}/></label>
            <label>Logo link (optional)<input type="text" placeholder="https://drive.google.com/..." value={form.logoUrl} onChange={e=>update('logoUrl',e.target.value)}/></label>
            <label className="dec-upload-control">Or upload your logo (JPG, PNG, WebP, max 2 MB)<input type="file" accept="image/jpeg,image/png,image/webp" disabled={!!uploading} onChange={e=>uploadPhoto(e,'logoUrl')} />{uploading==='logo'&&<small>Uploading logo…</small>}{form.logoUrl?.startsWith('/api/december/image')&&<img src={form.logoUrl} alt="Uploaded business logo" />}</label>
            <label>Brand colours and style<input placeholder="E.g. oxblood, cream and black" value={form.brandColors} onChange={e=>update('brandColors',e.target.value)}/></label>
            <label>Instagram / social page<input type="url" placeholder="https://instagram.com/..." value={form.instagramUrl} onChange={e=>update('instagramUrl',e.target.value)}/></label>
            <label>Preferred website/domain<input placeholder="E.g. mybrand.com or need a new domain" value={form.websiteDomain} onChange={e=>update('websiteDomain',e.target.value)}/></label>
            <label>Shared image + logo folder<input type="url" placeholder="https://drive.google.com/drive/folders/..." value={form.assetFolderUrl} onChange={e=>update('assetFolderUrl',e.target.value)}/></label>
            <label className="dec-intake-full">Describe your business and who you sell to *<textarea required minLength={20} rows={4} maxLength={2200} value={form.businessDescription} onChange={e=>update('businessDescription',e.target.value)} placeholder="What do you sell or offer, who is it for, and what makes your brand different?"/></label>
          </div>
          <div className="dec-tip"><strong>PHOTOS & BRAND ASSETS</strong><p>Upload individual JPG/PNG/WebP photos (up to 2 MB each), or paste a correctly shared Google Drive/Dropbox folder with full-resolution images, logos and other resources. For larger files and video, please use a shared folder link.</p></div>
        </section>
        <section className="dec-intake-section">
          <div className="dec-intake-heading"><span>03</span><div><h2>{cards[1].title}</h2><p>{cards[1].description} Your package allows {verified.maxItems} listings.</p></div></div>
          <div className="dec-item-grid">
            {form.items.map((item,i)=><div className="dec-intake-item" key={i}>
              <div className="dec-intake-item-head"><strong>LISTING {String(i+1).padStart(2,'0')}</strong><button type="button" onClick={()=>removeItem(i)} aria-label={'Remove listing '+(i+1)}>Remove ×</button></div>
              <div className="dec-intake-grid">
                <label>Product / service name<input value={item.name} maxLength={120} onChange={e=>changeItem(i,'name',e.target.value)} placeholder="The signature holiday box"/></label>
                <label>Price or starting price<input value={item.price} maxLength={60} onChange={e=>changeItem(i,'price',e.target.value)} placeholder="₦18,500 or Price on enquiry"/></label>
                <label>Photo link or uploaded image<input value={item.imageUrl} onChange={e=>changeItem(i,'imageUrl',e.target.value)} placeholder="https://..."/></label>
                <label className="dec-upload-control">Or upload this product photo (max 2 MB)<input type="file" accept="image/jpeg,image/png,image/webp" disabled={!!uploading} onChange={e=>uploadPhoto(e,'imageUrl',i)}/>{uploading==='item-'+i&&<small>Uploading photo…</small>}{item.imageUrl?.startsWith('/api/december/image')&&<img src={item.imageUrl} alt={'Uploaded product '+(i+1)}/>}</label>
                <label>Brief description<input value={item.description} maxLength={600} onChange={e=>changeItem(i,'description',e.target.value)} placeholder="Size, colours, servings, or what it includes"/></label>
              </div>
            </div>)}
          </div>
          <button type="button" onClick={addItem} disabled={form.items.length>=verified.maxItems} className="dec-add-item">+ Add another item ({form.items.length}/{verified.maxItems})</button>
        </section>
        <section className="dec-intake-section">
          <div className="dec-intake-heading"><span>04</span><div><h2>{cards[2].title}</h2><p>{cards[2].description}</p></div></div>
          <div className="dec-intake-grid">
            <label>WhatsApp order number *<input required value={form.whatsappNumber} onChange={e=>update('whatsappNumber',e.target.value)} placeholder="+234..."/></label>
            <label>Order deadlines or booking windows<input value={form.orderDeadline} onChange={e=>update('orderDeadline',e.target.value)} placeholder="E.g. December 20, or 48h advance notice"/></label>
            <label className="dec-intake-full">Delivery / pickup / booking information<textarea rows={3} value={form.deliveryInformation} onChange={e=>update('deliveryInformation',e.target.value)}/></label>
            <label className="dec-intake-full">Address or service areas<textarea rows={2} value={form.contactAddress} onChange={e=>update('contactAddress',e.target.value)}/></label>
            <label className="dec-intake-full">December offer headline and details<textarea rows={3} value={form.festiveOffer} onChange={e=>update('festiveOffer',e.target.value)}/></label>
            <label className="dec-intake-full">Returns, payment or booking policies<textarea rows={3} value={form.policies} onChange={e=>update('policies',e.target.value)}/></label>
            <label className="dec-intake-full">Anything else to know?<textarea rows={3} value={form.additionalNotes} onChange={e=>update('additionalNotes',e.target.value)}/></label>
          </div>
        </section>
        <div className="dec-intake-submit">
          <label className="dec-intake-confirm"><input type="checkbox" checked={form.assetsSubmittedComplete} onChange={e=>update('assetsSubmittedComplete',e.target.checked)}/>
          <span>All my product images, business information, prices and other website resources are ready for review.</span></label>
          <p>The 3–7 day build window starts after Qing confirms your submitted materials are complete. If something is missing, you can return with the same payment reference and email to update your form.</p>
          <button type="submit" disabled={pending||!!uploading}>{pending?'Saving your details…':uploading?'Image uploading…':'Save business information ↗'}</button>
          {saved&&<p className="dec-save-success" role="status">✓ Details saved in your website order. Keep your reference for any updates.</p>}
        </div>
      </form>}
    </main>
  </div>
}
