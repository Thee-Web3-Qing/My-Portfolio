
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { foodStores, foodPhotos, getItem, money } from './foodStoreData.js'
import './foodStorefront.css'

const Icon = ({name,size=20}) => {
 const p={bag:'M5 8h14l1 13H4L5 8ZM9 9V6a3 3 0 0 1 6 0v3',search:'M21 21l-4.5-4.5M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',close:'M5 5l14 14M19 5 5 19',menu:'M4 7h16M4 12h16M4 17h16',arrow:'M5 12h14m-6-6 6 6-6 6',up:'M7 17 17 7M9 7h8v8',heart:'M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z',plus:'M12 5v14M5 12h14',minus:'M5 12h14',pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0ZM12 10h.01',star:'m12 2 2.8 6.7L22 9l-7.7 3 1.8 8L12 16l-6.1 4 1.8-8L0 9l7.2-.3L12 2',check:'M4 12l5 5L20 6',clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l4 2',chef:'M6 14a4 4 0 0 1-1-8 5 5 0 0 1 9-1 5 5 0 0 1 6 7v8H6v-6',insta:'M4 4h16v16H4zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5-1h.01'}
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={p[name]||p.arrow}/></svg>
}
function Img({src,alt,backup,...props}) {
 const [failed,setFailed]=useState(false)
 return <img src={failed?(backup||foodPhotos.bakeryHero):src} alt={alt} loading="lazy" decoding="async" onError={()=>setFailed(true)} {...props}/>
}
function useBasket(store) {
 const key='qing-food-sample-'+store.id
 const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}})
 const [saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem(key+'-saved')||'[]')}catch{return []}})
 const [open,setOpen]=useState(false)
 const [toast,setToast]=useState('')
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(items))}catch{}},[items,key])
 useEffect(()=>{try{localStorage.setItem(key+'-saved',JSON.stringify(saved))}catch{}},[saved,key])
 const qty=items.reduce((n,x)=>n+x.qty,0)
 const total=items.reduce((n,x)=>n+x.qty*x.price,0)
 const add=(p,amount=1)=>{setItems(current=>{const found=current.find(i=>i.id===p.id);return found?current.map(i=>i.id===p.id?{...i,qty:i.qty+amount}:i):[...current,{id:p.id,name:p.name,image:p.image,price:p.price,qty:amount}]});setOpen(true);setToast('')}
 const change=(id,d)=>setItems(current=>current.map(i=>i.id===id?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0))
 const remove=id=>setItems(cur=>cur.filter(i=>i.id!==id))
 const toggle=id=>setSaved(cur=>cur.includes(id)?cur.filter(p=>p!==id):[...cur,id])
 return {items,saved,open,setOpen,toast,setToast,qty,total,add,change,remove,toggle}
}
const to=(store,path='')=>store.root+(path?'/'+path:'')
function FoodNav({store,basket}) {
 const [mobile,setMobile]=useState(false)
 const location=useLocation()
 const isBakery=store.id==='catalogue'
 const links=store.id==='editorial'?[['Menu','menu'],['Experience','experience'],['About','about'],['Events','events'],['Contact','contact']]
 :isBakery?[['Our bakes','menu'],['Locations','locations'],['Catering','catering'],['Our story','about'],['Contact','contact']]
 :[['Menu','menu'],['Our story','about'],['Catering','catering'],['Contact','contact']]
 return <header className="fd-header" id="fd-top">
  <Link className="fd-brand" to={store.root}>{store.id==='editorial'?<><span>HANSIK</span><small>한식</small></>:store.id==='minimal'?<><span>✺</span><span>KANIGIRI<small>TASTE OF ANDHRA</small></span></>:store.id==='artisan'?<><span>✳</span><span>matbor<small>BIRYANI HOUSE</small></span></>:<><span className="fd-brand-badge">c</span><span>Crumb &amp; Co.<small>BAKED WITH LOVE</small></span></>}</Link>
  <nav className={'fd-nav-links '+(mobile?'fd-nav-visible':'')} aria-label="Food website menu">
   {links.map(([label,path])=><Link key={path} to={to(store,path)} onClick={()=>setMobile(false)} className={location.pathname===to(store,path)?'active':''}>{label}</Link>)}
   <Link className="fd-nav-mobile-extra" to={to(store,'cart')} onClick={()=>setMobile(false)}>View bag</Link>
  </nav>
  <div className="fd-nav-actions">
   {store.id==='editorial'?<Link className="fd-reserve" to={to(store,'reservations')}>Reserve a table <Icon name="arrow" size={14}/></Link>:store.id==='catalogue'?<Link className="fd-order-nav" to={to(store,'catering')}>Order a cake <Icon name="up" size={14}/></Link>:<Link className="fd-order-nav" to={to(store,'menu')}>Order online <Icon name="up" size={14}/></Link>}
   <button onClick={()=>basket.setOpen(true)} aria-label={'Open bag with '+basket.qty+' items'} className="fd-bag-trigger"><Icon name="bag" size={19}/><span>{basket.qty}</span></button>
   <button className="fd-mobile-trigger" aria-label="Toggle menu" aria-expanded={mobile} onClick={()=>setMobile(!mobile)}><Icon name={mobile?'close':'menu'}/></button>
  </div>
 </header>
}
function PhotoCard({p,store,basket,variant=''}) {
 return <article className={'fd-product '+variant}>
  <Link className="fd-product-photo" to={to(store,'item/'+p.id)}><Img src={p.image} alt={p.name} backup={store.hero}/>{p.badge&&<span className="fd-photo-badge">{p.badge}</span>}</Link>
  <div className="fd-product-body"><span>{p.category}</span><Link to={to(store,'item/'+p.id)}><h3>{p.name}</h3></Link><p>{p.description}</p><div className="fd-product-bottom"><strong>{money(p.price)}</strong><button onClick={()=>basket.add(p)} aria-label={'Add '+p.name+' to bag'}><Icon name="plus" size={18}/></button></div></div>
 </article>
}
function SectionHeading({kicker,children,link,store}) {
 return <div className="fd-section-head"><div><span>{kicker}</span><h2>{children}</h2></div>{link&&<Link to={to(store,link)}>View all <Icon name="up" size={15}/></Link>}</div>
}
function CartPanel({store,basket}) {
 return basket.open?<div className="fd-overlay" role="presentation" onMouseDown={e=>{if(e.currentTarget===e.target)basket.setOpen(false)}}><aside className="fd-bag" role="dialog" aria-modal="true" aria-label="Shopping bag"><div className="fd-bag-title"><div><span>YOUR FOOD ORDER</span><h2>Bag ({basket.qty})</h2></div><button onClick={()=>basket.setOpen(false)} aria-label="Close bag"><Icon name="close"/></button></div><div className="fd-bag-list">{basket.items.length?basket.items.map(p=><article key={p.id}><Img src={p.image} alt={p.name} backup={store.hero}/><div><h3>{p.name}</h3><b>{money(p.price)}</b><div className="fd-qty"><button onClick={()=>basket.change(p.id,-1)} aria-label="Remove one">−</button>{p.qty}<button onClick={()=>basket.change(p.id,1)} aria-label="Add one">+</button></div></div><button onClick={()=>basket.remove(p.id)} aria-label="Remove item"><Icon name="close" size={15}/></button></article>):<p className="fd-bag-empty">Nothing in your bag yet. Your next favourite is on the menu.</p>}</div><div className="fd-bag-footer"><div><span>Subtotal</span><strong>{money(basket.total)}</strong></div><p>Delivery costs and fulfilment details are confirmed at checkout.</p><Link to={to(store,'cart')} onClick={()=>basket.setOpen(false)}>View your order <Icon name="arrow" size={17}/></Link><button onClick={()=>basket.setOpen(false)}>Keep exploring</button></div></aside></div>:null
}

/* 01. HANSIK / BLACK × RED × MINT */
function HansikHome({store,basket}) {
 return <main className="fd-hansik-home">
   <section className="fd-han-hero">
    <div className="fd-han-hero-text"><div className="fd-hero-vertical">01<br/>02<br/>03</div><span className="fd-han-korean">한국의 맛,<br/>현대의 감각.</span><span className="fd-han-line"></span><h1>MODERN<br/><em>KOREAN</em><br/>CUISINE</h1><p>Tradition in Every Bite,<br/>Reimagined for Today.</p><div className="fd-hero-buttons"><Link to={to(store,'menu')}>Explore Menu <Icon name="arrow" size={16}/></Link><Link to={to(store,'experience')}><span className="fd-play">▶</span> Our story</Link></div></div>
    <div className="fd-han-art"><div className="fd-han-red-circle"></div><span className="fd-han-hangul">한<br/>식</span><span className="fd-han-blossom">✿ ✿ ✿</span><div className="fd-han-bowl"><Img src={store.hero} alt="Colourful Korean bibimbap rice bowl" backup={foodPhotos.koreanRice}/></div><span className="fd-han-city">SEOUL<br/>BISTRO<br/>&amp; BAR<br/>⟶</span></div>
   </section>
   <section className="fd-han-benefits">{[['♧','Authentic Flavors','정통의 맛'],['⌁','Modern Twists','현대적인 감각'],['♨','Premium Ingredients','최상의 식재료'],['◇','Immersive Experience','특별한 공간']].map(([icon,t,sub])=><div key={t}><b>{icon}</b><strong>{t}</strong><small>{sub}</small></div>)}</section>
   <section className="fd-han-experience"><Img src={foodPhotos.koreanPlace} alt="Contemporary Korean inspired dining room" backup={foodPhotos.koreanTable}/><div><span>THE EXPERIENCE</span><h2>A CONTEMPORARY<br/><em>KOREAN</em> DINING<br/>JOURNEY</h2><p>A space where Korea's rich culinary heritage meets modern design, art and hospitality.</p><Link to={to(store,'experience')}>Discover our space <Icon name="arrow" size={17}/></Link><span className="fd-han-flower">✿</span></div></section>
   <section className="fd-han-signature"><div><span>THE MENU / 01</span><h2>SIGNATURE<br/><em>DISHES</em></h2><p>Our most-loved creations, crafted with an authentic Korean soul.</p><Link to={to(store,'menu')}>View full menu <Icon name="arrow" size={16}/></Link></div>{store.featured.map(id=>{const p=getItem(store,id);return <Link className="fd-han-dish" to={to(store,'item/'+id)} key={id}><Img src={p.image} alt={p.name} backup={store.hero}/><div><h3>{p.name}</h3><span>{p.description}</span><b>↗</b></div></Link>})}</section>
   <section className="fd-han-bar"><div className="fd-han-bar-photo"><Img src={foodPhotos.koreanDrinks} alt="Signature drinks at the bar" backup={store.hero}/></div><div><span>HANSIK BAR</span><h2>KOREAN FLAVORS<br/><em>BEYOND FOOD</em></h2><p>Signature spritzes, Korean-inspired cocktails and a curated selection of drinks.</p><Link to={to(store,'menu')}>Explore the bar ↗</Link></div><span className="fd-han-decor">✿</span></section>
   <section className="fd-han-cta"><h2>A table worth gathering around.</h2><p>Plan a night of food, drinks and good company.</p><Link to={to(store,'reservations')}>Reserve a table <Icon name="up" size={18}/></Link></section>
 </main>
}
/* 02. CRUMB & CO / PINK × CREAM × BROWN */
function BakeryHome({store,basket}) {
 const groups=[{name:'Pastries',image:foodPhotos.bakeryCroissant},{name:'Cakes',image:foodPhotos.bakeryCake},{name:'Cookies',image:foodPhotos.bakeryCookies},{name:'Coffee',image:foodPhotos.bakeryCoffee}]
 return <main className="fd-bakery-home">
   <div className="fd-bakery-topline">Freshly baked every morning, made with love <span>✿</span> Your sweet escape starts here</div>
   <section className="fd-bake-hero"><div className="fd-bake-copy"><span>HELLO, SWEET TOOTH ✺</span><h1>Butter, flour<br/>&amp; a <em>little bit</em><br/>of love.</h1><p>Flaky croissants, slow-fermented sourdough, celebration cakes and honest little treats, baked fresh for you.</p><div className="fd-bake-hero-ctas"><Link to={to(store,'menu')}>Order fresh bakes <Icon name="arrow" size={17}/></Link><Link to={to(store,'about')}>Explore the bakery <Icon name="up" size={16}/></Link></div><div className="fd-bake-trust"><div><b>40+</b><span>Bakery favourites</span></div><div><b>Made</b><span>With real butter</span></div><div><b>Every</b><span>Single morning</span></div></div></div><div className="fd-bake-photo"><div className="fd-bake-pink-blob"></div><Img src={store.hero} alt="Fresh flaky golden bakery croissants" backup={foodPhotos.bakeryCroissant}/><span className="fd-bake-stamp">100%<br/><small>BAKED WITH LOVE</small></span><span className="fd-bake-sticker">Freshly<br/>baked ✿</span></div></section>
   <div className="fd-bake-ticker">Sourdough <b>✳</b> Cinnamon Buns <b>✳</b> Celebration Cakes <b>✳</b> Cold Brew <b>✳</b> Cookies <b>✳</b> Brownies <b>✳</b></div>
   <section className="fd-bake-fresh"><SectionHeading kicker="JUST OUT OF THE OVEN" link="menu" store={store}>Today's <em>fresh bakes.</em></SectionHeading><div className="fd-bake-products">{store.featured.map(id=><PhotoCard key={id} p={getItem(store,id)} store={store} basket={basket} variant="fd-bake-product"/>)}</div></section>
   <section className="fd-bake-cravings"><div className="fd-bake-craving-head"><span>SO MANY HAPPY MOMENTS</span><h2>Something for <em>every craving.</em></h2><nav>{groups.map(g=><Link key={g.name} to={to(store,'menu?category='+g.name)}>{g.name}</Link>)}</nav></div><div className="fd-bake-craving-body"><Img src={foodPhotos.bakeryCoffee} alt="Beautifully poured fresh coffee" backup={store.hero}/><div>{store.items.slice(0,6).map(p=><Link to={to(store,'item/'+p.id)} key={p.id}><span>{p.name}</span><b>{money(p.price)}</b></Link>)}<Link className="fd-bake-all" to={to(store,'menu')}>View the full menu ↗</Link></div></div></section>
   <section className="fd-bake-party"><div><span>CELEBRATE SOMETHING SWEET</span><h2>Your party,<br/>your cake.</h2><p>Birthday cakes, office treats and sweet little surprises. Tell us what you have in mind.</p><Link to={to(store,'catering')}>Order a cake <Icon name="arrow" size={16}/></Link></div><Img src={foodPhotos.bakeryCake} alt="Celebration cake decorated with cream" backup={store.hero}/><span className="fd-bake-party-flower">✿</span></section>
   <section className="fd-bake-origin"><div className="fd-bake-origin-photo"><Img src={foodPhotos.bakeryBread} alt="Fresh rustic artisan loaf" backup={store.hero}/><span>EST. 2016<br/>IN OUR HEARTS</span></div><div><span>OUR LITTLE STORY</span><h2>Baked with love <em>since day one.</em></h2><p>It started with one oven and a very simple belief. Something freshly baked has a way of making an ordinary day feel special.</p><Link to={to(store,'about')}>More about our bakery <Icon name="up" size={16}/></Link></div></section>
   <section className="fd-bake-outlets"><SectionHeading kicker="FIND YOUR HAPPY PLACE" link="locations" store={store}>Our cosy <em>outlets.</em></SectionHeading><p>Pull up a chair, grab a book and stay a while. For this prototype, addresses are placeholders.</p><div>{[{name:'The Morning Counter',image:foodPhotos.bakeryCafe},{name:'The Garden Café',image:foodPhotos.koreanTable},{name:'The Little Bakehouse',image:foodPhotos.koreanPlace}].map(place=><article key={place.name}><Img src={place.image} alt={place.name} backup={store.secondary}/><h3>{place.name}</h3><p>Sample location · Lagos</p><Link to={to(store,'locations')}>Get details <Icon name="arrow" size={15}/></Link></article>)}</div></section>
   <section className="fd-bake-social"><SectionHeading kicker="FRESH ON THE FEED" store={store}>A little <em>Instagram love.</em></SectionHeading><div>{[foodPhotos.bakeryCroissant,foodPhotos.bakeryCoffee,foodPhotos.bakeryCake,foodPhotos.bakeryCookies,foodPhotos.bakeryDonuts,foodPhotos.bakeryBread].map((image,i)=><Img key={i} src={image} alt={'Bakery gallery '+(i+1)} backup={store.hero}/>)}</div></section>
   <section className="fd-bake-notes"><span>THE SWEET REVIEWS</span><h2>Kind words, <em>happy customers.</em></h2><div>{['“The kind of bakery you want to visit every morning.”','“The perfect little treat for a long afternoon.”','“Everything looks as good as it tastes.”'].map((text,i)=><div key={i}><b>★★★★★</b><p>{text}</p><small>Sample review {String(i+1).padStart(2,'0')}</small></div>)}</div></section>
   <Newsletter store={store}/>
 </main>
}
/* 03. KANIGIRI / PRODUCT-CENTRIC ORDERING */
function MinimalHome({store,basket}) {
 const feature=getItem(store,'mutton-biryani')
 return <main className="fd-kan-home"><section className="fd-kan-hero"><div className="fd-kan-food"><Img src={feature.image} alt="Mutton biryani rice with meat and spices" backup={store.secondary}/><span className="fd-kan-spices">✦ &nbsp; ✧ &nbsp; ✦</span></div><div className="fd-kan-hero-copy"><span className="fd-kan-script">Mutton</span><div className="fd-kan-price-seal">PRICE<br/><b>{money(feature.price)}</b></div><h1>Biryani</h1><div className="fd-kan-stars">★★★★★ <b>4.5</b> <small>Sample rating</small></div><div className="fd-kan-description">{feature.description}</div><div className="fd-kan-ctas"><button onClick={()=>basket.add(feature)}>ORDER NOW <Icon name="arrow" size={16}/></button><Link to={to(store,'item/'+feature.id)}>EXPLORE MORE <Icon name="up" size={16}/></Link></div></div></section><div className="fd-kan-wave"></div>
 <section className="fd-kan-specials"><SectionHeading kicker="TASTY CHOICES" store={store}>Our food, <em>your favourites.</em></SectionHeading><div className="fd-kan-feature-grid">{store.featured.map((id,i)=>{const p=getItem(store,id);return <article className={'fd-kan-dish fd-kan-colour-'+i} key={id}><Link to={to(store,'item/'+id)} className="fd-kan-dish-photo"><Img src={p.image} alt={p.name} backup={store.hero}/></Link><div className="fd-kan-small-price">PRICE<br/><b>{money(p.price)}</b></div><h3>{p.name.split(' ').slice(0,-1).join(' ')} <strong>{p.name.split(' ').slice(-1)}</strong></h3><span>★★★★★ &nbsp; 4.5 <small>Sample rating</small></span><p>{p.description}</p><button onClick={()=>basket.add(p)}>ORDER NOW <Icon name="arrow" size={14}/></button></article>})}</div><div className="fd-kan-menu-link"><Link to={to(store,'menu')}>Explore the complete menu <Icon name="arrow"/></Link></div></section>
 <section className="fd-kan-split"><Img src={foodPhotos.biryaniSpread} alt="A generous Indian curry and biryani spread" backup={store.hero}/><div><span>ROOTED IN FLAVOUR</span><h2>A feast to remember.</h2><p>Spice, warmth and generous portions. Celebrate the people around your table with a dish made to share.</p><Link to={to(store,'catering')}>Order for a gathering <Icon name="arrow" size={16}/></Link></div></section>
 </main>
}
/* 04. MATBOR / ORGANIC CREAM AND SAGE */
function ArtisanHome({store,basket}) {
 const fav=store.featured.map(id=>getItem(store,id))
 return <main className="fd-art-home">
  <section className="fd-art-hero"><div className="fd-art-copy"><span>HANDCRAFTED FLAVOUR · FROM OUR KITCHEN</span><h1>Matbor<br/><em>Biryani</em></h1><p>A little warmth, a lot of spice, and generous biryani bowls cooked for the moments worth sharing.</p><Link to={to(store,'menu')}>Order Now <Icon name="arrow" size={17}/></Link><span className="fd-art-flower">❀</span></div><div className="fd-art-hero-picture"><div className="fd-art-green-shape"></div><Img src={store.hero} alt="Fresh biryani rice in a clay serving bowl" backup={foodPhotos.biryaniSpread}/><span className="fd-art-badge">HOT<br/>AND<br/>FRESH ✳</span></div></section>
  <section className="fd-art-intro"><span>01 / MADE SLOWLY, SHARED HAPPILY</span><h2>Our kind of <em>biryani.</em></h2><p>Fragrant grains, slow-cooked spices and the little details that make a good meal unforgettable.</p></section>
  <section className="fd-art-top-picks">{fav.map((p,i)=><article className={'fd-art-highlight fd-art-highlight-'+i} key={p.id}><div className="fd-art-highlight-picture"><Img src={p.image} alt={p.name} backup={store.hero}/><span className="fd-art-ribbon">FRESHLY MADE</span></div><h3>{p.name}</h3><p>{p.description}</p><div><strong>{money(p.price)}</strong><button onClick={()=>basket.add(p)}>Order this bowl <Icon name="up" size={16}/></button></div></article>)}</section>
  <section className="fd-art-mood"><div><span>02 / STRAIGHT FROM THE HEART</span><h2>Comfort food.<br/>Happy hearts.</h2><p>Our kitchen's favourite recipes, crafted for everyday cravings and special celebrations.</p><Link to={to(store,'about')}>Read our story <Icon name="arrow" size={17}/></Link></div><Img src={foodPhotos.biryaniSpices} alt="Warming spices used to prepare biryani" backup={store.hero}/></section>
  <section className="fd-art-menu-section"><SectionHeading kicker="03 / A LITTLE SOMETHING FOR EVERYONE" link="menu" store={store}>Made for <em>your table.</em></SectionHeading><div>{store.items.slice(3,7).map(p=><PhotoCard key={p.id} p={p} store={store} basket={basket}/>)}</div></section>
  <section className="fd-art-callout"><span>GATHER. LAUGH. EAT WELL.</span><h2>Good food tastes<br/>better together.</h2><p>From small dinners to the biggest tables, we make room for another helping.</p><Link to={to(store,'catering')}>Let's feed your people <Icon name="up" size={16}/></Link></section>
 </main>
}
function Newsletter({store}) {
 const [email,setEmail]=useState('')
 const [sent,setSent]=useState(false)
 return <section className="fd-newsletter"><div><span>GOOD NEWS, GOOD FOOD</span><h2>{store.id==='catalogue'?'Fresh news, warm from the oven.':'Something good is cooking.'}</h2><p>Be first to hear about special menus and fresh favourites.</p></div><form onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<p role="status">This signup is a preview. Email delivery is not connected yet.</p>:<><label htmlFor={'fd-email-'+store.id}>Email address</label><div><input id={'fd-email-'+store.id} type="email" required placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><button type="submit">Subscribe <Icon name="arrow" size={16}/></button></div></>}</form></section>
}
function MenuPage({store,basket}) {
 const location=useLocation()
 const urlCat=new URLSearchParams(location.search).get('category')
 const [category,setCategory]=useState(store.categories.includes(urlCat)?urlCat:'All')
 const [q,setQ]=useState('')
 const [sort,setSort]=useState('featured')
 const items=useMemo(()=>{const list=store.items.filter(p=>(category==='All'||p.category===category)&&(p.name+' '+p.description+' '+p.category).toLowerCase().includes(q.trim().toLowerCase()));if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);return list},[category,q,sort,store])
 return <main className="fd-inner fd-menu-page"><Breadcrumb store={store} section="Menu"/><div className="fd-page-head"><span>{store.id==='catalogue'?'JUST OUT OF THE OVEN':'FRESH FROM OUR KITCHEN'}</span><h1>{store.id==='catalogue'?'The sweet collection.':'Explore our menu.'}</h1><p>All dishes shown are examples. Photos and prices are replaced with the business's real catalogue at launch.</p></div><div className="fd-menu-tools"><label><Icon name="search" size={19}/><input type="search" placeholder="Search food, drinks or flavours..." value={q} onChange={e=>setQ(e.target.value)}/></label><select aria-label="Sort menu" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured first</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div><div className="fd-menu-cats">{store.categories.map(c=><button key={c} className={category===c?'selected':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="fd-menu-count">{items.length} ITEMS TO DISCOVER</div>{items.length?<div className="fd-menu-grid">{items.map(p=><PhotoCard key={p.id} p={p} store={store} basket={basket}/>)}</div>:<div className="fd-empty"><h2>Nothing matches just yet.</h2><button onClick={()=>{setCategory('All');setQ('')}}>View the full menu</button></div>}</main>
}
function Breadcrumb({store,section,detail}) {
 return <div className="fd-breadcrumb"><Link to={store.root}>Home</Link><span>/</span>{detail?<><Link to={to(store,'menu')}>Menu</Link><span>/</span><span>{detail}</span></>:<span>{section}</span>}</div>
}
function ItemPage({store,basket,id}) {
 const p=getItem(store,id)
 const [quantity,setQuantity]=useState(1)
 const [expanded,setExpanded]=useState('Description')
 if(!p)return <Missing store={store}/>
 const related=store.items.filter(x=>x.id!==id&&(x.category===p.category)).slice(0,4)
 const others=[...related,...store.items.filter(x=>x.id!==id&&!related.includes(x))].slice(0,4)
 return <main className="fd-inner fd-item-page"><Breadcrumb store={store} detail={p.name}/><div className="fd-item-layout"><div className="fd-item-hero-img"><Img src={p.image} alt={p.name} backup={store.hero}/></div><div className="fd-item-info"><span>{p.category.toUpperCase()} / OUR MENU</span><h1>{p.name}</h1><p>{p.description}</p><strong className="fd-item-price">{money(p.price)}</strong><div className="fd-item-quantity"><span>QUANTITY</span><div><button onClick={()=>setQuantity(n=>Math.max(1,n-1))} aria-label="Reduce quantity">−</button><b>{quantity}</b><button onClick={()=>setQuantity(n=>n+1)} aria-label="Increase quantity">+</button></div></div><button className="fd-primary" onClick={()=>basket.add(p,quantity)}>Add to bag · {money(quantity*p.price)} <Icon name="arrow" size={19}/></button><div className="fd-item-accordions">{[['Description',p.description],['Ingredients & allergens','This is illustrative menu content. All ingredients, allergen information and substitutions must be supplied and verified by the business.'],['Delivery and pickup','The finished website will use the business’s actual delivery zones, collection instructions and operating hours.']].map(([label,text])=><div key={label}><button onClick={()=>setExpanded(expanded===label?'':label)}>{label} <span>{expanded===label?'−':'+'}</span></button>{expanded===label&&<p>{text}</p>}</div>)}</div></div></div><section className="fd-related"><SectionHeading kicker="MORE TO ENJOY" link="menu" store={store}>You might love these.</SectionHeading><div className="fd-menu-grid">{others.map(x=><PhotoCard key={x.id} p={x} store={store} basket={basket}/>)}</div></section></main>
}
function CartPage({store,basket}) {
 const [checkout,setCheckout]=useState(false)
 return <main className="fd-inner fd-cart-page"><Breadcrumb store={store} section="Your bag"/><div className="fd-page-head"><span>YOUR ORDER</span><h1>Good food is on its way.</h1></div>{basket.items.length?<div className="fd-cart-layout"><div className="fd-cart-items">{basket.items.map(p=><article key={p.id}><Img src={p.image} alt={p.name} backup={store.hero}/><div><Link to={to(store,'item/'+p.id)}>{p.name}</Link><span>{money(p.price)}</span><div className="fd-qty"><button onClick={()=>basket.change(p.id,-1)}>−</button>{p.qty}<button onClick={()=>basket.change(p.id,1)}>+</button></div></div><button onClick={()=>basket.remove(p.id)}>Remove</button></article>)}</div><aside className="fd-cart-total"><h2>YOUR TOTAL</h2><div><span>Subtotal</span><b>{money(basket.total)}</b></div><p>Delivery fee and pickup details will be confirmed by the business before payment.</p><button className="fd-primary" onClick={()=>setCheckout(true)}>Continue to checkout <Icon name="arrow" size={17}/></button>{checkout&&<div role="status" className="fd-demo-alert">Checkout is a demonstration. No order has been placed and no payment was taken. The live business will connect its own payment and delivery provider.</div>}<Link to={to(store,'menu')}>Keep browsing the menu</Link></aside></div>:<div className="fd-empty"><h2>Your bag is feeling a little empty.</h2><p>Explore the menu to find something delicious.</p><Link to={to(store,'menu')}>Explore the menu <Icon name="arrow" size={17}/></Link></div>}</main>
}
function StoryPage({store,kind='about'}) {
 const experience=kind==='experience'
 const images=store.id==='catalogue'?[foodPhotos.bakeryBread,foodPhotos.bakeryCafe]:store.id==='editorial'?[foodPhotos.koreanPlace,foodPhotos.koreanTable]:[foodPhotos.biryaniSpices,foodPhotos.biryaniRestaurant]
 return <main className="fd-inner fd-story-page"><Breadcrumb store={store} section={experience?'Experience':'Our story'}/><section className="fd-story-hero"><div><span>{experience?'DINE WITH US':'WHO WE ARE'}</span><h1>{experience?'A place for the whole experience.':'Where good food becomes a good memory.'}</h1><p>{store.tagline} Inspired by the warmth of the table, our example kitchen celebrates food that brings people closer.</p><Link className="fd-primary" to={to(store,'menu')}>Explore our menu <Icon name="arrow" size={16}/></Link></div><Img src={images[0]} alt="Restaurant kitchen and dining ambience" backup={store.secondary}/></section><section className="fd-story-bottom"><Img src={images[1]} alt="Food and hospitality details" backup={store.hero}/><div><span>OUR APPROACH</span><h2>Made with intention. Shared with love.</h2><p>Thoughtful ingredients, memorable food and a warm welcome. These are sample brand narratives to demonstrate the finished business website experience.</p><Link to={to(store,'contact')}>Get in touch <Icon name="arrow" size={16}/></Link></div></section></main>
}
function FeedbackForm({store,kind}) {
 const [sent,setSent]=useState(false)
 const [values,setValues]=useState({name:'',email:'',phone:'',date:'',guests:'2',message:'',size:'Medium',flavour:'Vanilla'})
 const change=(key,value)=>setValues(prev=>({...prev,[key]:value}))
 const isReservation=kind==='reservations'
 const isCatering=kind==='catering'||kind==='events'
 const title=isReservation?'Reserve your table.':isCatering?(store.id==='catalogue'?'Let's make your celebration sweet.':'Let's make your gathering delicious.'):'Say hello.'
 return <main className="fd-inner fd-contact-page"><Breadcrumb store={store} section={isReservation?'Reservations':isCatering?'Catering & events':'Contact'}/><div className="fd-contact-grid"><div className="fd-contact-intro"><span>{isReservation?'DINE WITH US':isCatering?'PARTIES & BIG TABLES':'WE WOULD LOVE TO HEAR FROM YOU'}</span><h1>{title}</h1><p>{isReservation?'Choose your preferred date and group size. This form demonstrates the reservation journey, without checking actual table availability.':isCatering?'Tell us what you are celebrating and how many people are coming. We will use your details to prepare a proper order enquiry on the finished website.':'Have a question about an order, menu or visit? Leave a note.'}</p><div className="fd-contact-facts"><p><Icon name="pin" size={19}/> {store.location}</p><p><Icon name="clock" size={19}/> Actual hours and delivery zones supplied at launch</p><p><Icon name="bag" size={19}/> Sample business, not taking real orders</p></div><Img src={store.secondary} alt="Food venue and dining atmosphere" backup={store.hero}/></div><form className="fd-contact-form" onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<div className="fd-form-done" role="status"><Icon name="check" size={28}/><h2>Your details are filled in.</h2><p>This is a working form preview, not a real submission. No reservation, cake order or catering enquiry was sent. The finished site will connect email, WhatsApp or a booking system.</p><button type="button" onClick={()=>setSent(false)}>Edit details</button></div>:<><h2>{isReservation?'Your table details':isCatering?'Your event details':'Send us a message'}</h2><label>Full name<input required value={values.name} onChange={e=>change('name',e.target.value)} placeholder="Your name"/></label><label>Email address<input type="email" required value={values.email} onChange={e=>change('email',e.target.value)} placeholder="you@example.com"/></label><label>Phone number<input required value={values.phone} onChange={e=>change('phone',e.target.value)} placeholder="Your contact number"/></label>{(isReservation||isCatering)&&<div className="fd-form-row"><label>Preferred date<input type="date" required min={new Date().toISOString().slice(0,10)} value={values.date} onChange={e=>change('date',e.target.value)}/></label><label>{isReservation?'Party size':'Number of guests'}<select value={values.guests} onChange={e=>change('guests',e.target.value)}>{['1','2','3','4','5','6','8','10','15','20','30','50+'].map(v=><option key={v}>{v}</option>)}</select></label></div>}{isCatering&&store.id==='catalogue'&&<div className="fd-form-row"><label>Cake size<select value={values.size} onChange={e=>change('size',e.target.value)}><option>Small</option><option>Medium</option><option>Large</option><option>Party-sized</option></select></label><label>Flavour<select value={values.flavour} onChange={e=>change('flavour',e.target.value)}><option>Vanilla</option><option>Chocolate</option><option>Red velvet</option><option>Strawberry</option></select></label></div>}<label>Additional details<textarea rows={5} value={values.message} onChange={e=>change('message',e.target.value)} placeholder={isReservation?'Preferred time, accessibility needs or occasion...':'Tell us what you need...'} /></label><button type="submit" className="fd-primary">Preview submission <Icon name="arrow" size={17}/></button><small>This demo does not transmit, store or confirm any enquiry.</small></>}</form></div></main>
}
function Locations({store}) {
 const locations=[{name:'The Morning Counter',image:foodPhotos.bakeryCafe,detail:'Sample location, Lagos'},{name:'The Garden Café',image:foodPhotos.koreanTable,detail:'Sample location, Lagos'},{name:'The Little Bakehouse',image:foodPhotos.koreanPlace,detail:'Sample location, Lagos'}]
 return <main className="fd-inner fd-locations-page"><Breadcrumb store={store} section="Locations"/><div className="fd-page-head"><span>COME SAY HELLO</span><h1>Our cosy outlets.</h1><p>These location cards demonstrate the store locator. Addresses, maps and business hours are supplied when the client launches.</p></div><div className="fd-location-grid">{locations.map(place=><article key={place.name}><Img src={place.image} alt={place.name} backup={store.secondary}/><h2>{place.name}</h2><p>{place.detail}</p><span>Store address and hours available at launch</span><Link to={to(store,'contact')}>Contact the bakery <Icon name="up" size={16}/></Link></article>)}</div></main>
}
function FAQ({store}) {
 const [opened,setOpened]=useState(0)
 const qs=[['Can I place a real order here?','No. This is a website preview showing menu browsing, cart and checkout design. Real payment processing and fulfilment are connected for the finished business.'],['Are the food photographs and prices final?','No. Product photographs, prices, descriptions, customer reviews, addresses and business hours are example content and will be replaced with verified business details.'],['Can I customise items for a large order?','The catering form shows how customers can submit date, party size and instructions. Live quotes and order confirmations are configured for the finished website.'],['Are allergies and dietary requirements handled?','A business should provide verified ingredients, allergen information and procedures. This demo must not be used to make real dietary decisions.'],['How do reservations work?','The reservation form shows the guest enquiry flow but does not check real-time availability or confirm a booking.'],['Can the shop accept delivery and pickup orders?','Yes, as part of a completed website with the merchant’s real payment gateway, address validation and delivery or collection settings.']]
 return <main className="fd-inner fd-help-page"><Breadcrumb store={store} section="Help"/><div className="fd-page-head"><span>GOOD TO KNOW</span><h1>Questions, answered.</h1></div><div className="fd-faq">{qs.map(([q,a],i)=><div key={q}><button aria-expanded={opened===i} onClick={()=>setOpened(opened===i?-1:i)}>{q}<span>{opened===i?'−':'+'}</span></button>{opened===i&&<p>{a}</p>}</div>)}</div></main>
}
function Missing({store}) {return <main className="fd-inner fd-empty"><h1>That page isn't on the menu.</h1><Link to={store.root}>Return home <Icon name="arrow"/></Link></main>}
function FoodFooter({store}) {
 return <footer className="fd-footer"><div className="fd-footer-top"><div><Link className="fd-footer-brand" to={store.root}>{store.name}</Link><p>{store.tagline}</p><small>Illustrative restaurant and bakery storefront created for December website previews.</small></div><div><b>Explore</b><Link to={to(store,'menu')}>Full menu</Link><Link to={to(store,'about')}>Our story</Link><Link to={to(store,store.id==='catalogue'?'locations':'catering')}>{store.id==='catalogue'?'Locations':'Catering'}</Link></div><div><b>Need help?</b><Link to={to(store,'contact')}>Contact</Link><Link to={to(store,'faq')}>FAQs</Link><Link to={to(store,'cart')}>Your order</Link></div><div><b>Visit us</b><p>{store.location}</p><p>Hours and phone added at launch.</p></div></div><div className="fd-footer-bottom"><span>© 2026 {store.name}. Sample website, not an active food business.</span><a href="#fd-top">Back to top ↑</a></div></footer>
}
function FoodBody({store}) {
 const basket=useBasket(store)
 const location=useLocation()
 const path=location.pathname.slice(store.root.length).replace(/^\//,'')
 const [page,id]=path.split('/')
 const content= !page ? (store.id==='editorial'?<HansikHome store={store} basket={basket}/>:store.id==='catalogue'?<BakeryHome store={store} basket={basket}/>:store.id==='minimal'?<MinimalHome store={store} basket={basket}/>:<ArtisanHome store={store} basket={basket}/>)
 :page==='menu'?<MenuPage key={location.search} store={store} basket={basket}/>
 :page==='item'?<ItemPage key={id} store={store} basket={basket} id={id}/>
 :page==='cart'?<CartPage store={store} basket={basket}/>
 :page==='about'||page==='experience'?<StoryPage store={store} kind={page}/>
 :['contact','catering','events','reservations'].includes(page)?<FeedbackForm key={page} store={store} kind={page}/>
 :page==='locations'?<Locations store={store}/>
 :page==='faq'?<FAQ store={store}/>:<Missing store={store}/>
 useEffect(()=>{const title=page==='item'?getItem(store,id)?.name:page?page.replace(/-/g,' ').replace(/^./,x=>x.toUpperCase()):'Home';document.title=(title||'Menu')+' | '+store.name+' | Food Website Preview'},[store,page,id])
 return <div className={'fd-site fd-site-'+store.id}><FoodNav store={store} basket={basket}/>{content}<FoodFooter store={store}/><CartPanel store={store} basket={basket}/></div>
}
export default function FoodStorefront({type='editorial'}) {const store=foodStores[type]||foodStores.editorial;return <FoodBody store={store}/>}
