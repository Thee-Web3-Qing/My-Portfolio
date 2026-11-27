import { WORKFLOWS } from '../src/data/workflows.js'
import { configuredKey, db, environment, initializePayment, makeReference } from './_lib/payments.js'

export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store')
  if (req.method === 'GET') return res.status(200).json({available:Boolean(configuredKey() && process.env.DATABASE_URL),mode:environment()})
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  if (!configuredKey() || !process.env.DATABASE_URL) return res.status(503).json({error:'Workflow checkout is temporarily unavailable.'})
  const b = req.body && typeof req.body==='object' ? req.body : {}
  const name = String(b.name||'').trim()
  const email = String(b.email||'').trim().toLowerCase()
  const phone = String(b.phone||'').trim()
  const ids = b.ids
  if (!Array.isArray(ids) || !ids.length || ids.length>WORKFLOWS.length || new Set(ids).size!==ids.length ||
      ids.some(id=>typeof id!=='string'||!WORKFLOWS.some(w=>w.id===id)) ||
      name.length<2 || name.length>100 || email.length>160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      phone.length>30 || (phone && phone.replace(/\D/g,'').length<7)) return res.status(400).json({error:'Choose your workflows and enter valid contact details.'})
  const selected=WORKFLOWS.filter(w=>ids.includes(w.id))
  const line_items=selected.map(w=>({name:w.name,price:w.price}))
  const amount=selected.reduce((sum,w)=>sum+w.price,0)
  const reference=makeReference('qing-workflow')
  const configuration={product:'qing-workflow',reference,workflow_ids:selected.map(w=>w.id),line_items,total_ngn:amount}
  try {
    const sql=db()
    if(environment()==='live'&&ids.includes('qutline')){
      if(!process.env.RESEND_API_KEY)return res.status(503).json({error:'Qutline email delivery is temporarily unavailable.'})
      const files=await sql`SELECT count(*)::int AS count FROM public.workflow_delivery_files WHERE product_id='qutline' AND platform IN ('chatgpt','claude')`
      if(Number(files[0]?.count)!==2)return res.status(503).json({error:'Qutline email delivery is temporarily unavailable.'})
    }
    await sql`INSERT INTO workflow_orders(reference,product,environment,customer_name,customer_email,customer_whatsapp,amount_kobo,quote_total_kobo,payment_mode,configuration)
      VALUES(${reference},'qing-workflow',${environment()},${name},${email},${phone||null},${amount*100},${amount*100},'full',${JSON.stringify(configuration)}::jsonb)`
    const authorization_url=await initializePayment({reference,email,amountKobo:amount*100,metadata:configuration})
    return res.status(200).json({authorization_url,reference,amount,mode:environment()})
  } catch(error) {
    console.error('Workflow checkout failed',error?.message)
    return res.status(502).json({error:'Could not start secure Paystack checkout. Please try again.'})
  }
}
