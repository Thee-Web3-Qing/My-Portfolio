import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
 giftBrands,giftPhotos,giftProducts,giftCategories,giftOccasions,giftItems,
 giftPackaging,getGift,getGiftItem,getPackaging,giftMoney as money
} from './giftStoreData.js'
import './giftStorefront.css'

const go=(store,path='')=>store.root+(path?'/'+path:'')
const arrow=''
function Icon({name,size=19}){
 const paths={
 bag:'M5 9h14l1 12H4L5 9ZM9 9V6a3 3 0 0 1 6 0v3',
 heart:'M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z',
 search:'M21 21l-4.5-4.5M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
 close:'M5 5l14 14M19 5 5 19',
 menu:'M4 6h16M4 12h16M4 18h16',
 plus:'M12 5v14M5 12h14',
 minus:'M5 12h14',
 check:'M4 12l5 5L20 6',
 arrow:'M5 12h14m-6-6 6 6-6 6',
 gift:'M3 10h18v11H3V10ZM2 6h20v4H2V6ZM12 6v15M12 6c-8 0-7-5-4-5 2 0 4 3 4 5Zm0 0c8 0 7-5 4-5-2 0-4 3-4 5Z',
 sparkle:'m12 2 1.9 7.1L21 11l-7.1 1.9L12 20l-1.9-7.1L3 11l7.1-1.9L12 2Z'
 }
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.sparkle}/></svg>
}
function Img({src,alt,...props}){
 const [failed,setFailed]=useState(false)
 return <img {...props} src={failed?giftPhotos.texture:src} alt={alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>
}
function useGiftBag(store){
 const key='qing-december-gift-'+store.id
 const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem(key+'-cart')||'[]')}catch{return []}})
 const [saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem(key+'-saved')||'[]')}catch{return []}})
 const [open,setOpen]=useState(false)
 useEffect(()=>{try{localStorage.setItem(key+'-cart',JSON.stringify(cart))}catch{}},[key,cart])
 useEffect(()=>{try{localStorage.setItem(key+'-saved',JSON.stringify(saved))}catch{}},[key,saved])
 const count=cart.reduce((n,item)=>n+item.quantity,0)
 const total=cart.reduce((n,item)=>n+item.unitPrice*item.quantity,0)
 const add=(product,options={})=>{
  const qty=Math.max(1,Math.min(40,Number(options.quantity)||1))
  const wrap=getPackaging(options.packaging||'sage')
  const extras=Array.isArray(options.extras)?options.extras.filter(id=>giftItems.some(i=>i.id===id)):[]
  const unitPrice=Number(product.price)+wrap.price+(options.isCustom?extras.reduce((n,id)=>n+(getGiftItem(id)?.price||0),0):0)
  const memo=String(options.message||'').slice(0,240)
  const recipient=String(options.recipient||'').slice(0,100)
  const date=String(options.date||'').slice(0,20)
  const keyValue=[product.id,wrap.id,[...extras].sort().join(','),memo,recipient,date].join('|')
  const line={key:keyValue,id:product.id,name:product.name,image:product.image,unitPrice,quantity:qty,packaging:wrap.name,extras,recipient,message:memo,date}
  setCart(current=>{const match=current.find(item=>item.key===keyValue);return match?current.map(item=>item.key===keyValue?{...item,quantity:item.quantity+qty}:item):[...current,line]})
  setOpen(true)
 }
 const change=(keyValue,delta)=>setCart(current=>current.map(item=>item.key===keyValue?{...item,quantity:item.quantity+delta}:item).filter(item=>item.quantity>0))
 const remove=keyValue=>setCart(current=>current.filter(item=>item.key!==keyValue))
 const toggle=id=>setSaved(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
 return {cart,saved,open,setOpen,count,total,add,change,remove,toggle}
}
function GiftNav({store,bag}){
 const [menu,setMenu]=useState(false)
 const location=useLocation()
 const pages=[['The collection','shop'],['Build a hamper','build'],['Corporate gifting','corporate'],['Our story','about']]
 return <header className="gg-nav">
  <Link className="gg-brand" to={store.root}>
   {store.id==='editorial'?<><span className="gg-mark-star">✳</span><span>MAISON <em>NOËL</em><small>THE ART OF GIVING</small></span></>
   :store.id==='catalogue'?<><span className="gg-mark-circle">✿</span><span>THE GIFT <em>CLUB</em><small>GOOD THINGS, GIFT-WRAPPED</small></span></>
   :<><span className="gg-mark-signet">K.</span><span>THE KIND EDIT<small>THOUGHTFULLY GIVEN</small></span></>}
  </Link>
  <nav className={'gg-nav-links '+(menu?'open':'')} aria-label="Gift shop navigation">{pages.map(([name,path])=><Link key={path} to={go(store,path)} className={location.pathname===go(store,path)?'selected':''} onClick={()=>setMenu(false)}>{name}</Link>)}<Link className="gg-mobile-only" to={go(store,'contact')} onClick={()=>setMenu(false)}>Contact</Link><Link className="gg-mobile-only" to={go(store,'faq')} onClick={()=>setMenu(false)}>Help</Link></nav>
  <div className="gg-nav-right">
   <Link className="gg-nav-wish" to={go(store,'wishlist')} aria-label={'Saved gifts ('+bag.saved.length+')'}><Icon name="heart"/>{bag.saved.length>0&&<sup>{bag.saved.length}</sup>}</Link>
   <button type="button" onClick={()=>bag.setOpen(true)} aria-label={'Open gift bag, '+bag.count+' items'}><Icon name="bag"/><sup>{bag.count}</sup></button>
   <button className="gg-nav-mobile" type="button" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label="Toggle navigation"><Icon name={menu?'close':'menu'}/></button>
  </div>
 </header>
}
function Ribbon(){return <div className="gg-moving-ribbon" aria-hidden="true"><div>✳ THOUGHTFUL GESTURES &nbsp;&nbsp; ✳ BEAUTIFUL SURPRISES &nbsp;&nbsp; ✳ WRAPPED WITH CARE &nbsp;&nbsp; ✳ GIVING SEASON &nbsp;&nbsp; ✳ THOUGHTFUL GESTURES &nbsp;&nbsp; ✳ BEAUTIFUL SURPRISES &nbsp;&nbsp; ✳ WRAPPED WITH CARE &nbsp;&nbsp; ✳ GIVING SEASON</div></div>}
function ProductCard({product,store,bag}){
 const saved=bag.saved.includes(product.id)
 return <article className="gg-product-card">
  <div className="gg-product-photo">
   <Link to={go(store,'product/'+product.id)} aria-label={'View '+product.name}><Img src={product.image} alt={'Illustrative gift box photography for '+product.name}/></Link>
   {product.marker&&<span className="gg-product-marker">{product.marker}</span>}
   <button className={'gg-product-heart '+(saved?'active':'')} aria-label={(saved?'Remove ':'Save ')+product.name} aria-pressed={saved} onClick={()=>bag.toggle(product.id)}><Icon name="heart" size={18}/></button>
   <button className="gg-product-add" onClick={()=>bag.add(product)} aria-label={'Add '+product.name+' to bag'}><Icon name="plus" size={16}/></button>
  </div>
  <div className="gg-product-text"><div><span>{product.category}</span><Link to={go(store,'product/'+product.id)}><h3>{product.name}</h3></Link></div><strong>{money(product.price)}</strong></div>
 </article>
}
function SectionHead({eyebrow,children,store,link='shop',light=false}){
 return <header className={'gg-section-head '+(light?'light':'')}><div><p>{eyebrow}</p><h2>{children}</h2></div><Link to={go(store,link)}>Explore more {arrow}</Link></header>
}
/* EDITORIAL: burgundy + evergreen, high-drama fashion-like editorial */
function EditorialHome({store,bag}){
 const feats=[giftProducts[0],giftProducts[1],giftProducts[3],giftProducts[8]]
 return <main className="gg-editorial-home">
  <section className="ge-hero">
   <div className="ge-hero-topline"><span>EST. FOR EVERY BEAUTIFUL MOMENT</span><span>HOLIDAY COLLECTION / 2026</span></div>
   <div className="ge-hero-copy"><span>GIFTING SEASON / VOL. 01</span><h1>THE ART<br/>OF <em>GIVING.</em></h1><p>Some things are too meaningful for ordinary wrapping. Make every gesture unforgettable.</p><div className="ge-hero-actions"><Link to={go(store,'shop')}>Shop the collection <Icon name="arrow" size={17}/></Link><Link to={go(store,'build')}>Create your own gift</Link></div><div className="ge-hero-index">01&nbsp; / &nbsp;03 &nbsp;&nbsp; ✳ A SEASON TO REMEMBER</div></div>
   <div className="ge-hero-visual"><span className="ge-hero-circle"></span><Img src={giftPhotos.editorialHero} alt="Deep-green holiday gift hamper with decorative golden stars"/><span className="ge-hero-seal">THE<br/>DECEMBER<br/>EDIT ✳</span></div>
   <div className="ge-hero-vertical">A SEASON FOR SOMETHING EXTRAORDINARY · 2026</div>
  </section>
  <Ribbon/>
  <section className="ge-categories"><div className="ge-small-intro"><p>01 / GIFTS THAT MEAN MORE</p><h2>Find the right<br/><em>kind of magic.</em></h2><span>From a small thank-you to a grand gesture. There is always a reason.</span></div><div className="ge-categories-grid">{[['FOR THE SEASON','Festive',giftPhotos.editorialHero],['FOR THE TEAM','Corporate',giftPhotos.luxuryDesk],['FOR THEIR PEACE','Wellness',giftPhotos.selfCare]].map(([name,cat,img],i)=><Link to={go(store,'shop?category='+cat)} key={cat} className={'ge-category ge-category-'+i}><Img src={img} alt={name+' curated gifts'}/><span><small>0{i+1} / SHOP BY MOOD</small><strong>{name}</strong></span></Link>)}</div></section>
  <section className="ge-editorial-story"><div><span>MAISON NOËL / OUR PHILOSOPHY</span><h2>It’s the thought.<br/><em>And everything after.</em></h2><p>Beyond the ribbon is a gesture someone will remember. Every box is imagined as a little celebration of the person receiving it.</p><Link to={go(store,'about')}>Our story <Icon name="arrow" size={17}/></Link></div><Img src={giftPhotos.blushHoliday} alt="Wrapped skincare and festive gifts with warm metallic ribbons"/></section>
  <section className="gg-home-collection"><SectionHead eyebrow="02 / OUR SIGNATURE EDIT" store={store}>The gifts worth <em>giving.</em></SectionHead><div className="gg-products-grid">{feats.map(p=><ProductCard key={p.id} product={p} store={store} bag={bag}/>)}</div></section>
  <section className="ge-big-quote"><span>THE PERSONAL TOUCH</span><h2>More than a box.<br/>A feeling, <em>beautifully delivered.</em></h2><div><Link to={go(store,'build')}>Build your own hamper <Icon name="arrow"/></Link><span>WRAP. WRITE. GIVE. LOVE.</span></div></section>
  <section className="ge-corporate"><Img src={giftPhotos.luxuryBox} alt="Executive gift box curated with coffee and premium treats"/><div><span>03 / THE CORPORATE COLLECTION</span><h2>For people who<br/>make things <em>possible.</em></h2><p>Celebrate your team, thank a client and mark the milestones that matter. Our business gifting experience is built around your message.</p><Link to={go(store,'corporate')}>Explore corporate gifting</Link></div></section>
 </main>
}
/* CATALOGUE: happy pink, punchy orange + butter with accessible search */
function CatalogueHome({store,bag}){
 const [recipient,setRecipient]=useState('Anyone')
 const [budget,setBudget]=useState('Any budget')
 const navigate=useNavigate()
 const [occasion,setOccasion]=useState('Just Because')
 const [featured,setFeatured]=useState('All')
 const picks=featured==='All'?giftProducts.slice(0,8):giftProducts.filter(p=>p.category===featured).slice(0,8)
 const submitFinder=()=>{
  const qs=new URLSearchParams()
  if(recipient==='Work bestie')qs.set('category','Corporate')
  else if(recipient==='Self-care lover')qs.set('category','Wellness')
  if(budget!=='Any budget')qs.set('budget',budget)
  if(!qs.has('category')&&occasion==='Christmas')qs.set('category','Festive')
  navigate(go(store,'shop')+(qs.toString()?'?'+qs.toString():''))
 }
 return <main className="gg-catalogue-home">
  <div className="gc-announcement">✳ SOMETHING GOOD IS COMING &nbsp;&nbsp; ✿ &nbsp;&nbsp; YOUR DECEMBER GIFT LIST STARTS HERE &nbsp;&nbsp; ✳</div>
  <section className="gc-hero"><div className="gc-hero-copy"><span>IT’S THE THOUGHT (AND THE WRAPPING!) ✳</span><h1>Good gifts.<br/><em>BIG</em> feelings.</h1><p>For birthdays, big wins and the people who make ordinary days better. Pick a gift. Add a note. Make someone smile.</p><div><Link to={go(store,'shop')}>SHOP ALL THE GOOD STUFF <Icon name="arrow" size={18}/></Link><Link to={go(store,'build')}>Make your own box</Link></div><div className="gc-social-proof"><b>100% FEEL-GOOD ENERGY</b><span>Beautifully presented, thoughtfully chosen.</span></div></div><div className="gc-hero-image"><span className="gc-orb"></span><Img src={giftPhotos.colorfulWrap} alt="Colourful ribbon-tied gift boxes and wrapping paper"/><span className="gc-hero-sticker">HEY YOU,<br/>THIS ONE’S<br/>FOR YOU! ✳</span><div className="gc-floating-tag">✿ READY TO GIFT<br/><small>AND READY TO LOVE.</small></div></div></section>
  <div className="gc-ribbon">BIRTHDAYS &nbsp; ✳ &nbsp; CONGRATS &nbsp; ✳ &nbsp; JUST BECAUSE &nbsp; ✳ &nbsp; WORK BESTIES &nbsp; ✳ &nbsp; LITTLE SURPRISES &nbsp; ✳</div>
  <section className="gc-moments"><SectionHead eyebrow="01 / THERE'S ALWAYS A REASON" store={store} link="shop">Shop by <em>moment.</em></SectionHead><div className="gc-moment-grid">{[['Just Because','Everyday',giftPhotos.colorfulWrap],['SOMETHING FESTIVE','Festive',giftPhotos.editorialHero],['SOME WELL-DESERVED REST','Wellness',giftPhotos.selfCare],['A BIG THANK YOU','Corporate',giftPhotos.luxuryBox]].map(([name,cat,image],i)=><Link key={cat} to={go(store,'shop?category='+cat)} className={'gc-moment gc-moment-'+i}><Img src={image} alt={cat+' gift ideas'}/><span>{name} </span></Link>)}</div></section>
  <section className="gc-gift-finder"><div><span>NOT SURE WHAT TO GET?</span><h2>Find their<br/><em>happy thing.</em></h2><p>A little help for the lovingly indecisive. Pick a person and a budget, and we'll narrow down the gift shelf.</p></div><form onSubmit={e=>{e.preventDefault();submitFinder()}}><label>WHO'S THE LUCKY PERSON?<select value={recipient} onChange={e=>setRecipient(e.target.value)}>{['Anyone','Work bestie','Self-care lover','Someone special'].map(x=><option key={x}>{x}</option>)}</select></label><label>WHAT'S THE OCCASION?<select value={occasion} onChange={e=>setOccasion(e.target.value)}>{giftOccasions.map(x=><option key={x}>{x}</option>)}</select></label><label>YOUR BUDGET<select value={budget} onChange={e=>setBudget(e.target.value)}>{['Any budget','Under ₦40,000','₦40,000 to ₦70,000','Above ₦70,000'].map(x=><option key={x}>{x}</option>)}</select></label><button type="submit">FIND A GIFT <Icon name="arrow" size={18}/></button></form></section>
  <section className="gg-home-collection gc-bestsellers"><SectionHead eyebrow="02 / THE PEOPLE HAVE SPOKEN" store={store}>Everyone’s <em>favourites.</em></SectionHead><div className="gc-pick-tabs">{['All','Gourmet','Wellness','Corporate','Festive'].map(x=><button key={x} className={featured===x?'active':''} onClick={()=>setFeatured(x)}>{x}</button>)}</div><div className="gg-products-grid">{picks.map(p=><ProductCard key={p.id} product={p} store={store} bag={bag}/>)}</div></section>
  <section className="gc-big-banner"><div><span>FOR YOUR OWN KIND OF CELEBRATION</span><h2>You pick the joy.<br/>We’ll wrap it <em>up.</em></h2><p>Choose the little treasures, customise the packaging and write the note they'll keep.</p><Link to={go(store,'build')}>BUILD YOUR BOX <Icon name="arrow"/></Link></div><Img src={giftPhotos.blushHoliday} alt="Gifts in a holiday beauty box with ribbons"/><span className="gc-banner-flower">✿</span></section>
  <section className="gc-corporate-strip"><span>FOR TEAMS BIG AND SMALL ✳</span><h2>Good teams deserve <em>good gifts.</em></h2><Link to={go(store,'corporate')}>CORPORATE GIFTING</Link></section>
 </main>
}
/* MINIMAL: architectural ecru and sage, builder-first */
function MinimalHome({store,bag}){
 return <main className="gg-minimal-home">
  <section className="gm-hero"><div className="gm-hero-copy"><span>THE KIND EDIT / ISSUE NO. 01</span><h1>A beautiful<br/>thing to <em>give.</em></h1><p>Considered objects, thoughtful gestures and the pleasure of making someone feel seen.</p><Link to={go(store,'shop')}>Explore the collection <Icon name="arrow" size={18}/></Link><div className="gm-hero-index"><span>01</span><i></i><span>03</span><small>THE DECEMBER EDIT</small></div></div><div className="gm-hero-photo"><Img src={giftPhotos.luxuryDesk} alt="Minimal curated hamper featuring ceramic cup, candle, tea and chocolate"/><span className="gm-top-tag">SOMETHING THOUGHTFUL <Icon name="sparkle" size={13}/></span></div><span className="gm-hero-number">2026.</span></section>
  <section className="gm-intro"><span>THE BEAUTY IN THE SMALL THINGS</span><h2>Every gesture<br/><em>tells a story.</em></h2><p>Whether it is a thoughtful thank-you or a celebration worth remembering, the perfect gift feels personal from the very first detail.</p></section>
  <section className="gm-triptych">{[giftProducts[1],giftProducts[2],giftProducts[5]].map((p,i)=><Link to={go(store,'product/'+p.id)} key={p.id} className="gm-triptych-card"><div><Img src={p.image} alt={p.name}/></div><span>0{i+1} / {p.category.toUpperCase()}</span><h3>{p.name} </h3><small>{money(p.price)}</small></Link>)}</section>
  <section className="gm-builder-tease"><div className="gm-builder-copy"><span>MAKE IT PERSONAL / YOUR OWN EDIT</span><h2>One box.<br/><em>Entirely yours.</em></h2><p>Choose the pieces, pick your wrapping and write the words. We bring it together in one thoughtful package.</p><Link to={go(store,'build')}>Build a personal gift <Icon name="arrow" size={18}/></Link><div className="gm-small-detail">BOX · CONTENTS · CARD · THE FINISHING TOUCH</div></div><div className="gm-builder-photo"><Img src={giftPhotos.coffeeBox} alt="Open neutral gift box with candle, coffee, travel mug and wrapped treats"/><span>YOUR THOUGHTFUL<br/>GESTURE STARTS HERE.</span></div></section>
  <section className="gg-home-collection gm-featured"><SectionHead eyebrow="THE COLLECTION / 2026" store={store}>Considered <em>favourites.</em></SectionHead><div className="gg-products-grid">{[giftProducts[0],giftProducts[4],giftProducts[6],giftProducts[9]].map(p=><ProductCard key={p.id} product={p} store={store} bag={bag}/>)}</div></section>
  <section className="gm-our-story"><Img src={giftPhotos.starWrap} alt="Beautiful paper gifts and ribbon-tied wrapping"/><div><span>THE THOUGHT BEHIND IT</span><h2>Made to<br/>mean <em>more.</em></h2><p>We believe in little luxuries with lasting meaning, carefully considered from the first item to the last fold of the wrapping paper.</p><Link to={go(store,'about')}>Our story</Link></div></section>
  <section className="gm-corporate-cta"><span>BECAUSE THOUGHTFULNESS SCALES</span><h2>A considered gesture,<br/>for every <em>relationship.</em></h2><Link to={go(store,'corporate')}>Corporate gifts and enquiries</Link></section>
 </main>
}
function Breadcrumb({store,sections}){return <div className="gg-breadcrumb"><Link to={store.root}>Home</Link>{sections.map((x,i)=><span key={i}>/ {x}</span>)}</div>}
function Shop({store,bag}){
 const location=useLocation()
 const url=new URLSearchParams(location.search)
 const [category,setCategory]=useState(url.get('category')&&giftCategories.includes(url.get('category'))?url.get('category'):'All')
 const [query,setQuery]=useState(url.get('q')||'')
 const [sort,setSort]=useState('featured')
 const [budget,setBudget]=useState(url.get('budget')||'Any budget')
 const [savedOnly,setSavedOnly]=useState(false)
 const filtered=useMemo(()=>{
  let items=giftProducts.filter(x=>(category==='All'||x.category===category)
   &&(!savedOnly||bag.saved.includes(x.id))
   &&(x.name+' '+x.category+' '+x.caption+' '+x.contents.join(' ')).toLowerCase().includes(query.toLowerCase())
   &&(budget==='Any budget'||(budget==='Under ₦40,000'&&x.price<40000)||(budget==='₦40,000 to ₦70,000'&&x.price>=40000&&x.price<=70000)||(budget==='Above ₦70,000'&&x.price>70000)))
  if(sort==='low')items=[...items].sort((a,b)=>a.price-b.price)
  if(sort==='high')items=[...items].sort((a,b)=>b.price-a.price)
  if(sort==='name')items=[...items].sort((a,b)=>a.name.localeCompare(b.name))
  return items
 },[bag.saved,category,query,sort,budget,savedOnly])
 return <main className="gg-inner gg-shop"><Breadcrumb store={store} sections={['The collection']}/><div className="gg-page-heading"><span>THE COLLECTION / READY TO GIVE</span><h1>Every reason<br/>to <em>celebrate.</em></h1><p>Explore the gift boxes, find your favourite and add a personal message at the finishing touch.</p></div><div className="gg-shop-layout"><aside><h2>FIND YOUR GIFT</h2><div className="gg-filter-list">{giftCategories.map(c=><button key={c} className={c===category?'selected':''} onClick={()=>setCategory(c)}>{c}<span>{c==='All'?giftProducts.length:giftProducts.filter(x=>x.category===c).length}</span></button>)}</div><label className="gg-save-filter"><input type="checkbox" checked={savedOnly} onChange={e=>setSavedOnly(e.target.checked)}/> Saved gifts only</label><div className="gg-filter-promo"><strong>MAKE IT YOURS ✳</strong><p>Create a hamper from the little treasures they'll love.</p><Link to={go(store,'build')}>Build your own box</Link></div></aside><div className="gg-shop-results"><div className="gg-shop-tools"><label><Icon name="search" size={18}/><input type="search" placeholder="Search gifts, moods or contents" value={query} onChange={e=>setQuery(e.target.value)}/></label><select aria-label="Gift budget" value={budget} onChange={e=>setBudget(e.target.value)}>{['Any budget','Under ₦40,000','₦40,000 to ₦70,000','Above ₦70,000'].map(x=><option key={x}>{x}</option>)}</select><select aria-label="Sort gifts" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">A to Z</option></select></div><div className="gg-mobile-filter">{giftCategories.map(c=><button key={c} className={category===c?'selected':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="gg-results-count">{filtered.length} GIFT IDEAS</div>{filtered.length?<div className="gg-products-grid">{filtered.map(p=><ProductCard key={p.id} product={p} store={store} bag={bag}/>)}</div>:<div className="gg-empty"><h2>Nothing in this little corner yet.</h2><p>Try a wider budget or browse all our gifts.</p><button onClick={()=>{setCategory('All');setBudget('Any budget');setQuery('');setSavedOnly(false)}}>Show all gifts</button></div>}</div></div></main>
}
function Product({store,bag,id}){
 const product=getGift(id)
 const [packaging,setPackaging]=useState('sage')
 const [quantity,setQuantity]=useState(1)
 const [recipient,setRecipient]=useState('')
 const [note,setNote]=useState('')
 const [date,setDate]=useState('')
 const [expanded,setExpanded]=useState('Inside the box')
 if(!product)return <Missing store={store}/>
 const selected=getPackaging(packaging)
 const pair=giftProducts.filter(p=>p.id!==product.id&&(p.category===product.category)).concat(giftProducts.filter(p=>p.id!==product.id&&p.category!==product.category)).slice(0,4)
 return <main className="gg-inner gg-product-page"><Breadcrumb store={store} sections={['The collection',product.name]}/><div className="gg-pdp"><div className="gg-pdp-photo"><Img src={product.image} alt={'Illustrative gift arrangement for '+product.name}/><span>CURATED GIFT / {product.category.toUpperCase()}</span></div><div className="gg-pdp-copy"><span className="gg-overline">THOUGHTFULLY CURATED / NO. {String(giftProducts.indexOf(product)+1).padStart(2,'0')}</span><h1>{product.name}</h1><p>{product.caption}</p><strong className="gg-price">{money(product.price)}</strong><div className="gg-pdp-contents"><h3>THE THOUGHTFUL DETAILS</h3><div>{product.contents.map(item=><span key={item}>✳ {item}</span>)}</div></div><div className="gg-label">CHOOSE YOUR WRAPPING</div><div className="gg-packing-swatches">{giftPackaging.map(p=><button type="button" key={p.id} className={packaging===p.id?'active':''} onClick={()=>setPackaging(p.id)} aria-pressed={packaging===p.id}><i style={{background:p.color}}/>{p.name}{p.price>0?' +'+money(p.price):''}</button>)}</div><div className="gg-pdp-fields"><label>WHO'S IT FOR?<input value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="Their name (optional)" maxLength={100}/></label><label>PERSONAL GIFT NOTE<textarea rows={3} maxLength={240} value={note} onChange={e=>setNote(e.target.value)} placeholder="A little message from the heart…"/></label><label>PREFERRED DELIVERY DATE <small>(illustrative)</small><input type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)}/></label></div><div className="gg-pdp-buy"><div className="gg-quantity"><button type="button" onClick={()=>setQuantity(q=>Math.max(1,q-1))} aria-label="Reduce quantity">−</button><strong>{quantity}</strong><button type="button" onClick={()=>setQuantity(q=>Math.min(40,q+1))} aria-label="Increase quantity">+</button></div><button type="button" className="gg-primary" onClick={()=>bag.add(product,{quantity,packaging,recipient,message:note,date})}>ADD TO GIFT BAG · {money((product.price+selected.price)*quantity)} <Icon name="arrow" size={16}/></button></div><div className="gg-accordions">{[['Inside the box',product.contents.join(' · ')],['Packaging & personalisation','Choose a wrapping colour, enter a recipient and add a personal note. Actual box contents and wrapping must be verified by the merchant before real orders.'],['Delivery & fulfilment','Sample website only. Real delivery zones, timelines and fees are configured when the business launches.']].map(([title,body])=><div key={title}><button type="button" onClick={()=>setExpanded(expanded===title?'':title)} aria-expanded={expanded===title}>{title}<span>{expanded===title?'−':'+'}</span></button>{expanded===title&&<p>{body}</p>}</div>)}</div></div></div><section className="gg-related"><SectionHead eyebrow="THE FINISHING TOUCHES" store={store}>More to <em>love.</em></SectionHead><div className="gg-products-grid">{pair.map(p=><ProductCard key={p.id} product={p} store={store} bag={bag}/>)}</div></section></main>
}
function HamperVisual({chosen,packaging,note,recipient,total}){
 const box=getPackaging(packaging)
 return <div className="gg-builder-box" style={{'--wrap-color':box.color,'--wrap-ink':box.ink}}>
  <div className="gg-builder-box-top"><span>YOUR GIFT · 01/01</span><span>HANDPICKED FOR YOU</span></div>
  <div className="gg-builder-render"><div className="gg-builder-render-bg"></div><div className="gg-builder-ribbon-horizontal"></div><div className="gg-builder-ribbon-vertical"></div><div className="gg-builder-bow">✳</div><div className="gg-builder-box-label">THE<br/>KIND<br/>EDIT.</div></div>
  <div className="gg-builder-content-preview"><span>INSIDE YOUR BOX</span><div>{chosen.length?chosen.map(id=>{const p=getGiftItem(id);return <div key={id} className="gg-builder-chip"><b>{p.symbol}</b><small>{p.name}</small></div>}):<p>Choose a few treasures to fill your hamper.</p>}</div></div>
  <div className="gg-builder-box-bottom"><span>{recipient?'FOR '+recipient.toUpperCase():'A LITTLE GESTURE, YOUR WAY.'}</span><strong>{money(total)}</strong></div>
  {note&&<div className="gg-builder-note-preview">✎ “{note.slice(0,90)}{note.length>90?'…':''}”</div>}
 </div>
}
function Build({store,bag}){
 const [selected,setSelected]=useState(['candle','coffee','chocolate'])
 const [packaging,setPackaging]=useState('sage')
 const [recipient,setRecipient]=useState('')
 const [note,setNote]=useState('')
 const [date,setDate]=useState('')
 const [quantity,setQuantity]=useState(1)
 const [family,setFamily]=useState('All')
 const base=19500
 const total=base+getPackaging(packaging).price+selected.reduce((s,id)=>s+(getGiftItem(id)?.price||0),0)
 const toggle=id=>setSelected(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
 const add=()=>{bag.add({id:'custom-box',name:'Your Custom Hamper',image:giftPhotos.luxuryDesk,price:base},{packaging,recipient,message:note,date,quantity,extras:selected,isCustom:true})}
 return <main className="gg-inner gg-build-page"><Breadcrumb store={store} sections={['Build a hamper']}/><header className="gg-builder-intro"><span>YOUR GIFTING STUDIO / 01 TO 04</span><h1>Make it <em>personal.</em></h1><p>Choose the little treasures, find the perfect wrapping and write the note they’ll hold on to. Your selections and total update together.</p></header><div className="gg-builder-layout"><div className="gg-builder-preview"><HamperVisual chosen={selected} packaging={packaging} note={note} recipient={recipient} total={total}/><p>A styled packaging illustration shows your selections. Actual physical arrangement and inventory are confirmed when the merchant launches.</p></div><div className="gg-builder-controls"><section><div className="gg-builder-step"><span>01</span><div><h2>Fill the box.</h2><p>Select up to six personal favourites.</p></div></div><div className="gg-builder-tabs">{['All','Rituals','Indulgences','Keepsakes'].map(x=><button className={family===x?'active':''} key={x} onClick={()=>setFamily(x)}>{x}</button>)}</div><div className="gg-builder-items">{giftItems.filter(p=>family==='All'||p.family===family).map(p=><button type="button" key={p.id} className={selected.includes(p.id)?'active':''} onClick={()=>toggle(p.id)} aria-pressed={selected.includes(p.id)}><span className="gg-item-symbol">{p.symbol}</span><span><strong>{p.name}</strong><small>{money(p.price)}</small></span><b>{selected.includes(p.id)?'✓':'+'}</b></button>)}</div></section><section><div className="gg-builder-step"><span>02</span><div><h2>The wrapping.</h2><p>Choose the colour that feels right.</p></div></div><div className="gg-wrap-options">{giftPackaging.map(p=><button key={p.id} className={packaging===p.id?'active':''} onClick={()=>setPackaging(p.id)} aria-pressed={packaging===p.id}><i style={{background:p.color}}/><span>{p.name}<small>{p.price?'+ '+money(p.price):'Included'}</small></span></button>)}</div></section><section><div className="gg-builder-step"><span>03</span><div><h2>The words.</h2><p>Say the thing you wish they knew.</p></div></div><div className="gg-builder-inputs"><label>RECIPIENT<input maxLength={100} placeholder="Who are we celebrating?" value={recipient} onChange={e=>setRecipient(e.target.value)}/></label><label>YOUR MESSAGE<textarea rows={3} maxLength={240} placeholder="A handwritten-style note goes here…" value={note} onChange={e=>setNote(e.target.value)}/></label></div></section><section><div className="gg-builder-step"><span>04</span><div><h2>The finishing touch.</h2><p>Save your selection to the gift bag.</p></div></div><div className="gg-builder-last"><label>REQUESTED DELIVERY DATE <small>(demo)</small><input type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)}/></label><div className="gg-builder-summary"><span>Base gift box</span><b>{money(base)}</b><span>Selected pieces ({selected.length})</span><b>{money(total-base-getPackaging(packaging).price)}</b><span>Wrapping</span><b>{money(getPackaging(packaging).price)}</b><strong>YOUR HAMPER TOTAL</strong><strong>{money(total)}</strong></div><div className="gg-builder-cart-row"><div className="gg-quantity"><button onClick={()=>setQuantity(q=>Math.max(1,q-1))}>−</button><strong>{quantity}</strong><button onClick={()=>setQuantity(q=>Math.min(40,q+1))}>+</button></div><button className="gg-primary" onClick={add} disabled={selected.length===0}>ADD YOUR HAMPER · {money(total*quantity)} <Icon name="arrow" size={16}/></button></div></div></section></div></div></main>
}
function Corporate({store}){
 const [values,setValues]=useState({name:'',email:'',company:'',quantity:'10',budget:'',date:'',message:''})
 const [sent,setSent]=useState(false)
 const change=(key,val)=>setValues(cur=>({...cur,[key]:val}))
 return <main className="gg-inner gg-corporate"><Breadcrumb store={store} sections={['Corporate gifting']}/><section className="gg-corporate-intro"><div><span>FOR THE PEOPLE WHO MATTER AT WORK</span><h1>Make gratitude<br/>feel <em>extraordinary.</em></h1><p>Thank your team. Celebrate a client. Mark a milestone with a personalised gesture that feels considered, never ordinary.</p><a href="#gg-corporate-form">Start an enquiry</a></div><Img src={giftPhotos.luxuryBox} alt="Premium executive gift box with coffee, tea and a candle"/></section><section className="gg-corporate-trio">{[['01','CURATED GIFTING','Handpicked gift combinations to match the occasion.'],['02','PERSONAL TOUCH','A note, a wrapping style and a thoughtful finishing touch.'],['03','TEAM-WIDE MOMENTS','Design a gesture that works for small teams and big celebrations.']].map(([n,h,d])=><div key={n}><span>{n} / WHAT WE DO</span><h2>{h}</h2><p>{d}</p></div>)}</section><section className="gg-corporate-enquiry" id="gg-corporate-form"><div><span>LET'S WORK TOGETHER</span><h2>A thoughtful gift,<br/><em>for the whole team.</em></h2><p>Share your gifting requirements. This demonstrates the enquiry form. Real submissions need an email or CRM connection.</p></div><form onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<div className="gg-form-result" role="status"><Icon name="check" size={28}/><h3>Enquiry preview complete.</h3><p>Your details passed the form validation. This is a prototype, so no request was sent to a business.</p><button type="button" onClick={()=>setSent(false)}>Edit the enquiry</button></div>:<><label>YOUR NAME<input required value={values.name} onChange={e=>change('name',e.target.value)} placeholder="Your name"/></label><label>WORK EMAIL<input type="email" required value={values.email} onChange={e=>change('email',e.target.value)} placeholder="name@company.com"/></label><label>COMPANY OR ORGANISATION<input required value={values.company} onChange={e=>change('company',e.target.value)} placeholder="Company name"/></label><div className="gg-form-row"><label>NUMBER OF BOXES<input type="number" min="1" max="10000" required value={values.quantity} onChange={e=>change('quantity',e.target.value)}/></label><label>BUDGET PER BOX<input value={values.budget} onChange={e=>change('budget',e.target.value)} placeholder="e.g. ₦50,000"/></label></div><label>IDEAL DELIVERY DATE<input type="date" min={new Date().toISOString().slice(0,10)} value={values.date} onChange={e=>change('date',e.target.value)}/></label><label>ANYTHING ELSE?<textarea rows={4} value={values.message} onChange={e=>change('message',e.target.value)} placeholder="Tell us more about the occasion…"/></label><button type="submit" className="gg-primary">PREVIEW ENQUIRY <Icon name="arrow" size={17}/></button><small>No actual enquiry is transmitted.</small></>}</form></section></main>
}
function About({store}){
 return <main className="gg-inner gg-about"><Breadcrumb store={store} sections={['Our story']}/><div className="gg-about-hero"><div><span>BEHIND EVERY BEAUTIFUL GESTURE</span><h1>There’s always<br/>a story behind<br/><em>the gift.</em></h1><p>A beautiful present is more than the things inside. It is the care, the choice and the message that makes the moment.</p><Link to={go(store,'shop')}>Discover our collection</Link></div><Img src={giftPhotos.blushHoliday} alt="Softly wrapped ribbon-tied gift box"/></div><section className="gg-about-copy"><span>WE BELIEVE</span><h2>Giving should feel<br/><em>personal, always.</em></h2><p>These stories, products, images and descriptions are a creative demonstration of how a gift business can tell its own story. Your real business voice, history and photography will replace this sample content.</p></section><div className="gg-about-images"><Img src={giftPhotos.colorfulWrap} alt="Colourful gifts with ribbons"/><Img src={giftPhotos.starWrap} alt="Elegant stationery and ribbon gift wrapping"/></div></main>
}
function FAQ({store}){
 const [opened,setOpened]=useState(0)
 const rows=[
  ['Are these products available to buy?','This is a demonstration storefront. Photos, prices, product availability and gift contents are illustrative. No real payments or deliveries occur.'],
  ['Can I personalise a hamper?','Yes. Use the hamper builder to choose contents, wrapping, recipient and a note. Your selections update the example total and are saved in the demo cart.'],
  ['Can I place a bulk corporate order?','The corporate form demonstrates gathering business requirements, quantities and preferred dates. Real leads are delivered only once the site is connected to an email or CRM service.'],
  ['Can I choose a delivery date?','You can enter a preferred date for the demo. It is not a delivery booking or confirmed fulfilment window.'],
  ['Do you provide gift notes and custom packaging?','The demo shows gift note fields and three wrapping selections. Final materials, printing costs and card options must be confirmed by the business.'],
  ['Can you customise these sites for my brand?','Yes. Your own inventory, approved photos, brand fonts and colours, real checkout, delivery policies and company details can replace the example content before launch.'],
 ]
 return <main className="gg-inner gg-faq"><Breadcrumb store={store} sections={['Help']}/><div className="gg-page-heading"><span>NEED TO KNOW</span><h1>Good questions.<br/><em>Thoughtful answers.</em></h1></div><div className="gg-faq-list">{rows.map(([q,a],i)=><div key={q}><button aria-expanded={opened===i} onClick={()=>setOpened(opened===i?-1:i)}>{q}<span>{opened===i?'−':'+'}</span></button>{opened===i&&<p>{a}</p>}</div>)}</div></main>
}
function Contact({store}){
 const [data,setData]=useState({name:'',email:'',message:''})
 const [sent,setSent]=useState(false)
 return <main className="gg-inner gg-contact"><Breadcrumb store={store} sections={['Contact']}/><div><section><span>HAVE A QUESTION?</span><h1>Send a little<br/><em>hello.</em></h1><p>For gift questions, delivery enquiries or just to say hello, use the example contact form.</p><Img src={giftPhotos.starWrap} alt="Gift wrapping papers with ribbons"/></section><form onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<div className="gg-form-result"><h2>Preview complete.</h2><p>No message was sent because this is a demonstration website.</p><button type="button" onClick={()=>setSent(false)}>Write another</button></div>:<><h2>Write to us.</h2><label>YOUR NAME<input required value={data.name} onChange={e=>setData(s=>({...s,name:e.target.value}))}/></label><label>EMAIL ADDRESS<input required type="email" value={data.email} onChange={e=>setData(s=>({...s,email:e.target.value}))}/></label><label>MESSAGE<textarea required rows={6} value={data.message} onChange={e=>setData(s=>({...s,message:e.target.value}))}/></label><button className="gg-primary" type="submit">PREVIEW MESSAGE</button></>}</form></div></main>
}
function Cart({store,bag}){
 const [checkout,setCheckout]=useState(false)
 return <main className="gg-inner gg-cart-page"><Breadcrumb store={store} sections={['Your gift bag']}/><div className="gg-page-heading"><span>YOUR OWN GIFT EDIT</span><h1>Your gift bag <em>({bag.count})</em></h1></div>{bag.cart.length?<div className="gg-cart-layout"><div>{bag.cart.map(item=><article key={item.key} className="gg-cart-line"><Img src={item.image} alt={item.name}/><div><strong>{item.name}</strong><span>{item.packaging}</span><small>{item.recipient?'For '+item.recipient:'Ready for a thoughtful gesture'}</small>{item.message&&<small className="gg-cart-message">“{item.message}”</small>}{item.extras?.length>0&&<small>{item.extras.map(x=>getGiftItem(x)?.name).join(' · ')}</small>}<b>{money(item.unitPrice)}</b><div className="gg-quantity"><button onClick={()=>bag.change(item.key,-1)}>−</button><strong>{item.quantity}</strong><button onClick={()=>bag.change(item.key,1)}>+</button></div></div><button className="gg-remove" onClick={()=>bag.remove(item.key)}>Remove ×</button></article>)}</div><aside><h2>THE TOTAL</h2><div><span>Subtotal</span><strong>{money(bag.total)}</strong></div><p>Delivery fees and final availability are confirmed at checkout on a finished business website.</p><button className="gg-primary" onClick={()=>setCheckout(true)}>CONTINUE TO CHECKOUT <Icon name="arrow" size={17}/></button>{checkout&&<div className="gg-cart-alert" role="status">This is a storefront demonstration. No order was placed and no payment has been collected.</div>}<Link to={go(store,'shop')}>Continue gifting</Link></aside></div>:<div className="gg-empty"><h2>Nothing in your bag yet.</h2><p>There's someone worth celebrating.</p><Link to={go(store,'shop')}>Find the perfect gift</Link></div>}</main>
}
function Wishlist({store,bag}){
 const loved=giftProducts.filter(p=>bag.saved.includes(p.id))
 return <main className="gg-inner gg-wishlist"><Breadcrumb store={store} sections={['Saved gifts']}/><div className="gg-page-heading"><span>THE ONES YOU LOVE</span><h1>Your saved <em>gifts.</em></h1></div>{loved.length?<div className="gg-products-grid">{loved.map(p=><ProductCard key={p.id} product={p} store={store} bag={bag}/>)}</div>:<div className="gg-empty"><h2>Your favourites are waiting.</h2><p>Tap the heart on any gift to save it for later.</p><Link to={go(store,'shop')}>Discover gifts</Link></div>}</main>
}
function Missing({store}){return <main className="gg-inner gg-empty"><h1>This little gift isn't on the shelf.</h1><Link to={store.root}>Back to the store</Link></main>}
function CartDrawer({bag,store}){
 return bag.open?<div className="gg-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)bag.setOpen(false)}}><aside className="gg-drawer" role="dialog" aria-modal="true" aria-label="Your gift bag"><header><div><span>IT'S THE THOUGHT</span><h2>Your gift bag ({bag.count})</h2></div><button onClick={()=>bag.setOpen(false)} aria-label="Close bag"><Icon name="close"/></button></header><div className="gg-drawer-body">{bag.cart.length?bag.cart.map(x=><article key={x.key}><Img src={x.image} alt={x.name}/><div><strong>{x.name}</strong><span>{x.packaging}</span><b>{money(x.unitPrice)}</b><div className="gg-quantity"><button onClick={()=>bag.change(x.key,-1)}>−</button><strong>{x.quantity}</strong><button onClick={()=>bag.change(x.key,1)}>+</button></div></div><button onClick={()=>bag.remove(x.key)} aria-label={'Remove '+x.name}><Icon name="close" size={15}/></button></article>):<p className="gg-empty-drawer">A good surprise starts here. Explore the collection to add your first gift.</p>}</div><footer><div><span>Subtotal</span><strong>{money(bag.total)}</strong></div><p>Preview shopping bag. No payment will be taken.</p><Link to={go(store,'cart')} onClick={()=>bag.setOpen(false)}>VIEW YOUR BAG <Icon name="arrow" size={17}/></Link><button onClick={()=>bag.setOpen(false)}>Keep exploring</button></footer></aside></div>:null
}
function Newsletter({store}){
 const [email,setEmail]=useState('')
 const [sent,setSent]=useState(false)
 return <div className="gg-newsletter"><div><span>LOVE A GOOD SURPRISE?</span><h2>A little good news<br/><em>in your inbox.</em></h2><p>Sign up for new collections, gifting inspiration and the occasional good surprise.</p></div><form onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<p role="status">This is a newsletter preview. No email has been saved or sent.</p>:<><label htmlFor={'gg-email-'+store.id}>EMAIL ADDRESS</label><div><input id={'gg-email-'+store.id} type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/><button type="submit" aria-label="Preview newsletter signup"><Icon name="arrow"/></button></div></>}</form></div>
}
function Footer({store}){
 return <footer className="gg-footer"><Newsletter store={store}/><div className="gg-footer-content"><div><Link className="gg-footer-brand" to={store.root}>{store.name}</Link><p>Made for the person who makes your life a little brighter.</p><small>Sample gifts, prices and photographs. Checkout and fulfilment are not connected.</small></div><div><strong>THE GIFT SHOP</strong><Link to={go(store,'shop')}>All gifts</Link><Link to={go(store,'build')}>Build a hamper</Link><Link to={go(store,'wishlist')}>Saved gifts</Link></div><div><strong>MORE FROM US</strong><Link to={go(store,'corporate')}>Corporate gifting</Link><Link to={go(store,'about')}>Our story</Link><Link to={go(store,'faq')}>FAQs</Link></div><div><strong>QUESTIONS?</strong><Link to={go(store,'contact')}>Contact</Link><Link to={go(store,'cart')}>Your gift bag</Link><p>A little joy, wherever you are.</p></div></div><div className="gg-footer-bottom"><span>© 2026 {store.name}. WEBSITE DESIGN DEMONSTRATION.</span><a href="#gg-top">BACK TO TOP ↑</a></div></footer>
}
function GiftBody({store}){
 const bag=useGiftBag(store)
 const location=useLocation()
 const sub=location.pathname.slice(store.root.length).replace(/^\/+/,'')
 const [section,segment]=sub.split('/')
 const home=!section
 const content=home?(store.id==='editorial'?<EditorialHome store={store} bag={bag}/>:store.id==='catalogue'?<CatalogueHome store={store} bag={bag}/>:<MinimalHome store={store} bag={bag}/>)
  :section==='shop'?<Shop key={location.search} store={store} bag={bag}/>
  :section==='product'?<Product key={segment} store={store} bag={bag} id={segment}/>
  :section==='build'?<Build store={store} bag={bag}/>
  :section==='corporate'?<Corporate store={store}/>
  :section==='about'?<About store={store}/>
  :section==='faq'?<FAQ store={store}/>
  :section==='contact'?<Contact store={store}/>
  :section==='cart'?<Cart store={store} bag={bag}/>
  :section==='wishlist'?<Wishlist store={store} bag={bag}/>
  :<Missing store={store}/>
 useEffect(()=>{document.title=(section==='product'?getGift(segment)?.name:section?section.charAt(0).toUpperCase()+section.slice(1):'Home')+' | '+store.name+' | Gift Website Preview'},[section,segment,store])
 return <div id="gg-top" className={'gg-store gg-store-'+store.id}><GiftNav store={store} bag={bag}/>{content}<Footer store={store}/><CartDrawer bag={bag} store={store}/></div>
}
export default function GiftStorefront({mode='editorial'}){const store=giftBrands[mode]||giftBrands.editorial;return <GiftBody store={store}/>}
