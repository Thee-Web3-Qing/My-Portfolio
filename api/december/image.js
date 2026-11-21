import { db } from '../_lib/payments.js'
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end('Method not allowed')
 const id=String(req.query?.id||'')
 if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).end('Invalid image reference')
 try{
  const sql=db()
  const rows=await sql`SELECT mime_type,encode(content,'base64') AS b64
    FROM december_business_assets WHERE id=${id} LIMIT 1`
  if(!rows.length)return res.status(404).end('Image not found')
  res.setHeader('Content-Type',rows[0].mime_type)
  res.setHeader('Cache-Control','private, max-age=86400')
  res.setHeader('X-Content-Type-Options','nosniff')
  return res.status(200).send(Buffer.from(rows[0].b64,'base64'))
 }catch{return res.status(502).end('Image unavailable')}
}
