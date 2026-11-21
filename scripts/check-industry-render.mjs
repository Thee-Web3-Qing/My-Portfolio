// Render route-level React smoke tests for every independent December concept.
// Vite SSR compiles the same JSX used by the browser. The tests catch crashes,
// incorrect route matches and missing inner-page journeys before deployment.
import {createServer} from 'vite'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server.js'

const categories=['beauty','events','accessories','hospitality']
const styles=['editorial','catalogue','minimal']
const vite=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'})
let total=0
try{
 const {default:IndustryStorefront}=await vite.ssrLoadModule('/src/pages/IndustryStorefront.jsx')
 function check(industry,style,segment,marker){
  const path='/'+industry+style+(segment?'/'+segment:'')
  const tree=React.createElement(StaticRouter,{location:path},React.createElement(IndustryStorefront,{industry,style}))
  const html=renderToStaticMarkup(tree)
  if(!html.includes('ix-store-'+industry)||!html.includes('ix-'+industry+'-'+style)||!html.includes('ix-nav-links')){
   throw new Error('Store identity or navigation missing for '+path)
  }
  if(marker&&!html.includes(marker)){
   throw new Error('Expected '+marker+' in rendered route '+path)
  }
  if(html.length<2500){throw new Error('Unusually small page markup at '+path)}
  total++
 }
 for(const category of categories){
  for(const style of styles){
   check(category,style,'','ix-home')
   check(category,style,'explore','ix-catalogue')
  }
 }
 check('beauty','editorial','book','ix-inquiry')
 check('beauty','minimal','item/skin-reset','ix-details')
 check('events','catalogue','plan','ix-inquiry')
 check('events','editorial','item/wedding-story','ix-details')
 check('accessories','minimal','style-kit','ix-stylekit')
 check('accessories','editorial','cart','ix-cart')
 check('accessories','catalogue','item/city-tote','ix-details')
 check('hospitality','catalogue','search?guests=2&area=Ikoyi','ix-catalogue')
 check('hospitality','minimal','enquire?item=the-studio','ix-inquiry')
 check('hospitality','minimal','item/the-studio','ix-details')
 console.log('Rendered '+total+' website pages, covering 12 independent homepages and each business workflow.')
}finally{await vite.close()}
