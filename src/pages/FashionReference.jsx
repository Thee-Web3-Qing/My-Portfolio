
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fashionInventory, fashionLooks, fashionImage } from './fashionInventory.js'
import { fashionProducts, fashionImages, money } from './fashionData.js'
import './fashionReference.css'

/*
 * Faithful structural rebuild from the four supplied fashion UI references:
 * LOCO campaign storefront, HER FASHION three-column stylist,
 * wine-coloured mobile outfit cards, RUSH fitting room layout.
 * Stock photographs and merchandise are placeholders pending final assets.
 */
const pic = (id, w = 900) => 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=' + w + '&q=85'
const ICON = {
  search:'M21 21l-4.4-4.4 M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  menu:'M4 6h16M4 12h16M4 18h16',bag:'M5 8h14l1 13H4L5 8ZM9 9V6a3 3 0 0 1 6 0v3',
  heart:'M20.8 4.5a5.4 5.4 0 0 0-7.6 0L12 5.7l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.9a5.4 5.4 0 0 0 0-7.6Z',
  arrow:'M4 12h16m-6-6 6 6-6 6',arrowUp:'M7 17 17 7M8 7h9v9',left:'M15 18l-6-6 6-6',
  right:'M9 18l6-6-6-6',close:'M5 5l14 14M19 5 5 19',plus:'M12 5v14M5 12h14',
  minus:'M5 12h14',person:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21v-2a8 8 0 0 1 16 0v2',
  hanger:'M10 6a2 2 0 1 1 3 1c-1 1-1 2-1 3L2 19h20l-10-9',
  shirt:'M8 4l4 2 4-2 5 4-3 5-2-1v9H8v-9l-2 1-3-5 5-4',
  spark:'M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2',
  rotate:'M21 12a9 9 0 1 1-3-6.7M21 3v6h-6',
  filter:'M4 7h16M7 12h10m-7 5h4',check:'M4 12l5 5L20 6',
  star:'m12 2 2.8 6.7L22 9l-7.7 3 1.8 8L12 16l-6.1 4 1.8-8L0 9l7.2-.3L12 2',
  home:'M3 10 12 3l9 7v11h-7v-7h-4v7H3V10',
  bookmark:'M6 3h12v18l-6-4-6 4V3',info:'M12 11v6m0-9h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
}
function I({name,size=19}) {return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[name]||ICON.arrow}/></svg>}
function Img({src,alt,className=''}) {return <img className={className} src={src} alt={alt} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=pic('photo-1483985988355-763728e1935b')}}/>}
const demoBrands={ivory:'ZARA',pleat:'MANGO',boots:'ZARA',tabby:'COACH',wine:'MANGO',winepants:'MANGO',croco:'COACH',heels:'ASOS',bluecoat:'ZARA',whiteboots:'ZARA',rosebag:'COACH',greyskirt:'MANGO'}
const brandOptions=['ZARA','H&M','MANGO','ASOS','COACH']
const initial=fashionInventory.map((product,index)=>({...product,brand:demoBrands[product.id]||brandOptions[index%brandOptions.length],tone:product.colour}))
const popular = [...initial.slice(0,4)]
const storeNames=['ZARA','H&M','MANGO','ASOS']
const groupNames=['All','Tops','Bottoms','Outerwear','Dresses','Shoes','Bags','Accessories']

const ShopContext = createContext(null)
export function FashionStoreProvider({site,children}) {
 const key='qing-december-fashion-'+site
 const [bag,setBag]=useState(()=>{try{return JSON.parse(window.localStorage.getItem(key+'-bag')||'[]')}catch{return []}})
 const [bagOpen,setBagOpen]=useState(false)
 const [saved,setSaved]=useState(()=>{try{return JSON.parse(window.localStorage.getItem(key+'-saved')||'[]')}catch{return []}})
 const [notice,setNotice]=useState('')
 useEffect(()=>{try{window.localStorage.setItem(key+'-bag',JSON.stringify(bag))}catch{}},[key,bag])
 useEffect(()=>{try{window.localStorage.setItem(key+'-saved',JSON.stringify(saved))}catch{}},[key,saved])
 const count=bag.reduce((total,entry)=>total+entry.quantity,0)
 const subtotal=bag.reduce((total,entry)=>total+entry.item.price*entry.quantity,0)
 const add=(product,open=true)=>{setBag(cur=>{const prior=cur.find(entry=>entry.item.id===product.id);return prior?cur.map(entry=>entry.item.id===product.id?{...entry,quantity:entry.quantity+1}:entry):[...cur,{item:product,quantity:1}]});setNotice('');if(open)setBagOpen(true)}
 const addMultiple=(items)=>{setBag(cur=>{let next=[...cur];for(const product of items){const at=next.findIndex(entry=>entry.item.id===product.id);if(at>=0)next=next.map((entry,index)=>index===at?{...entry,quantity:entry.quantity+1}:entry);else next.push({item:product,quantity:1})}return next});setNotice('');setBagOpen(true)}
 const toggle=id=>setSaved(cur=>cur.includes(id)?cur.filter(x=>x!==id):[...cur,id])
 const change=(id,delta)=>setBag(cur=>cur.map(entry=>entry.item.id===id?{...entry,quantity:entry.quantity+delta}:entry).filter(entry=>entry.quantity>0))
 const remove=id=>setBag(cur=>cur.filter(entry=>entry.item.id!==id))
 const value={bag,bagOpen,setBagOpen,saved,toggle,add,addMultiple,count,subtotal,change,remove,notice,setNotice}
 return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
export function useStore() {const value=useContext(ShopContext);if(!value)throw new Error('Fashion store must be wrapped in FashionStoreProvider');return value}
export function Bag({shop}) {
 if(!shop.bagOpen)return null
 return <div className="ref-dim" onMouseDown={e=>{if(e.target===e.currentTarget)shop.setBagOpen(false)}}><aside className="ref-bag" role="dialog" aria-modal="true" aria-label="Your bag"><header><div><small>YOUR SELECTION</small><h2>Shopping bag ({shop.count})</h2></div><button onClick={()=>shop.setBagOpen(false)} aria-label="Close bag"><I name="close"/></button></header><div className="ref-bag-scroll">{!shop.bag.length?<p className="ref-empty">Your bag is empty. Find a piece you love.</p>:shop.bag.map(({item,quantity})=><div className="ref-bag-line" key={item.id}><Img src={item.image} alt={item.name}/><div><small>{item.brand}</small><strong>{item.name}</strong><span>{money(item.price)}</span><div className="ref-counter"><button aria-label="Reduce quantity" onClick={()=>shop.change(item.id,-1)}><I name="minus" size={13}/></button>{quantity}<button aria-label="Increase quantity" onClick={()=>shop.change(item.id,1)}><I name="plus" size={13}/></button></div></div></div>)}</div><div className="ref-bag-foot"><div><span>Subtotal</span><strong>{money(shop.subtotal)}</strong></div><button onClick={()=>shop.setNotice('Checkout is a demonstration. Real payments will be connected when a client selects this website.')} disabled={!shop.count}>PROCEED TO CHECKOUT <I name="arrow"/></button>{shop.notice&&<p role="status">{shop.notice}</p>}<small>Prototype merchandise and prices. No purchase is processed.</small></div></aside></div>
}
function Product({p,shop,variant=''}){return <article className={'ref-product '+variant}><div className="ref-product-img"><Img src={p.image} alt={p.name}/><button className={'ref-heart '+(shop.saved.includes(p.id)?'active':'')} aria-label={'Save '+p.name} aria-pressed={shop.saved.includes(p.id)} onClick={()=>shop.toggle(p.id)}><I name="heart" size={18}/></button><button className="ref-add" aria-label={'Add '+p.name+' to bag'} onClick={()=>shop.add(p)}><I name="plus" size={18}/></button></div><div className="ref-product-copy"><span>{p.brand}</span><h3>{p.name}</h3><strong>{money(p.price)}</strong></div></article>}

/* Reference 04: LOCO campaign homepage. Oversized black typography,
 * animated fashion ticker, model spanning hero, floating product cards,
 * horizontal arrivals and orange-backed bestsellers. */
export function FashionEditorial(){
 const shop=useStore()
 const [slide,setSlide]=useState(0)
 const [nav,setNav]=useState(false)
 const [activePin,setActivePin]=useState(null)
 const arrival=[initial[0],initial[8],initial[4]]
 const best=[initial[1],initial[5],initial[12],initial[14]]
 const variants=[{title:'FEEL THE VIBES',image:fashionImage['campaign-bright']},{title:'OWN YOUR STYLE',image:fashionImage['campaign-street']},{title:'WEAR IT LOUD',image:fashionImage['campaign-luxury']}]
 return <div className="ref-page ref-loco" id="top">
  <div className="ref-loco-frame">
   <header className="loco-nav">
    <a className="loco-mark" href="#top">LOCO<span>®</span></a>
    <nav className={nav?'open':''}><a href="/fashioneditorial/shop" onClick={()=>setNav(false)}>Shop</a><a href="/fashioneditorial/looks" onClick={()=>setNav(false)}>Lookbook</a><a href="/fashioneditorial/about" onClick={()=>setNav(false)}>Our story</a><a href="/fashioneditorial/faq" onClick={()=>setNav(false)}>Help</a></nav>
    <div className="loco-nav-end"><span className="loco-lang">◎ EN⌄</span><button className="loco-search" onClick={()=>window.location.assign('/fashioneditorial/shop')}><I name="search" size={16}/> Search</button><button aria-label="Saved products" onClick={()=>window.location.assign('/fashioneditorial/wishlist')}><I name="heart" size={19}/></button><button aria-label="Open shopping bag" onClick={()=>shop.setBagOpen(true)}><I name="bag" size={19}/>{shop.count>0&&<sup>{shop.count}</sup>}</button><button className="loco-nav-mobile" aria-label="Toggle menu" onClick={()=>setNav(!nav)}><I name={nav?'close':'menu'}/></button></div>
   </header>
   <main>
    <section className="loco-hero">
      <h1>{variants[slide].title}</h1>
      <div className="loco-marquee"><span>CATCH THE STYLE <b>✳</b> CATCH THE STYLE <b>✳</b> CATCH THE STYLE <b>✳</b> CATCH THE STYLE <b>✳</b> CATCH THE STYLE <b>✳</b></span></div>
      <div className="loco-campaign">
        <Img className="loco-campaign-model" src={variants[slide].image} alt="Campaign fashion portrait"/>
        <div className="loco-campaign-shade"></div>
        <div className="loco-campaign-left"><small>THE NEW DROP / 2026</small><h2>Get ready for a<br/>new season with<br/>Loco.</h2><p>Loco brings something new this season, specially designed for every you.</p><a href="#new">Explore items <I name="arrow" size={14}/></a></div>
        <button className="loco-floating loco-floating-left" onClick={()=>setActivePin(activePin===1?null:1)}><Img src={initial[5].image} alt="New arrival"/><span>New Arrival</span></button>
        <button className="loco-floating loco-floating-right" onClick={()=>setActivePin(activePin===2?null:2)}><Img src={initial[4].image} alt="Fashion pick"/><span>New Arrival</span></button>
        {activePin&&<div className={'loco-pin-pop loco-pin-'+activePin}><strong>{activePin===1?initial[5].name:initial[4].name}</strong><span>{money(activePin===1?initial[5].price:initial[4].price)}</span><button onClick={()=>shop.add(activePin===1?initial[5]:initial[4])}>Add to bag +</button></div>}
        <div className="loco-slides">{variants.map((v,i)=><button key={v.title} className={slide===i?'selected':''} aria-label={'Show campaign '+(i+1)} onClick={()=>{setSlide(i);setActivePin(null)}}/>)}</div>
      </div>
    </section>
    <section className="loco-arrivals" id="new"><div className="loco-section-title"><h2>New Arrival</h2><a href="#best">See All <I name="arrow"/></a></div><div className="loco-arrival-row">{arrival.map((p,i)=><article key={p.id} className="loco-mini"><Img src={p.image} alt={p.name}/><div><strong>{p.name}</strong><p className="loco-stars">★★★★★</p><small>(Demo piece)</small><b>{money(p.price)}</b><button onClick={()=>shop.add(p)} aria-label={'Add '+p.name}><I name="plus" size={17}/></button></div></article>)}</div></section>
    <section className="loco-bestsellers" id="best"><div className="loco-section-title"><h2>Best Seller</h2><a href="#new">See All <I name="arrow"/></a></div><div className="loco-best-grid">{best.map((p,i)=><article key={p.id}><div className="loco-best-image"><Img src={p.image} alt={p.name}/><button aria-label={'Add '+p.name+' to bag'} onClick={()=>shop.add(p)}><I name="plus" size={18}/></button></div><h3>{p.name}</h3><p className="loco-stars">★★★★★ <small>(Preview)</small></p><b>{money(p.price)}</b></article>)}</div></section>
    <div className="loco-end"><strong>THE LOOK IS YOURS.</strong><a href="#top">BACK TO TOP ↑</a></div>
   </main>
  </div><Bag shop={shop}/>
 </div>
}

/* Reference 01 desktop and reference 02 mobile:
 * HER FASHION shop by store + icon rail + model + your look sidebar.
 * Mobile collapses into wine-coloured outfit cards inspired by reference 02. */
export function FashionCatalogue(){
 const shop=useStore()
 const [category,setCategory]=useState('All')
 const [brand,setBrand]=useState('All stores')
 const [query,setQuery]=useState('')
 const [look,setLook]=useState([...fashionLooks[0].products])
 const [activeTab,setActiveTab]=useState('Explore')
 const [savedOnly,setSavedOnly]=useState(false)
 const [selectedOutfit,setSelectedOutfit]=useState(0)
 const [arMessage,setArMessage]=useState(false)
 const [selectedProduct,setSelectedProduct]=useState(null)
 const [filterOpen,setFilterOpen]=useState(false)
 const filtered=useMemo(()=>initial.filter(p=>(category==='All'||p.category===category)&&(brand==='All stores'||p.brand===brand)&&(!savedOnly||shop.saved.includes(p.id))&&((p.name+' '+p.brand).toLowerCase().includes(query.toLowerCase()))),[category,brand,query,savedOnly,shop.saved])
 const selected=initial.filter(p=>look.includes(p.id))
 const exactLook=fashionLooks.find(l=>l.products.length===look.length && l.products.every(id=>look.includes(id)))
 const remove=(id)=>setLook(arr=>arr.filter(x=>x!==id))
 const append=(id)=>setLook(arr=>arr.includes(id)?arr.filter(x=>x!==id):[...arr,id])
 const selectedTotal=selected.reduce((s,p)=>s+p.price,0)
 return <div className="ref-page ref-herfashion">
 <div className="her-shell">
  <section className="her-left">
   <header className="her-left-header"><a href="#her-top">HER FASHION</a><div><button onClick={()=>document.getElementById('her-search')?.focus()} aria-label="Search"><I name="search" size={23}/></button><button aria-label="Toggle category menu" onClick={()=>setFilterOpen(!filterOpen)}><I name="menu" size={24}/></button></div></header>
   <label className="her-search" id="her-top"><I name="search" size={19}/><input id="her-search" placeholder="Search for products, brands or styles..." value={query} onChange={e=>setQuery(e.target.value)} /></label>
   <div className={'her-tabs '+(filterOpen?'her-tabs-expand':'')}>{groupNames.map(name=><button className={category===name?'current':''} key={name} onClick={()=>{setCategory(name);setFilterOpen(false)}}>{name}</button>)}</div>
   <section className="her-stores"><div className="her-label"><h2>Shop by Store</h2><button onClick={()=>{setBrand('All stores');setCategory('All');setQuery('')}}>See all</button></div><div className="her-brand-grid">{storeNames.map(name=><button key={name} className={brand===name?'active':''} onClick={()=>setBrand(brand===name?'All stores':name)}>{name}</button>)}</div></section>
   <section className="her-popular"><div className="her-label"><h2>{savedOnly?'Your saved pieces':query||category!=='All'||brand!=='All stores'?'Your selection':'Popular in your style'}</h2><span>{filtered.length} pieces</span></div><div className="her-product-grid">{filtered.length?filtered.map(p=><div className="her-product" key={p.id}><div className="her-product-img"><button onClick={()=>append(p.id)} aria-label={'Add '+p.name+' to your look'}><Img src={p.image} alt={p.name}/></button><button className={'her-save '+(shop.saved.includes(p.id)?'saved':'')} onClick={()=>shop.toggle(p.id)} aria-label={'Save '+p.name}><I name="heart" size={18}/></button><button className="her-pick" onClick={()=>append(p.id)}>{look.includes(p.id)?'✓ In your look':'+ Add to look'}</button></div><span>{p.brand}</span><p>{p.name}</p><b>{money(p.price)}</b></div>):<p className="her-none">No matching products. Try another category or store.</p>}</div></section>
   <nav className="her-bottom-nav">{[['home','Home'],['search','Explore'],['hanger','Outfits'],['bookmark','Saved'],['person','Profile']].map(([icon,label])=><button key={label} className={activeTab===label?'selected':''} onClick={()=>{setActiveTab(label);setSavedOnly(label==='Saved');if(label==='Saved'){setQuery('');setCategory('All');setBrand('All stores')}if(label==='Outfits')document.getElementById('her-your-look')?.scrollIntoView({behavior:'smooth'});if(label==='Explore'||label==='Home')document.getElementById('her-top')?.scrollIntoView({behavior:'smooth'});if(label==='Profile')setArMessage(true)}}><I name={icon} size={21}/><span>{label}</span></button>)}</nav>
  </section>
  <section className="her-centre" aria-label="Outfit styling preview">
   <div className="her-icon-rail">{['left','person','shirt','hanger','bag','spark'].map((icon,i)=><button key={i} className={selectedOutfit===i?'selected':''} aria-label={['Go back','Model','Tops','Wardrobe','Bags','Style suggestions'][i]} onClick={()=>setSelectedOutfit(i)}><I name={icon} size={22}/></button>)}</div>
   <div className="her-switch"><button className="active" onClick={()=>setArMessage(false)}>3D</button><button onClick={()=>setArMessage(true)}>AR</button></div>
   {exactLook?<Img className="her-main-model" src={exactLook.image} alt={'Curated model look: '+exactLook.title}/>:<div className="ref-outfit-board"><span>YOUR OWN EDIT</span><div>{selected.map(p=><Img key={p.id} src={p.image} alt={p.name}/>)}</div><small>These are the pieces you selected. Live garment fitting is not connected.</small></div>}
   <div className="ref-look-tabs">{fashionLooks.map(l=><button key={l.id} className={exactLook?.id===l.id?'active':''} onClick={()=>setLook([...l.products])}>{l.id==='mono'?'CLASSIC':l.id==='wine'?'BURGUNDY':'BLUE HOUR'}</button>)}</div>
   <span className="her-podium-label">360° <I name="rotate" size={20}/></span>
   <div className="her-selected-rail">{selected.map(p=><button key={p.id} onClick={()=>{setSelectedProduct(p);document.getElementById('her-your-look')?.scrollIntoView({behavior:'smooth'})}} aria-label={'View '+p.name}><Img src={p.image} alt={p.name}/></button>)}</div>
   {arMessage&&<div className="her-ar-info" role="status">AR fitting is a visual concept. The live experience requires garment models and a camera integration.<button onClick={()=>setArMessage(false)}>Close</button></div>}
   <div className="her-centre-note">{exactLook?'CURATED LOOK / CLOSE-MATCH PRODUCT STYLING':'CUSTOM OUTFIT BOARD / YOUR SELECTED PIECES'}</div>
  </section>
  <section className="her-right" id="her-your-look">
   <div className="her-look-card"><div className="her-card-title"><h2>YOUR LOOK</h2><span>{selected.length} ITEMS</span></div><div className="her-look-list">{selected.length?selected.map(p=><div className={'her-look-item '+(selectedProduct?.id===p.id?'active':'')} key={p.id}><button className="her-look-picture" onClick={()=>setSelectedProduct(p)}><Img src={p.image} alt={p.name}/></button><div><b>{p.brand}</b><span>{p.name}</span><strong>{money(p.price)}</strong></div><button className="her-look-more" aria-label={'Remove '+p.name+' from look'} onClick={()=>remove(p.id)}><I name="close" size={17}/></button></div>):<div className="her-look-blank">Tap the pieces on the left to build your look.</div>}</div><div className="her-style-fit"><h3>STYLE & FIT</h3><p><I name="check" size={16}/> Your personal outfit selection <I name="info" size={15}/></p><p><I name="check" size={16}/> Combine tops, bottoms and accessories</p><p><I name="info" size={16}/> Fit checks require your measurements</p></div><div className="her-total"><span>LOOK TOTAL</span><strong>{money(selectedTotal)}</strong></div><button disabled={!selected.length} className="her-shop-look" onClick={()=>selected.forEach(p=>shop.add(p))}>Shop the Look <I name="arrowUp" size={18}/></button></div>
   <div className="her-recs"><h3><I name="spark" size={22}/> Recommended for you</h3><div>{initial.slice(4,7).map(p=><button key={p.id} onClick={()=>append(p.id)}><Img src={p.image} alt={p.name}/><span>{p.brand}</span><small>{p.name}</small><strong>{money(p.price)}</strong></button>)}</div></div>
  </section>
 </div>
 <Bag shop={shop}/>
 </div>
}

/* Reference 03: RUSH fitting-room desktop composition, translucent
 * wardrobe rail, bright yellow controls and parameter panel. */
export function FashionMinimal(){
 const shop=useStore()
 const [chosen,setChosen]=useState([...fashionLooks[0].products])
 const [size,setSize]=useState('M')
 const [flip,setFlip]=useState(false)
 const [measurements,setMeasurements]=useState({chest:'81',waist:'59',hips:'86',height:'168'})
 const [confirmed,setConfirmed]=useState(false)
 const [colour,setColour]=useState('#5d4034')
 const [expanded,setExpanded]=useState('')
 const outfit=initial.filter(p=>chosen.includes(p.id))
 const exactRushLook=fashionLooks.find(l=>l.products.length===chosen.length&&l.products.every(id=>chosen.includes(id)))
 const add=(id)=>setChosen(cur=>cur.includes(id)?cur.filter(x=>x!==id):[...cur,id])
 const total=outfit.reduce((s,p)=>s+p.price,0)
 return <div className="ref-page ref-rush" id="rush-top">
   <div className="rush-backdrop"></div>
   <div className="rush-window">
    <header className="rush-header"><div className="rush-header-left"><strong>AI fitting room</strong><span>INTERFACE CONCEPT</span><a href="#rush-wardrobe"><I name="left" size={14}/> Back</a></div><a className="rush-logo" href="#rush-top">RUSH</a><div className="rush-header-right"><button onClick={()=>shop.setBagOpen(true)}><I name="bag" size={17}/> Bag ({shop.count})</button><button aria-label="Profile" onClick={()=>setExpanded(expanded==='profile'?'':'profile')}><I name="person" size={19}/></button></div></header>
    <div className="rush-layout">
     <section className="rush-stage">
       <div className="rush-stage-person">{exactRushLook?<Img className={flip?'flipped':''} src={exactRushLook.image} alt={'Model wearing the '+exactRushLook.title+' styled look'}/>:<div className="rush-composed-board"><strong>YOUR LOOK BOARD</strong><div>{outfit.map(p=><Img key={p.id} src={p.image} alt={p.name}/>)}</div><small>Selected garments, not a generated try-on</small></div>}</div>
       <div className="ref-rush-looks">{fashionLooks.map(l=><button key={l.id} className={exactRushLook?.id===l.id?'active':''} onClick={()=>setChosen([...l.products])}>{l.title}</button>)}</div>
       <div className="rush-fabric-preview"><Img src={outfit[0]?.image || fashionInventory[0].image} alt="Close-up of selected garment"/></div>
       <div className="rush-zoom"><button onClick={()=>setFlip(!flip)} aria-label="Flip model photo"><I name="rotate"/></button><button onClick={()=>setFlip(false)} aria-label="Reset model photo"><I name="search"/></button></div>
       <button className="rush-turn-left" onClick={()=>setFlip(!flip)} aria-label="Flip photo left"><I name="left" size={28}/></button>
       <button className="rush-turn-right" onClick={()=>setFlip(!flip)} aria-label="Flip photo right"><I name="right" size={28}/></button>
       <div className="rush-wardrobe" id="rush-wardrobe"><header><strong>On a hanger</strong><I name="search" size={17}/></header><div className="rush-wardrobe-items"><button className="rush-rail-arrow" onClick={()=>document.getElementById('rush-rack')?.scrollBy({left:-240,behavior:'smooth'})} aria-label="Scroll rail left"><I name="left" size={19}/></button><div id="rush-rack" className="rush-scroll">{initial.map(p=><button key={p.id} className={chosen.includes(p.id)?'selected':''} title={p.name} aria-label={(chosen.includes(p.id)?'Remove ':'Add ')+p.name} onClick={()=>add(p.id)}><Img src={p.image} alt={p.name}/>{chosen.includes(p.id)&&<span><I name="check" size={12}/></span>}</button>)}</div><button className="rush-rail-arrow" onClick={()=>document.getElementById('rush-rack')?.scrollBy({left:240,behavior:'smooth'})} aria-label="Scroll rail right"><I name="right" size={19}/></button></div></div>
       <span className="rush-stage-disclaimer">{exactRushLook?'CURATED OUTFIT PHOTO · MATCHED GARMENT SELECTION':'CUSTOM LOOK BOARD · NOT LIVE AI TRY-ON'}</span>
     </section>
     <aside className="rush-right">
       <div className="rush-params"><h2>Your parameters</h2><div className="rush-metrics">{[['Chest (cm)','chest'],['Waist (cm)','waist'],['Hips (cm)','hips'],['Height (cm)','height']].map(([label,key])=><label key={key}><span>{label}</span><input type="number" min="1" aria-label={label} value={measurements[key]} onChange={e=>{setMeasurements(cur=>({...cur,[key]:e.target.value}));setConfirmed(false)}}/></label>)}</div><button onClick={()=>setConfirmed(true)}>{confirmed?'Confirmed ✓':'Confirm'}</button>{confirmed&&<p className="rush-confirm" role="status">Measurements saved for this preview. Size estimation is not active.</p>}</div>
       <div className="rush-wearing"><h2>You are wearing</h2><div className="rush-garments">{outfit.map(p=><div className="rush-garment" key={p.id}><Img src={p.image} alt={p.name}/><div><strong>{p.name}</strong><span>{money(p.price)}</span><small>{p.tone}</small></div><button onClick={()=>add(p.id)} aria-label={'Remove '+p.name}><I name="close" size={14}/></button></div>)}{!outfit.length&&<p className="rush-none">Select clothes from the hanger to create an outfit.</p>}</div><div className="rush-swatch"><span>Colour</span>{['#5d4034','#151413','#e6ddd0'].map(c=><button style={{backgroundColor:c}} key={c} aria-label={'Select colour '+c} onClick={()=>setColour(c)} className={colour===c?'active':''}/>)}</div><div className="rush-size-label">Size</div><div className="rush-sizes">{['XS','S','M','L','XL'].map(s=><button key={s} className={size===s?'selected':''} onClick={()=>setSize(s)}>{s}</button>)}</div><div className="rush-details">{[['Materials, care and source','Demo garments are placeholders. Fabric care and sourcing details would come from the client catalogue.'],['In-store availability','Inventory integration will be connected for the finished store.'],['Deliveries and returns','Delivery and return policies will be supplied by the brand.']].map(([label,body])=><div key={label}><button onClick={()=>setExpanded(expanded===label?'':label)}>{label}<span>{expanded===label?'−':'⌄'}</span></button>{expanded===label&&<p>{body}</p>}</div>)}</div><button className="rush-add-bag" onClick={()=>outfit.forEach(p=>shop.add(p))} disabled={!outfit.length}>Add to bag ({outfit.length}) · {money(total)} <I name="arrow" size={16}/></button></div>
     </aside>
    </div>
   </div>
   <Bag shop={shop}/>
 </div>
}
