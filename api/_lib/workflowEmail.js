const OWNER='qinglidah@gmail.com'
export async function finalizeWorkflowEmail(sql,order,mode) {
  if(mode!=='live'||!process.env.RESEND_API_KEY) return {workflowReceiptSent:false}
  const configuration=typeof order.configuration==='string'?JSON.parse(order.configuration):order.configuration||{}
  const items=(configuration.line_items||[]).map(x=>x.name+' (₦'+Number(x.price).toLocaleString('en-NG')+')').join('\n')
  const total='₦'+(Number(order.amount_kobo)/100).toLocaleString('en-NG')
  const body='Workflows:\n'+items+'\n\nAmount paid: '+total+'\nPaystack reference: '+order.reference
  async function send(kind,to,subject,text){
    const response=await fetch('https://api.resend.com/emails',{method:'POST',
      headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'workflow-'+kind+'-'+order.reference},
      body:JSON.stringify({from:process.env.DECEMBER_EMAIL_FROM||'Qing The Creator <classroom@qingthecreator.xyz>',to:[to],subject,text,reply_to:kind==='buyer'?OWNER:order.customer_email}),
      signal:AbortSignal.timeout(10000)})
    if(!response.ok)throw Error('Resend returned '+response.status)
  }
  let buyerSent=Boolean(order.buyer_email_sent_at)
  try {
    if(!order.owner_email_sent_at){
      await send('owner',OWNER,'New paid workflow order', 'Customer: '+order.customer_name+'\nEmail: '+order.customer_email+'\nWhatsApp: '+(order.customer_whatsapp||'Not supplied')+'\n\n'+body)
      await sql`UPDATE workflow_orders SET owner_email_sent_at=COALESCE(owner_email_sent_at,now()) WHERE reference=${order.reference}`
    }
  }catch(error){console.error('Workflow owner notification failed',error?.message)}
  try {
    if(!buyerSent){
      await send('buyer',order.customer_email,'Your Qing workflow payment is confirmed','Hi '+order.customer_name+',\n\nYour Paystack payment is confirmed.\n\n'+body+'\n\nReply to this email with your reference to arrange delivery of your workflow.\n\nQing The Creator')
      await sql`UPDATE workflow_orders SET buyer_email_sent_at=COALESCE(buyer_email_sent_at,now()) WHERE reference=${order.reference}`
      buyerSent=true
    }
  }catch(error){console.error('Workflow receipt failed',error?.message)}
  return {workflowReceiptSent:buyerSent}
}
