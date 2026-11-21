import test from 'node:test'
import assert from 'node:assert/strict'
import { paymentVerificationChecks } from '../api/_lib/payments.js'

const reference='QDEC-1234567890abcdef1234567890abcdef'
const order={reference,amount_kobo:6000000,customer_email:'customer@example.com'}
const transaction={
 reference,status:'success',domain:'test',currency:'NGN',amount:6000000,
 customer:{email:'Customer@Example.com'}
}
const checks=(change={})=>paymentVerificationChecks({...transaction,...change},order,reference,'test')
test('Successful Paystack test payments pass every check',()=>{
 assert.equal(Object.values(checks()).every(Boolean),true)
})
test('Paystack screen alone cannot mark an ongoing charge as paid',()=>{
 assert.equal(checks({status:'pending'}).status,false)
})
test('A successful charge with the wrong amount is rejected',()=>{
 assert.equal(checks({amount:5000000}).amount,false)
})
test('A successful live charge cannot satisfy a test order',()=>{
 assert.equal(checks({domain:'live'}).environment,false)
})
test('Email must match the saved checkout customer',()=>{
 assert.equal(checks({customer:{email:'different@example.com'}}).customerEmail,false)
})
test('Missing Paystack customer email is not accepted',()=>{
 assert.equal(checks({customer:{}}).customerEmail,false)
})
test('Wrong reference and currency cannot unlock project progress',()=>{
 const result=checks({reference:'something-else',currency:'USD'})
 assert.equal(result.reference,false)
 assert.equal(result.currency,false)
})
