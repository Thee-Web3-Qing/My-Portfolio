import { WORKFLOWS } from './workflows.js'
const editorial={id:'GhFWPw7bYNU',title:'The Editorial Edit That Built Qutline'}
const promo={id:'kglhSvLNpjo',title:'Qutline: From Raw Footage to Finished Edit'}
export const VIDEO_GROUPS=[{id:'showcase',name:'Editorial showcase'},...WORKFLOWS.map(({id,name})=>({id,name}))]
export const DEFAULT_VIDEOS={
 showcase:[{id:'dFaD9_hj_kk',title:'Tinubu: The Price of Reform'},{id:'CdsfK2FDrzE',title:'Peter Obi: The Man Behind the Movement'}],
 qutline:[editorial,promo],
 'qutline-motion':[promo,{id:'N5M08AA-pAI',title:'Claude Desktop / TakeSort demo',aspect:'16:9'}]
}
export function youtubeId(value){
 if(typeof value!=='string')return null
 const input=value.trim()
 if(/^[A-Za-z0-9_-]{11}$/.test(input))return input
 try{
  const u=new URL(input)
  if(u.protocol!=='https:')return null
  let id
  if(u.hostname==='youtu.be')id=u.pathname.split('/')[1]
  else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(u.hostname)){
   const [,kind,key]=u.pathname.split('/')
   if(kind==='watch')id=u.searchParams.get('v')
   if(kind==='shorts'||kind==='embed'||kind==='live')id=key
  }
  return /^[A-Za-z0-9_-]{11}$/.test(id||'')?id:null
 }catch{return null}
}
export function validateVideos(videos){
 if(!Array.isArray(videos)||videos.length>12)return null
 const result=[],seen=new Set()
 for(const item of videos){
  const id=youtubeId(item?.id),title=typeof item?.title==='string'?item.title.trim():''
  if(!id||!title||title.length>120||seen.has(id))return null
  seen.add(id);result.push({id,title,aspect:item.aspect==='16:9'?'16:9':'9:16'})
 }
 return result
}
