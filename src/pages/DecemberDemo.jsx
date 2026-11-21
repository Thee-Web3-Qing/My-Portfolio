import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { demoCatalogue } from '../data/decemberDemos.js'
import { INDUSTRIES, LAYOUTS } from '../data/december.js'
import './DecemberDemo.css'

const money=x=>'₦'+Number(x).toLocaleString('en-NG')

function DemoImage({src,alt,...rest}) {
  const [broken,setBroken]=useState(false)
  return broken?<div className="demo-image-fallback" role="img" aria-label={alt}>VISUALS FOR YOUR BRAND ✳</div>:
    <img src={src} alt={alt} loading="lazy" {...rest} onError={()=>setBroken(true)} />
}

function ProductCard({product,onChoose,index}){
  return <article className="demo-product-card">
    <button onClick={()=>onChoose(product)} aria-label={'Select '+product.name} className="demo-product-image">
      <DemoImage src={product.img} alt={product.name}/>
      <span>0{index+1} / VIEW ITEM ↗</span>
    </button>
    <div className="demo-product-details"><div><h3>{product.name}</h3><small>{product.category}</small></div><strong>{money(product.price)}</strong></div>
    <button className="demo-product-plus" onClick={()=>onChoose(product)}>Add to enquiry <span>+</span></button>
  </article>
}

function DemoProducts({data,category,setCategory,onChoose,limit=6,title='The collection',eyebrow='DISCOVER YOUR FAVOURITES'}){
  const filtered=data.products.filter(x=>category==='All'||category===x.category).slice(0,limit)
  return <section className="demo-products" id="demo-collection">
    <div className="demo-section-title"><div><span>{eyebrow}</span><h2>{title}</h2></div><span>CURATED FOR THE SEASON / 2026</span></div>
    <div className="demo-category-filters">{data.categories.map(x=><button className={category===x?'is-active':''} key={x} onClick={()=>setCategory(x)}>{x}</button>)}</div>
    <div className="demo-product-grid">{filtered.map((item,i)=><ProductCard product={item} index={i} key={item.name} onChoose={onChoose}/>)}</div>
    {!filtered.length&&<p>No items available in this category yet.</p>}
  </section>
}

function FashionEditorial({data,category,setCategory,onChoose}){
 return <>
  <section className="demo-fashion-editorial-hero">
    <div className="demo-fashion-overline"><span>FORME STUDIO ✳</span><span>THE HOLIDAY DROP / VOL. 01</span></div>
    <h1>FEEL THE <em>SEASON.</em></h1>
    <div className="demo-fashion-ribbon">MADE TO BE SEEN ✳ MADE TO BE WORN ✳ MADE TO BE SEEN ✳ MADE TO BE WORN ✳</div>
    <div className="demo-fashion-hero-photo">
      <DemoImage src={data.hero} alt="Editorial fashion campaign model"/>
      <div className="demo-fashion-hero-note"><span>NEW ARRIVALS 2026</span><h2>The art of<br/>showing up.</h2><p>Statement pieces for everywhere your December takes you.</p><a href="#demo-collection">SHOP THE COLLECTION ↗</a></div>
      <span className="demo-vertical-mark">DEC 26 / LIMITED SEASON EDIT</span>
      <div className="demo-sticker">THE<br/>DECEMBER<br/>EDIT ✳</div>
    </div>
  </section>
  <DemoProducts data={data} category={category} setCategory={setCategory} onChoose={onChoose} title="New arrivals" eyebrow="01 / THE SEASON EDIT"/>
  <section className="demo-fashion-story"><div><span>02 / THE CAMPAIGN</span><h2>Wear the<br/><em>unexpected.</em></h2><p>From rooftop evenings to the last-minute dinner invitation. Every piece deserves its own moment.</p><a href="#demo-collection">Explore the edit ↗</a></div><DemoImage src={data.second} alt="Fashion winter editorial campaign"/></section>
  <DemoProducts data={data} category={category} setCategory={setCategory} onChoose={onChoose} limit={4} title="The best sellers" eyebrow="03 / MOST LOVED"/>
 </>
}

function FashionCatalogue({data,category,setCategory,onChoose}){
 const [look,setLook]=useState(0)
 const chosen=data.products[look]
 return <div className="demo-fashion-catalogue">
   <div className="demo-outfit-left"><div className="demo-outfit-logo">FORME <span>STUDIO</span></div><p className="demo-outfit-search">⌕ &nbsp; Search styles, outfits, collections</p><div className="demo-outfit-categories">{data.categories.map(x=><button key={x} className={category===x?'active':''} onClick={()=>setCategory(x)}>{x}</button>)}</div><h2>Shop the edit <small>See all ↗</small></h2><div className="demo-outfit-grid">{data.products.filter(x=>category==='All'||category===x.category).slice(0,4).map((p,i)=><button key={p.name} onClick={()=>setLook(data.products.indexOf(p))}><DemoImage src={p.img} alt={p.name}/><strong>{p.name}</strong><small>{money(p.price)}</small></button>)}</div></div>
   <div className="demo-outfit-centre"><div className="demo-outfit-image"><DemoImage src={chosen.img} alt={'Look selected: '+chosen.name}/></div><span className="demo-spin-note">LOOK {String(look+1).padStart(2,'0')} / {String(data.products.length).padStart(2,'0')}</span><div className="demo-outfit-arrows"><button onClick={()=>setLook((look+data.products.length-1)%data.products.length)} aria-label="Previous look">←</button><button onClick={()=>setLook((look+1)%data.products.length)} aria-label="Next look">→</button></div></div>
   <div className="demo-outfit-right"><div><span>YOUR SELECTED LOOK</span><h2>Wear it your way.</h2><p>Choose a look and view all the details.</p></div><div className="demo-outfit-selected"><DemoImage src={chosen.img} alt={chosen.name}/><div><strong>{chosen.name}</strong><p>{chosen.desc}</p><b>{money(chosen.price)}</b></div></div><div className="demo-outfit-controls"><span>STYLE &amp; FIT</span><label>Size <select aria-label="Sample clothing size"><option>S</option><option>M</option><option>L</option><option>XL</option></select></label><p>✳&nbsp; Sample shopping experience</p><p>✳&nbsp; Your products, your options</p></div><button onClick={()=>onChoose(chosen)} className="demo-outfit-order">ADD TO ENQUIRY ↗</button><p className="demo-outfit-small">Demo: your finished website uses your real catalogue and selected paid features.</p></div>
 </div>
}

function FashionMinimal({data,onChoose}){
 return <div className="demo-fashion-minimal">
    <section className="demo-minimal-fashion-hero"><div><span>FORME / THE WINTER EDIT</span><h1>GET<br/>DRESSED.<br/><em>GO OUT.</em></h1><p>Every look tells its own story. Explore a few favourites, then make it yours.</p><a href="#minimal-shop">EXPLORE THE EDIT ↗</a></div><DemoImage src={data.second} alt="Seasonal fashion collection"/></section>
    <div className="demo-fashion-minimal-grid" id="minimal-shop">{data.products.slice(0,4).map((p,i)=><button onClick={()=>onChoose(p)} key={p.name}><DemoImage src={p.img} alt={p.name}/><div><span>0{i+1}</span><strong>{p.name}</strong><b>{money(p.price)} ↗</b></div></button>)}</div>
    <section className="demo-burgundy-callout"><span>STYLE NOTES / 2026</span><h2>A new season.<br/>A better outfit.</h2><p>For every place you're going and every person you'll become.</p></section>
 </div>
}

function FoodEditorial({data,category,setCategory,onChoose}){
 return <div className="demo-food-editorial">
  <section className="demo-food-dark-hero"><div className="demo-food-dark-copy"><span>FROM OUR KITCHEN TO YOUR TABLE</span><h1>GOOD FOOD.<br/><em>GREAT<br/>DECEMBER.</em></h1><p>Signature plates, full party trays and the kind of flavours people remember.</p><a href="#demo-collection">EXPLORE OUR FESTIVE MENU ↗</a><small>01 / 02 / 03</small></div><div className="demo-food-dark-photo"><DemoImage src={data.hero} alt="Delicious meal beautifully plated"/><span>FRESHLY MADE. BEAUTIFULLY SERVED.</span></div></section>
  <div className="demo-food-benefits"><span>✳ Fresh to order</span><span>✳ Party trays available</span><span>✳ Delivery and pickup</span><span>✳ Made for sharing</span></div>
  <section className="demo-food-split"><DemoImage src={data.second} alt="Signature chef's dish"/><div><span>THE EXPERIENCE / 2026</span><h2>A table worth<br/>coming back to.</h2><p>Thoughtful preparation, bold flavours and dishes that bring people together.</p><a href="#demo-collection">DISCOVER THE MENU ↗</a></div></section>
  <DemoProducts data={data} category={category} setCategory={setCategory} onChoose={onChoose} title="Signature dishes" eyebrow="FESTIVE MENU / ALL SEASON"/>
  <section className="demo-food-banner"><div><span>CELEBRATE WITH US</span><h2>Feed the whole crew.</h2><p>From office lunches to family celebrations, your festive order starts here.</p><a href="#demo-collection">EXPLORE DECEMBER TRAYS ↗</a></div><DemoImage src={data.hero} alt="Food catering and dining spread"/></section>
 </div>
}

function FoodCatalogue({data,category,setCategory,onChoose}){
 return <div className="demo-bakery">
  <div className="demo-bakery-hero"><div className="demo-bakery-copy"><span>FRESH FROM THE OVEN / DECEMBER 2026</span><h1>Butter, flour<br/>&amp; a <em>little</em> love.</h1><p>The table is better with something sweet. Cakes, pastries and small celebrations, made fresh.</p><a href="#demo-collection">EXPLORE THE MENU ↗</a><div className="demo-bakery-stars">★★★★★ <span>Lovingly prepared for every order.</span></div></div><div className="demo-bakery-photo"><DemoImage src={data.products[2].img} alt="Beautiful bakery celebration cake"/><span>FRESHLY BAKED <b>✳</b></span></div></div>
  <div className="demo-bakery-ticker">CAKES ✳ PASTRIES ✳ PARTY TRAYS ✳ DESSERTS ✳ CAKES ✳ PASTRIES ✳ PARTY TRAYS ✳ DESSERTS</div>
  <DemoProducts data={data} category={category} setCategory={setCategory} onChoose={onChoose} title="Today's fresh bakes" eyebrow="THE SWEET COLLECTION"/>
  <section className="demo-bakery-offer"><div><span>MADE FOR SPECIAL OCCASIONS</span><h2>Your party, our cake.</h2><p>Beautiful treats for birthdays, work parties and your festive table.</p><a href="#demo-collection">ORDER A CELEBRATION BOX ↗</a></div><DemoImage src={data.products[3].img} alt="Bakery treats ready for celebration"/></section>
  <div className="demo-bakery-feature"><div><span>01 /</span><h3>Made fresh</h3><p>Freshly prepared with care.</p></div><div><span>02 /</span><h3>Made to share</h3><p>A little extra for every gathering.</p></div><div><span>03 /</span><h3>Made for you</h3><p>Simple ordering that feels personal.</p></div></div>
 </div>
}

function FoodMinimal({data,category,setCategory,onChoose}){
 return <div className="demo-food-minimal">
  <section className="demo-food-min-hero"><div className="demo-food-min-image"><DemoImage src={data.hero} alt="Freshly prepared feast meal"/></div><div className="demo-food-min-copy"><span>THE BIG DECEMBER FEAST / 2026</span><h1>Made for<br/><em>sharing.</em></h1><p>Rich flavour, generous portions, and food that tastes like celebration.</p><div className="demo-food-price"><span>FEASTS FROM</span><b>₦9,000</b></div><a href="#demo-collection">ORDER NOW ↗</a></div></section>
  <DemoProducts data={data} category={category} setCategory={setCategory} onChoose={onChoose} title="Explore the menu" eyebrow="OUR FAVOURITES"/>
  <section className="demo-food-min-offer"><strong>THE DECEMBER EDIT</strong><h2>Good company.<br/>Great food.</h2><p>Orders for events, private celebrations and the days that deserve something extra.</p></section>
 </div>
}

function GenericDemo({data,category,setCategory,onChoose,layout}){
 return <div className={'demo-generic demo-generic-'+layout} style={{'--demo-accent':data.accent,'--demo-tint':data.bg}}>
   <section className="demo-generic-hero"><div><span>{data.tag}</span><h1>{data.subtitle}</h1><p>{data.promise}</p><a href="#demo-collection">VIEW COLLECTION ↗</a></div><DemoImage src={data.hero} alt={data.brand+' featured campaign photography'}/></section>
   <DemoProducts data={data} category={category} setCategory={setCategory} onChoose={onChoose} title={data.products.length===3?'The featured edit':'The collection'} eyebrow="YOUR PRODUCTS & SERVICES"/>
   <section className="demo-generic-feature"><DemoImage src={data.second} alt={data.brand+' seasonal feature'}/><div><span>WHY CHOOSE US</span><h2>A little more<br/>thoughtful.</h2><p>{data.promise}</p><a href="#demo-collection">EXPLORE MORE ↗</a></div></section>
 </div>
}
export default function DecemberDemo(){
 const {industry:raw}=useParams()
 const [search]=useSearchParams()
 const industry=demoCatalogue[raw]?raw:'fashion'
 const data=demoCatalogue[industry]
 const layout=['editorial','catalogue','minimal'].includes(search.get('layout'))?search.get('layout'):'editorial'
 const [category,setCategory]=useState('All')
 const [bag,setBag]=useState([])
 const [showBag,setShowBag]=useState(false)
 const [notice,setNotice]=useState('')
 const bagTotal=useMemo(()=>bag.reduce((sum,x)=>sum+x.price,0),[bag])
 const selected=INDUSTRIES.find(x=>x.id===industry)
 const add=p=>{setBag(prev=>[...prev,p]);setNotice(p.name+' added to your sample enquiry.');setShowBag(true)}
 const shown=industry==='fashion'?(layout==='editorial'?<FashionEditorial data={data} category={category} setCategory={setCategory} onChoose={add}/>:layout==='catalogue'?<FashionCatalogue data={data} category={category} setCategory={setCategory} onChoose={add}/>:<FashionMinimal data={data} onChoose={add}/>)
 :industry==='food'?(layout==='editorial'?<FoodEditorial data={data} category={category} setCategory={setCategory} onChoose={add}/>:layout==='catalogue'?<FoodCatalogue data={data} category={category} setCategory={setCategory} onChoose={add}/>:<FoodMinimal data={data} category={category} setCategory={setCategory} onChoose={add}/>)
 :<GenericDemo data={data} category={category} setCategory={setCategory} onChoose={add} layout={layout}/>
 return <div className={'dec-demo dec-demo-'+industry+' dec-demo-'+layout}>
   <div className="dec-demo-bar"><Link to={'/december?industry='+industry+'&layout='+layout+'#build-your-site'}>← Back to December sale</Link><span>LIVE DEMO WEBSITE · {selected?.label}</span><Link to="/december">GET THIS STYLE ↗</Link></div>
   <div className="dec-demo-layout-switch"><span>EXPLORE THIS DEMO</span><div>{LAYOUTS.map(l=><Link key={l.id} to={'/december/demo/'+industry+'?layout='+l.id} className={layout===l.id?'is-active':''}>{l.label}</Link>)}</div><span>EXAMPLE CONTENT · NOT A REAL BUSINESS</span></div>
   <div className="dec-demo-site"><nav className="dec-demo-nav"><a href="#demo-top" className="dec-demo-wordmark">{data.brand}</a><div><a href="#demo-collection">Collection</a><a href="#demo-story">Our story</a><a href="#demo-contact">Contact</a></div><button onClick={()=>setShowBag(true)}>ENQUIRY ({bag.length}) <span>↗</span></button></nav><div id="demo-top"></div>
    {shown}
    <section className="demo-last-call" id="demo-story"><p>DESIGNED FOR DECEMBER. READY FOR EVERY SEASON.</p><h2>Make something<br/><em>worth remembering.</em></h2><span>{data.promise}</span><a href="#demo-collection">EXPLORE {industry==='food'?'THE MENU':'THE COLLECTION'} ↗</a></section>
    <footer className="demo-site-footer" id="demo-contact"><strong>{data.brand}</strong><p>Instagram · WhatsApp · Delivery &amp; pickup · Contact</p><span>Sample storefront design by Qing The Creator · All brands, prices and products are illustrative.</span></footer>
   </div>
   {notice&&<div className="demo-toast" role="status">{notice}</div>}
   {showBag&&<div className="demo-bag-backdrop" onClick={()=>setShowBag(false)} role="presentation"><aside className="demo-bag" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Sample product enquiry"><button className="demo-bag-close" onClick={()=>setShowBag(false)}>CLOSE ×</button><span>YOUR SAMPLE ENQUIRY</span><h2>Good choices.</h2>{bag.length?<><div className="demo-bag-items">{bag.map((p,i)=><div key={i}><DemoImage src={p.img} alt={p.name}/><span><strong>{p.name}</strong><small>{money(p.price)}</small></span><button onClick={()=>setBag(prev=>prev.filter((_,index)=>index!==i))} aria-label={'Remove '+p.name}>×</button></div>)}</div><p className="demo-bag-total">EXAMPLE TOTAL <strong>{money(bagTotal)}</strong></p><p>In a real client website, customers can send an item or an optional combined basket to the business WhatsApp number. This demo does not submit real orders.</p><button className="demo-bag-primary" onClick={()=>setShowBag(false)}>CONTINUE EXPLORING ↗</button></>:<p>No items selected yet. Explore the site and select a product to see a sample enquiry.</p>}</aside></div>}
 </div>
}
