import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {renderPaidProjectEmail,notifyVerifiedProjectPayment} from '../api/_lib/projectPaymentNotification.js'

const ref='QDEC-'+'c'.repeat(32)
const order={
 reference:ref,product:'december-website',environment:'live',status:'paid',
 customer_name:'Alex <script>evil</script>',business_name:'Sade & Co.',
 customer_email:'buyer@example.com',customer_whatsapp:'+2348001112222',
 amount_kobo:6000000,quote_total_kobo:10000000,
 payment_mode:'deposit',paid_at:'2026-11-24T16:05:00Z',
 configuration:{
  industry:'fashion',layout:'editorial',images:0,
  customer_note:'Please use <img src=x onerror=alert(1)> on my new site',
  line_items:[{name:'Branded website (12 listings)',price:100000}]
 }
}
const rendered=renderPaidProjectEmail(order)
assert.equal(rendered.viewUrl,'https://qingthecreator.xyz/admin?project='+ref)
assert.match(rendered.html,/View project/)
assert.match(rendered.text,/Sade & Co\./)
assert.match(rendered.text,/buyer@example\.com/)
assert.match(rendered.text,/60,000/)
assert.match(rendered.text,/40,000/)
assert.match(rendered.text,/Branded website \(12 listings\)/)
assert.match(rendered.text,/AFTER payment/)
assert.ok(!rendered.html.includes('<script>evil</script>'),'Client HTML must be escaped')
assert.ok(!rendered.html.includes('<img src=x onerror='),'Client note HTML must be escaped')
assert.match(rendered.html,/&lt;script&gt;evil&lt;\/script&gt;/)
assert.match(rendered.html,/&lt;img src=x onerror=alert\(1\)&gt;/)

let touchedDatabase=false
const fakeSql=()=>{touchedDatabase=true;throw Error('Database should not be queried for ineligible payments')}
const notLive=await notifyVerifiedProjectPayment(fakeSql,{...order,environment:'test'},{create:true})
assert.equal(notLive,false)
const notProject=await notifyVerifiedProjectPayment(fakeSql,{...order,product:'qing-class'},{create:true})
assert.equal(notProject,false)
assert.equal(touchedDatabase,false)

const payments=await readFile('api/_lib/payments.js','utf8')
assert.match(payments,/notifyVerifiedProjectPayment\(sql, paidOrder, \{ create: confirmed\.length > 0 \}\)/)
assert.match(payments,/notifyVerifiedProjectPayment\(sql, order\)/)
const admin=await readFile('src/pages/DecemberAdmin.jsx','utf8')
assert.match(admin,/URLSearchParams\(location\.search\)\.get\('project'\)/)
assert.match(admin,/order\.reference===projectReference/)
assert.match(admin,/order\.environment==='live'/)
assert.match(admin,/id="da-project-details"/)
const provider=await readFile('api/_lib/projectPaymentNotification.js','utf8')
assert.match(provider,/Idempotency-Key/)
assert.match(provider,/december-paid-project\//)
assert.match(provider,/sent_at IS NULL/)
assert.match(provider,/claimed_at IS NULL/)
assert.match(provider,/RESEND_API_KEY/)
console.log('Verified project notification email, HTML escaping, live-only delivery, deduplication and protected admin deep links.')
