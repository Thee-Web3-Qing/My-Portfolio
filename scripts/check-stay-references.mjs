// Stay and experience acceptance checks, covering five supplied compositions
// and every routed journey, not just the desktop homepages.
import assert from 'node:assert/strict'
import React from 'react'
import {createServer} from 'vite'
import {renderToStaticMarkup} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server.js'
import {readFile} from 'node:fs/promises'
import {STAY_STYLES,STAY_WORLDS} from '../src/pages/stayWorldData.js'
import {allPaths} from '../src/pages/industryStoreData.js'
import {getLayoutsForIndustry,BASE_PRICE,calculateDecemberQuote} from '../src/data/december.js'

const expectations={
 editorial:{name:'ORIZON',className:'st-orizon',item:'lunar-oasis'},
 catalogue:{name:'VISA TRAVELS',className:'st-visa',item:'alpine-retreat'},
 adventure:{name:'NEPALICA',className:'st-nepal',item:'everest-evermore'},
 minimal:{name:'PIGMA',className:'st-pigma',item:'pigma-coastal'},
 architect:{name:'APEX ARC',className:'st-apex',item:'arc-forest'}
}
assert.deepEqual(getLayoutsForIndustry('hospitality').map(x=>x.id),STAY_STYLES)
assert.equal(getLayoutsForIndustry('hospitality').length,5)
assert.equal(BASE_PRICE,100000)
for(const style of STAY_STYLES)assert.equal(calculateDecemberQuote({industry:'hospitality',layout:style}).layout.id,style)
const css=await readFile('src/pages/stayReference.css','utf8')
const gallery=await readFile('src/components/StorefrontPreviewGallery.jsx','utf8')
const app=await readFile('src/App.jsx','utf8')
const builder=await readFile('src/pages/December.jsx','utf8')
assert.match(css,/@media\(max-width:720px\)/)
assert.match(css,/@media\(max-width:380px\)/)
assert.match(css,/\.st-header nav\.st-open/)
assert.match(builder,/dec-layout-choices-hospitality/)
assert.match(app,/hospitality'\+style/)
assert.match(gallery,/Twenty-seven websites/)
for(const style of STAY_STYLES){
 const data=STAY_WORLDS[style]
 assert.ok(data,'Missing world '+style)
 assert.equal(data.name,expectations[style].name)
 assert.ok(data.items.length>=5,'Not enough meaningful items for '+style)
 assert.ok(data.images.hero,'Missing hero photography for '+style)
 assert.ok(css.includes('.'+expectations[style].className),'Missing independent design CSS for '+style)
 assert.ok(gallery.includes("id:'hospitality"+style+"'"),'Missing gallery card '+style)
 for(const item of data.items)assert.ok(data.categories.includes(item.category),'Unreachable category '+item.category+' in '+style)
 for(const page of ['', '/search','/saved','/enquire','/explore','/item/'+expectations[style].item]){
  assert.ok(allPaths.includes('/hospitality'+style+page),'No deep-link entrypoint '+style+page)
 }
}
const vite=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'})
let count=0
try{
 const {default:IndustryStorefront}=await vite.ssrLoadModule('/src/pages/IndustryStorefront.jsx')
 for(const [style,expect] of Object.entries(expectations)){
  const pages=[
   ['',expect.className],
   ['explore','ix-catalogue'],
   ['search?guests=2&area='+encodeURIComponent(STAY_WORLDS[style].items[0].area),'ix-catalogue'],
   ['item/'+expect.item,'ix-details'],
   ['enquire?item='+expect.item,'ix-inquiry'],
   ['saved','ix-saved'],
   ['about','ix-about'],
   ['contact','ix-contact']
  ]
  for(const [segment,marker] of pages){
   const pathname='/hospitality'+style+(segment?'/'+segment:'')
   const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:pathname},React.createElement(IndustryStorefront,{industry:'hospitality',style})))
   assert.ok(html.includes('ix-hospitality-'+style),'Missing variant identity on '+pathname)
   assert.ok(html.includes('st-header'),'Missing distinct header '+pathname)
   assert.ok(html.includes(expect.name),'Missing brand identity '+pathname)
   assert.ok(html.includes(marker),'Missing '+marker+' on '+pathname)
   assert.ok(html.length>2000,'Suspiciously short markup '+pathname)
   if(!segment){
    assert.ok(html.includes('/hospitality'+style+'/item/'),'Home must link to its own property details '+pathname)
    assert.ok(html.includes('/hospitality'+style+'/search'),'Home must offer real search navigation '+pathname)
   }
   count++
  }
 }
}finally{await vite.close()}
console.log('PASS '+count+' rendered stay routes, five unique homepages, responsive styles and active browse/enquiry journeys.')
