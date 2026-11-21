
import { useState } from 'react'
import './StorefrontPreviewGallery.css'

export const STOREFRONT_PREVIEWS = [
 { id:'fashioneditorial',category:'Fashion',label:'LOCO',style:'Editorial',summary:'Oversized typography, an expressive campaign hero and a bold new-season collection.',url:'/fashioneditorial',accent:'#eb704b',number:'01' },
 { id:'fashioncatalogue',category:'Fashion',label:'HER FASHION',style:'Catalogue',summary:'Shop by garment, discover matching looks and build an outfit with the product picker.',url:'/fashioncatalogue',accent:'#6e3444',number:'02' },
 { id:'fashionminimal',category:'Fashion',label:'RUSH',style:'Minimal',summary:'A considered wardrobe and fitting-room-inspired shopping experience.',url:'/fashionminimal',accent:'#d2b528',number:'03' },
 { id:'foodeditorial',category:'Food',label:'HANSIK',style:'Editorial',summary:'Dramatic Korean dining, signature dishes, a restaurant experience and reservations.',url:'/foodeditorial',accent:'#ed4147',number:'04' },
 { id:'foodcatalogue',category:'Food',label:'Crumb & Co.',style:'Catalogue',summary:'A playful bakery with fresh pastries, sweet treats and a custom cake enquiry.',url:'/foodcatalogue',accent:'#f05c83',number:'05' },
 { id:'foodminimal',category:'Food',label:'KANIGIRI',style:'Minimal',summary:'Dish-first biryani ordering with bold food photography, menu filters and a cart.',url:'/foodminimal',accent:'#dba344',number:'06' },
 { id:'foodartisan',category:'Food',label:'MATBOR',style:'Artisan',summary:'Cream, sage and warm colours for an inviting biryani restaurant storefront.',url:'/foodartisan',accent:'#839b56',number:'07' },
 { id:'giftseditorial',category:'Gifts',label:'MAISON NOËL',style:'Editorial',summary:'A dramatic holiday gift edit with oversized serif typography, festive bundles and art-directed storytelling.',url:'/giftseditorial',accent:'#923b46',number:'08' },
 { id:'giftscatalogue',category:'Gifts',label:'THE GIFT CLUB',style:'Catalogue',summary:'A joyful gift catalogue with recipient-led discovery, a playful gift finder and personalisation.',url:'/giftscatalogue',accent:'#ec577f',number:'09' },
 { id:'giftsminimal',category:'Gifts',label:'THE KIND EDIT',style:'Minimal',summary:'Considered gift sets and a personal hamper-building studio with contents, wrapping and gift notes.',url:'/giftsminimal',accent:'#81917c',number:'10' },
 { id:'beautyeditorial',category:'Beauty',label:'MUSE / ATELIER',style:'Editorial',summary:'Glossy dark-bronze beauty campaign with a studio story and personal appointment journey.',url:'/beautyeditorial',accent:'#c99b79',number:'11' },
 { id:'beautycatalogue',category:'Beauty',label:'GLOWROOM',style:'Catalogue',summary:'Playful pink beauty service catalogue with categories, duration and booking requests.',url:'/beautycatalogue',accent:'#dc6a9b',number:'12' },
 { id:'beautyminimal',category:'Beauty',label:'SÉRÉNE',style:'Minimal',summary:'Quiet ivory and sage salon experience with considered treatment details.',url:'/beautyminimal',accent:'#849579',number:'13' },
 { id:'eventseditorial',category:'Events',label:'AFTER HOURS',style:'Editorial',summary:'High-contrast creative events studio with immersive hero, project portfolio and event briefs.',url:'/eventseditorial',accent:'#a8ef65',number:'14' },
 { id:'eventscatalogue',category:'Events',label:'MOMENT CLUB',style:'Catalogue',summary:'Bright celebration website with occasion-led packages and a working project brief.',url:'/eventscatalogue',accent:'#ef7b51',number:'15' },
 { id:'eventsminimal',category:'Events',label:'FORMA EVENTS',style:'Minimal',summary:'Architectural event design studio with restrained typography, galleries and proposal enquiries.',url:'/eventsminimal',accent:'#b1816d',number:'16' },
 { id:'accessorieseditorial',category:'Accessories',label:'FORM & FOUND',style:'Editorial',summary:'High-fashion accessories campaign with striking object photography and ecommerce pages.',url:'/accessorieseditorial',accent:'#f39660',number:'17' },
 { id:'accessoriescatalogue',category:'Accessories',label:'THE LITTLE OBJECTS',style:'Catalogue',summary:'Playful accessories catalogue with colour variants, saved pieces and style-kit builder.',url:'/accessoriescatalogue',accent:'#d77aa4',number:'18' },
 { id:'accessoriesminimal',category:'Accessories',label:'OBJECTS / 09',style:'Minimal',summary:'Minimal object-study retail store with product variants and curated style combinations.',url:'/accessoriesminimal',accent:'#9a8574',number:'19' },
 { id:'hospitalityeditorial',category:'Stays',label:'SUNDAY HOUSE',style:'Editorial',summary:'Immersive stay editorial with curated properties, photo galleries and date enquiries.',url:'/hospitalityeditorial',accent:'#d8bd95',number:'20' },
 { id:'hospitalitycatalogue',category:'Stays',label:'NEST CLUB',style:'Catalogue',summary:'Bright short-let catalogue with guest and area filters and booking enquiry forms.',url:'/hospitalitycatalogue',accent:'#e3ad52',number:'21' },
 { id:'hospitalityminimal',category:'Stays',label:'ATELIER STAYS',style:'Minimal',summary:'Quiet architectural stays website with detailed room galleries and stay requests.',url:'/hospitalityminimal',accent:'#91a18f',number:'22' },
]

function GalleryCard({site,device}){
 const [interactive,setInteractive]=useState(false)
 return <article className="site-preview-card" style={{'--site-preview-accent':site.accent}}>
  <div className="site-preview-card-top">
   <span className="site-preview-count">{site.number} / {String(STOREFRONT_PREVIEWS.length).padStart(2,'0')}</span>
   <span className="site-preview-category">{site.category} <i/> {site.style}</span>
  </div>
  <div className="site-preview-browser">
   <div className="site-preview-chrome"><span className="site-preview-dots"><i/><i/><i/></span><code>{site.url}</code><a href={site.url} target="_blank" rel="noopener noreferrer" aria-label={'Open '+site.label+' in a full tab'}>↗</a></div>
   <div className={'site-preview-viewport site-preview-viewport-'+device}>
    <iframe src={site.url} title={site.label+' full website interactive preview'} loading="lazy" style={{pointerEvents:interactive?'auto':'none'}} />
    {!interactive&&<button type="button" className="site-preview-unlock" onClick={()=>setInteractive(true)}>Interact with website ↗</button>}
   </div>
   <div className="site-preview-controls"><button type="button" onClick={()=>setInteractive(x=>!x)} aria-pressed={interactive}>{interactive?'✓ Interaction on · Lock scrolling':'Enable browsing inside preview'}</button><a href={site.url} target="_blank" rel="noopener noreferrer">Open full website ↗</a></div>
  </div>
  <div className="site-preview-copy"><div><span>{site.category.toUpperCase()} / {site.style.toUpperCase()}</span><h3>{site.label}</h3></div><p>{site.summary}</p></div>
 </article>
}

export default function StorefrontPreviewGallery({placement='december'}){
 const [category,setCategory]=useState('All')
 const [device,setDevice]=useState('desktop')
 const shown=STOREFRONT_PREVIEWS.filter(site=>category==='All'||site.category===category)
 return <section className={'site-preview-gallery site-preview-gallery-'+placement} id="website-previews" aria-labelledby="site-preview-gallery-title">
  <header className="site-preview-intro"><div><p>DECEMBER / LIVE WEBSITE DEMONSTRATIONS</p><h2 id="site-preview-gallery-title">Twenty-two websites.<br/><em>Twenty-two ways to stand out.</em></h2><span>Explore real, multi-page fashion, food, gifting, beauty, events, accessories and hospitality storefronts. Every preview opens as its own full website, with products, menus and a sample shopping experience.</span></div><strong>{String(STOREFRONT_PREVIEWS.length).padStart(2,'0')} / LIVE CONCEPTS</strong></header>
  <div className="site-preview-filters"><div aria-label="Filter website previews">{['All','Fashion','Food','Gifts','Beauty','Events','Accessories','Stays'].map(item=><button key={item} onClick={()=>setCategory(item)} className={category===item?'active':''} aria-pressed={category===item}>{item} <span>{String(item==='All'?STOREFRONT_PREVIEWS.length:STOREFRONT_PREVIEWS.filter(site=>site.category===item).length).padStart(2,'0')}</span></button>)}</div><div className="site-preview-device" aria-label="Preview size"><button className={device==='desktop'?'active':''} onClick={()=>setDevice('desktop')} aria-pressed={device==='desktop'}>Desktop</button><button className={device==='mobile'?'active':''} onClick={()=>setDevice('mobile')} aria-pressed={device==='mobile'}>Mobile</button></div></div>
  <div className="site-preview-grid">{shown.map(site=><GalleryCard key={site.id} site={site} device={device}/>)}</div>
  <p className="site-preview-footnote">These are demonstration stores. Sample product prices, imagery, availability and customer information are illustrative. Shopping and booking interfaces do not collect real payments or confirm reservations.</p>
  {placement==='home'&&<a className="site-preview-home-cta" href="/december#dec-designs">Choose a website style and see pricing ↗</a>}
 </section>
}
