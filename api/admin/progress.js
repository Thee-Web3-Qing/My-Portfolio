import { STAGES, enabledOrderModes, needAdmin, ordersDb } from '../_lib/decemberAdmin.js'
const clean=(x,n)=>typeof x==='string'?x.trim().slice(0,n):''
export default async function handler(req,res){
 res.setHeader('X-Robots-Tag','noindex, nofollow')
 if(!needAdmin(req,res,'POST'))return
 const body=req.body&&typeof req.body==='object'?req.body:{}
 const mode=clean(body.environment,8),ref=clean(body.reference,120),stage=clean(body.stage,45)
 const percent=Number(body.percent)
 const publicNote=clean(body.publicNote,1500),privateNote=clean(body.privateNote,2500)
 const eta=clean(body.eta,10)
 const assetsConfirmed=body.assetsConfirmed===true
 if(!enabledOrderModes().includes(mode) || !/^QDEC-[a-f0-9]{32}$/i.test(ref) ||
    !STAGES.includes(stage) || !Number.isInteger(percent)||percent<0||percent>100||
    publicNote.length<5 || (eta&&!/^\d{4}-\d{2}-\d{2}$/.test(eta))){
  return res.status(400).json({error:'Enter a valid stage, progress, note, reference and estimated date'})
 }
 try{
  const sql=ordersDb(mode)
  const orders=await sql`SELECT status FROM payment_orders WHERE reference=${ref} AND environment=${mode} AND product='december-website' LIMIT 1`
  if(!orders.length)return res.status(404).json({error:'December website order not found'})
  if(orders[0].status!=='paid')return res.status(409).json({error:'Project progress can only be started after verified payment'})
  const previous=await sql`SELECT stage FROM december_project_progress WHERE payment_reference=${ref} LIMIT 1`
  await sql`INSERT INTO december_project_progress
    (payment_reference,stage,percent_complete,public_note,private_note,estimated_completion_date,assets_confirmed_at)
    VALUES (${ref},${stage},${percent},${publicNote},${privateNote},
      ${eta||null}::date,CASE WHEN ${assetsConfirmed} THEN now() ELSE NULL END)
    ON CONFLICT(payment_reference) DO UPDATE SET
     stage=EXCLUDED.stage,percent_complete=EXCLUDED.percent_complete,
     public_note=EXCLUDED.public_note,private_note=EXCLUDED.private_note,
     estimated_completion_date=EXCLUDED.estimated_completion_date,
     assets_confirmed_at=CASE
       WHEN ${assetsConfirmed} THEN COALESCE(december_project_progress.assets_confirmed_at,now())
       ELSE NULL END,updated_at=now()`
  await sql`UPDATE december_business_intakes SET
    assets_confirmed_at=CASE WHEN ${assetsConfirmed} THEN COALESCE(assets_confirmed_at,now()) ELSE NULL END,
    review_status=CASE WHEN ${assetsConfirmed} THEN 'confirmed' ELSE review_status END,
    updated_at=now()
    WHERE payment_reference=${ref}`
  await sql`INSERT INTO december_admin_audit (payment_reference,previous_stage,next_stage,progress_percent)
    VALUES (${ref},${previous[0]?.stage||null},${stage},${percent})`
  return res.status(200).json({success:true,message:'Client project progress updated',stage,percent})
 }catch(err){
  console.error('Admin project update failed',err?.message)
  return res.status(502).json({error:'Unable to save project progress'})
 }
}
