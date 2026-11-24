import { db } from './_lib/payments.js'
import { needAdmin } from './_lib/decemberAdmin.js'

/**
 * Lightweight first-party December sales analytics.
 * Data is pseudonymous and intentionally excludes IPs, user agents, customer
 * names/emails, full referrers, query strings and payment details.
 *
 * Public POST records allowed events; protected GET provides aggregated data.
 * One extra Vercel Function, keeping the site below the Hobby limit of 12.
 */
const allowedEvents=new Set(['page_view','preview_selected','checkout_started','payment_redirect'])
const clean=(value,n)=>typeof value==='string'?value.toLowerCase().trim().replace(/[^a-z0-9._-]/g,'').slice(0,n):''
const isId=x=>typeof x==='string'&&/^[a-zA-Z0-9-]{8,80}$/.test(x)
let schemaReady
function ensure(sql){
 if(!schemaReady){
  schemaReady=(async()=>{
   await sql`CREATE TABLE IF NOT EXISTS december_analytics_events (
     event_id varchar(80) PRIMARY KEY,
     occurred_at timestamptz NOT NULL DEFAULT now(),
     event_type varchar(32) NOT NULL,
     page_path varchar(180) NOT NULL,
     visitor_id varchar(80) NOT NULL,
     session_id varchar(80) NOT NULL,
     source varchar(45) NOT NULL DEFAULT 'direct',
     medium varchar(45) NOT NULL DEFAULT '',
     campaign varchar(80) NOT NULL DEFAULT '',
     industry varchar(45) NOT NULL DEFAULT '',
     layout varchar(35) NOT NULL DEFAULT ''
   )`
   await sql`CREATE INDEX IF NOT EXISTS december_analytics_event_time ON december_analytics_events (occurred_at DESC)`
   await sql`CREATE INDEX IF NOT EXISTS december_analytics_page_time ON december_analytics_events (page_path,occurred_at DESC)`
  })().catch(error=>{schemaReady=null;throw error})
 }
 return schemaReady
}
const sameOrigin=req=>{
 const origin=req.headers.origin
 if(typeof origin!=='string')return false
 try{
  const o=new URL(origin)
  return o.protocol==='https:'&&o.host===req.headers.host
 }catch{return false}
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store')
 res.setHeader('X-Robots-Tag','noindex, nofollow')
 if(req.method==='POST'){
  if(!sameOrigin(req) || req.headers['sec-fetch-site']==='cross-site')return res.status(403).json({error:'Same-origin access only'})
  const b=req.body||{}
  if(typeof b!=='object'||Array.isArray(b)||JSON.stringify(b).length>1800 ||
    !allowedEvents.has(b.eventType)||!isId(b.eventId)||!isId(b.visitorId)||!isId(b.sessionId)){
   return res.status(400).json({error:'Invalid analytics event'})
  }
  const path=String(b.path||'')
  if(!/^\/[a-zA-Z0-9/_-]{0,179}$/.test(path)||/^(\/admin|\/api|\/payment|\/december\/(details|track))/.test(path)){
   return res.status(400).json({error:'Unsupported page'})
  }
  // Do not persist or query a visitor's personal details.
  try{
   const sql=db()
   await ensure(sql)
   await sql`INSERT INTO december_analytics_events
    (event_id,event_type,page_path,visitor_id,session_id,source,medium,campaign,industry,layout)
    VALUES (${b.eventId},${b.eventType},${path},${b.visitorId},${b.sessionId},
       ${clean(b.source,45)||'direct'},${clean(b.medium,45)},${clean(b.campaign,80)},
       ${clean(b.industry,45)},${clean(b.layout,35)})
    ON CONFLICT (event_id) DO NOTHING`
   return res.status(204).end()
  }catch(err){
   console.error('December analytics event failed:',err?.message)
   return res.status(503).json({error:'Analytics temporarily unavailable'})
  }
 }
 if(req.method==='GET'){
  if(!needAdmin(req,res))return
  const allowedDays=[1,2,7,14,30]
  const days=Number(req.query?.days||2)
  if(!allowedDays.includes(days))return res.status(400).json({error:'Invalid reporting period'})
  const since=new Date(Date.now()-days*86400000).toISOString()
  try{
   const sql=db()
   await ensure(sql)
   const [totals,sources,daysData,previews,topPages]=await Promise.all([
    sql`SELECT
      (count(*) FILTER(WHERE event_type='page_view'))::int AS all_views,
      (count(DISTINCT visitor_id) FILTER(WHERE event_type='page_view'))::int AS all_visitors,
      (count(*) FILTER(WHERE event_type='page_view' AND page_path='/december'))::int AS landing_views,
      (count(DISTINCT visitor_id) FILTER(WHERE event_type='page_view' AND page_path='/december'))::int AS landing_visitors,
      (count(DISTINCT session_id) FILTER(WHERE event_type='page_view' AND page_path='/december'))::int AS landing_sessions,
      (count(*) FILTER(WHERE event_type='preview_selected'))::int AS preview_selections,
      (count(*) FILTER(WHERE event_type='checkout_started'))::int AS checkout_attempts,
      (count(*) FILTER(WHERE event_type='payment_redirect'))::int AS payment_redirects
     FROM december_analytics_events WHERE occurred_at >= ${since}::timestamptz`,
    sql`SELECT source,medium,campaign,count(*)::int AS views,count(DISTINCT visitor_id)::int AS visitors
      FROM december_analytics_events
      WHERE occurred_at >= ${since}::timestamptz AND event_type='page_view' AND page_path='/december'
      GROUP BY source,medium,campaign ORDER BY views DESC LIMIT 12`,
    sql`SELECT to_char(occurred_at AT TIME ZONE 'Africa/Lagos','YYYY-MM-DD') AS day,
      count(*)::int AS views, count(DISTINCT visitor_id)::int AS visitors
      FROM december_analytics_events
      WHERE occurred_at >= ${since}::timestamptz AND event_type='page_view' AND page_path='/december'
      GROUP BY 1 ORDER BY 1 ASC LIMIT 32`,
    sql`SELECT industry,layout,count(*)::int AS selections
      FROM december_analytics_events
      WHERE occurred_at >= ${since}::timestamptz AND event_type='preview_selected'
      GROUP BY industry,layout ORDER BY selections DESC LIMIT 12`,
    sql`SELECT page_path AS path,count(*)::int AS views
      FROM december_analytics_events
      WHERE occurred_at >= ${since}::timestamptz AND event_type='page_view'
      GROUP BY page_path ORDER BY views DESC LIMIT 12`
   ])
   return res.status(200).json({periodDays:days,asOf:new Date().toISOString(),startedAt:since,
      totals:totals[0]||{},sources,days:daysData,previews,topPages,
      note:'Collection begins after this feature is deployed. Visitors are approximate browser-based IDs; ad attribution requires UTM tags or an available referrer. Paid transactions are reported separately from Paystack.'})
  }catch(err){
   console.error('December analytics report failed:',err?.message)
   return res.status(503).json({error:'Traffic report is temporarily unavailable'})
  }
 }
 res.setHeader('Allow','GET, POST')
 return res.status(405).json({error:'Method not allowed'})
}
