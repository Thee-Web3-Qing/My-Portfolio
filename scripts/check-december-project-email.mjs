import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { buildDecemberProjectEmail, OWNER_PROJECT_EMAIL } from '../api/_lib/decemberProjectEmail.js'

const reference='QDEC-'+'b'.repeat(32)
const fixture={
 reference, product:'december-website', environment:'live', status:'paid',
 customer_name:'Ada Okafor',customer_email:'ada@example.com',
 customer_whatsapp:'+2348000000000', business_name:'Ada Studio',
 amount_kobo:6000000,quote_total_kobo:10000000,payment_mode:'deposit',
 configuration:{
  industry:'fashion',layout:'editorial',images:3,
  customer_note:'I want an editorial homepage with <script>alert("unsafe")</script>.',
  line_items:[{name:'Branded website (12 listings)',price:100000},{name:'Express booking',price:20000}]
 }
}
const message=buildDecemberProjectEmail(fixture)
assert.equal(OWNER_PROJECT_EMAIL,'qinglidah@gmail.com')
assert.equal(message.adminUrl,'https://qingthecreator.xyz/admin?project='+reference)
assert.match(message.subject,/Ada Studio/)
assert.match(message.text,/Ada Okafor/)
assert.match(message.text,/ada@example.com/)
assert.match(message.text,/2348000000000/)
assert.match(message.text,/Fashion/)
assert.match(message.text,/Editorial/)
assert.match(message.text,/60,000/)
assert.match(message.text,/100,000/)
assert.match(message.text,/40,000/)
assert.match(message.text,/Express booking/)
assert.match(message.html,/View project/)
assert.match(message.html,/admin\?project=QDEC-/)
assert.doesNotMatch(message.html,/<script>/)
assert.match(message.html,/&lt;script&gt;/)
assert.match(message.html,/usual administrator login/)
const full=buildDecemberProjectEmail({...fixture,payment_mode:'full',amount_kobo:10000000})
assert.match(full.text,/Paid in full/)
assert.match(full.text,/Remaining balance: ₦0/)
assert.throws(()=>buildDecemberProjectEmail({...fixture,reference:'not-an-order'}),/Invalid/)
const [payments,admin,owner]=await Promise.all([
 readFile('api/_lib/payments.js','utf8'),
 readFile('src/pages/DecemberAdmin.jsx','utf8'),
 readFile('api/_lib/decemberProjectEmail.js','utf8'),
])
assert.match(payments,/finalizeDecemberProjectEmail/)
assert.equal((payments.match(/await finalizeDecemberProjectEmail\(/g)||[]).length,2,
 'Webhook/callback already-paid and newly-paid paths must both finalise emails')
assert.match(admin,/useSearchParams/)
assert.match(admin,/id="dec-project-details"/)
assert.match(admin,/order\.product==='december-website' && order\.status==='paid'/)
assert.match(owner,/mode!=='live'/)
assert.match(owner,/status='paid'/)
assert.match(owner,/Idempotency-Key/)
assert.match(owner,/ON CONFLICT\(reference\)/)
assert.match(owner,/projectEmailSent/)
console.log('Verified owner email HTML, payment summary, private project link, live-only and idempotent payment trigger.')
