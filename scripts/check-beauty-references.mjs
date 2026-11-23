import React from 'react'
import {createServer} from 'vite'
import {renderToStaticMarkup} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server.js'

const vite=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'})
try{
 const {default:BeautyReferenceStorefront}=await vite.ssrLoadModule('/src/pages/BeautyReferenceStorefront.jsx')
 const {default:FashionPlatform}=await vite.ssrLoadModule('/src/pages/FashionPlatform.jsx')
 const {calculateDecemberQuote,getLayoutsForIndustry,BASE_PRICE}=await vite.ssrLoadModule('/src/data/december.js')
 const styleMarkers={
  editorial:['br-salon','br-salon-service-cards','br-salon-about','br-salon-mosaic','br-salon-teamgrid'],
  catalogue:['br-olive','br-olive-product-float','br-olive-expert-grid','br-olive-products-grid'],
  minimal:['br-dark','br-dark-reasons','br-dark-tiles','br-dark-fullbleed'],
  botanical:['br-botanical','br-botanical-arches','br-botanical-ticker','br-botanical-feature']
 }
 for(const [style,markers] of Object.entries(styleMarkers)){
  const route='/beauty'+style
  const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:route},React.createElement(BeautyReferenceStorefront,{variant:style})))
  for(const marker of markers)if(!html.includes(marker))throw Error('Beauty '+style+' lacks '+marker)
  if(html.length<7500)throw Error('Beauty '+style+' page unexpectedly small')
  const sub=renderToStaticMarkup(React.createElement(StaticRouter,{location:route+'/explore'},React.createElement(BeautyReferenceStorefront,{variant:style})))
  if(!sub.includes('ix-store-beauty')||!sub.includes(route+'/item/'))throw Error('Beauty '+style+' browse route broken')
  console.log('PASS: '+route+' reference sections and linked browse page')
 }
 for(const mode of ['editorial','catalogue','minimal']){
  const page=renderToStaticMarkup(React.createElement(StaticRouter,{location:'/fashion'+mode},React.createElement(FashionPlatform,{mode})))
  if(page.length<3000)throw Error('Fashion '+mode+' unexpectedly changed or crashed')
 }
 if(BASE_PRICE!==100000)throw Error('December base price changed')
 for(const industry of ['fashion','food','gifts','events','accessories','hospitality']){
  if(getLayoutsForIndustry(industry).length!==3)throw Error('Non-beauty layouts changed: '+industry)
 }
 if(getLayoutsForIndustry('beauty').length!==4)throw Error('Beauty fourth layout missing')
 const quote=calculateDecemberQuote({industry:'beauty',layout:'botanical',addons:[],images:0})
 if(quote.layout.id!=='botanical'||quote.total!==100000||quote.deposit!==60000)throw Error('Botanical quote or deposit invalid')
 console.log('PASS: All original fashion variants, industry options and December prices remain intact.')
}finally{await vite.close()}
