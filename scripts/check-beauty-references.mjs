import React from 'react'
import {createServer} from 'vite'
import {renderToStaticMarkup} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server.js'
import {access} from 'node:fs/promises'

const vite=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'})
try{
 const {default:BeautyReferenceStorefront}=await vite.ssrLoadModule('/src/pages/BeautyReferenceStorefront.jsx')
 const {default:FashionPlatform}=await vite.ssrLoadModule('/src/pages/FashionPlatform.jsx')
 const {calculateDecemberQuote,getLayoutsForIndustry,BASE_PRICE}=await vite.ssrLoadModule('/src/data/december.js')
 const {beautyCollections}=await vite.ssrLoadModule('/src/pages/beautySiteContent.js')
 const styleMarkers={
  editorial:['br-salon','br-salon-service-cards','br-salon-about','br-salon-mosaic','br-salon-teamgrid'],
  catalogue:['br-olive','br-olive-product-float','br-olive-expert-grid','br-olive-products-grid'],
  minimal:['br-dark','br-dark-reasons','br-dark-tiles','br-dark-fullbleed'],
  botanical:['br-botanical','br-botanical-arches','br-botanical-ticker','br-botanical-feature']
 }
 for(const [style,markers] of Object.entries(styleMarkers)){
  const route='/beauty'+style
  await access(new URL('../dist'+route+'.html',import.meta.url))
  const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:route},React.createElement(BeautyReferenceStorefront,{variant:style})))
  for(const marker of markers)if(!html.includes(marker))throw Error('Beauty '+style+' lacks '+marker)
  if(html.length<2500)throw Error('Beauty '+style+' page unexpectedly small')
  const pages=['explore','about','contact','book','faq','bag','item/'+beautyCollections[style].items[0].id]
  for(const suffix of pages){
   const target=route+'/'+suffix
   await access(new URL('../dist'+target+'.html',import.meta.url))
   const content=renderToStaticMarkup(React.createElement(StaticRouter,{location:target},React.createElement(BeautyReferenceStorefront,{variant:style})))
   if(content.includes('ix-store-beauty'))throw Error('Legacy mismatched beauty layout leaked into '+target)
   if(!content.includes('bi-wrapper bi-'+style))throw Error('Missing matched branding on '+target)
   if(content.length<1400)throw Error('Subpage unexpectedly empty: '+target)
   if(!content.includes(beautyCollections[style].brand))throw Error('Wrong brand on '+target)
   if(suffix==='explore'){
    for(const item of beautyCollections[style].items){
     if(!content.includes('/item/'+item.id))throw Error('Unlinked item '+item.id+' on '+target)
    }
   }
   if(suffix==='book'&&!content.includes('type="date"'))throw Error('Booking controls missing: '+target)
   if(suffix.startsWith('item/')&&!content.includes('bi-detail-visual'))throw Error('Product detail missing: '+target)
   if(suffix==='bag'&&!content.includes('bi-bag-summary'))throw Error('Sample order summary missing: '+target)
   if(suffix==='contact'&&(!content.includes('bi-enquiry-form')||!content.includes('YOUR MESSAGE')))throw Error('Demo enquiry form missing: '+target)
  }
  console.log('PASS: '+route+' reference home, matching catalogue, product, about, contact, booking, FAQ and sample order routes')
 }
 for(const mode of ['editorial','catalogue','minimal']){
  const page=renderToStaticMarkup(React.createElement(StaticRouter,{location:'/fashion'+mode},React.createElement(FashionPlatform,{mode})))
  if(page.length<3000)throw Error('Fashion '+mode+' unexpectedly changed or crashed')
 }
 if(BASE_PRICE!==100000)throw Error('December base price changed')
 for(const industry of ['fashion','food','gifts','hospitality']){
  if(getLayoutsForIndustry(industry).length!==3)throw Error('Non-beauty layouts changed: '+industry)
 }
 if(getLayoutsForIndustry('accessories').length!==6)throw Error('Accessories must include six distinct reference designs')
 if(getLayoutsForIndustry('beauty').length!==4)throw Error('Beauty fourth layout missing')
 if(getLayoutsForIndustry('events').length!==4)throw Error('Events fourth reference layout missing')
 const quote=calculateDecemberQuote({industry:'beauty',layout:'botanical',addons:[],images:0})
 if(quote.layout.id!=='botanical'||quote.total!==100000||quote.deposit!==60000)throw Error('Botanical quote or deposit invalid')
 console.log('PASS: All original fashion variants, industry options and December prices remain intact.')
}finally{await vite.close()}
