import {useEffect,useState} from 'react'
import {Link,useLocation} from 'react-router-dom'
import IndustryStorefront from './IndustryStorefront.jsx'
import {storeData,money} from './industryStoreData.js'
import './BeautyReferenceStorefront.css'
import './BeautyReferenceFidelity.css'

const p=(id,w=1400)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+w+'&q=84'
const px=(id,w=1200)=>'https://images.pexels.com/photos/'+id+'/pexels-photo-'+id+'.jpeg?auto=compress&cs=tinysrgb&w='+w
// Hand-selected free-use photo subjects that match the original page compositions.
const images={
 salonHero:p('photo-1740389702808-b63f49277fcc',1600),
 salonSecond:p('photo-1524504388940-b1c1722653e1',1000),
 salonRoom:px(7750090,1500),
 nails:px(8377206,950),lashes:px(5128234,950),
 brows:p('photo-1534528741775-53994a69daeb',950),
 makeup:p('photo-1740389702808-b63f49277fcc',1050),
 skin:px(6925483,1050),hair:p('photo-1595476108010-b4d1f102b1b1',1050),
 team1:px(5128118,1000),team2:px(26616192,1000),team3:px(33867522,1000),
 serumHero:px(6925487,1800),dropper:px(7795661,1100),product:px(7038150,1100),cream:px(7797010,1100),
 botanics:px(7038185,1600),botanicsAlt:px(7797010,1300),botanicsTwo:px(7795661,950),
 darkSmile:px(20744304,1800),dentalImplant:px(7788499,1000),dentalModel:px(33748060,1000),dentalCosmetic:px(33748059,1000),darkTeam:px(19976577,1200),treatment:px(3845689,1500),detail:px(6812444,1200),
}
const serviceItems=storeData.beauty.items
const to=(variant,segment='')=>'/beauty'+variant+(segment?'/'+segment:'')
function Photo({src,alt,className='',...props}){
 const [err,setErr]=useState(false)
 return err?<div role="img" aria-label={alt} className={'br-image-fallback '+className}>THE BEAUTY EDIT</div>:
 <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={()=>setErr(true)} {...props}/>
}
function Head({variant,brand,dark=false}){
 const [open,setOpen]=useState(false)
 return <header className={'br-head'+(dark?' br-head-dark':'')}>
  <Link to={to(variant)} className="br-wordmark">{brand}</Link>
  <nav className={open?'br-open':''} aria-label="Beauty demo navigation">
    <Link to={to(variant)}>Home</Link><Link to={to(variant,'explore')}>{variant==='botanical'?'Shop the collection':variant==='minimal'?'Dental treatments':'Services & treatments'}</Link><Link to={to(variant,'about')}>Our story</Link><Link to={to(variant,'contact')}>Contact</Link>
  </nav>
  <Link to={to(variant,variant==='botanical'?'explore':'book')} className="br-head-book">{variant==='botanical'?'Shop now':variant==='minimal'?'Book consultation':'Book a session'} </Link>
  <button className="br-menu" aria-label="Toggle navigation" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?'Close':'Menu'}</button>
 </header>
}
function Foot({variant,brand}){
 return <footer className="br-footer">
  <div><span>GOOD BEAUTY, GOOD PEOPLE.</span><h2>{brand}</h2><p>{variant==='botanical'?'Your everyday essentials, considered from beginning to end.':variant==='minimal'?'A different kind of dental experience, designed around you.':'Your next favourite beauty moment starts here.'}</p></div>
  <div><Link to={to(variant,'explore')}>{variant==='botanical'?'Shop collection':'Explore services'}</Link><Link to={to(variant,variant==='botanical'?'explore':'book')}>{variant==='botanical'?'View the edit':variant==='minimal'?'Book consultation':'Book a session'}</Link><Link to={to(variant,'contact')}>Contact us</Link></div>
  <small>Design sample by Qing The Creator. Photography, prices and availability are illustrative.</small>
 </footer>
}
function Action({variant,children,section='book',className=''}){return <Link className={'br-action '+className} to={to(variant,section)}>{children}</Link>}
function StudioEditorial(){
 const v='editorial'
 const reasons=[['01','Considered service','A calm, personal experience from start to finish.'],['02','Beautiful details','Every look is planned around your features.'],['03','Hygienic care','Professional products and thoughtful routines.'],['04','Expert attention','The right questions before every treatment.'],['05','Feeling at ease','An atmosphere made for you.'],['06','Your kind of beauty','Looks with real personality.']]
 const services=[['Nails',images.nails,'sculpted-nails'],['Lashes',images.lashes,'lash-lift'],['Brows',images.brows,'soft-glam']]
 const results=[images.nails,images.brows,images.makeup,images.skin,images.hair]
 return <div className="br-site br-salon">
  <Head variant={v} brand="MAISON BEAUTÉ"/>
  <section className="br-salon-hero">
   <div className="br-salon-hero-main"><div className="br-salon-title"><span>THE BEAUTY HOUSE / EST. 2026</span><h1>BEAUTY<br/>IS PERSONAL.<br/><em>It's your moment.</em></h1><p>A little luxury, a lot of attention. Lashes, nails, brows and beautifully considered care.</p><Action variant={v}>Book your beauty moment</Action></div>
   <Photo src={images.salonHero} alt="Elegant portrait for salon hero"/><Photo className="br-salon-face-two" src={images.salonSecond} alt="Second beauty campaign portrait"/><span className="br-salon-heronote">THE ART OF FEELING LIKE YOURSELF</span></div>
  </section>
  <section className="br-salon-services"><div className="br-section-line"><span>OUR SERVICES / 01</span><h2>EVERYTHING YOU NEED FOR <em>complete beauty</em></h2><div><p>From lashes to nails and brows, find a service that feels entirely yours.</p><Action variant={v} section="explore">View all services</Action></div></div>
   <div className="br-salon-service-cards">{services.map(([name,img,id],i)=><Link to={to(v,'item/'+id)} key={name}><Photo src={img} alt={name+' beauty treatment photograph'}/><span>0{i+1}</span><div><h3>{name}</h3><small>Small details, beautifully done.</small></div></Link>)}</div></section>
  <section className="br-salon-about"><div className="br-salon-about-copy"><span className="br-mini-label">ABOUT THE STUDIO / 02</span><h2>MORE THAN<br/>A BEAUTY<br/><em>salon.</em></h2><div className="br-salon-reasons">{reasons.map(([n,title,desc])=><div key={n}><span>{n}</span><strong>{title}</strong><small>{desc}</small></div>)}</div><p>Every visit is designed to leave you feeling confident, cared for, and entirely yourself.</p></div>
   <div className="br-salon-interior"><Photo src={images.salonRoom} alt="Calm beauty studio interior"/><span>THE MAISON BEAUTÉ EXPERIENCE</span></div></section>
  <section className="br-salon-results"><div className="br-section-line"><span>OUR PORTFOLIO / 03</span><h2>OUR WORK, <em>real results.</em></h2><div><p>Different treatments, different faces. One beautifully considered approach.</p><Action variant={v} section="explore">Explore our work</Action></div></div><div className="br-salon-mosaic">{results.map((img,i)=><div key={img+i}><Photo src={img} alt={'Portfolio beauty detail '+(i+1)}/>{[0,3].includes(i)&&<small>{i===0?'A LITTLE EXTRA CARE':'THE DETAILS MAKE THE DIFFERENCE'}</small>}</div>)}</div></section>
  <section className="br-salon-team"><div className="br-section-line"><span>THE PEOPLE / 04</span><h2>MEET OUR <em>team.</em></h2><div><p>Our studio is built on attention, artistry and a love of the little details.</p><Action variant={v} section="about">Meet the studio</Action></div></div><div className="br-salon-teamgrid">{[['Brow specialist',images.team1],['Beauty artist',images.team2],['Hair specialist',images.team3]].map(([role,img])=><article key={role}><Photo src={img} alt={'Illustrative portrait for '+role}/><span>{role}<small>MEET THE ARTIST</small></span></article>)}</div></section>
  <Foot variant={v} brand="MAISON BEAUTÉ"/>
 </div>
}
const botanicsProducts=[
 {name:'Daily Dew Cleanser',desc:'A softly refreshing morning ritual.',price:17500,img:images.botanicsTwo},
 {name:'The Hydration Ritual',desc:'A moisture-loving skin essential.',price:24000,img:images.product},
 {name:'Barrier Comfort Cream',desc:'Gentle everyday comfort.',price:19500,img:images.dropper},
 {name:'Botanical Body Oil',desc:'A nourishing little moment.',price:22000,img:images.cream},
]
function OliveSkin(){
 const v='catalogue'
 const [chosen,setChosen]=useState(0)
 return <div className="br-site br-olive">
  <Head variant={v} brand="VÉRA SKIN" dark/>
  <section className="br-olive-hero"><Photo src={images.serumHero} alt="Luminous natural skincare editorial portrait"/><div className="br-olive-overlay"><small>SKINCARE, MORE INTENTIONALLY.</small><h1>GLOW<br/><em>BETTER.</em></h1><p>Healthy-looking skin. A little more confidence. A ritual that feels like yours.</p><Action variant={v} section="explore">Explore skin rituals</Action><div className="br-olive-trust"><span>Thoughtful care</span><span>Made for your routine</span><span>Feel-good formulas</span></div></div>
   <div className="br-olive-product-float"><Photo src={images.dropper} alt="Featured botanical serum bottle"/><div><small>THE DAILY RITUAL</small><strong>Everyday Glow</strong><Link to={to(v,'explore')}>EXPLORE COLLECTION</Link></div></div>
   <div className="br-olive-counter"><strong>01 / 03</strong><span>THE SKIN STORY</span></div></section>
  <section className="br-olive-experts"><div className="br-olive-expert-top"><div><strong>01</strong><span>YOUR ROUTINE, YOUR WAY</span></div><div><span>BEAUTY THAT GOES BEYOND THE SURFACE.</span><p>Care that makes space for real skin and real life.</p></div></div><div className="br-olive-expert-grid"><div><span>THE PEOPLE BEHIND THE RITUALS</span><h2>Skilled<br/>Skin<br/><em>Experts.</em></h2></div><div className="br-olive-expert-photo"><Photo src={images.skin} alt="Natural skincare face treatment"/><span>DESIGNED TO FEEL GOOD</span></div><div><span>SKIN, AT YOUR PACE.</span><h3>Results-<br/>Driven.</h3><p>Choose what your skin is asking for, and make room for the little moments.</p><Action variant={v} section="explore">View treatments</Action></div></div></section>
  <section className="br-olive-products"><div className="br-olive-heading"><span>02 / YOUR DAILY EDIT</span><h2>Take a tour of<br/><em>your skincare routine.</em></h2><p>Explore the sample collection. Finished client sites use real products, photographs and pricing.</p></div><div className="br-olive-products-grid">{botanicsProducts.slice(0,3).map((item,i)=><button type="button" key={item.name} className={chosen===i?'selected':''} onClick={()=>setChosen(i)}><Photo src={item.img} alt={item.name+' product photograph'}/><span>0{i+1} / THE DAILY EDIT</span><strong>{item.name}</strong><small>{money(item.price)} · DEMO</small></button>)}</div><div className="br-olive-collection-note"><span>SELECTED / {botanicsProducts[chosen].name.toUpperCase()}</span><p>{botanicsProducts[chosen].desc}</p><Action variant={v} section="explore">Discover the full collection</Action></div></section>
  <section className="br-olive-final"><Photo src={images.botanics} alt="Editorial beauty skincare product photography"/><div><span>LET YOUR SKIN SET THE PACE</span><h2>Feel comfortable.<br/><em>Look luminous.</em></h2><Action variant={v} section="book">Explore a skin session</Action></div></section>
  <Foot variant={v} brand="VÉRA SKIN"/>
 </div>
}
function DarkLuxury(){
 const v='minimal'
 const offerings=[['DENTAL IMPLANTS',images.dentalImplant],['ORTHODONTICS',images.dentalModel],['COSMETIC DENTISTRY',images.dentalCosmetic]]
 return <div className="br-site br-dark">
  <Head variant={v} brand="AURA DENTAL" dark/>
  <section className="br-dark-hero"><Photo src={images.darkSmile} alt="Woman smiling naturally with healthy teeth"/><div className="br-dark-shade"><span>THE AURA DENTAL STUDIO / CONFIDENCE, CONSIDERED</span><h1>Crafting<br/>Naturally<br/><em>Confident Smiles.</em></h1><p>Dental care inspired by people, shaped with precision, and designed around you.</p><Action variant={v} section="contact">Book a consultation</Action><div className="br-dark-highlights"><span>CONSIDERED CARE</span><span>PERSONALISED TREATMENTS</span><span>PRECISION IN THE DETAILS</span></div></div><div className="br-dark-float"><Photo src={images.darkTeam} alt="Professional in a dental treatment clinic"/><div><strong>MEET THE DENTAL TEAM</strong><span>PERSONAL CARE / YOUR COMFORT</span></div></div></section>
  <section className="br-dark-reasons"><div><span>CRAFTED WITH PRECISION</span><h2>Why patients<br/>choose<br/><em>LumiDent?</em></h2><p>A calm, comfortable setting for a more personal dental experience.</p></div><Photo src={images.detail} alt="Professional dental chair and treatment equipment"/><div className="br-dark-reasons-list">{[['Experienced professionals','Thoughtful attention, from consultation to aftercare.'],['A considered setting','A welcoming space, with comfort built into the visit.'],['Personalised plans','Treatment options explained clearly and with care.']].map(([a,b])=><div key={a}><strong>{a}</strong><p>{b}</p></div>)}<Action variant={v} section="contact">Meet the team</Action></div></section>
  <section className="br-dark-services"><div><span>OUR SPECIALTIES / THE DENTAL EDIT</span><h2>Comprehensive<br/><em>Dental Care.</em></h2><Action variant={v} section="contact">View services</Action></div><div className="br-dark-tiles">{offerings.map(([name,img])=><Link to={to(v,'contact')} key={name}><Photo src={img} alt={name+' sample service photograph'}/><div><strong>{name}</strong><span>Ask about this treatment </span></div></Link>)}</div></section>
  <section className="br-dark-fullbleed"><Photo src={images.treatment} alt="Patient during dental consultation"/><div><span>THE ART OF CARE</span><h2>Every Smile<br/><em>Begins With Trust.</em></h2><p>Your consultation is a conversation. We take time to listen, explain and find the next step with you.</p><Action variant={v} section="contact">Book a consultation</Action></div></section>
  <Foot variant={v} brand="AURA DENTAL"/>
 </div>
}
function BotanicalStore(){
 const v='botanical'
 const [selected,setSelected]=useState(0)
 const current=botanicsProducts[selected]
 return <div className="br-site br-botanical">
  <div className="br-botanical-shipping">A LITTLE EXTRA CARE / YOUR EVERYDAY ROUTINE</div>
  <Head variant={v} brand="FOLIA BOTANICS"/>
  <section className="br-botanical-hero"><div className="br-botanical-photo"><Photo src={images.botanics} alt="Botanical skincare bottles and greenery"/><span>THE BOTANICAL COLLECTION / 2026</span></div><div className="br-botanical-hero-note"><small>THE DECEMBER SKIN EDIT</small><h1>A softer<br/><em>kind of glow.</em></h1><p>Gentle rituals, thoughtful ingredients, and everyday care that feels good.</p><Action variant={v} section="explore">Explore collection</Action></div></section>
  <div className="br-botanical-ticker"><span>SKIN, SIMPLIFIED / THE DAILY RITUAL / NOURISH YOUR GLOW / SKIN, SIMPLIFIED / THE DAILY RITUAL / NOURISH YOUR GLOW</span></div>
  <section className="br-botanical-collection"><span>01 / CURATED FOR YOUR DAILY ROUTINE</span><h2>The featured <em>collection.</em></h2><div className="br-botanical-arches">{botanicsProducts.slice(0,3).map((item,i)=><button key={item.name} type="button" className={selected===i?'selected':''} onClick={()=>setSelected(i)}><div><Photo src={item.img} alt={'Botanical product '+item.name}/><span>{['DAILY CLEANSE','SKIN ESSENTIAL','SOFT MOISTURE'][i]}</span></div><strong>{item.name}</strong><small>VIEW PRODUCT</small></button>)}</div></section>
  <section className="br-botanical-feature"><div><Photo src={current.img} alt={'Selected botanical product '+current.name}/></div><div><span>YOUR NEW FAVOURITE / 02</span><h2>Meet your<br/><em>daily ritual.</em></h2><h3>{current.name}</h3><p>{current.desc} Sample collection, ready to be replaced with your own products and photos.</p><Action variant={v} section="explore">Shop your edit</Action></div></section>
  <div className="br-botanical-labels"><span>THE BOTANICAL EDIT</span><span>THOUGHTFUL CARE</span><span>THE EVERYDAY RITUAL</span><span>FOLIA / 2026</span></div>
  <section className="br-botanical-explore"><div><span>03 / YOUR BEAUTY ROUTINE</span><h2>Good skin days,<br/><em>your way.</em></h2></div><div>{botanicsProducts.slice(1).map((item,i)=><button key={item.name} type="button" onClick={()=>setSelected(i+1)}><Photo src={item.img} alt={item.name+' botanical product'}/><span>DISCOVER 0{i+1}</span><strong>{item.name}</strong></button>)}</div></section>
  <Foot variant={v} brand="FOLIA BOTANICS"/>
 </div>
}
export default function BeautyReferenceStorefront({variant='editorial'}){
 const location=useLocation()
 const pathname=location.pathname.replace(/\/+$/,'')
 const root=to(variant)
 useEffect(()=>{
  const labels={editorial:'Maison Beauté | Salon Design',catalogue:'Véra Skin | Skincare Design',minimal:'Aura Dental | Dental Studio Design',botanical:'Folia Botanics | Botanical Store Design'}
  document.title=(labels[variant]||labels.editorial)+' | December Website Preview'
 },[variant])
 if(pathname!==root){
   return <IndustryStorefront industry="beauty" style={variant==='botanical'?'catalogue':variant} rootOverride={root}/>
 }
 const pages={editorial:StudioEditorial,catalogue:OliveSkin,minimal:DarkLuxury,botanical:BotanicalStore}
 const Page=pages[variant]||StudioEditorial
 return <Page/>
}
