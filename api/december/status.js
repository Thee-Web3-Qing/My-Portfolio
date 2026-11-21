import { configuredKey, environment } from '../_lib/payments.js'
export default function handler(req,res) {
  res.setHeader('Cache-Control','no-store')
  if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'})
  res.status(200).json({available:!!configuredKey() && !!process.env.DATABASE_URL, mode:environment()})
}
