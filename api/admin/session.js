import { adminSecurityReady, clearAdminSession, createAdminSession, failedLogin, isAdmin, loginAllowed, needPost, enabledOrderModes, verifyAdminCode } from '../_lib/decemberAdmin.js'

export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store')
 res.setHeader('X-Robots-Tag','noindex, nofollow')
 if(req.method==='GET')return res.status(200).json({authenticated:isAdmin(req),modes:isAdmin(req)?enabledOrderModes():[]})
 if(!needPost(req,res))return
 const action=String(req.body?.action||'')
 if(action==='logout'){clearAdminSession(res);return res.status(200).json({authenticated:false})}
 if(action!=='login')return res.status(400).json({error:'Unknown action'})
 if(!adminSecurityReady())return res.status(503).json({error:'Admin sign-in has not been configured securely'})
 try{
  if(!await loginAllowed(req))return res.status(429).json({error:'Too many attempts. Try again later.'})
  if(!verifyAdminCode(req.body?.code)){
   await failedLogin(req)
   return res.status(401).json({error:'Incorrect admin access code'})
  }
  createAdminSession(res)
  return res.status(200).json({authenticated:true,modes:enabledOrderModes()})
 }catch(err){
  console.error('Admin session error',err?.message)
  return res.status(503).json({error:'Unable to sign in right now'})
 }
}
