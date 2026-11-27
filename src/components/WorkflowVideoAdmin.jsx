import { useEffect, useState } from 'react'
import { VIDEO_GROUPS, youtubeId, validateVideos } from '../data/workflowVideos.js'
import './WorkflowVideoAdmin.css'
const endpoint='/api/admin/orders?view=workflow-videos'
export default function WorkflowVideoAdmin(){
 const [map,setMap]=useState(null),[group,setGroup]=useState('qutline'),[draft,setDraft]=useState([]),[url,setUrl]=useState(''),[title,setTitle]=useState(''),[busy,setBusy]=useState(false),[notice,setNotice]=useState('')
 useEffect(()=>{let active=true;fetch(endpoint,{credentials:'same-origin',cache:'no-store'}).then(async r=>{const j=await r.json();if(!r.ok)throw Error(j.error);if(active){setMap(j.videos);setDraft(j.videos.qutline||[])}}).catch(e=>{if(active)setNotice(e.message||'Could not load video samples.')});return()=>{active=false}},[])
 function changeGroup(next){setGroup(next);setDraft(map?.[next]||[]);setNotice('');setUrl('');setTitle('')}
 function add(){const id=youtubeId(url);const result=validateVideos([...draft,{id,title}]);if(!result){setNotice('Enter a unique YouTube link and a title, up to 12 videos per group.');return}setDraft(result);setUrl('');setTitle('');setNotice('Added to draft. Save to publish.')}
 async function save(){setBusy(true);setNotice('');try{const r=await fetch(endpoint,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({group,videos:draft})});const j=await r.json();if(!r.ok)throw Error(j.error);setMap(j.videos);setDraft(j.videos[group]||[]);setNotice('Published. Your workflow page now uses this list.')}catch(e){setNotice(e.message||'Could not save video samples.')}finally{setBusy(false)}}
 return <section className="wva"><h2>Sample video manager</h2><p>Manage unlisted YouTube videos on your workflow page. No video uploads or redeployment needed.</p>
 <label>Display location<select value={group} disabled={!map||busy} onChange={e=>changeGroup(e.target.value)}>{VIDEO_GROUPS.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label>
 {draft.map((v,i)=><div className="wva-row" key={v.id}><img src={'https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg'} alt="" loading="lazy"/><div><strong>{v.title}</strong><small>{v.id}</small></div><button type="button" disabled={busy||i===0} onClick={()=>setDraft(d=>d.map((x,j)=>j===i?d[i-1]:j===i-1?d[i]:x))}>Move up</button><button type="button" disabled={busy} onClick={()=>setDraft(d=>d.filter(x=>x.id!==v.id))}>Remove</button></div>)}
 {!draft.length&&<p>No videos assigned.</p>}
 <div className="wva-add"><label>YouTube link<input value={url} disabled={busy} onChange={e=>setUrl(e.target.value)} placeholder="https://youtube.com/shorts/…"/></label><label>Video title<input maxLength={120} value={title} disabled={busy} onChange={e=>setTitle(e.target.value)}/></label><button type="button" disabled={!map||busy} onClick={add}>Add video</button></div>
 <button type="button" className="wva-save" disabled={!map||busy} onClick={save}>{busy?'Saving…':'Save and publish'}</button>{notice&&<p role="status">{notice}</p>}
 </section>
}
