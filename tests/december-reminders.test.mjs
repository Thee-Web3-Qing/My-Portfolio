import test from 'node:test'
import assert from 'node:assert/strict'
import december from '../api/december.js'
import orders from '../api/admin/orders.js'
import { buildDecemberReminder, getReminderSelection, isReminderUnsubscribeToken, normalizeReminderEmail } from '../api/_lib/decemberReminders.js'

function response(){
 return {headers:{},code:0,setHeader(k,v){this.headers[k]=v;return this},status(code){this.code=code;return this},
  json(value){this.value=value;return this},send(value){this.value=value;return this}}
}
const host='qingthecreator.xyz'
const signup=(body,headers={host,origin:'https://'+host})=>({method:'POST',headers,query:{operation:'reminders'},body})
test('Only an explicit boolean opt-in with a valid email is accepted',async()=>{
 for(const consent of [false,undefined,'true',1]){
  const res=response()
  await december(signup({email:'visitor@example.com',consent}),res)
  assert.equal(res.code,400)
 }
 assert.equal(normalizeReminderEmail(' Sales@Example.COM '),'sales@example.com')
 for(const invalid of ['bad@example','..bad@example.com','one@example.com\nTWO@example.com','x@example..com']){
  assert.equal(normalizeReminderEmail(invalid),'')
 }
})
test('Cross-site signup fails before storage',async()=>{
 const res=response()
 await december(signup({email:'visitor@example.com',consent:true},{host,origin:'https://elsewhere.example'}),res)
 assert.equal(res.code,403)
 assert.equal(res.headers['Cache-Control'],'no-store')
})
test('Honeypot never creates a sendable lead',async()=>{
 const res=response()
 await december(signup({email:'visitor@example.com',consent:true,companyWebsite:'spam'}),res)
 assert.equal(res.code,202)
 assert.deepEqual(res.value,{saved:true})
})
test('Admin listing and send both require valid authentication',async()=>{
 for(const method of ['GET','POST']){
  const res=response()
  await orders({method,headers:{host},query:{view:'reminders'},body:{action:'send'}},res)
  assert.equal(res.code,401)
 }
})
test('Reminder has the saved selection, no custom URL injection, and a signed opt-out',()=>{
 const id='80e97c38-da5a-47b9-bcf6-1ef1dcf92cb1'
 const key='k'.repeat(45)
 const email=buildDecemberReminder({id,industry:'fashion',layout:'editorial'},key)
 const url=new URL(email.unsubscribeUrl)
 assert.match(email.text,/industry=fashion&layout=editorial/)
 assert.match(email.html,/Stop December reminders/)
 assert.equal(isReminderUnsubscribeToken(id,url.searchParams.get('token'),key),true)
 assert.equal(isReminderUnsubscribeToken(id,'0'.repeat(64),key),false)
 assert.equal(isReminderUnsubscribeToken(id,url.searchParams.get('token'),'x'.repeat(45)),false)
 assert.deepEqual(getReminderSelection('https://elsewhere.example','../evil'),{industry:'',layout:'',industryLabel:'',layoutLabel:''})
})
