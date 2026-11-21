import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import { db, environment } from './payments.js'

const COOKIE='december_admin_session'
export const STAGES=['awaiting_assets','assets_under_review','queued','designing','building','review','revisions','ready_to_launch','launched','on_hold']
const secret=()=>process.env.DECEMBER_ADMIN_SESSION_SECRET
const getCookie=req=>{
 const str=String(req.headers?.cookie||'')
 const match=str.match(/(?:^|;\s*)december_admin_session=([^;]+)/)
 return match?decodeURIComponent(match[1]):''
}
const sign=value=>createHmac('sha256',secret()||'missing').update(String(value)).digest('hex')
export function adminSecurityReady(){
 return !!process.env.DECEMBER_ADMIN_CODE_HASH?.startsWith('scrypt:') && !!secret() && secret().length>=40
}
export function originAllowed(req){
 const origin=String(req.headers?.origin||'')
 if(!origin)return false
 try{
  const url=new URL(origin)
  return url.protocol==='https:' && url.host===req.headers.host
 }catch{return false}
}
function setCookie(res,value,clear=false){
 res.setHeader('Set-Cookie',COOKIE+'='+encodeURIComponent(value)+
 '; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age='+(clear?0:12*60*60))
}
export function clearAdminSession(res){setCookie(res,'',true)}
export function createAdminSession(res){
 if(!adminSecurityReady())throw Error('Admin not configured')
 const payload=Buffer.from(JSON.stringify({
   iat:Date.now(),exp:Date.now()+12*60*60*1000,nonce:randomBytes(16).toString('hex')
 })).toString('base64url')
 setCookie(res,payload+'.'+sign(payload))
}
export function isAdmin(req){
 if(!adminSecurityReady())return false
 const [payload,signature,extra]=getCookie(req).split('.')
 if(!payload||!signature||extra||!/^[a-f0-9]{64}$/i.test(signature))return false
 const expected=Buffer.from(sign(payload),'hex'),actual=Buffer.from(signature,'hex')
 if(expected.length!==actual.length||!timingSafeEqual(expected,actual))return false
 try{
   const p=JSON.parse(Buffer.from(payload,'base64url').toString('utf8'))
   return Number(p.exp)>Date.now()&&Number(p.iat)<=Date.now()&&Date.now()-Number(p.iat)<13*60*60*1000
 }catch{return false}
}
export function verifyAdminCode(input){
 if(!adminSecurityReady()||typeof input!=='string'||input.length>120)return false
 const [type,saltHex,expectedHex]=process.env.DECEMBER_ADMIN_CODE_HASH.split(':')
 if(type!=='scrypt'||!/^[a-f0-9]{48}$/.test(saltHex)||!/^[a-f0-9]{128}$/.test(expectedHex))return false
 const expected=Buffer.from(expectedHex,'hex')
 const computed=scryptSync(input,Buffer.from(saltHex,'hex'),64,{N:16384,r:8,p:1})
 return expected.length===computed.length&&timingSafeEqual(expected,computed)
}
const clientHash=req=>{
 const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].slice(0,128)
 return createHash('sha256').update(sign(ip)).digest('hex')
}
export async function loginAllowed(req){
 const sql=db(),hash=clientHash(req)
 const rows=await sql`SELECT count(*)::int AS attempts FROM december_admin_login_attempts
  WHERE client_hash=${hash} AND attempted_at>now()-interval '15 minutes'`
 return Number(rows[0]?.attempts||0)<8
}
export async function failedLogin(req){
 const sql=db(),hash=clientHash(req)
 await sql`INSERT INTO december_admin_login_attempts (client_hash) VALUES (${hash})`
}
export function needAdmin(req,res,method='GET'){
 res.setHeader('Cache-Control','no-store')
 if(req.method!==method){res.status(405).json({error:'Method not allowed'});return false}
 if(!isAdmin(req)){res.status(401).json({error:'Admin login required'});return false}
 if(method!=='GET'&&!originAllowed(req)){res.status(403).json({error:'Invalid request origin'});return false}
 return true
}
export function needPost(req,res){
 res.setHeader('Cache-Control','no-store')
 if(req.method!=='POST'){res.status(405).json({error:'Method not allowed'});return false}
 if(!originAllowed(req)){res.status(403).json({error:'Invalid request origin'});return false}
 return true
}
export function ordersDb(mode){
 if(mode==='live'){
  if(environment()!=='live')throw Error('Live orders can only be accessed in production')
  return db()
 }
 if(mode!=='test')throw Error('Invalid environment')
 if(environment()==='test')return db()
 if(!process.env.DECEMBER_TEST_DATABASE_URL)throw Error('Test database is not configured')
 return neon(process.env.DECEMBER_TEST_DATABASE_URL)
}
export function enabledOrderModes(){
 return environment()==='live'?['live',...(process.env.DECEMBER_TEST_DATABASE_URL?['test']:[])]:['test']
}
