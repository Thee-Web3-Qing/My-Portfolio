import {useEffect,useMemo,useState} from 'react'
import {Link,useLocation} from 'react-router-dom'
import {beautyCollections} from './beautySiteContent.js'
import './BeautyInnerPages.css'

const money=n=>'₦'+Number(n||0).toLocaleString('en-NG')
const link=(root,path='')=>root+(path?'/'+path:'')
const catOptions=(data)=>['All',...new Set(data.items.map(x=>x.category))]
function Pic({Photo,src,alt,className=''}){return <Photo className={className} src={src} alt={alt}/>}
function Trail({data,root,crumb}){return <nav className="bi-trail" aria-label="Breadcrumb"><Link to={root}>Home</Link><span>/</span><span>{crumb}</span><span className="bi-demo-word">WEBSITE SAMPLE</span></nav>}
function Label({children}){return <span className="bi-label">{children}</span>}
function Cta({root,to,children,light=false}){return <Link className={'bi-cta'+(light?' bi-cta-light':'')} to={link(root,to)}>{children}</Link>}
function PreviewNote(){return <p className="bi-sample-note">This is an interactive website sample. Products, services, prices and availability are illustrative. No real orders, payments or bookings are processed.</p>}
function Categories({data,category,onSelect}){return <div className="bi-filters" aria-label="Filter by category">{catOptions(data).map(c=><button type="button" key={c} className={c===category?'selected':''} aria-pressed={c===category} onClick={()=>onSelect(c)}>{c}</button>)}</div>}
function ProductCards({items,Photo,root,format='grid'}){
 return <div className={'bi-product-list bi-products-'+format}>{items.map((p,i)=><Link className="bi-product" key={p.id} to={link(root,'item/'+p.id)}>
  <div className="bi-product-image"><Pic Photo={Photo} src={p.image} alt={'Photograph illustrating '+p.name}/>{p.size&&<span>{p.size}</span>}</div>
  <div className="bi-product-text"><small>{String(i+1).padStart(2,'0')} / {p.category}</small><h3>{p.name}</h3><p>{p.description}</p><div><strong>{money(p.price)}</strong><span>VIEW DETAILS</span></div></div>
 </Link>)}</div>
}
function SalonExplore({data,Photo,root}){
 const [category,setCategory]=useState('All')
 const items=data.items.filter(x=>category==='All'||x.category===category)
 return <main className="bi-inner bi-explore bi-salon-explore">
  <Trail root={root} data={data} crumb="The treatment menu"/>
  <section className="bi-salon-menu-hero"><div><Label>THE MAISON BEAUTÉ SERVICE BOOK</Label><h1>Made for<br/><em>your moment.</em></h1><p>A considered collection of hair, nail, lash, makeup and skin treatments. Choose the service that feels right and explore every detail before requesting an appointment.</p><Cta root={root} to="book">Request a session</Cta></div><Pic Photo={Photo} src={data.detail} alt="Detailed eyelash styling treatment"/></section>
  <section className="bi-salon-catalog"><div className="bi-section-top"><Label>01 / SERVICE MENU</Label><h2>All the beautiful<br/><em>little details.</em></h2><span>SELECT A CATEGORY TO FILTER</span></div><Categories data={data} category={category} onSelect={setCategory}/><ProductCards items={items} Photo={Photo} root={root} format="salon"/></section>
  <section className="bi-salon-process"><div><Label>02 / WHAT TO EXPECT</Label><h2>From the first hello<br/>to the final <em>look.</em></h2><p>Make choosing your next service just as pleasant as the appointment itself.</p></div><div>{data.principles.map(([name,description],i)=><article key={name}><span>0{i+1}</span><h3>{name}</h3><p>{description}</p></article>)}</div></section>
  <section className="bi-salon-room"><Pic Photo={Photo} src={data.setting} alt="Beauty salon lounge and treatment interior"/><div><Label>AN INVITATION</Label><h2>Your chair<br/>is waiting.</h2><p>Step into a place where the little details matter. Choose your services, share your preferred day and see what a thoughtful booking experience could look like.</p><Cta root={root} to="book">Explore booking</Cta></div></section>
  <PreviewNote/>
 </main>
}
function SkinExplore({data,Photo,root}){
 const [category,setCategory]=useState('All')
 const items=data.items.filter(p=>category==='All'||p.category===category)
 return <main className="bi-inner bi-explore bi-skin-explore">
  <Trail root={root} data={data} crumb="Shop skincare"/>
  <section className="bi-skin-hero"><div><Label>THE VÉRA SKIN ROUTINE DIRECTORY</Label><h1>THE GOOD<br/><span>SKIN EDIT.</span></h1><p>A thoughtful collection built around daily care. Find your cleanse, treatment, moisturising and body rituals without the guesswork.</p><Cta root={root} to="bag" light>View your sample bag</Cta></div><Pic Photo={Photo} src={data.hero} alt="Skincare editorial portrait and product ritual"/></section>
  <section className="bi-skin-shop"><div className="bi-section-top"><Label>01 / CHOOSE YOUR RITUAL</Label><h2>Less clutter.<br/><em>More clarity.</em></h2><p>Choose a collection and open a product for its texture, size and usage details.</p></div><Categories data={data} category={category} onSelect={setCategory}/><ProductCards items={items} Photo={Photo} root={root} format="skin"/></section>
  <section className="bi-skin-ritual"><div><Label>02 / THE EVERYDAY GUIDE</Label><h2>Just the<br/>essentials.</h2><div>{[['MORNING','Cleanse, moisturise, then use your usual sun protection.'],['EVENING','Cleanse and apply the products in your preferred routine.'],['EVERY DAY','Always use the directions and verified ingredient information supplied with the actual product.']].map(([label,desc])=><article key={label}><strong>{label}</strong><p>{desc}</p></article>)}</div><Cta root={root} to="explore">Return to the shop</Cta></div><Pic Photo={Photo} src={data.setting} alt="Beautifully arranged skincare bottles"/></section>
  <section className="bi-skin-collection-cta"><Pic Photo={Photo} src={data.detail} alt="Skincare serum bottle product close-up"/><div><Label>THE VÉRA PHILOSOPHY</Label><h2>A good routine<br/>feels like <em>you.</em></h2><p>A full merchant site can include ingredient disclosures, before-and-after guidance, how-to tutorials and bundles, using the real brand's verified information.</p><Cta root={root} to="about">Meet the brand</Cta></div></section><PreviewNote/>
 </main>
}
function DentalExplore({data,Photo,root}){
 const [category,setCategory]=useState('All')
 return <main className="bi-inner bi-explore bi-dental-explore">
 <Trail root={root} data={data} crumb="Dental care"/>
 <section className="bi-dental-hero"><div><Label>CARE / EXPERTISE / UNDERSTANDING</Label><h1>Everything begins<br/>with <em>good care.</em></h1><p>From preventive visits to specialist conversations, explore what each appointment involves before requesting a consultation.</p><Cta root={root} to="book" light>Request an assessment</Cta></div><Pic Photo={Photo} src={data.setting} alt="Modern dental treatment setting"/></section>
 <section className="bi-dental-services"><div className="bi-section-top"><Label>01 / DENTAL SERVICES</Label><h2>Clear choices.<br/>Thoughtful care.</h2></div><Categories data={data} category={category} onSelect={setCategory}/><ProductCards items={data.items.filter(x=>category==='All'||x.category===category)} Photo={Photo} root={root} format="dental"/></section>
 <section className="bi-dental-process"><Label>02 / YOUR PATIENT JOURNEY</Label><h2>Every detail<br/>explained.</h2><div>{data.principles.map(([title,body],i)=><article key={title}><b>0{i+1}</b><h3>{title}</h3><p>{body}</p></article>)}</div></section>
 <section className="bi-dental-callout"><Pic Photo={Photo} src={data.detail} alt="Dentist in treatment setting"/><div><Label>CARE BEGINS WITH A CONVERSATION</Label><h2>Feel informed.<br/>Feel at ease.</h2><p>Treatment and cost information on a real practice website should always be checked by the clinic. This sample makes the flow clear without promising individual outcomes.</p><Cta root={root} to="book" light>Explore consultation</Cta></div></section><PreviewNote/>
 </main>
}
function BotanicalExplore({data,Photo,root}){
 const [category,setCategory]=useState('All')
 return <main className="bi-inner bi-explore bi-botanical-explore">
  <Trail root={root} data={data} crumb="The collection"/>
  <section className="bi-botanical-hero"><Pic Photo={Photo} src={data.hero} alt="Botanical product and foliage still life"/><div><Label>YOUR EVERYDAY BOTANICALS</Label><h1>GOOD THINGS<br/><em>GROW HERE.</em></h1><p>Shower essentials, everyday creams, oils and considered sets. Find the good little things for your own routine.</p><Cta root={root} to="bag">Your sample bag</Cta></div></section>
  <section className="bi-botanical-shop"><div className="bi-section-top"><Label>01 / THE FOLIA EDIT</Label><h2>Rooted in<br/><em>the ritual.</em></h2><p>Choose a category or browse the full collection.</p></div><Categories data={data} category={category} onSelect={setCategory}/><ProductCards items={data.items.filter(x=>category==='All'||x.category===category)} Photo={Photo} root={root} format="botanical"/></section>
  <section className="bi-botanical-pair"><Pic Photo={Photo} src={data.setting} alt="Rich body-care jars and product texture"/><div><Label>02 / EVERYDAY GOODNESS</Label><h2>Your new<br/><em>favourite ritual.</em></h2><p>From wash day to your evening wind-down, each product has its own page, pricing and product information. Try combining multiple items in a sample bag.</p><Cta root={root} to="item/body-bundle">Explore the body ritual set</Cta></div></section>
  <section className="bi-botanical-process"><Label>03 / HOW TO SHOP</Label><div>{data.principles.map(([name,body],i)=><article key={name}><span>0{i+1}</span><h3>{name}</h3><p>{body}</p></article>)}</div></section><PreviewNote/>
 </main>
}
function Explore({variant,data,Photo,root}){return variant==='editorial'?<SalonExplore {...{data,Photo,root}}/>:variant==='catalogue'?<SkinExplore {...{data,Photo,root}}/>:variant==='minimal'?<DentalExplore {...{data,Photo,root}}/>:<BotanicalExplore {...{data,Photo,root}}/>}
function ProductDetail({variant,data,Photo,root,id,onAdd}){
 const item=data.items.find(p=>p.id===id)
 const [qty,setQty]=useState(1)
 if(!item)return <section className="bi-missing"><h1>We couldn't find this item.</h1><Cta root={root} to="explore">Browse the collection</Cta></section>
 const isShop=variant==='catalogue'||variant==='botanical'
 return <main className="bi-inner bi-detail">
  <Trail root={root} data={data} crumb={item.name}/>
  <section className="bi-detail-grid"><div className="bi-detail-visual"><Pic Photo={Photo} src={item.image} alt={'Editorial product or treatment photograph for '+item.name}/><span>{item.category} / THE EDIT</span></div><div className="bi-detail-content"><Label>{data.brand} / {item.category}</Label><h1>{item.name}</h1><p className="bi-detail-price">{money(item.price)}{variant==='minimal'&&<span> / example starting fee</span>}</p><p className="bi-detail-description">{item.description}</p>
  <div className="bi-detail-attributes">{item.size&&<div><span>SIZE</span><strong>{item.size}</strong></div>}{item.texture&&<div><span>TEXTURE</span><strong>{item.texture}</strong></div>}{item.length&&<div><span>APPOINTMENT GUIDE</span><strong>{item.length}</strong></div>}</div>
  {isShop?<><div className="bi-quantity"><span>QUANTITY</span><button type="button" aria-label="Decrease quantity" onClick={()=>setQty(Math.max(1,qty-1))}>−</button><output>{qty}</output><button type="button" aria-label="Increase quantity" onClick={()=>setQty(Math.min(20,qty+1))}>+</button></div><button className="bi-primary" onClick={()=>onAdd(item,qty)}>Add to sample bag</button><Cta root={root} to="bag">View bag and order summary</Cta></>:<Cta root={root} to={'book?service='+encodeURIComponent(id)}>Request this appointment</Cta>}
  <p className="bi-detail-sample">Sample {isShop?'product and price':'service description and starting price'}. Availability is not live.</p></div></section>
  <section className="bi-detail-below"><div><Label>01 / THE DETAILS</Label><h2>{isShop?'Considered from every angle.':'What is included.'}</h2><p>{item.ritual||'A helpful outline so clients can see what they are requesting before selecting a date and time.'}</p></div><div className="bi-detail-points">{(item.includes||[]).map((s,i)=><div key={s}><span>0{i+1}</span><strong>{s}</strong></div>)}</div></section>
  <section className="bi-detail-related"><div className="bi-section-top"><Label>02 / KEEP EXPLORING</Label><h2>Something else<br/><em>might suit you.</em></h2></div><ProductCards items={data.items.filter(p=>p.id!==id).slice(0,3)} root={root} Photo={Photo}/></section><PreviewNote/>
 </main>
}
function About({variant,data,Photo,root}){
 return <main className="bi-inner bi-about"><Trail root={root} data={data} crumb="Our story"/><section className="bi-about-hero"><div><Label>{data.brand} / OUR POINT OF VIEW</Label><h1>{data.storyTitle}</h1><p>{data.story}</p><Cta root={root} to="explore">{variant==='minimal'?'Explore patient care':variant==='editorial'?'See our treatments':'Explore the collection'}</Cta></div><Pic Photo={Photo} src={data.portrait} alt={'Editorial photograph showing '+data.label}/></section>
 <section className="bi-about-statement"><Label>THE DETAILS MATTER</Label><h2>{variant==='minimal'?'Care that takes time to listen.':variant==='botanical'?'A slower, softer way to care.':variant==='catalogue'?'Everyday rituals, considered.':'Every look begins with a feeling.'}</h2><p>This example shows how a real brand can tell its story through original photography, verified team details, useful product information and a clear customer journey.</p></section>
 <section className="bi-about-gallery"><Pic Photo={Photo} src={data.setting} alt={'Location or products for '+data.brand}/><Pic Photo={Photo} src={data.detail} alt="Close-up of service or product details"/><Pic Photo={Photo} src={data.hero} alt="Campaign editorial imagery"/></section>
 <section className="bi-about-values"><div><Label>OUR APPROACH / 01—03</Label><h2>Every step,<br/><em>with intention.</em></h2></div><div>{data.principles.map(([name,description],i)=><article key={name}><span>0{i+1}</span><h3>{name}</h3><p>{description}</p></article>)}</div></section>
 <section className="bi-endcta"><Label>THE NEXT CHAPTER</Label><h2>{variant==='minimal'?'Let’s begin with a conversation.':variant==='botanical'?'Find your everyday favourites.':'Your next favourite starts here.'}</h2><Cta root={root} to={variant==='minimal'||variant==='editorial'?'book':'explore'}>Explore the experience</Cta></section><PreviewNote/>
 </main>
}
function Enquiry({variant,data,Photo,root,book=false}){
 const location=useLocation(),query=new URLSearchParams(location.search)
 const selected=query.get('service')||''
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[phone,setPhone]=useState('')
 const [service,setService]=useState(selected),[day,setDay]=useState(''),[time,setTime]=useState(''),[message,setMessage]=useState(''),[done,setDone]=useState(false)
 const title=book?(variant==='minimal'?'Your consultation begins here.':variant==='editorial'?'Make time for your moment.':'Tell us what your skin needs.'):'We would love to hear from you.'
 const today=new Date().toISOString().slice(0,10)
 return <main className={'bi-inner bi-enquiry '+(book?'bi-book':'bi-contact')}><Trail root={root} data={data} crumb={book?'Request an appointment':'Get in touch'}/>
 <section className="bi-enquiry-layout"><div className="bi-enquiry-aside"><Label>{data.brand} / {book?'BOOKING PREVIEW':'CONTACT THE STUDIO'}</Label><h1>{title}</h1><p>{book?'Choose a service and your preferred time to see the booking experience. This preview does not hold actual availability.':'Whether it is a simple question or something more specific, a dedicated contact form makes it easier for customers to reach the right person.'}</p><Pic Photo={Photo} src={book?data.detail:data.setting} alt={book?'Service booking inspiration':'Studio or collection atmosphere'}/><div className="bi-enquiry-facts"><span>NO LIVE APPOINTMENTS</span><span>NO REAL MESSAGES SENT</span><span>DEMONSTRATION ONLY</span></div></div>
 <div className="bi-enquiry-form">{done?<div className="bi-complete" role="status"><Label>PREVIEW SUBMITTED</Label><h2>Your {book?'booking':'enquiry'} example is complete.</h2><p>Thanks, {name}. In a finished client website, this is where the business would receive your details and send a confirmation. This demo has not sent anything or reserved a time.</p>{book&&<p><strong>Requested:</strong> {data.items.find(x=>x.id===service)?.name||'General consultation'}{day?' on '+day:''}{time?' at '+time:''}.</p>}<button type="button" className="bi-primary" onClick={()=>setDone(false)}>Edit your details</button><Cta root={root} to="explore">Explore more</Cta></div>:
 <form onSubmit={e=>{e.preventDefault();setDone(true)}}><Label>YOUR DETAILS</Label><h2>{book?'Request a time.':'Send a message.'}</h2><div className="bi-form-two"><label>FULL NAME<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Your full name" required/></label><label>EMAIL ADDRESS<input value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" type="email" placeholder="you@example.com" required/></label></div><label>PHONE / WHATSAPP<input value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="Your contact number" required/></label>
 {book&&<><label>{variant==='minimal'?'APPOINTMENT TYPE':'PREFERRED SERVICE'}<select value={service} onChange={e=>setService(e.target.value)} required><option value="">Choose an option</option>{data.items.map(p=><option key={p.id} value={p.id}>{p.name} ({money(p.price)} sample)</option>)}</select></label><div className="bi-form-two"><label>PREFERRED DATE<input type="date" value={day} min={today} required onChange={e=>setDay(e.target.value)}/></label><label>PREFERRED TIME<select value={time} onChange={e=>setTime(e.target.value)} required><option value="">Select a time</option>{['09:00','10:30','12:00','13:30','15:00','16:30'].map(t=><option key={t} value={t}>{t}</option>)}</select></label></div></>}
 <label>{book?'NOTES / SPECIAL REQUESTS':'YOUR MESSAGE'}<textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5} placeholder={book?'Tell us what you would like us to know.':'How can we help?'} required={!book}/></label>
 <button type="submit" className="bi-primary">{book?'Preview booking request':'Preview enquiry'}</button><p className="bi-privacy">No data is transmitted or saved. This form illustrates what clients could complete on their own website.</p></form>}</div></section>
 <section className="bi-contact-extra"><Label>BEYOND THE FORM</Label><h2>Good questions deserve<br/><em>clear answers.</em></h2><div>{data.faqs.slice(0,2).map(([q,a])=><article key={q}><h3>{q}</h3><p>{a}</p></article>)}</div><Cta root={root} to="faq">Read all questions</Cta></section>
 </main>
}
function Questions({data,root}){
 const [open,setOpen]=useState(0)
 return <main className="bi-inner bi-questions"><Trail root={root} data={data} crumb="Questions"/><div className="bi-faq-layout"><div><Label>HELP / THE DETAILS</Label><h1>Good questions.<br/><em>Clear answers.</em></h1><p>Explore how the sample site works. Real service policies, product details and order information would be supplied by the merchant.</p><Cta root={root} to="contact">Contact the studio</Cta></div><div className="bi-faq-accordions">{data.faqs.map(([q,a],i)=><section key={q}><button type="button" aria-expanded={open===i} onClick={()=>setOpen(open===i?-1:i)}><span>{q}</span><b>{open===i?'−':'+'}</b></button>{open===i&&<p>{a}</p>}</section>)}</div></div><PreviewNote/></main>
}
function Bag({data,Photo,root,cart,onQty,onRemove}){
 const total=cart.reduce((n,p)=>n+p.price*p.quantity,0)
 const txt='WEBSITE DEMO ORDER ONLY\n'+cart.map(p=>p.quantity+' × '+p.name+' — '+money(p.price*p.quantity)).join('\n')+'\nEstimated total: '+money(total)+'\nThis is a sample, not a real purchase.'
 const [copied,setCopied]=useState(false)
 return <main className="bi-inner bi-bag"><Trail root={root} data={data} crumb="Sample bag"/><section className="bi-bag-head"><div><Label>{data.brand} / ORDER PREVIEW</Label><h1>Beautiful things,<br/><em>together.</em></h1><p>See how a multi-item order can be reviewed before a customer contacts the business.</p></div><Cta root={root} to="explore">Continue exploring</Cta></section><div className="bi-bag-layout"><div className="bi-bag-lines">{cart.length?cart.map(p=><article key={p.id}><Pic Photo={Photo} src={p.image} alt={p.name+' product photograph'}/><div><span>{p.category}</span><h3>{p.name}</h3><p>{money(p.price)} each</p><div className="bi-bag-quantity"><button aria-label={'Remove one '+p.name} onClick={()=>onQty(p.id,-1)}>−</button><span>{p.quantity}</span><button aria-label={'Add one '+p.name} onClick={()=>onQty(p.id,1)}>+</button><button className="bi-remove" onClick={()=>onRemove(p.id)}>Remove</button></div></div><strong>{money(p.price*p.quantity)}</strong></article>):<div className="bi-bag-empty"><h2>Your bag is taking a little break.</h2><p>Choose a few products to see how this sample checkout works.</p><Cta root={root} to="explore">Explore the collection</Cta></div>}</div><aside className="bi-bag-summary"><Label>YOUR SAMPLE ORDER</Label><h2>{money(total)}</h2><p>{cart.reduce((n,p)=>n+p.quantity,0)} item(s) in your bag</p><div><span>Subtotal</span><strong>{money(total)}</strong></div><div><span>Delivery</span><span>Confirmed by the actual merchant</span></div><label>ORDER MESSAGE PREVIEW<textarea readOnly rows={Math.max(4,cart.length+3)} value={cart.length?txt:'Add products to preview your combined order.'}/></label><button type="button" className="bi-primary" disabled={!cart.length} onClick={async()=>{try{await navigator.clipboard.writeText(txt);setCopied(true)}catch{setCopied(false)}}}>{copied?'Order message copied':'Copy sample order message'}</button><p className="bi-privacy">No payment is taken. No WhatsApp message is sent automatically.</p></aside></div></main>
}
export function BeautyHomeExtras({variant,Photo}){
 const data=beautyCollections[variant],root='/beauty'+variant
 return <section className={'bi-home-extras bi-extra-'+variant}><div className="bi-extra-heading"><Label>MORE THAN THE HOMEPAGE / 2026</Label><h2>{variant==='editorial'?'Every appointment has a story.':variant==='catalogue'?'Get to know your routine.':variant==='minimal'?'Care, clearly explained.':'The ritual continues.'}</h2><p>Discover the services, stories, product details and interactions behind this website sample.</p></div><div className="bi-extra-options">{[['explore',variant==='minimal'?'Explore dental care':variant==='editorial'?'The full service menu':'Shop the collection',data.setting],['about','Our story',data.portrait],['faq','Your questions answered',data.detail]].map(([path,title,img])=><Link key={path} to={link(root,path)}><Pic Photo={Photo} src={img} alt={title+' editorial image'}/><span>{title}</span></Link>)}</div></section>
}
export default function BeautyInnerPages({variant,root,Photo}){
 const data=beautyCollections[variant],location=useLocation()
 const [section,id]=location.pathname.slice(root.length).replace(/^\/+/,'').split('/')
 const [cart,setCart]=useState(()=>{
  try{return typeof window==='undefined'?[]:JSON.parse(window.sessionStorage.getItem('qing-beauty-'+variant+'-bag')||'[]')}
  catch{return []}
 })
 const [announcement,setAnnouncement]=useState('')
 useEffect(()=>{try{window.sessionStorage.setItem('qing-beauty-'+variant+'-bag',JSON.stringify(cart))}catch{}},[cart,variant])
 useEffect(()=>{document.title=(section==='item'?(data.items.find(x=>x.id===id)?.name||'Product'):section?.charAt(0).toUpperCase()+section?.slice(1))+' | '+data.brand+' | Website Preview'},[section,id,variant,data])
 const add=(p,quantity)=>{setCart(items=>{const old=items.find(x=>x.id===p.id);return old?items.map(x=>x.id===p.id?{...x,quantity:Math.min(50,x.quantity+quantity)}:x):[...items.filter(Boolean),{...p,quantity}]});setAnnouncement(p.name+' added to your sample bag.');}
 const qty=(id,d)=>setCart(items=>items.map(p=>p.id===id?{...p,quantity:p.quantity+d}:p).filter(x=>x.quantity>0))
 const remove=id=>setCart(items=>items.filter(p=>p.id!==id))
 return <div className={'bi-wrapper bi-'+variant}>
  {announcement&&<div className="bi-toast" role="status">{announcement} <Link to={link(root,'bag')}>View sample bag</Link><button aria-label="Close notification" onClick={()=>setAnnouncement('')}>×</button></div>}
  {section==='explore'?<Explore {...{variant,data,Photo,root}}/>
   :section==='item'?<ProductDetail {...{variant,data,Photo,root,id,onAdd:add}}/>
   :section==='about'?<About {...{variant,data,Photo,root}}/>
   :section==='contact'?<Enquiry {...{variant,data,Photo,root}}/>
   :section==='book'?<Enquiry {...{variant,data,Photo,root}} book/>
   :section==='faq'?<Questions {...{data,root}}/>
   :section==='bag'?<Bag {...{data,Photo,root,cart,onQty:qty,onRemove:remove}}/>
   :<main className="bi-inner bi-missing"><h1>That page isn't part of this collection yet.</h1><Cta root={root} to="explore">Explore the collection</Cta></main>}
 </div>
}
