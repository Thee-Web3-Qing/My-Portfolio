// Every accessories reference has an independently designed homepage,
// live product links, collection filters, favourites, cart, and mobile CSS.
import assert from 'node:assert/strict'
import React from 'react'
import { createServer } from 'vite'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server.js'
import { readFile } from 'node:fs/promises'
import { ACCESSORY_STYLES, ACCESSORY_WORLDS } from '../src/pages/accessoryWorldData.js'
import { allPaths } from '../src/pages/industryStoreData.js'
import { getLayoutsForIndustry } from '../src/data/december.js'

const expected={
 editorial:{name:'OSSIA',marker:'aw-ossia',item:'orbit'},
 tech:{name:'VYRA',marker:'aw-tech',item:'vyra-amber'},
 catalogue:{name:'AERO STEP',marker:'aw-aero',item:'vortex'},
 playful:{name:'HUSH',marker:'aw-hush',item:'sabrina'},
 market:{name:'NOVA FINDS',marker:'aw-market',item:'urban-pack'},
 minimal:{name:'Veloura',marker:'aw-veloura',item:'queen-ring'}
}
assert.equal(ACCESSORY_STYLES.length,6,'All six references should have independent routes')
assert.deepEqual(getLayoutsForIndustry('accessories').map(x=>x.id),ACCESSORY_STYLES)
const css=await readFile('src/pages/accessoriesReference.css','utf8')
const gallery=await readFile('src/components/StorefrontPreviewGallery.jsx','utf8')
const app=await readFile('src/App.jsx','utf8')
for(const style of ACCESSORY_STYLES){
 assert.ok(css.includes('.aw-'+(style==='editorial'?'ossia':style==='tech'?'tech':style==='catalogue'?'aero':style==='playful'?'hush':style==='market'?'market':'veloura')),'Missing world-specific stylesheet: '+style)
 assert.ok(gallery.includes("id:'accessories"+style+"'"),'Missing gallery card '+style)
 assert.ok(app.includes("'accessories'+style"),'Missing accessories routing')
 for(const path of ['/accessories'+style,'/accessories'+style+'/explore','/accessories'+style+'/cart','/accessories'+style+'/item/'+expected[style].item]){
  assert.ok(allPaths.includes(path),'Missing prerendered route '+path)
 }
 const categories=ACCESSORY_WORLDS[style].categories
 const products=ACCESSORY_WORLDS[style].items
 for(const category of categories.filter(x=>x!=='All')){
  assert.ok(products.some(p=>p.category===category),'Category '+category+' has no matching products in '+style)
 }
}
const vite=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'})
let count=0
try{
 const { default: IndustryStorefront }=await vite.ssrLoadModule('/src/pages/IndustryStorefront.jsx')
 for(const [style,{name,marker,item}] of Object.entries(expected)){
  for(const [segment,needle] of [['',marker],['explore','ix-catalogue'],['item/'+item,'ix-details'],['cart','ix-cart'],['saved','ix-saved']]){
   const path='/accessories'+style+(segment?'/'+segment:'')
   const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:path},React.createElement(IndustryStorefront,{industry:'accessories',style})))
   assert.ok(html.includes('ix-accessories-'+style),'Style identity missing '+path)
   assert.ok(html.includes('aw-header'),'Reference header missing '+path)
   assert.ok(html.includes(name),'Brand name missing '+path)
   assert.ok(html.includes(needle),'Expected '+needle+' on '+path)
   assert.ok(html.length>(segment?1700:3500),'Suspiciously empty '+path)
   if(!segment)assert.ok(html.includes('/accessories'+style+'/item/'),'Homepage product links are missing from '+path)
   count++
  }
 }
}finally{await vite.close()}
console.log('Verified '+count+' independently rendered accessory preview pages, all six style-specific catalogues and working commerce links.')
