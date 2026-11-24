import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Privacy-conscious first-party visit measurement.
 * No IPs, names, emails, phone numbers, precise geolocation or full referrer URLs.
 * No third-party cookies. Data starts accruing only once this code is deployed.
 */
const API = '/api/traffic'
const SKEY = 'qing_december_analytics_session'
const VKEY = 'qing_december_analytics_visitor'
const ATTR = 'qing_december_analytics_source'
export const INTERNAL_KEY = 'qing_december_analytics_internal'
const clean=(x,n=80)=>String(x||'').trim().toLowerCase().replace(/[^a-z0-9._-]/g,'').slice(0,n)
const makeId=()=>crypto?.randomUUID?.() || String(Date.now())+'-'+Math.random().toString(36).slice(2)
const eligiblePath=path=>Boolean(path&&!path.startsWith('/api/')&&!path.startsWith('/admin')&&!path.startsWith('/payment/')&&!path.startsWith('/december/details')&&!path.startsWith('/december/track'))
const inFrame=()=>{try{return window.top!==window.self}catch{return true}}
const flagInternal=()=>{try{return localStorage.getItem(INTERNAL_KEY)==='true'}catch{return false}}
function storedId(store,key){
 try{
  let id=store.getItem(key)
  if(!id||!/^[a-zA-Z0-9-]{8,80}$/.test(id)){id=makeId();store.setItem(key,id)}
  return id
 }catch{return makeId()}
}
function attribution(){
 const params=new URLSearchParams(window.location.search)
 const urlSource=clean(params.get('utm_source'),45)
 const urlMedium=clean(params.get('utm_medium'),45)
 const urlCampaign=clean(params.get('utm_campaign'),80)
 let stored={}
 try{stored=JSON.parse(sessionStorage.getItem(ATTR)||'{}')}catch{}
 let source=urlSource, medium=urlMedium, campaign=urlCampaign
 if(!source){
  try {
   const ref=document.referrer?new URL(document.referrer):null
   const host=ref?.hostname?.toLowerCase()||''
   if(host&&!host.endsWith(window.location.hostname)){
    source=/instagram|l\.instagram/.test(host)?'instagram':
      /tiktok/.test(host)?'tiktok':/facebook|fb\.com/.test(host)?'facebook':
      /google/.test(host)?'google':'referral'
    medium=medium||'referral'
   }
  }catch{}
 }
 source=source||stored.source||'direct'
 medium=medium||stored.medium||(source==='direct'?'none':'unknown')
 campaign=campaign||stored.campaign||''
 const result={source,medium,campaign}
 try{sessionStorage.setItem(ATTR,JSON.stringify(result))}catch{}
 return result
}
export function trackDecemberEvent(type,details={}){
 if(!import.meta.env.PROD||typeof window==='undefined'||inFrame()||flagInternal())return
 const path=window.location.pathname
 if(!eligiblePath(path))return
 const payload={
  eventId:makeId(),eventType:type,path,
  visitorId:storedId(localStorage,VKEY),
  sessionId:storedId(sessionStorage,SKEY),
  ...attribution(),
  industry:clean(details.industry,45),
  layout:clean(details.layout,35),
 }
 // Do not send personal information or full query strings.
 fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',body:JSON.stringify(payload),keepalive:true}).catch(()=>{})
}
export default function DecemberTrafficTracker(){
 const location=useLocation()
 useEffect(()=>{
  if(!eligiblePath(location.pathname)||inFrame()||flagInternal())return
  // React StrictMode, multiple effect mounts and short navigation retries
  // must not double-count the same page view.
  const key='qing_december_analytics_last_view'
  const current=Date.now()
  let previous={}
  try{previous=JSON.parse(sessionStorage.getItem(key)||'{}')}catch{}
  if(previous.path===location.pathname && current-Number(previous.time||0)<7000)return
  try{sessionStorage.setItem(key,JSON.stringify({path:location.pathname,time:current}))}catch{}
  trackDecemberEvent('page_view')
 },[location.pathname])
 return null
}
