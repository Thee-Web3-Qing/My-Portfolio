import {test} from 'node:test'
import assert from 'node:assert/strict'
import {finalizeWorkflowEmail} from '../api/_lib/workflowEmail.js'
test('Qutline delivery only after live paid order, separate idempotent attachment email, retries and mixed orders',async()=>{
 const prev=process.env.RESEND_API_KEY,original=globalThis.fetch
 process.env.RESEND_API_KEY='mock-key'
 const calls=[],updates=[]
 let fail=false,missing=false
 const content=Buffer.from('PK\\x03\\x04'+'a'.repeat(150),'latin1').toString('base64')
 const sql=async(strings,...values)=>{
  const query=strings.join('?')
  if(query.includes('SELECT platform'))return missing?[]:['chatgpt','claude'].map(platform=>({platform,version:'3.2.0',filename:'qutline-3.2-'+platform+'.zip',content}))
  updates.push(query);return []
 }
 globalThis.fetch=async(url,options)=>{const payload=JSON.parse(options.body);calls.push({payload,key:options.headers['Idempotency-Key']});return {ok:!(fail&&payload.attachments),status:503}}
 const order={status:'paid',environment:'live',reference:'QWORK-test',customer_name:'Test',customer_email:'buyer@example.com',amount_kobo:3000000,configuration:{workflow_ids:['qutline'],line_items:[{name:'Qutline',price:30000}]},owner_email_sent_at:'already',buyer_email_sent_at:'already'}
 try{
  assert.equal((await finalizeWorkflowEmail(sql,{...order,status:'pending'},'live')).qutlineDeliverySent,false)
  assert.equal((await finalizeWorkflowEmail(sql,{...order,environment:'test'},'test')).qutlineDeliveryRequired,false)
  assert.equal((await finalizeWorkflowEmail(sql,{...order,configuration:{workflow_ids:['vox']}},'live')).qutlineDeliveryRequired,false)
  assert.equal(calls.length,0)
  missing=true
  assert.equal((await finalizeWorkflowEmail(sql,order,'live')).qutlineDeliverySent,false);assert.equal(calls.length,0)
  missing=false;fail=true
  assert.equal((await finalizeWorkflowEmail(sql,order,'live')).qutlineDeliverySent,false);assert.equal(updates.length,0)
  fail=false
  const result=await finalizeWorkflowEmail(sql,{...order,configuration:{...order.configuration,workflow_ids:['qutline','vox']}},'live')
  assert.equal(result.qutlineDeliverySent,true);assert.equal(result.workflowManualDeliveryRequired,true)
  assert.equal(calls.length,2);assert.equal(calls[0].key,calls[1].key)
  assert.deepEqual(calls[1].payload.to,['buyer@example.com'])
  assert.equal(calls[1].payload.attachments.length,2)
  assert.ok(updates[0].includes('qutline_delivery_sent_at'))
  await finalizeWorkflowEmail(sql,{...order,qutline_delivery_sent_at:'already'},'live');assert.equal(calls.length,2)
 }finally{globalThis.fetch=original;if(prev===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=prev}
})
