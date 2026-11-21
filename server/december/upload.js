import { db, environment, confirmPayment } from '../../api/_lib/payments.js'
const getType = bytes => {
 if(bytes.subarray(0,3).equals(Buffer.from([255,216,255]))) return 'image/jpeg'
 if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png'
 if(bytes.subarray(0,4).toString('ascii')==='RIFF'&&bytes.subarray(8,12).toString('ascii')==='WEBP') return 'image/webp'
 return null
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store')
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'})
 const body=req.body||{}
 const reference=String(body.reference||'').trim()
 const email=String(body.email||'').trim().toLowerCase()
 if(!/^QDEC-[a-z0-9]{32}$/i.test(reference)||!email||email.length>160)return res.status(400).json({error:'Valid payment reference and email required'})
 if(typeof body.data!=='string'||body.data.length>3000000||!body.data.length)return res.status(400).json({error:'Upload a JPG, PNG or WebP image smaller than 2 MB'})
 const bytes=Buffer.from(body.data,'base64')
 const mime=getType(bytes)
 if(!mime||bytes.length>2000000||bytes.length<100)return res.status(400).json({error:'Only valid JPG, PNG or WebP images up to 2 MB are supported. For larger photos, share a Drive folder link.'})
 const filename=String(body.name||'business-image').replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,160)
 try{
  const sql=db()
  const check=await sql`SELECT reference FROM payment_orders
   WHERE reference=${reference} AND lower(customer_email)=${email}
   AND environment=${environment()} AND product='december-website' LIMIT 1`
  if(!check.length)return res.status(404).json({error:'Payment reference or email not found'})
  const result=await confirmPayment(reference,environment())
  if(!result.paid)return res.status(409).json({error:'Payment must be verified before image upload'})
  const totals=await sql`SELECT count(*)::int AS count,COALESCE(sum(file_size),0)::bigint AS bytes
      FROM december_business_assets WHERE payment_reference=${reference}`
  if(Number(totals[0].count)>=35||Number(totals[0].bytes)+bytes.length>30000000)return res.status(413).json({error:'Image upload limit reached. Share the remaining images using a Drive folder link.'})
  const rows=await sql`INSERT INTO december_business_assets
   (payment_reference,original_name,mime_type,file_size,content)
   VALUES (${reference},${filename},${mime},${bytes.length},decode(${body.data},'base64'))
   RETURNING id`
  const id=rows[0].id
  return res.status(201).json({success:true,url:'/api/december/image?id='+encodeURIComponent(id),id,name:filename})
 }catch(err){console.error('December image upload failed',err?.message);return res.status(502).json({error:'Could not save the image. Please try again or share a Drive link.'})}
}
