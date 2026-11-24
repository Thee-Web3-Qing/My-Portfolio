// Verify every Accessories and Shortlet concept owns a complete inner-page experience,
// rather than rendering the original shared generic category templates.
import assert from 'node:assert/strict'
import React from 'react'
import {createServer} from 'vite'
import {renderToStaticMarkup} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server.js'
import {readFile} from 'node:fs/promises'
import {ACCESSORY_STYLES,ACCESSORY_WORLDS} from '../src/pages/accessoryWorldData.js'
import {STAY_STYLES,STAY_WORLDS} from '../src/pages/stayWorldData.js'

const accessoryCss=await readFile('src/pages/accessoryInnerWorld.css','utf8')
const stayCss=await readFile('src/pages/stayInnerWorld.css','utf8')
const routeCode=await readFile('src/pages/IndustryStorefront.jsx','utf8')
assert.match(routeCode,/AccessoryInnerWorld ctx=\{ctx\}/)
assert.match(routeCode,/StayInnerWorld ctx=\{ctx\}/)
for(const style of ACCESSORY_STYLES)assert.ok(accessoryCss.includes('.awx-'+style),'Missing full-site accessories styling for '+style)
for(const style of STAY_STYLES)assert.ok(stayCss.includes('.stx-'+style),'Missing full-site stay styling for '+style)
for(const phrase of ['@media(max-width:560px)','@media(max-width:375px)'])assert.ok(accessoryCss.includes(phrase),'Missing accessories compact mobile treatment '+phrase)
for(const phrase of ['@media(max-width:590px)','@media(max-width:380px)'])assert.ok(stayCss.includes(phrase),'Missing stays compact mobile treatment '+phrase)

const vite=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'})
let count=0
try{
 const {default:IndustryStorefront}=await vite.ssrLoadModule('/src/pages/IndustryStorefront.jsx')
 const render=(industry,style,part='')=>renderToStaticMarkup(React.createElement(StaticRouter,{location:'/'+industry+style+(part?'/'+part:'')},React.createElement(IndustryStorefront,{industry,style})))
 for(const style of ACCESSORY_STYLES){
  const w=ACCESSORY_WORLDS[style],root='/accessories'+style
  const pages={explore:'awx-catalogue', ['item/'+w.items[0].id]:'awx-detail-columns',about:'awx-story-grid',contact:'awx-contact-section',faq:'awx-faq-grid',saved:'ix-saved',cart:'awx-cart-area','style-kit':'awx-kit'}
  for(const [path,marker] of Object.entries(pages)){
   const html=render('accessories',style,path)
   assert.ok(html.includes(marker),'Missing distinct '+style+' '+path+' interior component')
   assert.ok(html.includes('awx-'+style),'Accessories page lost world art direction: '+style+'/'+path)
   assert.ok(html.includes(w.name),'Accessories page lost brand identity: '+style+'/'+path)
   assert.ok(html.length>3000,'Thin accessories inner page: '+style+'/'+path)
   assert.ok(html.includes(root+'/explore'),'Missing browse path: '+style+'/'+path)
   count++
  }
 }
 for(const style of STAY_STYLES){
  const w=STAY_WORLDS[style],root='/hospitality'+style
  const pages={explore:'stx-search-zone',search:'stx-search-form',['item/'+w.items[0].id]:'stx-detail-content',enquire:'stx-enquiry',about:'stx-values',contact:'stx-contact-area',faq:'stx-faq',saved:'ix-saved'}
  for(const [path,marker] of Object.entries(pages)){
   const html=render('hospitality',style,path)
   assert.ok(html.includes(marker),'Missing distinct '+style+' '+path+' stay component')
   assert.ok(html.includes('stx-'+style),'Stay page lost world art direction: '+style+'/'+path)
   assert.ok(html.includes(w.name),'Stay page lost brand identity: '+style+'/'+path)
   assert.ok(html.length>3000,'Thin stay inner page: '+style+'/'+path)
   assert.ok(html.includes(root+'/search'),'Missing stay search path: '+style+'/'+path)
   count++
  }
 }
}finally{await vite.close()}
console.log('PASS '+count+' individually branded Accessories and Shortlet inner pages, 11 independent design worlds and responsive styles.')
