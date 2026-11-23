import React from 'react'
import {createServer} from 'vite'
import {renderToStaticMarkup} from 'react-dom/server.js'
import {StaticRouter} from 'react-router-dom/server.js'
import {access} from 'node:fs/promises'
import {fashionInventory,fashionLooks} from '../src/pages/fashionInventory.js'
import {eventOffers} from '../src/pages/eventsReferenceData.js'

const vite=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'})
try{
 const {default:Fashion}=await vite.ssrLoadModule('/src/pages/FashionPlatform.jsx')
 const {default:Events}=await vite.ssrLoadModule('/src/pages/EventsReferenceStorefront.jsx')
 const fashion={
  editorial:{shop:'fw-ed-shop-cover',looks:'fw-ed-look-story',about:'fw-ed-about-manifesto',faq:'fw-ed-help-banner',product:'fw-ed-pdp-hero'},
  catalogue:{shop:'fw-cat-workspace',looks:'fw-cat-look-desk',about:'fw-cat-about-values',faq:'fw-cat-help-body',product:'fw-cat-pdp'},
  minimal:{shop:'fw-rush-workbench',looks:'fw-rush-combo-grid',about:'fw-rush-about-steps',faq:'fw-rush-help-studio',product:'fw-rush-pdp'},
 }
 for(const [mode,expected] of Object.entries(fashion)){
  for(const [section,marker] of Object.entries(expected)){
   const suffix=section==='looks'?'looks':section==='product'?'product/'+fashionInventory[0].id:section
   const path='/fashion'+mode+'/'+suffix
   await access(new URL('../dist'+path+'.html',import.meta.url))
   const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:path},React.createElement(Fashion,{mode})))
   if(html.length<2700)throw Error('Fashion page too small '+path)
   if(!html.includes(marker))throw Error('Fashion '+mode+' '+section+' lacks own composition: '+marker)
   const sharedMarkers=Object.entries(fashion).filter(([v])=>v!==mode).map(([v,sections])=>sections[section])
   for(const x of sharedMarkers)if(html.includes(x))throw Error('Fashion '+mode+' '+section+' leaked different design '+x)
   if(section==='shop')for(const p of fashionInventory)if(!html.includes('/product/'+p.id))throw Error('Missing product from '+path+': '+p.id)
   if(section==='looks')for(const look of fashionLooks)if(!html.includes('/looks/'+look.id)&&mode==='editorial')throw Error('Unlinked campaign '+look.id)
   console.log('PASS '+path+' matches unique '+mode+' '+section+' design')
  }
 }
 const eventMarkers={
 editorial:{explore:'vx-conference-programme',agenda:'vx-conf-daygrid',about:'vx-conf-about-belief',faq:'vx-conf-faq-layout',item:'vx-detail-editorial'},
 catalogue:{explore:'vx-merch-projects',stories:'vx-merch-gallery',about:'vx-merch-manifesto',faq:'vx-merch-faq',item:'vx-detail-catalogue'},
 minimal:{explore:'vx-creative-work',showreel:'vx-creative-work-header',about:'vx-creative-rules',faq:'vx-creative-faq',item:'vx-detail-minimal'},
 playful:{explore:'vx-festival-programme',agenda:'vx-fest-day-cards',about:'vx-fest-story-cover',faq:'vx-festival-faq',item:'vx-detail-playful'}
 }
 for(const [variant,sections] of Object.entries(eventMarkers)){
  for(const [section,marker] of Object.entries(sections)){
   const suffix=section==='item'?'item/'+eventOffers[variant][0].id:section
   const path='/events'+variant+'/'+suffix
   await access(new URL('../dist'+path+'.html',import.meta.url))
   const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:path},React.createElement(Events,{variant})))
   if(!html.includes(marker)||html.length<2200)throw Error('Event '+variant+' '+section+' missing independent layout '+marker)
   if(section==='explore')for(const p of eventOffers[variant])if(!html.includes('/item/'+p.id))throw Error('Event '+variant+' missing offer '+p.id)
   console.log('PASS '+path+' uses its unique event style')
  }
 }
 const {readFile}=await import('node:fs/promises')
 const css=await readFile(new URL('../src/pages/eventsDistinct.css',import.meta.url),'utf8')
 for(const family of ['Anton','Syne','Unbounded','Shrikhand'])if(!css.includes("font-family:'"+family+"'"))throw Error('Missing unique events font '+family)
 console.log('PASS 3 fashion worlds, 4 event worlds, direct route entrypoints and creative type systems')
}finally{await vite.close()}
