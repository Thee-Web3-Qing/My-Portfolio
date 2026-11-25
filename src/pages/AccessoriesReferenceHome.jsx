
import {useEffect,useMemo,useState} from 'react'
import {Link,useLocation} from 'react-router-dom'
import {money} from './industryStoreData.js'
import './accessoriesReference.css'

const url=(ctx,path='')=>ctx.root+(path?'/'+path:'')
function Photo({src,alt='',className='',style,loading='lazy'}){
 const [failed,setFailed]=useState(false)
 useEffect(()=>setFailed(false),[src])
 return <img className={className} src={failed?'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1100&q=80':src}
  loading={loading} decoding="async" alt={alt} style={style} onError={()=>setFailed(true)}/>
}
function Icon({name,size=18}){
 const paths={
  bag:'M5 9h14l1 12H4L5 9ZM8 9V6a4 4 0 0 1 8 0v3',
  heart:'M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 1 0-7 7l8 8 8-8a5 5 0 0 0 0-7',
  search:'M21 21l-4.5-4.5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
  arrow:'M4 12h16m-7-7 7 7-7 7', chevron:'M9 5l7 7-7 7',
  left:'M20 12H4m7-7-7 7 7 7',menu:'M4 6h16M4 12h16M4 18h16',
  close:'M5 5l14 14M19 5 5 19', user:'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10',
  camera:'M3 8h4l2-3h6l2 3h4v12H3V8Zm9 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7',
  mic:'M12 3v10m-4-7v7a4 4 0 0 0 8 0V6M5 12a7 7 0 0 0 14 0M12 19v3m-4 0h8',
  globe:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2c-5 5-5 15 0 20M12 2c5 5 5 15 0 20',
  shield:'m12 2 8 4v6c0 5-4 8-8 10-4-2-8-5-8-10V6l8-4m-3 10 2 2 4-4',
  check:'M4 12l5 5L20 6', truck:'M2 6h12v11H2V6Zm12 4h4l4 4v3h-8m-8 1h2m9 0h2',
  refresh:'M20 10a8 8 0 1 0-3 7m3 1v-6h-6', sparkle:'m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3'
 }
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.arrow}/></svg>
}
function Product({ctx,shop,p,kind='default',number}){
 const [finish,setFinish]=useState(p.colors?.[0]||'Original')
 return <article className={'aw-product aw-product-'+kind}>
   <Link className="aw-product-photo" to={url(ctx,'item/'+p.id)}><Photo src={p.image} alt={p.title+' illustrative product photo'}/>{p.badge&&<small>{p.badge}</small>}</Link>
   <div className="aw-product-meta"><div><span className="aw-product-index">{number?String(number).padStart(2,'0')+' / ':''}{p.category}</span><Link to={url(ctx,'item/'+p.id)}><h3>{p.title}</h3></Link><p>{p.description}</p></div><strong>{money(p.price)}</strong></div>
   <div className="aw-product-actions"><div className="aw-colour-options">{(p.colors||[]).slice(0,3).map((c,i)=><button type="button" key={c} className={finish===c?'chosen':''} onClick={()=>setFinish(c)} title={c} aria-label={'Select '+c} style={{'--aw-swatch':/gold|bronze|amber|oat|sand|stone/i.test(c)?'#cfac73':/black|smoke|graphite|titanium|onyx/i.test(c)?'#242426':/pink|rose|blush/i.test(c)?'#dda3b8':/white|clear|cream|ivory|cloud/i.test(c)?'#e0ddd8':'#9b8779'}} />)}</div><button type="button" className="aw-add-button" onClick={()=>shop.add(p,finish,1)} aria-label={'Add '+p.title+' to demo bag'}><Icon name="bag" size={15}/><span>Add</span></button><Link className="aw-view-button" to={url(ctx,'item/'+p.id)}>View object</Link></div>
  </article>
}
function Products({ctx,shop,items,kind='default'}){
 return <div className={'aw-products aw-products-'+kind}>{items.map((p,i)=><Product key={p.id} ctx={ctx} shop={shop} p={p} kind={kind} number={i+1}/>)}</div>
}
function CTA({ctx,children,path='explore',className=''}){return <Link className={'aw-cta '+className} to={url(ctx,path)}>{children}<Icon name="arrow" size={17}/></Link>}
const NAV={
 editorial:[['COLLECTION','explore'],['OBJECTS','style-kit'],['DESIGNER','about'],['JOURNAL','faq']],
 tech:[['PRODUCT','explore'],['TECHNOLOGY','about'],['ABOUT','about']],
 catalogue:[['CATALOGUE','explore'],['BRANDS','explore'],['NEW ARRIVALS','explore'],['TECHNOLOGY','about'],['DELIVERY','faq']],
 playful:[['Explore','explore'],['Collections','explore'],['About','about'],['Reviews','faq']],
 market:[['Home',''],['Shop','explore'],['Collections','explore'],['New Arrivals','explore'],['Best Sellers','explore'],['Deals','explore']],
 minimal:[['Shop','explore'],['Rings','explore?category=Rings'],['Earrings','explore?category=Earrings'],['Bracelets','explore?category=Bracelets'],['Necklaces','explore?category=Necklaces']]
}
export function AccessoryHeader({ctx,shop}){
 const [menu,setMenu]=useState(false),location=useLocation(),style=ctx.style
 const links=NAV[style]||NAV.editorial
 return <>
  {style==='market'&&<div className="aw-market-top">Modern finds, everyday life. <Link to={url(ctx,'contact')}>Contact us</Link> / Support available</div>}
  <header className={'aw-header aw-header-'+style} id="ix-top">
   <Link to={ctx.root} className="aw-brand">{ctx.brand.name}{style==='catalogue'&&<span>MOVE AHEAD</span>}{style==='minimal'&&<small>THE FINE EDIT</small>}</Link>
   <nav className={'aw-nav'+(menu?' open':'')} aria-label={ctx.brand.name+' navigation'}>{links.map(([label,route],i)=><Link key={i} to={url(ctx,route)} onClick={()=>setMenu(false)} className={location.pathname===url(ctx,route)?'current':''}>{label}</Link>)}</nav>
   <div className="aw-header-actions">
    {style==='market'&&<form onSubmit={e=>{e.preventDefault();const q=e.currentTarget.elements.query?.value;window.location.href=url(ctx,'explore?q='+encodeURIComponent(q||''))}}><input name="query" placeholder="Search for products…" aria-label="Search products"/><button aria-label="Search products"><Icon name="search" size={17}/></button></form>}
    <Link to={url(ctx,'explore')} className="aw-head-search" aria-label="Browse or search collection"><Icon name="search"/></Link>
    <Link to={url(ctx,'saved')} className="aw-head-saved" aria-label={'Saved pieces: '+shop.saved.length}><Icon name="heart" size={18}/></Link>
    <button className="aw-bag" onClick={()=>shop.setDrawer(true)} aria-label={'Open bag with '+shop.count+' items'}><Icon name="bag"/>{shop.count>0&&<b>{shop.count}</b>}</button>
    {style==='tech'&&<CTA ctx={ctx}>SHOP NOW</CTA>}
    {style==='editorial'&&<CTA ctx={ctx}>SHOP</CTA>}
    {style==='market'&&<Link to={url(ctx,'explore')} className="aw-head-account"><Icon name="user"/></Link>}
    <button className="aw-menu-button" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}><Icon name={menu?'close':'menu'} size={22}/></button>
   </div>
  </header>
 </>
}
function Newsletter({ctx,className='',title='Stay in the loop.',sub='Discover new arrivals and the occasional good surprise.'}){
 const [email,setEmail]=useState(''),[done,setDone]=useState(false)
 return <section className={'aw-newsletter '+className}><div><h2>{title}</h2><p>{sub}</p></div><form onSubmit={e=>{e.preventDefault();setDone(true)}}>{done?<p role="status">Thanks! This newsletter is a demo, so no email was saved.</p>:<><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" aria-label="Email address"/><button type="submit">Subscribe</button></>}</form></section>
}
export function AccessoryFooter({ctx}){
 const style=ctx.style
 return <footer className={'aw-footer aw-footer-'+style}>
  {style==='market'&&<Newsletter ctx={ctx} title="Stay in the Loop" sub="New arrivals, member offers and the next good find."/>}
  {style!=='market'&&style!=='tech'&&style!=='minimal'&&<Newsletter ctx={ctx} title={style==='playful'?'A little HUSH in your inbox.':'A considered edit, occasionally.'}/>}
  <div className="aw-footer-grid"><div className="aw-footer-main"><Link to={ctx.root}>{ctx.brand.name}</Link><p>{ctx.brand.strapline}</p><small>Illustrative concept store. The cart, enquiries and checkout are demonstrations only. No real money is collected.</small></div>
   <div><b>SHOP</b><Link to={url(ctx,'explore')}>All pieces</Link><Link to={url(ctx,'saved')}>Saved favourites</Link><Link to={url(ctx,'style-kit')}>Make a style kit</Link></div>
   <div><b>STUDIO</b><Link to={url(ctx,'about')}>Our story</Link><Link to={url(ctx,'contact')}>Contact</Link><Link to={url(ctx,'faq')}>Materials & FAQs</Link></div>
   <div><b>HELP</b><Link to={url(ctx,'faq')}>Shipping</Link><Link to={url(ctx,'faq')}>Returns</Link><Link to={url(ctx,'contact')}>Support</Link></div>
  </div><div className="aw-footer-base"><span>© 2026 {ctx.brand.name.toUpperCase()} · SAMPLE WEBSITE</span><a href="#ix-top">BACK TO TOP</a></div>
 </footer>
}
function Ossia({ctx,shop}){
 const {images,items}=ctx.store
 const [filter,setFilter]=useState('All')
 const [sort,setSort]=useState('featured')
 const filtered=useMemo(()=>{
  const out=items.filter(x=>filter==='All'||x.category===filter)
  if(sort==='low')return [...out].sort((a,b)=>a.price-b.price)
  if(sort==='high')return [...out].sort((a,b)=>b.price-a.price)
  return out
 },[filter,sort,items])
 return <main className="aw-page aw-ossia">
  <section className="aw-ossia-hero">
   <div className="aw-ossia-lead"><Photo src={images.portrait} alt="Close fashion portrait with eyewear" loading="eager"/><div><span>HAND-SCULPTED EYEWEAR / DROP 04</span><h1>OBJECTS FOR<br/>THE FACE.</h1><p>Rimless silhouettes. Engineered metal. Built in limited numbers.</p><div><CTA ctx={ctx}>SHOP THE COLLECTION</CTA><Link to={url(ctx,'about')}>VIEW CAMPAIGN</Link></div></div></div>
   <div className="aw-ossia-side"><Photo src={images.detail} alt="Sculpted frame product detail" loading="eager"/><Photo src={images.hero} alt="Editorial eyewear portrait" loading="eager"/></div>
  </section>
  <section className="aw-ossia-edit"><header><div><h2>THE CURRENT EDIT.</h2><span>0{items.length} OBJECTS</span></div><div className="aw-ossia-filters">{ctx.store.categories.map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x.toUpperCase()}</button>)}<select aria-label="Sort eyewear" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">SORT: FEATURED</option><option value="low">PRICE: LOW</option><option value="high">PRICE: HIGH</option></select></div></header>
   <Products ctx={ctx} shop={shop} items={filtered} kind="ossia"/></section>
  <section className="aw-ossia-designer"><Photo src={images.craft} alt="Designer crafting eyewear at a studio"/><div><span>THE DESIGNER</span><h2>DESIGNED FROM<br/>THE HINGE OUT.</h2><p>The object becomes architecture. Balance, tension and the character of each line.</p><blockquote>“I design the hinge first. The rest follows.”</blockquote><CTA ctx={ctx} path="about">MEET THE DESIGNER</CTA><small>STUDIO WORKSHOP　/　METALWORK　/　NUMBERED EDITIONS</small></div></section>
 </main>
}
function Tech({ctx,shop}){
 const {images,items}=ctx.store
 const features=[['sparkle','GPT ASSISTANT','Your AI, always with you.'],['camera','BUILT-IN CAMERA','Capture your world.'],['mic','VOICE CONTROL','Hands-free, naturally.'],['globe','LIVE TRANSLATION','A more open world.'],['check','EVERYDAY STYLE','Advanced. Understated.']]
 return <main className="aw-page aw-tech">
  <section className="aw-tech-hero"><Photo src={images.hero} alt="Smart eyewear close-up editorial" loading="eager"/><div className="aw-tech-shade"/><div className="aw-tech-hero-content"><span>HUMAN TECHNOLOGY<br/>IN FOCUS</span><h1>A SMARTER<br/>LOOK AT<br/>TOMORROW</h1><p>AI glasses for a more connected, open world.</p><CTA ctx={ctx}>DISCOVER VYRA</CTA></div><small>SEE<br/>UNDERSTAND<br/>TRANSLATE<br/>CREATE<br/>GO FURTHER</small></section>
  <section className="aw-tech-collection"><div className="aw-tech-heading"><div><span>THE VYRA COLLECTION</span><h2>SAME VISION.<br/>YOUR STYLE.</h2></div><p>Personalise your VYRA glasses with refined finishes. Designed to look beautiful and feel effortless.</p></div><Products ctx={ctx} shop={shop} items={items.slice(0,3)} kind="tech"/></section>
  <section className="aw-tech-features">{features.map(([icon,title,desc])=><article key={title}><Icon name={icon} size={31}/><h3>{title}</h3><p>{desc}</p></article>)}</section>
  <section className="aw-tech-community"><Photo src={images.community} alt="City lifestyle and technology eyewear campaign"/><div><h2>MORE<br/>PERSPECTIVE<br/>EVERY DAY.</h2><p>Join people exploring what's next with connected eyewear.</p><Newsletter ctx={ctx} title="" sub=""/></div><small>PEOPLE<br/>IDEAS<br/>PLACES<br/>A CLEARER TOMORROW</small></section>
 </main>
}
function Aero({ctx,shop}){
 const {images,items}=ctx.store
 const [q,setQ]=useState('')
 const groups=[['Running',images.run],['Basketball',images.basket],['Training',images.train],['Lifestyle',images.city]]
 const technology=[['AERO FOAM','Responsive cushioning for everyday movement.'],['FLEX MOTION','Made for an effortless natural stride.'],['GRIP CONTROL','Confidence on every surface.'],['BREATH TECH','Lightweight, breathable comfort.'],['HEEL SUPPORT','A stable fit all day.'],['ECO MATERIALS','A more considered way to make.']]
 return <main className="aw-page aw-aero">
  <section className="aw-aero-hero"><div className="aw-aero-copy"><span>PREMIUM COLLECTION</span><h1>SHOES FOR<br/>RHYTHM,<br/>COMFORT AND<br/>CITY MOVEMENT.</h1><p>Technology, form and comfort in every step. Your day deserves better shoes.</p><div><CTA ctx={ctx}>SHOP CATALOGUE</CTA><Link to={url(ctx,'explore')}>NEW ARRIVALS</Link></div></div><Photo src={images.hero} alt="Athletic shoes and movement lifestyle photograph" loading="eager"/><div className="aw-aero-floating"><span>COMPLIMENTARY DELIVERY</span><span>FLEXIBLE RETURNS</span><span>ORIGINAL PRODUCTS</span></div></section>
  <form className="aw-aero-search" onSubmit={e=>{e.preventDefault();window.location.href=url(ctx,'explore?q='+encodeURIComponent(q))}}><Icon name="search"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Find sneakers, colours, collections..." aria-label="Search sneakers"/><button type="submit">SEARCH</button></form>
  <div className="aw-aero-pills">{ctx.store.categories.map(cat=><Link key={cat} to={url(ctx,cat==='All'?'explore':'explore?category='+encodeURIComponent(cat))}>{cat}</Link>)}</div>
  <section className="aw-aero-products"><div className="aw-aero-title"><h2>BEST SELLERS</h2><Link to={url(ctx,'explore')}>VIEW ALL PRODUCTS <Icon name="arrow"/></Link></div><Products ctx={ctx} shop={shop} items={items.slice(0,5)} kind="aero"/></section>
  <section className="aw-aero-tiles">{groups.map(([title,src],i)=><Link key={title} to={url(ctx,'explore?category='+encodeURIComponent(title))}><Photo src={src} alt={title+' shoes in movement'}/><div><span>{String(i+1).padStart(2,'0')} / EXPLORE</span><h3>{title}</h3><p>Designed for how you move.</p><strong>VIEW COLLECTION <Icon name="arrow" size={15}/></strong></div></Link>)}</section>
  <section className="aw-aero-tech"><h2>TECHNOLOGY FOR YOUR MOVEMENT</h2><div>{technology.map(([title,body],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
  <section className="aw-aero-club"><span>AERO STEP CLUB</span><div><h2>MOVE WITH US.</h2><p>Fresh collections, member access and new inspiration.</p></div><CTA ctx={ctx} path="contact">JOIN THE CLUB</CTA></section>
  <div className="aw-aero-perks"><span><Icon name="truck"/> COMPLIMENTARY SHIPPING</span><span><Icon name="refresh"/> EASY EXCHANGES</span><span><Icon name="shield"/> QUALITY ASSURED</span></div>
 </main>
}
function Hush({ctx,shop}){
 const {images,items}=ctx.store
 return <main className="aw-page aw-hush">
  <section className="aw-hush-hero"><span className="aw-hush-hero-kicker">A NEW KIND OF EVERYDAY</span><div className="aw-hush-bigword">your choice</div><Photo src={images.hero} alt="Sculptural handbag studio photograph" loading="eager"/><div className="aw-hush-silver" aria-hidden="true">○</div><div className="aw-hush-intro"><div><span>About us</span><h2>What we do</h2></div><div><p>Each HUSH brand bag is a beautiful combination of creativity and practicality.</p><CTA ctx={ctx} path="about">LEARN MORE</CTA></div></div></section>
  <section className="aw-hush-arrivals"><div className="aw-hush-arrivals-title"><span>BLOGGERS' CHOICE</span><h2>NEW ARRIVALS</h2><span>BESTSELLERS</span></div><Products ctx={ctx} shop={shop} items={items.slice(0,3)} kind="hush"/></section>
  <section className="aw-hush-story"><div className="aw-hush-text"><p>Our team is driven by innovation. Experimenting with modern materials, playful forms and unexpected shapes, we make bags that turn an everyday detail into a point of view.</p><CTA ctx={ctx} path="about">MORE ABOUT US</CTA><b>HUSH</b></div><div className="aw-hush-mosaic"><Photo src={images.chrome} alt="Reflective metal handbag sculpture"/><Photo src={images.art} alt="Creative materials studio"/><Photo src={images.still} alt="Accessories creative detail"/></div></section>
  <section className="aw-hush-collections"><h2>Our collections</h2><Products ctx={ctx} shop={shop} items={items.slice(3)} kind="hush-more"/></section>
 </main>
}
function Market({ctx,shop}){
 const {images,items}=ctx.store
 const groups=[
  ['Electronics',images.electronics],['Fashion',images.fashion],['Home & Living',images.home],['Beauty & Care',images.beauty],
  ['Footwear',images.footwear],['Accessories',images.eyewear],['Sports',images.sport],['Office & Stationery',images.office]
 ]
 const promos=[['SEASONAL SALE','UP TO 40% OFF','Selected essentials, limited time.',images.electronics],['NEW ARRIVALS','FRESH PICKS JUST IN','Explore the latest.',images.footwear],['HOME UPGRADE','STYLE YOUR SPACE','Curated home essentials.',images.home]]
 return <main className="aw-page aw-market">
  <section className="aw-market-hero"><div><span>MODERN GENERAL STORE</span><h1>Everyday Essentials<br/>for a Better Lifestyle</h1><p>Discover a curated selection of top products across tech, fashion, home, beauty and more.</p><div><CTA ctx={ctx}>SHOP NOW</CTA><Link to={url(ctx,'explore')}>EXPLORE COLLECTIONS</Link></div></div><Photo src={images.hero} className="aw-market-still" alt="Navy backpack, headphones, sunglasses and sneakers on a retail display" loading="eager"/></section>
  <section className="aw-market-benefits">{[['truck','Fast Shipping','Convenient delivery'],['refresh','Easy Returns','Clear return policies'],['shield','Secure Checkout','Connect your real provider'],['mic','Dedicated Support','Real people, easy answers']].map(([icon,title,body])=><div key={title}><Icon name={icon} size={25}/><span><b>{title}</b><small>{body}</small></span></div>)}</section>
  <section className="aw-market-categories"><header><h2>Shop by Category</h2><Link to={url(ctx,'explore')}>View all categories <Icon name="arrow"/></Link></header><div>{groups.map(([title,image])=><Link key={title} to={url(ctx,'explore?category='+encodeURIComponent(title))}><Photo src={image} alt={title+' category'}/><b>{title}</b><Icon name="arrow" size={17}/></Link>)}</div></section>
  <section className="aw-market-promos">{promos.map(([eyebrow,title,sub,image])=><Link key={title} to={url(ctx,'explore')}><Photo src={image} alt={title+' new products'}/><div><span>{eyebrow}</span><h2>{title}</h2><p>{sub}</p><strong>SHOP NOW <Icon name="arrow" size={14}/></strong></div></Link>)}</section>
  <section className="aw-market-trending"><header><h2>Trending Products</h2><Link to={url(ctx,'explore')}>View all products <Icon name="arrow"/></Link></header><Products ctx={ctx} shop={shop} items={items.slice(0,5)} kind="market"/></section>
 </main>
}
function Veloura({ctx,shop}){
 const {images,items}=ctx.store
 const [slide,setSlide]=useState(0)
 const hero=[[items[2],images.hero],[items[1],images.hands],[items[0],images.story],[items[4],images.skin],[items[3],images.wrist]]
 const shifted=hero.map((_,i)=>hero[(i+slide)%hero.length])
 return <main className="aw-page aw-veloura">
  <section className="aw-veloura-hero"><div className="aw-veloura-gallery">{shifted.map(([p,image],i)=><Link className={'aw-veloura-slide aw-veloura-slide-'+i} key={p.id} to={url(ctx,'item/'+p.id)}><Photo src={image} loading="eager" alt={p.title+' fine jewellery styled editorial'}/>{i===2&&<span>SHOP</span>}</Link>)}</div><div className="aw-veloura-arrows"><button aria-label="Previous jewellery image" onClick={()=>setSlide(x=>(x+hero.length-1)%hero.length)}><Icon name="left"/></button><button aria-label="Next jewellery image" onClick={()=>setSlide(x=>(x+1)%hero.length)}><Icon name="arrow"/></button></div></section>
  <section className="aw-veloura-products"><div className="aw-veloura-heading"><h2>From Classic to Contemporary,<br/>Your Perfect Piece Awaits</h2><Link to={url(ctx,'explore')}>see all</Link></div><Products ctx={ctx} shop={shop} items={items.slice(0,5)} kind="veloura"/></section>
  <section className="aw-veloura-box"><div><span>OUR SIGNATURE PRESENTATION</span><h2>Elegance in<br/>every detail.</h2></div><Photo src={images.box} alt="Thoughtfully presented jewellery gift and box"/><b>Veloura</b></section>
  <section className="aw-veloura-about"><Photo src={images.model} alt="Fine jewellery fashion portrait"/><div><span>01 / OUR STORY</span><h2>About Us</h2><p>At Veloura, jewellery is an intimate expression of elegance, confidence and timeless beauty. Thoughtful materials, precise shapes and classic details come together in pieces made to keep.</p><p>Each object is chosen with intention, for the everyday and every special moment.</p><CTA ctx={ctx} path="about">DISCOVER OUR STORY</CTA></div></section>
  <section className="aw-veloura-summer"><div><Photo src={images.skin} alt="Fine jewellery on skin"/><Photo src={images.still} alt="Gold jewellery macro detail"/></div><div><h2>SUMMER<br/>COLLECTIONS</h2><Link to={url(ctx,'explore')}>THE NEW EDIT <Icon name="arrow"/></Link><Photo src={images.story} alt="Editorial gold jewellery"/></div></section>
 </main>
}
const HOMES={editorial:Ossia,tech:Tech,catalogue:Aero,playful:Hush,market:Market,minimal:Veloura}
export function AccessoryHome({ctx,shop}){
 const Home=HOMES[ctx.style]||Ossia
 return <Home ctx={ctx} shop={shop}/>
}
