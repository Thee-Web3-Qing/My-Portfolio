const OWNER='qinglidah@gmail.com'
export async function finalizeWorkflowEmail(sql,order,mode) {
  const configuration=typeof order.configuration==='string'?JSON.parse(order.configuration):order.configuration||{}
  const ids=Array.isArray(configuration.workflow_ids)?configuration.workflow_ids:[]
  const digitalIds=['qutline','qutline-motion'].filter(id=>ids.includes(id))
  const productNames=digitalIds.map(id=>id==='qutline'?'Qutline':'Qutline Motion').join(' + ')
  const qutlineDeliveryRequired=mode==='live'&&order.environment==='live'&&order.status==='paid'&&digitalIds.length>0
  const workflowManualDeliveryRequired=ids.some(id=>!['qutline','qutline-motion'].includes(id))
  const qutlineDeliverySent=Boolean(order.qutline_delivery_sent_at)
  const status={qutlineDeliveryRequired,qutlineDeliverySent,workflowManualDeliveryRequired}
  if(mode!=='live'||order.environment!=='live'||order.status!=='paid'||!process.env.RESEND_API_KEY) return {workflowReceiptSent:false,...status}
  const items=(configuration.line_items||[]).map(x=>x.name+' (₦'+Number(x.price).toLocaleString('en-NG')+')').join('\n')
  const total='₦'+(Number(order.amount_kobo)/100).toLocaleString('en-NG')
  const body='Workflows:\n'+items+'\n\nAmount paid: '+total+'\nPaystack reference: '+order.reference
  async function send(kind,to,subject,text,attachments){
    const response=await fetch('https://api.resend.com/emails',{method:'POST',
      headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'workflow-'+kind+'-'+order.reference},
      body:JSON.stringify({from:process.env.DECEMBER_EMAIL_FROM||'Qing The Creator <classroom@qingthecreator.xyz>',to:[to],subject,text,...(attachments?{attachments}:{}),reply_to:kind==='owner'?order.customer_email:OWNER}),
      signal:AbortSignal.timeout(10000)})
    if(!response.ok)throw Error('Resend returned '+response.status)
  }
  let buyerSent=Boolean(order.buyer_email_sent_at)
  let delivered=qutlineDeliverySent
  try {
    if(!order.owner_email_sent_at){
      await send('owner',OWNER,'New paid workflow order', 'Customer: '+order.customer_name+'\nEmail: '+order.customer_email+'\nWhatsApp: '+(order.customer_whatsapp||'Not supplied')+'\n\n'+body)
      await sql`UPDATE workflow_orders SET owner_email_sent_at=COALESCE(owner_email_sent_at,now()) WHERE reference=${order.reference}`
    }
  }catch(error){console.error('Workflow owner notification failed',error?.message)}
  try {
    if(!buyerSent){
      await send('buyer',order.customer_email,'Your Qing workflow payment is confirmed','Hi '+order.customer_name+',\n\nYour Paystack payment is confirmed.\n\n'+body+'\n\n'+(qutlineDeliveryRequired?'Your '+productNames+' installation files will arrive in a separate access email. Check your spam folder if necessary.\n\n':'')+(workflowManualDeliveryRequired?'Reply to this email with your reference to arrange delivery of your other selected workflows.\n\n':'')+'QingTheCreator')
      await sql`UPDATE workflow_orders SET buyer_email_sent_at=COALESCE(buyer_email_sent_at,now()) WHERE reference=${order.reference}`
      buyerSent=true
    }
  }catch(error){console.error('Workflow receipt failed',error?.message)}
  try {
    if(qutlineDeliveryRequired&&!delivered){
      const attachments=[]
      for(const product of digitalIds){
        const files=await sql`SELECT platform,version,filename,encode(contents,'base64') AS content FROM public.workflow_delivery_files WHERE product_id=${product} ORDER BY platform`
        const expected=['chatgpt','claude']
        if(files.length!==2||!expected.every(platform=>files.some(f=>f.platform===platform))||new Set(files.map(f=>f.version)).size!==1)throw Error('Skill files are incomplete')
        for(const f of files){
          const content=String(f.content||'').replace(/\s/g,'')
          if(!f.filename.startsWith(product+'-')||!new RegExp('^'+product+'-[\\d.]+-'+f.platform+'\\.zip$').test(f.filename)||!content.startsWith('UEsDB')||content.length<100)throw Error('Invalid skill archive')
          attachments.push({filename:f.filename,content})
        }
      }
      await send('qutline',order.customer_email,'Your '+productNames+' access is ready | QingTheCreator','Hi '+order.customer_name+',\n\nYour payment is confirmed. The installation ZIPs for '+productNames+' are attached for ChatGPT and Claude. Choose the appropriate package for your platform.\n\nChatGPT: import the plugin archive through Plugin Creator on supported accounts, or use the standalone skill ZIP in the Skills upload interface if available.\nClaude: open Plugins / Customize > Skills, upload the Claude ZIP and enable the skill.\n\n'+(digitalIds.includes('qutline')?'Qutline: upload your footage and say “Edit my video using Qutline.” Customize fonts and colours if desired; provide a profile screenshot for social CTAs.\n\n':'')+(digitalIds.includes('qutline-motion')?'Qutline Motion: upload footage or screenshots of the interface you want to demonstrate and say “Use Qutline Motion to animate this explanation.” Use it on its own or alongside Qutline.\n\n':'')+''+(digitalIds.includes('qutline')?'Compatibility: Qutline is ChatGPT-first. Claude requires a compatible external image generator for the full photographic illustration style. ChatGPT also needs compatible image-generation and video-editing tools.\n\n':'')+(digitalIds.includes('qutline-motion')?'Compatibility: Qutline Motion is designed for ChatGPT and Claude. Its core interface animation does not require AI image generation; compatible code execution and rendering tools are needed. Independent Claude rendering has not yet been verified.\n\n':'')+'Video rendering and transcription require compatible tools on your account. Keep these files for your personal use and do not redistribute them.\n\nPayment reference: '+order.reference+'\n\nQingTheCreator',attachments)
      await sql`UPDATE workflow_orders SET qutline_delivery_sent_at=COALESCE(qutline_delivery_sent_at,now()) WHERE reference=${order.reference} AND environment='live' AND status='paid'`
      delivered=true
    }
  }catch(error){console.error('Qutline attachment delivery failed',error?.message)}
  return {workflowReceiptSent:buyerSent,...status,qutlineDeliverySent:delivered}
}
