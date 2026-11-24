import {useEffect,useMemo,useState} from 'react'
import {Link,useLocation,useNavigate} from 'react-router-dom'
import {money} from './industryStoreData.js'
import './stayReference.css'

const to=(ctx,part='')=>ctx.root+(part?'/'+part:'')
function Photo({src,alt='',className='',loading='lazy'}){
 const [broken,setBroken]=useState(false)
 useEffect(()=>setBroken(false),[src])
 return <img className={className} loading={loading} decoding="async" alt={alt} src={broken?'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80':src} onError={()=>setBroken(true)}/>
}
function Ico({kind,size=20}){
 const paths={
  arrow:'M4 12h16m-7-7 7 7-7 7',
  left:'M20 12H4m7-7-7 7 7 7',
  up:'M5 19 19 5M7 5h12v12',
  search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  heart:'M12 21 4 13C-2 7 7-1 12 5 17-1 26 7 20 13Z',
  home:'M3 11 12 4l9 7v10H3V11ZM9 21v-7h6v7',
  pin:'M12 22s8-7.2 8-13a8 8 0 0 0-16 0c0 5.8 8 13 8 13ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  calendar:'M3 6h18v15H3V6ZM7 3v6M17 3v6M3 11h18',
  people:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  grid:'M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8',
  menu:'M3 6h18M3 12h18M3 18h18',
  close:'M5 5l14 14M19 5 5 19',
  globe:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2c-5 5-5 15 0 20M12 2c5 5 5 15 0 20',
  sun:'M12 4V2M12 22v-2M4 12H2m20 0h-2M5 5 4 4m16 16-1-1M19 5l1-1M4 20l1-1M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10',
  moon:'M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z',
  check:'m4 12 5 5L20 6',
  compass:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9 15l2-6 6-2-2 6-6 2',
  message:'M3 4h18v14H8l-5 3V4Zm4 5h10M7 13h7',
  leaf:'M21 3c-11 0-17 3-17 12a6 6 0 0 0 6 6c9 0 12-6 11-18ZM5 20c4-6 7-9 12-12',
  chevron:'m9 5 7 7-7 7',
  star:'m12 2 2.8 6.7 7.2.7-5.5 4.7 1.7 7-6.2-3.6-6.2 3.6 1.7-7-5.5-4.7 7.2-.7L12 2',
  building:'M4 21V6l8-4 8 4v15M8 9v2m8-2v2M8 15v2m8-2v2M3 21h18'
 }
 return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={paths[kind]||paths.arrow}/></svg>
}
const nav={
 editorial:[['Properties','search'],['Locations','explore'],['Our story','about'],['Contact','contact']],
 catalogue:[['Quiz','faq'],['Retreats','explore?category=Retreats'],['Packages','explore'],['Coaches','about'],['Resources','faq'],['Contact us','contact']],
 adventure:[['Home',''],['Destinations','search'],['Tours','explore'],['Experiences','explore?category=Experiences'],['Contact','contact']],
 minimal:[['Home',''],['Properties','explore'],['Locations','search'],['Community','about'],['Contact','contact']],
 architect:[['About Us','about'],['Our Services','explore'],['Portfolio','explore'],['Process','faq'],['Contacts','contact']]
}
export function StayHeader({ctx,shop}){
 const [open,setOpen]=useState(false)
 const location=useLocation()
 return <header className={'st-header st-header-'+ctx.style} id="ix-top">
  <Link className="st-logo" to={ctx.root}>{ctx.brand.name}{ctx.style==='catalogue'&&<small>CURATED JOURNEYS</small>}</Link>
  <nav className={open?'st-open':''} aria-label="Main navigation">{nav[ctx.style].map(([label,target])=><Link key={label} to={to(ctx,target)} className={location.pathname===to(ctx,target)?'st-current':''} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>
  <div className="st-head-actions">
   <Link to={to(ctx,'saved')} aria-label={'View saved favourites, '+shop.saved.length+' saved'} className="st-head-icon"><Ico kind="heart" size={18}/>{shop.saved.length>0&&<sup>{shop.saved.length}</sup>}</Link>
   <Link to={to(ctx,'search')} className="st-head-book">{ctx.style==='architect'?'Enquire now':ctx.style==='catalogue'?'Explore trips':ctx.style==='minimal'?'Explore villas':'Find your stay'}</Link>
   <button className="st-menu" type="button" aria-label="Open website navigation" aria-expanded={open} onClick={()=>setOpen(!open)}><Ico kind={open?'close':'menu'} size={23}/></button>
  </div>
 </header>
}
function Search({ctx,variant='default',label='Explore',compact=false}){
 const navigate=useNavigate()
 const [category,setCategory]=useState('All')
 const [area,setArea]=useState('All destinations')
 const [guests,setGuests]=useState('2')
 const [checkin,setCheckin]=useState('')
 const [checkout,setCheckout]=useState('')
 const areas=useMemo(()=>[...new Set(ctx.store.items.map(x=>x.area))],[ctx.store.items])
 const min=new Date().toISOString().slice(0,10)
 const go=e=>{
  e.preventDefault()
  const params=new URLSearchParams()
  if(category!=='All')params.set('category',category)
  if(area!=='All destinations')params.set('area',area)
  params.set('guests',guests)
  if(checkin)params.set('checkin',checkin)
  if(checkout)params.set('checkout',checkout)
  navigate(to(ctx,'search')+'?'+params.toString())
 }
 return <form className={'st-search st-search-'+variant+(compact?' st-search-compact':'')} onSubmit={go}>
  <label><span><Ico kind="grid" size={14}/> TYPE</span><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Select property or experience type">{ctx.store.categories.map(x=><option key={x} value={x}>{x==='All'?'Any type':x}</option>)}</select></label>
  <label><span><Ico kind="pin" size={14}/> WHERE</span><select value={area} onChange={e=>setArea(e.target.value)} aria-label="Choose a destination"><option>All destinations</option>{areas.map(x=><option key={x}>{x}</option>)}</select></label>
  <label><span><Ico kind="people" size={14}/> GUESTS</span><select value={guests} onChange={e=>setGuests(e.target.value)} aria-label="Number of guests">{[1,2,3,4,5,6,8].map(n=><option key={n} value={n}>{n} guests</option>)}</select></label>
  <label className="st-date"><span><Ico kind="calendar" size={14}/> CHECK-IN</span><input type="date" aria-label="Preferred check-in date" min={min} max={checkout||undefined} value={checkin} onChange={e=>setCheckin(e.target.value)}/></label>
  {!compact&&<label className="st-date"><span><Ico kind="calendar" size={14}/> CHECK-OUT</span><input type="date" aria-label="Preferred check-out date" min={checkin||min} value={checkout} onChange={e=>setCheckout(e.target.value)}/></label>}
  <button className="st-search-go" type="submit">{label} <Ico kind="arrow" size={16}/></button>
 </form>
}
function Card({ctx,shop,p,variant='default',index=0}){
 const saved=shop.saved.includes(p.id)
 return <article className={'st-card st-card-'+variant}>
  <Link to={to(ctx,'item/'+p.id)} className="st-card-image"><Photo src={p.image} alt={'Illustrative photograph of '+p.title}/><span className="st-card-image-label">{p.badge||p.category}</span></Link>
  <button type="button" className={'st-card-save'+(saved?' is-saved':'')} onClick={()=>shop.toggle(p.id)} aria-pressed={saved} aria-label={(saved?'Remove ':'Save ')+p.title}><Ico kind="heart" size={17}/></button>
  <div className="st-card-detail"><div><span>{String(index+1).padStart(2,'0')} / {p.area}</span><h3><Link to={to(ctx,'item/'+p.id)}>{p.title}</Link></h3><p>{p.description}</p></div><strong>{money(p.price)} <small>/ sample rate</small></strong></div>
  <Link className="st-card-link" to={to(ctx,'item/'+p.id)}>View {p.category==='Experiences'||p.category==='Tours'||p.category==='Trekking'?'experience':'property'} <Ico kind="up" size={14}/></Link>
 </article>
}
function Cards({ctx,shop,items,variant='default'}){return <div className={'st-cards st-cards-'+variant}>{items.map((p,i)=><Card key={p.id} ctx={ctx} shop={shop} p={p} index={i} variant={variant}/>)}</div>}
function Button({ctx,children,path='search',kind='arrow',className=''}){return <Link to={to(ctx,path)} className={'st-button '+className}>{children}<Ico kind={kind} size={17}/></Link>}
function Newsletter({ctx}){
 const [email,setEmail]=useState(''),[sent,setSent]=useState(false)
 return <form onSubmit={e=>{e.preventDefault();setSent(true)}} className="st-newsletter">
  {sent?<span role="status">Thank you. This newsletter is a preview, so your address was not stored.</span>:<><label htmlFor={'st-email-'+ctx.style}>Get occasional new destinations.</label><div><input id={'st-email-'+ctx.style} required type="email" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><button type="submit" aria-label="Preview newsletter sign-up"><Ico kind="arrow" size={18}/></button></div></>}
 </form>
}
export function StayFooter({ctx}){
 return <footer className={'st-footer st-footer-'+ctx.style}>
  <div><h2>{ctx.brand.name}</h2><p>{ctx.brand.strapline}</p><small>Design concept only. All properties, rates, guest reviews, sustainability descriptions and availability are illustrative.</small></div>
  <div><strong>EXPLORE</strong><Link to={to(ctx,'search')}>Find a place</Link><Link to={to(ctx,'saved')}>Saved stays</Link><Link to={to(ctx,'about')}>Our story</Link><Link to={to(ctx,'contact')}>Get in touch</Link></div>
  <Newsletter ctx={ctx}/>
  <div className="st-footer-bottom"><span>© 2026 {ctx.brand.name} · DEMONSTRATION SITE</span><a href="#ix-top">Back to top</a></div>
 </footer>
}
function Orizon({ctx,shop}){
 const items=ctx.store.items,imgs=ctx.store.photos
 const [active,setActive]=useState(0),[dark,setDark]=useState(false),[showSearch,setShowSearch]=useState(false)
 const featured=items[active]
 return <main className={'st-page st-orizon'+(dark?' st-orizon-night':'')}>
  <div className="st-or-bg"><Photo src={imgs.background} alt="Snow-covered mountain panorama" loading="eager"/></div>
  <div className="st-or-shell">
   <div className="st-or-searchband"><button type="button" onClick={()=>setShowSearch(v=>!v)} aria-expanded={showSearch}><Ico kind="left" size={17}/> SEARCH</button><div><Ico kind="pin" size={16}/> <span>SCOTTSDALE<br/><b>Featured locations</b></span></div><div><Ico kind="home" size={16}/> <span>VILLA<br/><b>Property selection</b></span></div><div><Ico kind="star" size={16}/> <span>THE EDIT<br/><b>Curated stays</b></span></div><Button ctx={ctx}>FIND A HOME</Button></div>
   {showSearch&&<div className="st-or-expanded"><Search ctx={ctx} variant="orizon" label="Find places"/></div>}
   <div className="st-or-world"><Photo src={featured.image} alt={featured.title+' property visual'} loading="eager"/><div className="st-or-overlay"/>
    <div className="st-or-side"><button title="Home" aria-label="Open homepage" className="is-active" onClick={()=>setActive(0)}><Ico kind="home"/></button><Link title="Find places" aria-label="Find a property" to={to(ctx,'search')}><Ico kind="search"/></Link><Link title="Explore homes" aria-label="Browse properties" to={to(ctx,'explore')}><Ico kind="grid"/></Link><Link title="Contact" aria-label="Contact the team" to={to(ctx,'contact')}><Ico kind="message"/></Link><Link title="Saved properties" aria-label="Saved properties" to={to(ctx,'saved')}><Ico kind="heart"/></Link><button title="Change colour mode" aria-label="Toggle appearance" onClick={()=>setDark(x=>!x)}><Ico kind={dark?'moon':'sun'}/></button></div>
    <div className="st-or-headline"><span>THE FUTURE OF PERSONAL STAYS</span><h1>New Way Of<br/>Living</h1><p>Discover extraordinary properties with spaces that feel like a different world.</p></div>
    <div className="st-or-bottom"><div className="st-or-stat"><span>Find the perfect place.</span><p>Every stay has its own story. Find the space that works for yours.</p><b>06 <small>SELECTED PLACES</small></b><div className="st-or-next"><button aria-label="Previous featured property" onClick={()=>setActive(n=>(n+items.length-1)%items.length)}><Ico kind="left"/></button><button aria-label="Next featured property" onClick={()=>setActive(n=>(n+1)%items.length)}><Ico kind="arrow"/></button></div></div>
    <div className="st-or-feature"><span>FEATURED / 0{active+1}</span><h2>{featured.title}</h2><p><Ico kind="pin" size={14}/>{featured.area}</p><p>{featured.description}</p><div className="st-or-feature-facts"><span>{featured.guests} guests</span><span>{featured.beds} bedrooms</span><span>{money(featured.price)} / sample</span></div><div><button type="button" onClick={()=>shop.toggle(featured.id)} aria-pressed={shop.saved.includes(featured.id)} aria-label="Save featured property"><Ico kind="heart"/></button><Link to={to(ctx,'item/'+featured.id)} aria-label={'View '+featured.title}><Ico kind="up"/></Link></div></div></div>
   </div>
  </div>
  <section className="st-or-below"><div><span>01 / THE NEW STANDARD</span><h2>Extraordinary stays.<br/><em>Intentionally selected.</em></h2></div><Cards ctx={ctx} shop={shop} items={items.slice(0,3)} variant="orizon"/></section>
 </main>
}
function Visa({ctx,shop}){
 const images=ctx.store.photos,items=ctx.store.items
 const [slide,setSlide]=useState(0)
 const chosen=items[(slide+1)%items.length]
 return <main className="st-page st-visa">
  <section className="st-visa-hero"><Photo src={images.hero} alt="Epic mountain range travel landscape" loading="eager"/><div className="st-visa-tint"/><div><span>THE ART OF GETTING LOST, BEAUTIFULLY</span><h1>Travel</h1><p>Travel with intention. Discover retreats, active adventures and boutique stays all in one place.</p></div><Search ctx={ctx} variant="visa" compact label="Explore"/></section>
  <section className="st-visa-story"><div className="st-visa-kicker"><span>CURATED WITH PEOPLE IN MIND</span><span>REAL PLACES / MORE POSSIBILITY</span></div><h2>Travel means<br/><em>going places.</em></h2><div className="st-visa-split"><div><span>01 / OUR STORY</span><h3>Not your boring<br/>travel agent.</h3><p>We plan thoughtfully curated trips with great people, good energy and memorable places.</p><Button ctx={ctx} path="about">OUR STORY</Button></div><div className="st-visa-photo-row"><Link to={to(ctx,'item/'+items[slide%items.length].id)}><Photo src={items[slide%items.length].image} alt="Illustrative curated travel destination"/><span>{items[slide%items.length].area}</span></Link><Link to={to(ctx,'item/'+chosen.id)}><Photo src={chosen.image} alt="Second curated travel destination"/><span>{chosen.area}</span></Link><div className="st-visa-slider"><button onClick={()=>setSlide(x=>(x+items.length-1)%items.length)} aria-label="Previous destination"><Ico kind="left"/></button><button onClick={()=>setSlide(x=>(x+1)%items.length)} aria-label="Next destination"><Ico kind="arrow"/></button></div></div></div></section>
  <section className="st-visa-places"><header><div><span>POPULAR DESTINATIONS / 2026</span><h2>Pick the place.</h2></div><p>Thoughtful adventures, time to recharge and spaces worth travelling for.</p></header><Search ctx={ctx} variant="visa-list" compact label="Discover"/><Cards ctx={ctx} shop={shop} items={items.slice(0,3)} variant="visa"/></section>
  <section className="st-visa-banner"><Photo src={images.hillside} alt="Wide scenic valley"/><div><span>YOUR NEXT GOOD STORY</span><h2>Go somewhere<br/>worth remembering.</h2><Button ctx={ctx}>FIND YOUR JOURNEY</Button></div></section>
 </main>
}
function Nepal({ctx,shop}){
 const items=ctx.store.items,images=ctx.store.photos
 const [index,setIndex]=useState(2)
 const [mode,setMode]=useState('All')
 const filtered=items.filter(p=>mode==='All'||p.category===mode)
 const main=filtered.length?filtered:items
 const current=Math.min(index,main.length-1)
 const ordered=[...main.slice(current),...main.slice(0,current)]
 const next=()=>setIndex(i=>(i+1)%main.length)
 const prev=()=>setIndex(i=>(i+main.length-1)%main.length)
 return <main className="st-page st-nepal">
  <section className="st-nepal-hero"><Photo src={images.hero} alt="Himalayan mountain skyline" loading="eager"/><div className="st-nepal-hero-tint"/><div><h1>Nepal <em>Without Limits.</em><br/>Discover beyond the ordinary.</h1><p>Journey through Nepal's storied mountain trails, peaceful places and welcoming communities.</p><Button ctx={ctx} path="search">BUILD MY TRIP</Button></div></section>
  <section className="st-nepal-tours"><div className="st-nepal-title"><span>YOUR JOURNEY / OUR WORLD</span><h2>Discover <em>our most</em><br/>popular tours.</h2><p>Tap a tour, change the category or scroll to find a path worth exploring.</p></div><div className="st-nepal-tabs">{ctx.store.categories.map(x=><button key={x} className={mode===x?'selected':''} onClick={()=>{setMode(x);setIndex(0)}}>{x==='All'?'All tours':x}</button>)}</div><div className="st-nepal-gallery">{ordered.slice(0,5).map((p,i)=><Link key={p.id} to={to(ctx,'item/'+p.id)} className={'st-nepal-panel st-nepal-panel-'+i}><Photo src={p.image} alt={p.title+' tour scenery'}/><div><span>{p.category}</span><h3>{p.title}</h3><p>{p.area}</p><b>{i===0?'EXPLORE EXPERIENCE':'VIEW TOUR'} <Ico kind="up" size={14}/></b></div></Link>)}</div><div className="st-nepal-controls"><button onClick={prev} aria-label="Previous tour"><Ico kind="left"/></button><p>{String(current+1).padStart(2,'0')} / {String(main.length).padStart(2,'0')}</p><button onClick={next} aria-label="Next tour"><Ico kind="arrow"/></button></div></section>
  <section className="st-nepal-why"><div className="st-nepal-grid"><div><span>OUR PROMISE / 01</span><h2>Journeys made<br/>personal.</h2><p>Your own pace. Your path. The kind of detail that changes the entire trip.</p><Button ctx={ctx} path="about">OUR APPROACH</Button></div><Photo src={images.trail} alt="Hills and mountain trail"/><div className="st-nepal-why-card"><span>CURATED ADVENTURES</span><b>50<span>+</span></b><p>Ways to imagine your next chapter, from slow retreats to mountain adventures.</p></div></div><div className="st-nepal-numbers"><div><b>06</b><span>FEATURED EXPERIENCES</span></div><div><b>04</b><span>UNIQUE TRIP STYLES</span></div><div><b>01</b><span>YOUR NEXT JOURNEY</span></div><div><b>∞</b><span>ROOM TO EXPLORE</span></div></div></section>
 </main>
}
function Pigma({ctx,shop}){
 const items=ctx.store.items,imgs=ctx.store.photos
 const [selected,setSelected]=useState(0),[showBefore,setShowBefore]=useState(false)
 return <main className="st-page st-pigma"><div className="st-pigma-frame">
  <section className="st-pigma-hero"><span className="st-pigma-kicker">AN OPEN INVITATION / RESPONSIBLE TRAVEL</span><h1>SUSTAINABLE LUXURY<br/><em>IN THAILAND.</em></h1><Button ctx={ctx} path="enquire">REQUEST A BROCHURE</Button><div className="st-pigma-mask"><Photo src={imgs.hero} alt="Tropical architect-designed villa surrounded by greenery" loading="eager"/></div></section>
  <section className="st-pigma-properties"><header><h2>Our Properties</h2><p>A considered edit of lush places, thoughtful materials and beauty that settles in.</p><Link to={to(ctx,'search')}>Explore the collection <Ico kind="arrow"/></Link></header><div className="st-pigma-property-grid">{items.slice(0,4).map((p,i)=><Link key={p.id} to={to(ctx,'item/'+p.id)} className={i%2===0?'st-pigma-copy-tile':'st-pigma-image-tile'}>{i%2===0?<><span>THE GOOD-LIVING EDIT / 0{i+1}</span><h3>{p.title}</h3><b>{p.area}</b><p>{p.description}</p><strong>Explore residence <Ico kind="up" size={14}/></strong></>:<><Photo src={p.image} alt={p.title+' lush villa'}/><span>{p.title} / {p.area}</span></>}</Link>)}</div></section>
  <section className="st-pigma-focus"><div><h2>Locations</h2><div className="st-pigma-map"><svg viewBox="0 0 420 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrative location map, not an actual map"><path d="M-20 160C80 10 164 178 258 64S385 107 440 11M-20 245C66 154 183 253 283 131S388 228 440 100M3 3L430 250" stroke="#b3bba5" fill="none" strokeWidth="7" opacity=".7"/><path d="M-10 112Q126 221 252 31t180 185" stroke="#f5f2e6" strokeWidth="25" fill="none"/></svg>{items.slice(0,3).map((p,i)=><button key={p.id} onClick={()=>setSelected(i)} aria-label={'Explore '+p.area} className={'st-map-pin st-map-pin-'+i+(i===selected?' active':'')}><Ico kind="pin" size={19}/></button>)}<span>{items[selected].area}</span><small>Illustrative destination overview</small></div></div><div className="st-pigma-quote"><span>LOWER IMPACT / GREATER MEANING</span><h2>Considered<br/>by nature.</h2><p>These sample concepts explore how architecture and landscape can live in conversation.</p><button type="button" onClick={()=>setShowBefore(x=>!x)}>{showBefore?'SHOW OUR APPROACH':'SEE OUR APPROACH'} <Ico kind="arrow" size={15}/></button>{showBefore&&<div className="st-pigma-approach" role="status"><h3>Designed to belong.</h3><p>Natural ventilation, careful orientation, gentle light and locally appropriate materials are part of the concept, not verified sustainability results.</p></div>}</div></section>
  <section className="st-pigma-last"><h2>Stay in a<br/><em>different light.</em></h2><Photo src={imgs.coast} alt="Luxury villa architecture"/><Button ctx={ctx}>DISCOVER A RESIDENCE</Button></section>
 </div></main>
}
function Apex({ctx,shop}){
 const items=ctx.store.items,imgs=ctx.store.photos
 const [offset,setOffset]=useState(0)
 const services=[['Architectural stays','Places built around how you want to live.',imgs.architecture],['Interior excellence','Beautiful details, considered materials.',imgs.interior],['Urban escapes','Restful spaces between city and nature.',imgs.garden],['Private experiences','Memorable moments in expressive surroundings.',imgs.dining]]
 const visible=[...services.slice(offset),...services.slice(0,offset)]
 return <main className="st-page st-apex"><div className="st-apex-wrap">
  <section className="st-apex-hero"><Photo src={imgs.hero} alt="Dark modern architecture embraced by woodland" loading="eager"/><div><span>APEX ARC / SELECTED STAYS</span><h1>Designing Spaces<br/>That Inspire &amp; Endure.</h1><p>Discover thoughtfully designed homes and experiences that transform an ordinary escape.</p></div><Button ctx={ctx} path="contact">SCHEDULE A CONSULTATION</Button></section>
  <section className="st-apex-about"><div><h2>About the collection</h2><p>We believe where you stay should be as thoughtful as where you live. Explore beautiful spaces shaped by light, material and human experience.</p><Link to={to(ctx,'about')}>Learn about us <Ico kind="up" size={15}/></Link></div><div className="st-apex-metrics"><div><b>06</b><p>Curated places</p></div><div><b>03</b><p>Signature design ideas</p></div><div><b>05</b><p>Neighborhood perspectives</p></div><div><b>01</b><p>Distinct point of view</p></div></div></section>
  <section className="st-apex-services"><header><h2>Services we provide</h2><div><button onClick={()=>setOffset(x=>(x+services.length-1)%services.length)} aria-label="Previous service"><Ico kind="left"/></button><button onClick={()=>setOffset(x=>(x+1)%services.length)} aria-label="Next service"><Ico kind="arrow"/></button></div></header><div className="st-apex-service-cards">{visible.map(([name,desc,image],i)=><Link key={name} to={to(ctx,'explore')}><Photo src={image} alt={name+' visual'}/><span>0{i+1}</span><h3>{name}</h3><p>{desc}</p></Link>)}</div></section>
  <section className="st-apex-portfolio"><div className="st-apex-portfolio-intro"><h2>Our portfolio of<br/><em>pioneering design.</em></h2><p>Browse selected residences and experiences, each with its own particular character.</p><Button ctx={ctx}>SEE ALL STAYS</Button></div>{items.slice(0,4).map((p,i)=><Link key={p.id} to={to(ctx,'item/'+p.id)} className={'st-apex-project st-apex-project-'+i}><Photo src={p.image} alt={p.title+' architectural photo'}/><span>{p.title} <Ico kind="up" size={14}/></span></Link>)}</section>
  <div className="st-apex-outro"><h2>Find your next exceptional place.</h2><Button ctx={ctx} path="search">DISCOVER STAYS</Button></div>
 </div></main>
}
const HOMES={editorial:Orizon,catalogue:Visa,adventure:Nepal,minimal:Pigma,architect:Apex}
export function StayHome({ctx,shop}){const Home=HOMES[ctx.style]||Orizon;return <Home ctx={ctx} shop={shop}/>}
