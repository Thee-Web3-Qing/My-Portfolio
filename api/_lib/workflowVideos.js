import { db } from './payments.js'
import { needAdmin } from './decemberAdmin.js'
import { DEFAULT_VIDEOS, VIDEO_GROUPS, validateVideos } from '../../src/data/workflowVideos.js'
export async function getWorkflowVideos(){
 const rows=await db()`SELECT workflow_id,videos FROM public.workflow_video_samples`
 const map={...DEFAULT_VIDEOS}
 for(const row of rows){
  if(!VIDEO_GROUPS.some(g=>g.id===row.workflow_id))continue
  const videos=validateVideos(typeof row.videos==='string'?JSON.parse(row.videos):row.videos)
  if(videos)map[row.workflow_id]=videos
 }
 return map
}
export async function adminWorkflowVideos(req,res){
 const method=req.method==='GET'?'GET':'POST'
 if(!needAdmin(req,res,method))return
 try{
  if(method==='GET')return res.status(200).json({videos:await getWorkflowVideos()})
  const group=req.body?.group
  const videos=validateVideos(req.body?.videos)
  if(!VIDEO_GROUPS.some(g=>g.id===group)||!videos)return res.status(400).json({error:'Choose a valid group and up to 12 unique YouTube videos with titles.'})
  const sql=db()
  await sql`INSERT INTO public.workflow_video_samples(workflow_id,videos) VALUES(${group},${JSON.stringify(videos)}::jsonb) ON CONFLICT(workflow_id) DO UPDATE SET videos=EXCLUDED.videos,updated_at=now()`
  return res.status(200).json({videos:await getWorkflowVideos()})
 }catch(error){
  console.error('Workflow video manager failed',error?.message)
  return res.status(502).json({error:'Unable to load or save video samples.'})
 }
}
