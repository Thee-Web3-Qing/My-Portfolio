
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
  <header className="site-preview-intro"><div><p>DECEMBER / LIVE WEBSITE DEMONSTRATIONS</p><h2 id="site-preview-gallery-title">Ten websites.<br/><em>Ten ways to stand out.</em></h2><span>Explore real, multi-page fashion, food and gifting storefronts. Every preview opens as its own full website, with products, menus and a sample shopping experience.</span></div><strong>{String(STOREFRONT_PREVIEWS.length).padStart(2,'0')} / LIVE CONCEPTS</strong></header>
  <div className="site-preview-filters"><div aria-label="Filter website previews">{['All','Fashion','Food','Gifts'].map(item=><button key={item} onClick={()=>setCategory(item)} className={category===item?'active':''} aria-pressed={category===item}>{item} <span>{String(item==='All'?STOREFRONT_PREVIEWS.length:STOREFRONT_PREVIEWS.filter(site=>site.category===item).length).padStart(2,'0')}</span></button>)}</div><div className="site-preview-device" aria-label="Preview size"><button className={device==='desktop'?'active':''} onClick={()=>setDevice('desktop')} aria-pressed={device==='desktop'}>Desktop</button><button className={device==='mobile'?'active':''} onClick={()=>setDevice('mobile')} aria-pressed={device==='mobile'}>Mobile</button></div></div>
  <div className="site-preview-grid">{shown.map(site=><GalleryCard key={site.id} site={site} device={device}/>)}</div>
  <p className="site-preview-footnote">These are demonstration stores. Sample product prices, imagery, availability and customer information are illustrative. Shopping and booking interfaces do not collect real payments or confirm reservations.</p>
  {placement==='home'&&<a className="site-preview-home-cta" href="/december#dec-designs">Choose a website style and see pricing ↗</a>}
 </section>
}
