import { useState } from 'react'
export default function WorkflowVideoPlayer({video,active,onPlay}){
 const [started,setStarted]=useState(false)
 const playing=onPlay?active:started
 return <figure className="wf-video">
  <div className="wf-video-frame">
   {playing?<iframe title={video.title} src={'https://www.youtube-nocookie.com/embed/'+video.id+'?autoplay=1&playsinline=1&rel=0'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>:
    <button type="button" className="wf-video-preview" onClick={()=>onPlay?onPlay():setStarted(true)} aria-label={'Play '+video.title}>
      <img src={'https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg'} alt="" loading="lazy" decoding="async" />
      <span className="wf-video-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="23" height="23"><path fill="currentColor" d="M8 5v14l12-7z"/></svg></span>
      <span className="wf-video-hint">WATCH SAMPLE</span>
    </button>}
  </div>
  <figcaption>{video.title}</figcaption>
  {playing&&<button type="button" className="wf-video-close" onClick={()=>onPlay?onPlay(false):setStarted(false)}>Close player</button>}
 </figure>
}
