// Render the four fashion homepage references and the corresponding shopping
// journeys with the same Vite JSX compiler used during deployment.
import {createServer} from 'vite'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server.js'
import {getLayoutsForIndustry,calculateDecemberQuote,BASE_PRICE} from '../src/data/december.js'
const modeLabels={
 editorial:['MAISON RUE','GOOD STYLE','EVERYTHING','MORE THAN','OUR WORK'],
 catalogue:['ELOMA','DRESS','Considered','Take a tour'],
 minimal:['ATELIER 09','Crafting','Why your','Discover'],
 botanical:['VERDANT','Better things','Featured','Your new','Good things']
}
const vite=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'})
try{
 const {default:FashionPlatform}=await vite.ssrLoadModule('/src/pages/FashionPlatform.jsx')
 let count=0
 for(const [mode,labels] of Object.entries(modeLabels)){
  for(const extra of ['', '/shop','/looks','/product/ivory','/wishlist','/cart']){
    const path='/fashion'+mode+extra
    const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:path},React.createElement(FashionPlatform,{mode})))
    if(html.length<2800)throw Error('Too little rendering for '+path)
    if(!html.includes('commerce-platform--'+mode))throw Error('Incorrect fashion identity for '+path)
    if(!extra){
      for(const marker of labels)if(!html.includes(marker))throw Error('Missing '+marker+' in '+path)
      if(html.includes('loco-hero')||html.includes('ref-page'))throw Error('Stale previous fashion hero in '+path)
    }
    count++
  }
 }
 const fashionChoices=getLayoutsForIndustry('fashion')
 if(fashionChoices.length!==4||new Set(fashionChoices.map(x=>x.id)).size!==4)throw Error('Fashion must have four unique layout choices')
 if(getLayoutsForIndustry('food').length!==3)throw Error('Other industries must retain three existing styles')
 const quote=calculateDecemberQuote({industry:'fashion',layout:'botanical'})
 if(quote.total!==BASE_PRICE||quote.deposit!==60000||BASE_PRICE!==100000||quote.layout.id!=='botanical')
   throw Error('Fourth fashion layout must preserve ₦100k base and ₦60k deposit')
 const food=calculateDecemberQuote({industry:'food',layout:'botanical'})
 if(food.layout.id!=='editorial'||food.total!==BASE_PRICE)throw Error('Fashion-only layout must be rejected outside fashion')
 console.log('Rendered '+count+' working fashion routes across four independent references; verified industry isolation and unchanged base price.')
}finally{await vite.close()}
