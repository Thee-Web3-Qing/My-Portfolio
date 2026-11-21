
import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FashionCatalogue, FashionEditorial, FashionMinimal, FashionStoreProvider, useStore, Bag } from './FashionReference.jsx'
import { fashionImage, fashionInventory, fashionLooks, fashionCategories, getFashionProduct, getFashionLook, fashionMoney as money } from './fashionInventory.js'
import './fashionCommerce.css'

const CONFIG = {
 editorial: { root: '/fashioneditorial', name: 'LOCO', subtitle: 'FEEL THE VIBES', accent: '#de4b3a', hero: fashionImage['campaign-bright'], tone: 'editorial' },
 catalogue: { root: '/fashioncatalogue', name: 'HER FASHION', subtitle: 'YOUR STYLE, YOUR WAY', accent: '#51212e', hero: fashionImage['look-mono'], tone: 'catalogue' },
 minimal: { root: '/fashionminimal', name: 'RUSH', subtitle: 'A WARDROBE BUILT AROUND YOU', accent: '#f6d935', hero: fashionImage['campaign-luxury'], tone: 'minimal' },
}
const fallback = fashionImage['campaign-street']
function Image({src,alt, ...rest}) { return <img src={src} alt={alt} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=fallback}} {...rest} /> }
function Arrow({up=false}) { return <span aria-hidden="true">{up?'↗':'→'}</span> }
const getLink=(config,path)=>config.root+(path?'/'+path:'')
function Icon({name}) {
 const d={
 bag:'M5 8h14l1 12H4L5 8ZM9 9V6a3 3 0 0 1 6 0v3',
 search:'M21 21l-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
 heart:'M20.8 4.5a5.5 5.5 0 0 0-7.8 0L12 5.6l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.7a5.5 5.5 0 0 0 0-7.8Z',
 menu:'M4 7h16M4 12h16M4 17h16',close:'M5 5l14 14M19 5 5 19',plus:'M12 5v14M5 12h14',
 check:'M4 12l5 5L20 6',left:'M15 18l-6-6 6-6'
 };
 return <svg width="19" height="19" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" aria-hidden="true"><path d={d[name]||d.bag}/></svg>
}
function SiteNav({config,mode}){
 const shop=useStore()
 const [mobile,setMobile]=useState(false)
 const location=useLocation()
 const nav=[['Shop','shop'],['Collections','looks'],['About','about'],['Help','faq']]
 return <header className={'fc-site-nav fc-site-nav--'+mode}>
  <div className="fc-site-nav-inner">
   <Link to={config.root} className="fc-site-brand">{config.name}{mode==='editorial'?<sup>®</sup>:null}</Link>
   <nav className={'fc-site-links '+(mobile?'open':'')} aria-label="Store sections">
    {nav.map(([name,slug])=><Link key={slug} to={getLink(config,slug)} className={location.pathname.endsWith('/'+slug)?'active':''} onClick={()=>setMobile(false)}>{name}</Link>)}
    <Link to={getLink(config,'wishlist')} onClick={()=>setMobile(false)} className="fc-mobile-link">Saved pieces</Link>
    <Link to={getLink(config,'cart')} onClick={()=>setMobile(false)} className="fc-mobile-link">View cart</Link>
   </nav>
   <div className="fc-nav-actions">
    <Link to={getLink(config,'wishlist')} aria-label={'Saved pieces ('+shop.saved.length+')'}><Icon name="heart"/>{shop.saved.length>0&&<sup>{shop.saved.length}</sup>}</Link>
    <button type="button" onClick={()=>shop.setBagOpen(true)} aria-label="Open shopping bag"><Icon name="bag"/>{shop.count>0&&<sup>{shop.count}</sup>}</button>
    <button className="fc-site-menu-toggle" type="button" onClick={()=>setMobile(!mobile)} aria-expanded={mobile} aria-label="Toggle store navigation"><Icon name={mobile?'close':'menu'}/></button>
   </div>
  </div>
 </header>
}

function Subscribe({mode}) {
 const [email,setEmail]=useState('')
 const [sent,setSent]=useState(false)
 return <form className="fc-subscribe" onSubmit={e=>{e.preventDefault();if(email.includes('@'))setSent(true)}}>
  {sent ? <p role="status">This is a preview signup. Email integration is connected during client setup.</p> :
   <><label htmlFor={'fc-email-'+mode} className="fc-sr">Email address</label><input id={'fc-email-'+mode} type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address" /><button type="submit" aria-label="Join the preview mailing list"><Arrow/></button></>}
 </form>
}

function Footer({mode,config}) {
 return <footer className="fc-platform-footer">
   <div className="fc-footer-main"><div><Link to={config.root} className="fc-footer-name">{config.name}</Link><p>Considered pieces. Your own kind of style.</p><span className="fc-footer-demo">Fashion website demonstration. Products, prices and photography are illustrative.</span></div><div><strong>Explore</strong><Link to={getLink(config,'shop')}>Shop all</Link><Link to={getLink(config,'looks')}>Lookbook</Link><Link to={getLink(config,'wishlist')}>Saved pieces</Link></div><div><strong>Information</strong><Link to={getLink(config,'about')}>Our story</Link><Link to={getLink(config,'faq')}>Frequently asked questions</Link><Link to={getLink(config,'cart')}>Shopping bag</Link></div><div><strong>Join the edit</strong><p>New collections and early access, without the noise.</p><Subscribe mode={mode}/></div></div>
   <div className="fc-footer-bottom"><span>© 2026 {config.name} · DEMO STOREFRONT</span><Link to={config.root}>Back to top ↑</Link></div>
 </footer>
}
function SmallProduct({p,config,showSave=true}){
 const shop=useStore()
 return <article className="fc-merch">
  <div className="fc-merch-image">
   <Link to={getLink(config,'product/'+p.id)} aria-label={'View '+p.name}><Image src={p.image} alt={p.name}/></Link>
   {p.badge&&<span className="fc-merch-badge">{p.badge}</span>}
   {showSave&&<button className={'fc-merch-heart '+(shop.saved.includes(p.id)?'saved':'')} aria-label={shop.saved.includes(p.id)?'Remove '+p.name+' from saved':'Save '+p.name} aria-pressed={shop.saved.includes(p.id)} onClick={()=>shop.toggle(p.id)}><Icon name="heart"/></button>}
   <button className="fc-merch-plus" aria-label={'Add '+p.name+' to bag'} onClick={()=>shop.add(p)}><Icon name="plus"/></button>
  </div>
  <div className="fc-merch-info"><div><span>{p.category} · {p.colour}</span><Link to={getLink(config,'product/'+p.id)}>{p.name}</Link></div><strong>{money(p.price)}</strong></div>
 </article>
}
function CategoryCard({config,p,category}) {
 return <Link to={getLink(config,'shop?category='+encodeURIComponent(category))} className="fc-category-card">
  <Image src={p.image} alt={category+' collection'}/><span>{category}<Arrow up/></span>
 </Link>
}
function HomeSections({mode,config}){
 const categories=[['Tops','ivory'],['Bottoms','pleat'],['Bags','tabby'],['Shoes','boots']]
 return <div className="fc-home-sections">
  <div className="fc-home-benefits"><span>01 · Curated collections</span><span>02 · Build your look</span><span>03 · Shopping made simple</span></div>
  <section className="fc-home-category"><div className="fc-section-top"><div><p>THE COLLECTION</p><h2>Discover your kind of style.</h2></div><Link to={getLink(config,'shop')}>View all pieces <Arrow up/></Link></div><div className="fc-category-grid">{categories.map(([c,id])=><CategoryCard key={c} category={c} p={getFashionProduct(id)} config={config}/>)}</div></section>
  <section className="fc-home-look"><div className="fc-section-top"><div><p>COMPLETE THE OUTFIT</p><h2>Three looks. All considered.</h2></div><Link to={getLink(config,'looks')}>View the lookbook <Arrow up/></Link></div><div className="fc-home-look-grid">{fashionLooks.map(l=><Link to={getLink(config,'looks/'+l.id)} key={l.id}><Image src={l.image} alt={l.title}/><span>{l.eyebrow}</span><h3>{l.title} <Arrow up/></h3><p>{l.description}</p></Link>)}</div></section>
  <section className="fc-home-story"><Image src={fashionImage['campaign-luxury']} alt="Fashion campaign image"/><div><p>THE BRAND STORY</p><h2>Made for the way you move.</h2><span>Every style has its own personality. Shop the pieces, explore the collections, and build a wardrobe that feels personal.</span><Link to={getLink(config,'about')}>Discover our story <Arrow up/></Link></div></section>
 </div>
}
function ShopPage({config}){
 const location=useLocation()
 const params=new URLSearchParams(location.search)
 const initialCat=params.get('category')||'All'
 const [category,setCategory]=useState(initialCat)
 const [query,setQuery]=useState(params.get('q')||'')
 const [sort,setSort]=useState('featured')
 const [onlySaved,setOnlySaved]=useState(false)
 const shop=useStore()
 const items=useMemo(()=>{
  const list=fashionInventory.filter(p=>(category==='All'||p.category===category)&&(!onlySaved||shop.saved.includes(p.id))&&(p.name+' '+p.category+' '+p.colour).toLowerCase().includes(query.trim().toLowerCase()))
  if(sort==='low')list.sort((a,b)=>a.price-b.price)
  if(sort==='high')list.sort((a,b)=>b.price-a.price)
  if(sort==='az')list.sort((a,b)=>a.name.localeCompare(b.name))
  return list
 },[category,query,sort,onlySaved,shop.saved])
 return <main className="fc-commerce-main fc-shop-page">
  <div className="fc-breadcrumb"><Link to={config.root}>Home</Link><span>/</span><span>Shop</span></div>
  <header className="fc-commerce-heading"><p>THE WARDROBE / ALL PIECES</p><h1>Shop the collection<span>({fashionInventory.length})</span></h1><div><p>Explore the pieces behind the looks. Choose your favourite, save them or add them to your bag.</p><Link to={getLink(config,'looks')}>Shop by look <Arrow up/></Link></div></header>
  <div className="fc-shop-layout"><aside className="fc-shop-sidebar"><h2>FIND YOUR EDIT</h2><div className="fc-shop-filter-label">Category</div><div className="fc-category-options">{fashionCategories.map(c=><button type="button" className={category===c?'active':''} key={c} onClick={()=>setCategory(c)}>{c}<span>{c==='All'?fashionInventory.length:fashionInventory.filter(p=>p.category===c).length}</span></button>)}</div><label className="fc-shop-check"><input type="checkbox" checked={onlySaved} onChange={e=>setOnlySaved(e.target.checked)}/> Saved pieces only</label><div className="fc-shop-promo"><span>YOUR OWN LOOKBOOK</span><p>Shop outfits whose pieces actually match the featured image.</p><Link to={getLink(config,'looks')}>Explore styled looks <Arrow up/></Link></div></aside><div className="fc-shop-results"><div className="fc-shop-tools"><label><Icon name="search"/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, categories or colours"/></label><div><span>SORT BY</span><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="az">Name: A to Z</option></select></div></div><div className="fc-mobile-categories">{fashionCategories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="fc-found-count">{items.length} PIECES FOUND</div>{items.length?<div className="fc-products-grid">{items.map(p=><SmallProduct key={p.id} p={p} config={config}/>)}</div>:<div className="fc-none"><h2>No pieces found.</h2><p>Try a different category or search term.</p><button onClick={()=>{setCategory('All');setQuery('');setOnlySaved(false)}}>Clear filters</button></div>}</div></div>
 </main>
}
function ProductPage({config,id}){
 const p=getFashionProduct(id)
 const shop=useStore()
 const [size,setSize]=useState('M')
 const [qty,setQty]=useState(1)
 const [opened,setOpened]=useState('Description')
 const navigate=useNavigate()
 if(!p)return <NotFound config={config}/>
 const suggestions=fashionInventory.filter(q=>q.id!==p.id&&(q.group===p.group||q.category===p.category)).slice(0,4)
 const groupLook=fashionLooks.find(l=>l.products.includes(p.id))
 return <main className="fc-commerce-main fc-product-page">
   <div className="fc-breadcrumb"><Link to={config.root}>Home</Link><span>/</span><Link to={getLink(config,'shop')}>Shop</Link><span>/</span><span>{p.name}</span></div>
   <div className="fc-pdp"><div className="fc-pdp-photos"><div><Image src={p.image} alt={p.name}/></div>{groupLook&&<Link to={getLink(config,'looks/'+groupLook.id)} className="fc-pdp-styling"><Image src={groupLook.image} alt={'Styled outfit: '+groupLook.title}/><span>SEE IT STYLED <Arrow up/></span></Link>}</div><div className="fc-pdp-details"><span className="fc-pdp-overline">THE COLLECTION / {p.category.toUpperCase()}</span><h1>{p.name}</h1><p>{p.colour} · {p.fabric||'Carefully selected'}</p><strong className="fc-pdp-price">{money(p.price)}</strong><p className="fc-pdp-intro">{p.description||'An easy piece to wear your way, selected for the current collection. This is sample product copy for the storefront preview.'}</p>{!['Bags','Accessories'].includes(p.category)&&<><div className="fc-pdp-label">SELECT SIZE <span>{size}</span></div><div className="fc-pdp-sizes">{(p.category==='Shoes'?['37','38','39','40','41','42']:['XS','S','M','L','XL']).map(s=><button aria-pressed={size===s} key={s} className={size===s?'active':''} onClick={()=>setSize(s)}>{s}</button>)}</div></>}<div className="fc-pdp-label">QUANTITY</div><div className="fc-pdp-qty"><button onClick={()=>setQty(Math.max(1,qty-1))} aria-label="Decrease quantity">−</button><span>{qty}</span><button onClick={()=>setQty(qty+1)} aria-label="Increase quantity">+</button></div><div className="fc-pdp-buttons"><button className="fc-primary-action" onClick={()=>{for(let i=0;i<qty;i++)shop.add(p,i===qty-1)}}>ADD TO BAG · {money(p.price*qty)} <Arrow/></button><button className={'fc-pdp-wish '+(shop.saved.includes(p.id)?'active':'')} onClick={()=>shop.toggle(p.id)} aria-pressed={shop.saved.includes(p.id)} aria-label="Save item"><Icon name="heart"/></button></div><div className="fc-pdp-accordions">{[['Description',p.description||'A considered piece for your everyday wardrobe.'],['Materials & care','Materials and washing details will be provided by the fashion brand before launch.'],['Delivery & returns','Delivery availability, shipping charges and return terms will be configured for each client.']].map(([name,body])=><div key={name}><button onClick={()=>setOpened(opened===name?'':name)} aria-expanded={opened===name}>{name}<span>{opened===name?'−':'+'}</span></button>{opened===name&&<p>{body}</p>}</div>)}</div>{groupLook&&<button className="fc-pdp-look-link" onClick={()=>navigate(getLink(config,'looks/'+groupLook.id))}>Complete the {groupLook.title} outfit <Arrow up/></button>}</div></div>
   <section className="fc-related"><div className="fc-section-top"><div><p>COMPLETE YOUR WARDROBE</p><h2>Pairs beautifully with.</h2></div><Link to={getLink(config,'shop')}>Shop all <Arrow up/></Link></div><div className="fc-products-grid">{suggestions.map(item=><SmallProduct config={config} key={item.id} p={item}/>)}</div></section>
 </main>
}
function LooksPage({config,lookId}){
 const shop=useStore()
 const shown=lookId?fashionLooks.filter(l=>l.id===lookId):fashionLooks
 if(!shown.length)return <NotFound config={config}/>
 return <main className="fc-commerce-main fc-looks-page">
  <div className="fc-breadcrumb"><Link to={config.root}>Home</Link><span>/</span><Link to={getLink(config,'looks')}>Lookbook</Link>{lookId&&<><span>/</span><span>{shown[0].title}</span></>}</div>
  <header className="fc-commerce-heading"><p>LOOKBOOK / {lookId?'THE FULL OUTFIT':'THE WARDROBE STORIES'}</p><h1>{lookId?shown[0].title:'The outfit edit.'}</h1><div><p>Every look is paired with the actual colours and silhouettes shown in its photograph. Mix pieces from different looks to create your own edit.</p><Link to={getLink(config,'shop')}>Shop all products <Arrow up/></Link></div></header>
  <div className="fc-lookbook-grid">{shown.map(l=>{const parts=l.products.map(getFashionProduct).filter(Boolean);const total=parts.reduce((t,p)=>t+p.price,0);return <section className="fc-lookbook-story" key={l.id}><div className="fc-look-photo"><Image src={l.image} alt={l.title}/><span>{l.eyebrow}</span></div><div className="fc-look-content"><span>{l.eyebrow}</span><h2>{l.title}</h2><p>{l.description}</p><div className="fc-look-pieces">{parts.map(p=><Link to={getLink(config,'product/'+p.id)} key={p.id}><Image src={p.image} alt={p.name}/><div><strong>{p.name}</strong><span>{money(p.price)}</span></div><Arrow up/></Link>)}</div><div className="fc-look-actions"><span>FULL LOOK · {money(total)}</span><button onClick={()=>shop.addMultiple(parts)}>SHOP THE WHOLE LOOK <Arrow/></button></div>{!lookId&&<Link className="fc-look-detail-link" to={getLink(config,'looks/'+l.id)}>View this look <Arrow up/></Link>}</div></section>})}</div>
 </main>
}
function AboutPage({config}){
 return <main className="fc-commerce-main fc-about-page">
  <div className="fc-breadcrumb"><Link to={config.root}>Home</Link><span>/</span><span>Our story</span></div>
  <section className="fc-about-hero"><div><span>THE STORY / EST. 2026</span><h1>Fashion feels better when it feels like you.</h1><p>From statement pieces to everyday favourites, this demo storefront brings discovery, complete looks and a considered shopping experience into one space.</p><Link to={getLink(config,'shop')}>Explore the collection <Arrow/></Link></div><Image src={fashionImage['campaign-luxury']} alt="Fashion editorial"/></section>
  <div className="fc-about-manifesto"><span>OUR POINT OF VIEW</span><h2>Clothes to live in.<br/>Styles worth remembering.</h2><p>This is sample brand storytelling. When a business purchases the website, its own founders, photography, values, sizing and collections replace these examples.</p></div>
  <div className="fc-about-panels"><div><Image src={fashionImage['campaign-street']} alt="Contemporary fashion editorial"/><h3>Personal styling</h3><p>Put together the outfit without searching across several disconnected product pages.</p></div><div><Image src={fashionImage['look-wine']} alt="Burgundy look from shared catalogue"/><h3>Curated discoveries</h3><p>Thoughtful collections that help customers see how each piece fits together.</p></div></div>
 </main>
}
function FAQPage({config}){
 const [expanded,setExpanded]=useState('Can I buy products on this preview?')
 const questions=[
  ['Can I buy products on this preview?','No. All products, cart interactions and checkout notices are demonstrations. Real payments become active after the store owner connects a payment provider and verifies their details.'],
  ['Does the virtual fitting room actually change clothes on a person?','Curated complete looks show real outfit photographs that closely match the associated product images. Custom combinations appear as an outfit board. Live AR and AI try-on are not active.'],
  ['Where do the product photographs come from?','The three stores share one set of 30 temporary online images. The business will replace them with photos it owns or is licensed to use before launching.'],
  ['Are sizes and stock availability accurate?','No. Sample prices, sizes and availability are placeholders. In a real store these come from the business catalogue and inventory system.'],
  ['Can customers save items and keep a shopping bag?','Yes, in this prototype saved items and the bag are stored in the current browser. Each sample website keeps its own bag.'],
  ['Can I customise this website for my own fashion business?','Yes. This concept can be adapted with your logo, photography, product details, size guide, policies, payment provider and domain.']
 ]
 return <main className="fc-commerce-main fc-help"><div className="fc-breadcrumb"><Link to={config.root}>Home</Link><span>/</span><span>Help</span></div><div className="fc-help-hero"><span>GOOD TO KNOW</span><h1>Questions, answered.</h1><p>Everything about this fashion store preview and the shopping experience.</p></div><div className="fc-help-questions">{questions.map(([q,a])=><div key={q}><button onClick={()=>setExpanded(expanded===q?'':q)} aria-expanded={expanded===q}>{q}<span>{expanded===q?'−':'+'}</span></button>{expanded===q&&<p>{a}</p>}</div>)}</div><div className="fc-help-bottom"><h2>Found your next favourite?</h2><Link to={getLink(config,'shop')}>Explore the shop <Arrow up/></Link></div></main>
}
function CartPage({config}){
 const shop=useStore()
 const [demo,setDemo]=useState(false)
 return <main className="fc-commerce-main fc-cart-page"><div className="fc-breadcrumb"><Link to={config.root}>Home</Link><span>/</span><span>Shopping bag</span></div><header className="fc-commerce-heading"><p>YOUR SELECTION</p><h1>Your shopping bag<span>({shop.count})</span></h1></header>{shop.bag.length?<div className="fc-cart-layout"><div>{shop.bag.map(({item,quantity})=><article key={item.id} className="fc-cart-item"><Link to={getLink(config,'product/'+item.id)}><Image src={item.image} alt={item.name}/></Link><div><span>{item.category}</span><Link to={getLink(config,'product/'+item.id)}>{item.name}</Link><strong>{money(item.price)}</strong><div><button onClick={()=>shop.change(item.id,-1)} aria-label="Remove one">−</button><span>{quantity}</span><button onClick={()=>shop.change(item.id,1)} aria-label="Add one">+</button></div></div><button className="fc-cart-remove" onClick={()=>shop.remove(item.id)}>Remove</button></article>)}</div><aside><h2>ORDER SUMMARY</h2><div><span>Subtotal</span><strong>{money(shop.subtotal)}</strong></div><p>Shipping and taxes would be calculated at checkout.</p><button className="fc-primary-action" onClick={()=>setDemo(true)}>CONTINUE TO CHECKOUT <Arrow/></button>{demo&&<div className="fc-checkout-notice" role="status">This is a demo store. Payments are not yet connected and no order has been placed.</div>}<Link to={getLink(config,'shop')}>Continue shopping</Link></aside></div>:<div className="fc-empty-cart"><h2>Your bag is empty.</h2><p>There are so many good pieces waiting to be discovered.</p><Link to={getLink(config,'shop')}>Explore the collection <Arrow up/></Link></div>}</main>
}
function WishlistPage({config}){
 const shop=useStore()
 const saved=fashionInventory.filter(p=>shop.saved.includes(p.id))
 return <main className="fc-commerce-main fc-saved-page"><div className="fc-breadcrumb"><Link to={config.root}>Home</Link><span>/</span><span>Saved</span></div><header className="fc-commerce-heading"><p>YOUR OWN EDIT</p><h1>Saved pieces<span>({saved.length})</span></h1><div><p>A little list of everything that caught your eye.</p></div></header>{saved.length?<div className="fc-products-grid">{saved.map(p=><SmallProduct key={p.id} config={config} p={p}/>)}</div>:<div className="fc-empty-cart"><h2>Nothing saved yet.</h2><p>Tap a heart on a product to keep it here.</p><Link to={getLink(config,'shop')}>Find something you love <Arrow up/></Link></div>}</main>
}
function NotFound({config}) {return <main className="fc-commerce-main fc-empty-cart"><h1>That page isn't part of this collection.</h1><Link to={config.root}>Back to the store <Arrow/></Link></main>}

function PlatformBody({mode}){
 const config=CONFIG[mode]
 const location=useLocation()
 const path=location.pathname.slice(config.root.length).replace(/^\//,'')
 const [section,segment]=path.split('/')
 const home=!section
 const homeLanding=mode==='editorial'?<FashionEditorial/>:mode==='catalogue'?<FashionCatalogue/>:<FashionMinimal/>
 const shop=useStore()
 const commerce = section==='shop'?<ShopPage key={location.search} config={config}/>:
 section==='product'?<ProductPage config={config} key={segment} id={segment}/>:
 section==='looks'?<LooksPage config={config} key={segment||'all'} lookId={segment}/>:
 section==='about'?<AboutPage config={config}/>:
 section==='faq'?<FAQPage config={config}/>:
 section==='cart'?<CartPage config={config}/>:
 section==='wishlist'?<WishlistPage config={config}/>:
 section==='fitting-room'&&mode==='minimal'?<FashionMinimal/>:
 section==='stylist'&&mode==='catalogue'?<FashionCatalogue/>:
 section==='campaign'&&mode==='editorial'?<FashionEditorial/>:<NotFound config={config}/>
 return <div className={'commerce-platform commerce-platform--'+mode}>
  {(!home||mode!=='editorial')&&<SiteNav config={config} mode={mode}/>}
  {home?homeLanding:commerce}
  {home&&<HomeSections mode={mode} config={config}/>}
  <Footer mode={mode} config={config}/>
  {!home&&!['stylist','campaign','fitting-room'].includes(section)&&<Bag shop={shop}/>}
 </div>
}
export default function FashionPlatform({mode='catalogue'}){return <FashionStoreProvider site={mode}><PlatformBody mode={mode}/></FashionStoreProvider>}
