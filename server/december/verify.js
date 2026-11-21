import { confirmPayment, environment } from '../../api/_lib/payments.js'
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store')
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'})
  try {
    const data=await confirmPayment(String(req.query?.reference || '').trim(),environment())
    if(!data.found || data.product !== 'december-website') return res.status(404).json({error:'December payment not found'})
    return res.status(200).json(data)
  } catch (error) {
    console.error('December payment verification error',error?.message)
    return res.status(502).json({error:'Could not verify this payment yet'})
  }
}
