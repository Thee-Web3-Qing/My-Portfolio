import React from 'react'
import {access} from 'node:fs/promises'
import {createServer} from 'vite'
import {renderToStaticMarkup} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server.js'
import {eventOffers} from '../src/pages/eventsReferenceData.js'
import {getLayoutsForIndustry,BASE_PRICE} from '../src/data/december.js'
const vite=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'})
const variantNames={editorial:'ev-conf-hero',catalogue:'ev-merch-hero-grid',minimal:'ev-creative-character',playful:'ev-fest-rainbow'}
const homeSpecs={
 editorial:['ev-conf-floating','ev-conf-belief','ev-conf-gallery','ev-conf-agenda','ev-conf-speakers','ev-conf-tickets'],
 catalogue:['ev-merch-hero-grid','ev-merch-bigstatement','ev-merch-brandline','ev-merch-wide-gallery','ev-merch-services','ev-merch-spotlight'],
 minimal:['ev-creative-character','ev-creative-showcase','ev-creative-projects','ev-creative-tools','ev-creative-about','ev-creative-end'],
 playful:['ev-fest-rainbow','ev-fest-cream','ev-fest-pipe','ev-fest-session-cards','ev-fest-agenda','ev-fest-tickets']
}
try{
 const {default:Component}=await vite.ssrLoadModule('/src/pages/EventsReferenceStorefront.jsx')
 let total=0
 for(const [variant,items] of Object.entries(eventOffers)){
  const root='/events'+variant
  const paths=[root,'explore','about','contact','plan','faq','agenda','speakers','stories','showreel',...items.map(p=>'item/'+p.id)].map(part=>part===root?part:root+'/'+part)
  for(const url of paths){
   const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:url},React.createElement(Component,{variant})))
   await access(new URL('../dist'+url+'.html',import.meta.url))
   if(!html.includes('ev-'+variant)||!html.includes('ev-header'))throw Error('Brand or navigation missing '+url)
   if(html.length<1900)throw Error('Unusually small route '+url)
   if(url===root){
    for(const marker of homeSpecs[variant])if(!html.includes(marker))throw Error('Reference layout section '+marker+' missing '+url)
    if(!html.includes('ev-foot'))throw Error('Homepage missing footer '+url)
   }
   if(url.endsWith('/explore')){
    const correct={editorial:'vx-conference-programme',catalogue:'vx-merch-projects',minimal:'vx-creative-work',playful:'vx-festival-programme'}
    if(!html.includes(correct[variant]))throw Error('Wrong project layout for '+variant+' on '+url)
    for(const p of items)if(!html.includes('/item/'+p.id))throw Error('Missing project link '+p.id+' '+url)
   }
   if(url.endsWith('/plan')&&(!html.includes('type="email"')||!html.includes('YOUR INTEREST')))throw Error('Enquiry controls missing '+url)
   if(url.includes('/item/')&&!html.includes('vx-detail-'+variant))throw Error('Brand-specific detail page missing '+url)
   total++
  }
  console.log('PASS: '+root+' matched desktop reference composition and all '+paths.length+' deep-linked pages.')
 }
 if(BASE_PRICE!==100000)throw Error('Core December fee changed')
 if(getLayoutsForIndustry('events').length!==4)throw Error('Event reference gallery missing fourth design')
 console.log('PASS: '+total+' independent events routes, fixed December price and all four selector styles.')
}finally{await vite.close()}
