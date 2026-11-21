import { INDUSTRIES, LAYOUTS, calculateDecemberQuote, getAvailableAddons } from '../../src/data/december.js'
import { configuredKey, db, environment, makeReference, initializePayment } from '../../api/_lib/payments.js'

const good = (value, max) => typeof value === 'string' && value.trim().length >= 2 && value.trim().length <= max
const emailValid = value => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 160

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })
  if (!configuredKey() || !process.env.DATABASE_URL) return res.status(503).json({ error: 'Payment setup is not complete.' })
  const b = typeof req.body === 'object' && req.body ? req.body : {}
  if (!INDUSTRIES.some(x => x.id === b.industry) || !LAYOUTS.some(x => x.id === b.layout)) return res.status(400).json({ error:'Choose a valid industry and layout.' })
  const availableIds = new Set(getAvailableAddons(b.industry).map(x=>x.id))
  if (!Array.isArray(b.addons) || b.addons.length > availableIds.size ||
    b.addons.length !== new Set(b.addons).size ||
    b.addons.some(id=>typeof id!=='string'||!availableIds.has(id))) {
    return res.status(400).json({error:'One or more selected features are not available for this industry.'})
  }
  if (!Number.isInteger(b.images) || b.images < 0 || b.images > 200) return res.status(400).json({ error:'Choose 0–200 images.' })
  if (!['deposit','full'].includes(b.paymentMode)) return res.status(400).json({ error:'Choose deposit or full payment.' })
  const customer = b.customer || {}
  if (!good(customer.name, 100) || !good(customer.business, 120) || !good(customer.phone, 30) || !emailValid(customer.email)) return res.status(400).json({ error:'Complete your contact details.' })
  const quote = calculateDecemberQuote({ industry:b.industry, layout:b.layout, addons:b.addons, images:b.images })
  const amountKobo = (b.paymentMode === 'deposit' ? quote.deposit : quote.total) * 100
  const reference = makeReference('december-website')
  const lineItems = [
    { name:'Branded website (12 listings)',price:quote.base },
    ...quote.selectedAddons.map(x=>({name:x.name,price:x.price})),
    ...(quote.images > 0 ? [{name:quote.images+' AI product images',price:quote.imagesSubtotal}]:[]),
  ]
  const metadata = { campaign:'december-2026', product:'december-website', reference,
    industry:b.industry, layout:b.layout, addons:quote.selectedAddons.map(x=>x.id), images:b.images,
    payment_mode:b.paymentMode, quoted_total_ngn:quote.total, line_items:lineItems,
    custom_fields:[
      {display_name:'Website style',variable_name:'website_style',value:quote.industry.label+' / '+quote.layout.label},
      {display_name:'What you selected',variable_name:'selected_features',value:lineItems.map(x=>x.name+' (₦'+x.price.toLocaleString('en-NG')+')').join(', ').slice(0,255)},
      {display_name:'Payment',variable_name:'payment_type',value:b.paymentMode==='deposit'?'60% deposit':'Full payment'},
    ]
  }
  const config = { ...metadata, customer_note:String(customer.note || '').slice(0,1000) }
  try {
    const sql = db()
    await sql`
      INSERT INTO payment_orders (reference,product,environment,customer_name,customer_email,customer_whatsapp,
        business_name,amount_kobo,quote_total_kobo,payment_mode,configuration)
      VALUES (${reference}, 'december-website', ${environment()}, ${customer.name.trim()},
        ${customer.email.trim().toLowerCase()}, ${customer.phone.trim()}, ${customer.business.trim()},
        ${amountKobo}, ${quote.total*100}, ${b.paymentMode}, ${JSON.stringify(config)}::jsonb)
    `
    const authorization_url = await initializePayment({ reference, email:customer.email.trim().toLowerCase(), amountKobo, metadata })
    return res.status(200).json({ authorization_url, reference, environment:environment() })
  } catch (error) {
    console.error('December checkout initialization failed', error?.message)
    return res.status(502).json({ error:'Could not start your Paystack checkout. Please try again.' })
  }
}
