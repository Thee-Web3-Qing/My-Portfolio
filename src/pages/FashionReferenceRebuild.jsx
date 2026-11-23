import {useState} from 'react'
import {Link} from 'react-router-dom'
import {useStore} from './FashionReference.jsx'
import {fashionImage,fashionInventory,fashionLooks,fashionMoney as money,getFashionProduct} from './fashionInventory.js'
import './fashionReferenceRebuild.css'

const uns=(id,w=1200)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+w+'&q=85'
const photos={
  cover:uns('photo-1483985988355-763728e1935b',1600),
  runway:uns('photo-1529139574466-a303027c1d8b',1600),
  luxe:uns('photo-1539109136881-3be0616acf4b',1600),
  studio:uns('photo-1490481651871-ab68de25d43d',1500),
  details:uns('photo-1483985988355-763728e1935b',1500),
  statement:uns('photo-1515886657613-9f3515b0c78f',1600),
  coat:uns('photo-1544022613-e87ca75a784a',1100),
  garment:uns('photo-1434389677669-e08b4cac3105',1100),
  minimal:uns('photo-1496747611176-843222e1e57c',1600),
  portrait:uns('photo-1503342217505-b0a15ec3261c',1300),
  everyday:uns('photo-1469334031218-e382a71b716b',1500),
  spotlight:uns('photo-1539008835657-9e8e9680c956',1300),
}
function Img({src,alt,className='',...props}){
 const [failed,setFailed]=useState(false)
 return <img {...props} className={className} alt={alt} src={failed?fashionImage['campaign-street']:src} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>
}
const go=(root,page='')=>root+(page?'/'+page:'')
function DecoLink({root,page='shop',children,className=''}){return <Link className={'fr-cta '+className} to={go(root,page)}>{children}<span aria-hidden="true">↗</span></Link>}
function Head({brand,root,shop,dark=false,centered=false,small=false}){
 const [open,setOpen]=useState(false)
 return <header className={'fr-head'+(dark?' fr-head-dark':'')+(centered?' fr-head-center':'')+(small?' fr-head-small':'')}>
  <Link className="fr-head-name" to={root}>{brand}</Link>
  <nav className={'fr-head-links'+(open?' is-open':'')} aria-label="Fashion website preview navigation">
   <Link to={go(root,'shop')} onClick={()=>setOpen(false)}>Shop</Link>
   <Link to={go(root,'looks')} onClick={()=>setOpen(false)}>The edit</Link>
   <Link to={go(root,'about')} onClick={()=>setOpen(false)}>About</Link>
   <Link to={go(root,'faq')} onClick={()=>setOpen(false)}>Contact</Link>
  </nav>
  <div className="fr-head-actions">
   <Link aria-label="Saved products" to={go(root,'wishlist')} className="fr-nav-icon">♡</Link>
   <button type="button" aria-label={'Open shopping bag, '+shop.count+' items'} onClick={()=>shop.setBagOpen(true)} className="fr-nav-icon">⌑{shop.count>0&&<sup>{shop.count}</sup>}</button>
   <button type="button" className="fr-menu-toggle" aria-label="Toggle fashion navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'×':'☰'}</button>
  </div>
 </header>
}
function MiniProducts({root,shop,items,heading='The collection',theme=''}) {
 return <section className={'fr-mini-products '+theme}>
  <div className="fr-mini-head"><span>THE FASHION EDIT / 2026</span><h2>{heading}</h2><DecoLink root={root}>Shop all pieces</DecoLink></div>
  <div className="fr-mini-grid">{items.map((p,i)=><article key={p.id}>
   <Link className="fr-mini-image" to={go(root,'product/'+p.id)}><Img src={p.image} alt={p.name}/><span>{String(i+1).padStart(2,'0')}</span></Link>
   <div className="fr-mini-bottom"><Link to={go(root,'product/'+p.id)}>{p.name}</Link><strong>{money(p.price)}</strong></div>
   <button onClick={()=>shop.add(p)} aria-label={'Add '+p.name+' to bag'}>ADD TO BAG <span>+</span></button>
  </article>)}</div>
 </section>
}
function FashionAtelier({root}) {
 const shop=useStore()
 const categories=[
  {title:'THE OUTERWEAR',body:'Statement layers for every entrance.',photo:photos.coat,category:'Outerwear'},
  {title:'THE OCCASION',body:'Looks worth making plans for.',photo:photos.minimal,category:'Dresses'},
  {title:'THE DETAILS',body:'The pieces that make it yours.',photo:fashionImage['croco'],category:'Bags'},
 ]
 const gallery=[
  {img:photos.statement,alt:'Full-length modern fashion styling'},
  {img:fashionImage['blackdress'],alt:'Elegant evening dress'},
  {img:photos.runway,alt:'Fashion campaign model outdoors'},
  {img:photos.portrait,alt:'Contemporary ready-to-wear outfit'},
  {img:fashionImage['rosebag'],alt:'Structured accessory'},
 ]
 return <main className="fr-atelier">
  <Head root={root} brand="MAISON RUE" shop={shop}/>
  <section className="fr-at-hero" aria-label="Fashion collection introduction">
   <div className="fr-at-hero-copy"><span className="fr-overline">THE HOLIDAY EDIT / 2026</span><h1>GOOD STYLE<br/>IS NEVER<br/><em>AN ACCIDENT.</em></h1><p>Statement dressing, everyday ease and a wardrobe that feels unmistakably yours.</p><DecoLink root={root}>Explore the collection</DecoLink></div>
   <Img className="fr-at-hero-left" src={photos.statement} alt="Fashion campaign model in an editorial look"/>
   <Img className="fr-at-hero-right" src={photos.runway} alt="Fashion model wearing a bold seasonal outfit"/>
   <div className="fr-at-note"><span>01 / THE NEW WARDROBE</span><strong>YOUR STYLE,<br/>YOUR STORY.</strong><p>Explore pieces that feel good together and even better on you.</p></div>
  </section>
  <section className="fr-at-services">
   <div className="fr-at-section-heading"><span>01 / THE COLLECTION</span><h2>EVERYTHING<br/>YOU NEED FOR<br/><em>complete dressing.</em></h2><div><p>From the first layer to the final detail, we've put the best pieces in one place.</p><DecoLink root={root}>Shop the edit</DecoLink></div></div>
   <div className="fr-at-services-grid">{categories.map((c,i)=><Link to={go(root,'shop?category='+c.category)} key={c.title}>
    <Img src={c.photo} alt={c.title+' fashion selection'}/><span className="fr-at-card-shade"/><small>0{i+1}</small><div><h3>{c.title}</h3><p>{c.body}</p></div><b>↗</b>
   </Link>)}</div>
  </section>
  <section className="fr-at-about"><div className="fr-at-about-copy"><span>02 / INSIDE THE STUDIO</span><h2>MORE THAN<br/>A FASHION<br/><em>collection.</em></h2><p>We believe personal style comes from confidence, curiosity and a good eye for the details.</p>
   <div className="fr-at-benefits"><span>◇ &nbsp; Curated wardrobe staples</span><span>♡ &nbsp; Looks made for real life</span><span>◎ &nbsp; Thoughtful seasonal drops</span><span>✳ &nbsp; Easy outfit discovery</span><span>◈ &nbsp; Pieces worth wearing twice</span><span>↗ &nbsp; A personal style story</span></div>
   <DecoLink root={root} page="about">Get to know the brand</DecoLink></div>
   <div className="fr-at-about-photo"><Img src={photos.studio} alt="Fashion showroom with curated clothes on display"/><span>MAISON RUE / BEHIND THE COLLECTION</span></div>
  </section>
  <section className="fr-at-portfolio">
    <div className="fr-at-section-heading"><span>03 / A CLOSER LOOK</span><h2>OUR WORK.<br/><em>Real wardrobes.</em></h2><div><p>A little inspiration from the looks, details and silhouettes we love.</p><DecoLink root={root} page="looks">See the lookbook</DecoLink></div></div>
    <div className="fr-at-mosaic">{gallery.map((x,i)=><Link key={i} to={go(root,'looks')} className={'fr-at-mosaic-'+i}><Img src={x.img} alt={x.alt}/><span>EDIT {String(i+1).padStart(2,'0')}</span></Link>)}</div>
  </section>
  <section className="fr-at-faces"><div className="fr-at-section-heading"><span>04 / THE PEOPLE IN THE CLOTHES</span><h2>MEET THE<br/><em>new mood.</em></h2><div><p>Different faces, one feeling. Every wardrobe has a personality.</p></div></div><div className="fr-at-faces-grid">{[photos.portrait,photos.minimal,photos.statement].map((src,i)=><div key={src}><Img src={src} alt={'Fashion model for editorial look '+(i+1)}/><span>THE LOOK / 0{i+1}</span></div>)}</div></section>
  <div className="fr-at-bottom"><strong>MAISON RUE</strong><span>A wardrobe is a world of its own.</span><DecoLink root={root}>Shop the full collection</DecoLink></div>
 </main>
}
function FashionOlive({root}) {
 const shop=useStore()
 const highlights=[fashionInventory[12],fashionInventory[4],fashionInventory[14]]
 const [index,setIndex]=useState(0)
 const featured=highlights[index]
 return <main className="fr-olive">
  <div className="fr-ol-stage">
   <Head root={root} brand="ELOMA / STUDIO" shop={shop} dark centered/>
   <section className="fr-ol-hero"><div className="fr-ol-background"><Img src={photos.statement} alt="Fashion model in soft seasonal styling"/></div>
    <span className="fr-ol-eyebrow">THE ART OF GETTING DRESSED / VOL. 01</span>
    <h1>DRESS<br/><em>BETTER.</em></h1><p>GOOD CLOTHES.<br/>GREAT CONFIDENCE.<br/>UNMISTAKABLY YOU.</p>
    <DecoLink root={root}>EXPLORE COLLECTION</DecoLink>
    <div className="fr-ol-spotlight"><Img src={featured.image} alt={featured.name}/><div><span>IN THE SPOTLIGHT</span><strong>{featured.name}</strong><small>{money(featured.price)} <Link to={go(root,'product/'+featured.id)}>View piece ↗</Link></small></div></div>
    <div className="fr-ol-hero-metric"><span>CURATED FOR<br/>THE WAYS YOU LIVE</span><strong>26 / 01</strong><span>THE DECEMBER EDIT</span></div>
   </section>
  </div>
  <section className="fr-ol-trust"><div><strong>01</strong><span>YOUR SIGNATURE EDIT</span></div><div><strong>03</strong><span>LOOKS TO BUILD ON</span></div><div><strong>24</strong><span>STYLES TO DISCOVER</span></div></section>
  <section className="fr-ol-experts"><div className="fr-ol-experts-title"><span>01 / FASHION IS PERSONAL</span><h2>Considered<br/><em>Clothes.</em></h2></div><div className="fr-ol-experts-photo"><Img src={[photos.luxe,photos.runway,photos.minimal][index]} alt="Featured model in a curated outfit"/><span>THE CAMPAIGN EDIT / 0{index+1}</span></div><div className="fr-ol-experts-right"><span>STYLED FOR YOU</span><h2>Good style is<br/><em>a feeling.</em></h2><p>Beautiful pieces can make the everyday feel a little more extraordinary.</p><div className="fr-ol-arrows"><button aria-label="Previous featured look" onClick={()=>setIndex((index+2)%3)}>←</button><button aria-label="Next featured look" onClick={()=>setIndex((index+1)%3)}>→</button></div></div></section>
  <section className="fr-ol-tour"><div className="fr-ol-tour-top"><span>02 / EXPLORE THE EDIT</span><h2>Take a tour<br/>of the <em>wardrobe.</em></h2><p>New favourites. Considered details. The next piece you'll wear on repeat.</p></div>
   <div className="fr-ol-tour-grid">{highlights.map((p,i)=><Link key={p.id} className={'fr-ol-product fr-ol-product-'+i} to={go(root,'product/'+p.id)}><Img src={p.image} alt={p.name}/><div><span>0{i+1} / THE COLLECTION</span><h3>{p.name}</h3><b>{money(p.price)} ↗</b></div></Link>)}</div>
  </section>
  <div className="fr-ol-footer"><span>A MORE CONSIDERED WARDROBE</span><h2>Good looks.<br/><em>Good living.</em></h2><DecoLink root={root}>Shop the collection</DecoLink></div>
 </main>
}
function FashionNoir({root}) {
 const shop=useStore()
 const categories=[{title:'TAILORED PIECES',label:'Strong silhouettes for every day.',p:fashionInventory[8]}, {title:'THE EVENING EDIT',label:'For the nights worth dressing for.',p:fashionInventory[14]}, {title:'LASTING DETAILS',label:'Finish with the pieces you love.',p:fashionInventory[3]}]
 return <main className="fr-noir">
  <section className="fr-nr-hero">
   <Img className="fr-nr-hero-photo" src={photos.luxe} alt="Contemporary fashion editorial model in an elegant outfit"/>
   <div className="fr-nr-hero-shade"/>
   <Head root={root} brand="ATELIER 09" shop={shop} dark small/>
   <div className="fr-nr-hero-copy"><span>INTENTIONAL CLOTHES / THE 2026 EDIT</span><h1>Crafting<br/>Naturally<br/>Confident<br/><em>Style.</em></h1><p>Where personal style finds its own rhythm. Beautiful clothes, carefully chosen.</p><DecoLink root={root}>EXPLORE THE COLLECTION</DecoLink></div>
   <div className="fr-nr-hero-bottom"><div><strong>24</strong><span>CURATED PIECES</span></div><div><strong>03</strong><span>COMPLETE LOOKS</span></div><div><strong>01</strong><span>YOUR POINT OF VIEW</span></div></div>
   <div className="fr-nr-feature-chip"><Img src={fashionInventory[14].image} alt="The evening slip dress"/><div><strong>THE EVENING EDIT</strong><span>New season, new perspective.</span><Link to={go(root,'product/'+fashionInventory[14].id)}>Discover ↗</Link></div></div>
  </section>
  <section className="fr-nr-why"><div className="fr-nr-why-copy"><span>THE WAY WE SEE IT / 01</span><h2>Why your<br/>wardrobe<br/><em>matters.</em></h2><p>Every piece should make space for who you are, instead of telling you who to be.</p><div className="fr-nr-values"><div><strong>SELECTED WITH INTENTION</strong><p>Thoughtful pieces that work together.</p></div><div><strong>STYLE WITHOUT LIMITS</strong><p>Dress for yourself, wherever you're going.</p></div><div><strong>MADE TO BE WORN</strong><p>Beautiful details for your actual life.</p></div></div></div><div className="fr-nr-why-photos"><Img src={photos.studio} alt="Curated clothes in a fashion studio"/><div className="fr-nr-why-inset"><Img src={photos.portrait} alt="Contemporary editorial fashion look"/><span>THE ART OF THE OUTFIT</span></div></div></section>
  <section className="fr-nr-services"><div className="fr-nr-services-title"><span>THE COLLECTION / 02</span><h2>Discover<br/>the <em>good stuff.</em></h2><DecoLink root={root}>View all styles</DecoLink></div><div className="fr-nr-services-grid">{categories.map((x,i)=><Link to={go(root,'product/'+x.p.id)} key={x.title}><Img src={x.p.image} alt={x.p.name}/><div><span>0{i+1} / {x.p.category}</span><h3>{x.title}</h3><p>{x.label}</p><b>↗</b></div></Link>)}</div></section>
  <section className="fr-nr-finale"><Img src={photos.runway} alt="Fashion campaign model ready for the season"/><div><span>THE NEW SEASON STARTS WITH YOU</span><h2>Every look<br/>begins with<br/><em>confidence.</em></h2><p>Find the pieces that make the feeling yours.</p><DecoLink root={root}>FIND YOUR NEXT LOOK</DecoLink></div></section>
 </main>
}
function FashionBotanical({root}) {
 const shop=useStore()
 const [active,setActive]=useState(0)
 const categories=[{name:'THE NEW EDIT',sub:'Best dressed for the season',category:'Dresses',src:photos.minimal},{name:'THE EVERYDAY',sub:'Pieces worth keeping',category:'Tops',src:photos.garment},{name:'THE FINISHING',sub:'The final little detail',category:'Bags',src:fashionImage['rosebag']}]
 const feature=[fashionInventory[12],fashionInventory[18],fashionInventory[20]]
 return <main className="fr-botanical">
  <div className="fr-bt-announcement">A LITTLE SOMETHING EXTRA FOR YOUR DECEMBER WARDROBE &nbsp; ✳ &nbsp; SHOP THE NEW EDIT</div>
  <Head root={root} brand="VERDANT / STUDIO" shop={shop} centered/>
  <section className="fr-bt-hero"><Img src={photos.minimal} alt="Editorial fashion model in naturally styled seasonal clothing"/>
   <div className="fr-bt-hero-card"><span>THE NEW SEASON / 2026</span><h1>Better things<br/>to wear.</h1><p>Thoughtful pieces for the most ordinary days and the most extraordinary plans.</p><DecoLink root={root}>SHOP THE COLLECTION</DecoLink></div>
   <div className="fr-bt-hero-flag">THE NATURAL WARDROBE<br/>COLLECTION 001</div>
  </section>
  <div className="fr-bt-wave"><span>THE FRESH EDIT &nbsp; ✳ &nbsp; THE FRESH EDIT &nbsp; ✳ &nbsp; THE FRESH EDIT &nbsp; ✳ &nbsp; THE FRESH EDIT</span></div>
  <section className="fr-bt-collections"><span>01 / FIND YOUR EDIT</span><h2>Featured <em>collections.</em></h2><div className="fr-bt-arch-grid">{categories.map((cat,i)=><Link key={cat.name} to={go(root,'shop?category='+cat.category)}>
   <div className="fr-bt-arch-photo"><Img src={cat.src} alt={cat.name+' fashion category'}/><span>0{i+1} / {cat.category}</span></div><h3>{cat.name}</h3><p>{cat.sub}</p><b>VIEW COLLECTION ↗</b>
  </Link>)}</div></section>
  <section className="fr-bt-spotlight"><div className="fr-bt-spotlight-image"><Img src={photos.statement} alt="Statement fashion collection editorial"/></div><div className="fr-bt-spotlight-copy"><span>THE FAVOURITES / VOLUME 01</span><h2>Your new<br/><em>favourite.</em></h2><p>The kind of piece that gets worn, loved and passed down through stories.</p><DecoLink root={root} page={'product/'+feature[active].id}>Explore this piece</DecoLink><div className="fr-bt-dots">{feature.map((p,i)=><button key={p.id} aria-label={'Show featured product '+(i+1)} aria-pressed={active===i} className={active===i?'selected':''} onClick={()=>setActive(i)}/>)}</div></div></section>
  <section className="fr-bt-featured"><div><span>02 / CONSIDERED OBJECTS</span><h2>Good things,<br/><em>every day.</em></h2></div><div className="fr-bt-featured-row">{feature.map((p,i)=><article key={p.id}><Link to={go(root,'product/'+p.id)}><Img src={p.image} alt={p.name}/></Link><strong>{p.name}</strong><span>{money(p.price)}</span><button onClick={()=>shop.add(p)}>ADD TO BAG +</button></article>)}</div></section>
  <div className="fr-bt-footer"><span>VERDANT / A MORE INTENTIONAL WARDROBE</span><h2>Wear what<br/><em>feels like you.</em></h2><DecoLink root={root}>Shop all styles</DecoLink></div>
 </main>
}
export default function FashionReferenceRebuild({mode,root}){
 if(mode==='editorial')return <FashionAtelier root={root}/>
 if(mode==='catalogue')return <FashionOlive root={root}/>
 if(mode==='minimal')return <FashionNoir root={root}/>
 return <FashionBotanical root={root}/>
}
