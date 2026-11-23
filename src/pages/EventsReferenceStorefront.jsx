import {useEffect,useMemo,useState} from 'react'
import {Link,useLocation} from 'react-router-dom'
import {money} from './industryStoreData.js'
import {eventOffers} from './eventsReferenceData.js'
import './EventsReferenceStorefront.css'

const up=(id,w=1500)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w='+w+'&q=84'
const pics={
 keynote:up('photo-1475721027785-f74eccf877e2'),
 workshop:up('photo-1552664730-d307ca884978'),
 crowd:up('photo-1517245386807-bb43f82c33c4'),
 speaker:up('photo-1507003211169-0a1dd7228f2d'),
 talk:up('photo-1531482615713-2afd69097998'),
 panel:up('photo-1540575467063-178a50c2df87'),
 session:up('photo-1528605248644-14dd04022da1'),
 creators:up('photo-1521737711867-e3b97375f902'),
 notebooks:up('photo-1455390582262-044cdead277a'),
 event:up('photo-1492684223066-81342ee5ff30'),
 merch:up('photo-1503342217505-b0a15ec3261c'),
 shirt:up('photo-1523381210434-271e8be1f52b'),
 studio:up('photo-1494438639946-1ebd1d20bf85'),
 apparel:up('photo-1441986300917-64674bd600d8'),
 fabric:up('photo-1558769132-cb1aea458c5e'),
 apparel2:up('photo-1489987707025-afc232f7ea0f'),
 merchday:up('photo-1552664730-d307ca884978'),
 maker:up('photo-1515378791036-0648a3ef77b2'),
 camera:up('photo-1492691527719-9d1e07e534b4'),
 editing:up('photo-1558655146-d09347e92766'),
 animation:up('photo-1634017839464-5c339ebe3cb4'),
 illustrator:up('photo-1531058020387-3be344556be6'),
 venue:up('photo-1519167758481-83f550bb49b3'),
 festival:up('photo-1470229722913-7c0e2dbbafd3'),
 friends:up('photo-1527529482837-4698179dc6ce'),
 speakerWoman:up('photo-1580489944761-15a19d654956'),
 speakerMan:up('photo-1500648767791-00dcc994a43e'),
 speakerGirl:up('photo-1534528741775-53994a69daeb'),
}
const variants={
 editorial:{brand:'CONVERGE / 26',nav:['Home','Agenda','Speakers','About','Contact'],label:'CREATOR & BUSINESS CONFERENCE',headline:'IDEAS CONNECT. PEOPLE CREATE.',tag:'A place where good ideas meet great people.',hint:'Two days of talks, workshops and meaningful introductions.',cta:'Explore the programme',theme:'Conference / yellow',photo:pics.panel},
 catalogue:{brand:'THE LIVE LAB',nav:['Home','Experiences','Our story','Projects','Contact'],label:'LIVE MERCH & CREATIVE EXPERIENCES',headline:'MERCH / REINVENTED.',tag:'Good merch makes the moment last.',hint:'On-site customisation, screen printing and immersive brand moments that become part of the event.',cta:'Build an experience',theme:'Merch / dark',photo:pics.apparel},
 minimal:{brand:'ODDLY STUDIO',nav:['Home','Projects','About','Showreel','Contact'],label:'MOTION / DESIGN / CREATIVE PRODUCTION',headline:'HELLO, WE MAKE THINGS MOVE.',tag:'A little strange. A lot of imagination.',hint:'Motion, characters, films and fun ideas brought to life.',cta:'Browse our projects',theme:'Creative / illustrated',photo:pics.camera},
 playful:{brand:'GOOD COMPANY',nav:['Home','Agenda','Workshops','About','Contact'],label:'THE CREATIVE GATHERING',headline:'MAKE ROOM FOR WONDER.',tag:'A good excuse to get together and make something.',hint:'Talks, workshops, unexpected ideas and playful human connection.',cta:'Explore the festival',theme:'Festival / illustrated',photo:pics.friends},
}
const base=v=>'/events'+v
const href=(v,segment='')=>base(v)+(segment?'/'+segment:'')
const word=v=>variants[v]||variants.editorial
function Image({src,alt,className='',...props}){const[failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src]);return failed?<div role="img" aria-label={alt} className={'ev-image-fallback '+className}>THE MOMENT / 2026</div>:<img loading="lazy" decoding="async" src={src} alt={alt} onError={()=>setFailed(true)} className={className} {...props}/>}
function Arrow(){return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 12h16m-7-7 7 7-7 7"/></svg>}
function Star({className=''}){return <svg className={className} aria-hidden="true" viewBox="0 0 100 100"><path d="M50 0 59 31 85 8 72 42 100 50 70 58 85 94 57 69 49 100 40 68 9 92 29 58 0 49 31 40 12 8 42 30Z" fill="currentColor" stroke="currentColor" strokeWidth="1"/></svg>}
function Header({variant}){
 const [open,setOpen]=useState(false),config=word(variant)
 const menu=variant==='editorial'?[['Home',''],['Agenda','agenda'],['Speakers','speakers'],['About','about'],['Contact','contact']]
 :variant==='catalogue'?[['Home',''],['Experiences','explore'],['Our story','about'],['Projects','stories'],['Contact','contact']]
 :variant==='minimal'?[['Home',''],['Projects','explore'],['About','about'],['Showreel','showreel'],['Contact','contact']]
 :[['Home',''],['Agenda','agenda'],['Workshops','explore'],['About','about'],['Contact','contact']]
 return <header className="ev-header">
  <Link className="ev-logo" to={base(variant)}>{config.brand}<span className="ev-logo-dot">.</span></Link>
  <nav aria-label={config.brand+' navigation'} className={open?'open':''}>{menu.map(([title,to])=><Link key={title} onClick={()=>setOpen(false)} to={href(variant,to)}>{title}</Link>)}</nav>
  <Link className="ev-header-cta" to={href(variant,'plan')}>{variant==='editorial'||variant==='playful'?'JOIN THE EVENT':variant==='catalogue'?'GET STARTED':'WORK WITH US'} <Arrow/></Link>
  <button type="button" onClick={()=>setOpen(x=>!x)} className="ev-menu-toggle" aria-label="Toggle navigation" aria-expanded={open}><span/><span/><span/></button>
 </header>
}
function Foot({variant}){
 const c=word(variant)
 return <footer className="ev-foot"><div className="ev-foot-promo"><span>2026 / A WEBSITE DEMONSTRATION</span><h2>{variant==='minimal'?'LET’S MAKE SOMETHING WEIRD.':variant==='catalogue'?'LET’S MAKE IT AN EXPERIENCE.':variant==='playful'?'DON’T LET THE GOOD IDEAS GO.':'THE BEST MOMENTS ARE SHARED.'}</h2><Link to={href(variant,'plan')}>LET’S TALK <Arrow/></Link></div><div className="ev-foot-bottom"><Link to={base(variant)} className="ev-logo">{c.brand}</Link><div><Link to={href(variant,'explore')}>Explore</Link><Link to={href(variant,'about')}>About</Link><Link to={href(variant,'contact')}>Contact</Link><Link to={href(variant,'faq')}>FAQ</Link></div><span>Independent demo design by Qing The Creator. Dates, prices, people and services shown are illustrative.</span></div></footer>
}
function Button({v,route='explore',children,className=''}){return <Link className={'ev-button '+className} to={href(v,route)}>{children} <Arrow/></Link>}
function Disclaimer(){return <p className="ev-disclaimer">A fictional business website preview. Event dates, speakers, projects, ticket availability and prices are examples. No real ticket is sold or booking is confirmed here.</p>}
const speakerNames=['Tomi Adebayo','Zara Martins','Dami Cole','Mira James','Tunde Ojo','Nana Agyeman']
const speakerPhotos=[pics.speakerMan,pics.speakerWoman,pics.speaker,pics.speakerGirl,pics.speakerMan,pics.speakerWoman]
function Collage({items,className='',altPrefix='Event'}){return <div className={'ev-collage '+className}>{items.map((src,i)=><div className="ev-collage-cell" key={i}><Image src={src} alt={altPrefix+' photograph '+(i+1)}/></div>)}</div>}
function Conference(){
 const v='editorial'
 return <main className="ev-conf-home">
  <div className="ev-conf-yellow">
   <div className="ev-conf-ticker"><span>GOOD IDEAS MAKE GREAT CONNECTIONS</span><b>·</b><span>THE CREATIVE ECONOMY STARTS HERE</span><b>·</b><span>NEW MINDS. NEW MOMENTS.</span><b>·</b><span>CONVERGE 2026</span></div>
   <Header variant={v}/>
   <section className="ev-conf-hero">
    <Star className="ev-conf-star ev-conf-star-left"/><Star className="ev-conf-star ev-conf-star-right"/>
    <span className="ev-conf-sticker ev-sticker-location">LAGOS / NG</span>
    <span className="ev-conf-sticker ev-sticker-date">12–13 DEC 2026</span>
    <span className="ev-conf-sticker ev-sticker-event">CREATORS + CULTURE</span>
    <h1>THE MAKERS<br/><strong>CONNECT</strong><br/>SUMMIT</h1>
    <p>Ideas. People. Possibilities. One unforgettable room.</p>
    <Button v={v} route="agenda" className="ev-conf-book">VIEW THE PROGRAMME</Button>
    <div className="ev-conf-count"><div><strong>02</strong><span>DAYS</span></div><div><strong>18</strong><span>TALKS</span></div><div><strong>06</strong><span>WORKSHOPS</span></div><div><strong>01</strong><span>COMMUNITY</span></div></div>
   </section>
   <Collage className="ev-conf-floating" items={[pics.crowd,pics.workshop,pics.talk,pics.keynote]} altPrefix="Conference participants and speakers"/>
  </div>
  <section className="ev-conf-black">
   <div className="ev-conf-belief"><span>WHY WE GATHER / 2026</span><h2>AN EVENT SHOULD FEEL<br/>BIGGER THAN THE <em>ROOM.</em></h2><p>Ideas do not belong on a slide forever. We bring founders, creators and curious minds together to turn a room full of strangers into a room full of possibilities.</p></div>
   <Collage items={[pics.panel,pics.session,pics.speakerWoman,pics.creators]} className="ev-conf-gallery" altPrefix="Networking workshops and speakers"/>
  </section>
  <section className="ev-conf-agenda">
   <span className="ev-conf-smalltag">THE LINEUP / EXPLORE THE PROGRAMME</span>
   <h2>GOOD PEOPLE.<br/><em>GREAT CONVERSATIONS.</em></h2>
   <div className="ev-conf-dates"><span>12 DEC 2026</span><span>13 DEC 2026</span><span>YOUR DAY, YOUR WAY</span></div>
   <div className="ev-conf-agenda-grid">{[['OPENING KEYNOTE','Big ideas start with brave conversations.',pics.keynote],['CREATOR ROUNDTABLE','Behind the work and the people building it.',pics.panel],['HANDS-ON LAB','Make something useful before you leave.',pics.workshop]].map(([name,text,img],i)=><Link to={href(v,'agenda')} key={name}><Image src={img} alt={name}/><span>0{i+1} / MAIN STAGE</span><h3>{name}</h3><p>{text}</p></Link>)}</div>
   <Button v={v} route="agenda">VIEW THE FULL AGENDA</Button>
  </section>
  <section className="ev-conf-numbers"><span>THE ROOM / THE PEOPLE / THE IDEAS</span><div>{[['18','SPEAKERS'],['06','WORKSHOPS'],['02','DAYS'],['01','CITY']].map(([n,t])=><article key={t}><strong>{n}</strong><small>{t}</small></article>)}</div></section>
  <section className="ev-conf-speakers"><span className="ev-conf-smalltag">NEW VOICES, GOOD IDEAS</span><h2>MEET THE MINDS<br/><em>BEHIND THE MOMENT.</em></h2><div>{speakerNames.slice(0,4).map((name,i)=><Link to={href(v,'speakers')} key={name}><Image src={speakerPhotos[i]} alt={'Illustrative speaker portrait '+name}/><strong>{name}</strong><span>{['Creator & Producer','Founder & Strategist','Product Storyteller','Creative Director'][i]}</span></Link>)}</div><Button v={v} route="speakers">ALL SPEAKERS</Button></section>
  <section className="ev-conf-partners"><span>IN GOOD COMPANY</span><h2>THE PEOPLE WHO<br/>MAKE IT HAPPEN.</h2><div>{['THE STUDIO CLUB','FUTURE PEOPLE','MOTION HOUSE','LAGOS MAKERS','IDEA ROOM','CITY CULTURE'].map(n=><b key={n}>{n}</b>)}</div></section>
  <section className="ev-conf-tickets"><span>FIND YOUR PLACE IN THE ROOM</span><h2>THERE’S A SEAT<br/>FOR YOUR IDEAS.</h2><div>{[['ONE DAY PASS','₦15,000','Talks, sessions and community access'],['FULL EXPERIENCE','₦25,000','Both days and all main-stage talks'],['CREATOR LAB','₦35,000','Talks plus small-group workshop access']].map(([name,price,desc],i)=><article key={name}><span>OPTION 0{i+1}</span><h3>{name}</h3><strong>{price}</strong><p>{desc}</p><Button v={v} route="plan">PREVIEW REGISTRATION</Button></article>)}</div></section>
  <section className="ev-conf-close"><h2>GREAT THINGS BEGIN<br/>WITH HELLO.</h2><p>Let's make some memories worth talking about.</p><Button v={v} route="contact">GET IN TOUCH</Button></section><Disclaimer/>
 </main>
}
function Merch(){
 const v='catalogue'
 return <main className="ev-merch-home">
  <Header variant={v}/>
  <section className="ev-merch-hero"><div className="ev-merch-intro"><span>MADE TOGETHER. MADE IN THE MOMENT.</span><h1>MERCH<br/>MADE<br/><em>MEMORABLE.</em></h1><p>From live printing to one-off event pieces, we turn a brand moment into something people can take home.</p><div className="ev-merch-actions"><Button v={v} route="plan">GET STARTED</Button><Button v={v} route="explore">SEE EXPERIENCES</Button></div></div><Collage items={[pics.shirt,pics.merch,pics.apparel,pics.friends,pics.fabric,pics.studio,pics.merchday,pics.creators,pics.apparel2]} className="ev-merch-hero-grid" altPrefix="Apparel print and creative experience"/></section>
  <section className="ev-merch-bigstatement"><Image className="ev-round-shot ev-orbit-one" src={pics.friends} alt="Friends at creative event"/><Image className="ev-round-shot ev-orbit-two" src={pics.apparel} alt="Fashion rack"/><Image className="ev-round-shot ev-orbit-three" src={pics.crowd} alt="Visitors enjoying a gathering"/><h2>MAKE MERCH<br/>THE <em>EXPERIENCE.</em></h2><p>The best brand interactions happen when people stop watching and start creating. We build live moments with something worth keeping at the end.</p><Button v={v} route="about">WHAT WE DO</Button></section>
  <section className="ev-merch-brandline"><span>DESIGNED FOR PEOPLE AND IDEAS</span><div>{['BRAND ACTIVATIONS','LIVE PRINTING','CREATIVE CAMPAIGNS','MERCH EXPERIENCES','POP-UPS'].map(n=><strong key={n}>{n}</strong>)}</div></section>
  <Collage items={[pics.merch,pics.shirt,pics.apparel2,pics.fabric,pics.friends,pics.camera]} className="ev-merch-wide-gallery" altPrefix="Merchandising and pop-up moments"/>
  <section className="ev-merch-services"><div><span>THE POSSIBILITIES</span><h2>SHOW UP.<br/><em>STAND OUT.</em></h2><p>Every event deserves its own little universe. Here's how our fictional studio might bring yours to life.</p></div><div>{[['01','LIVE CUSTOMISATION',pics.shirt,'Let guests make a personalised piece while they are there.'],['02','MERCH STATIONS',pics.merch,'A considered pop-up space built around your brand.'],['03','CREATIVE PRODUCTION',pics.camera,'Photography, content and visual direction for the entire experience.']].map(([n,title,img,body])=><Link key={n} to={href(v,'explore')}><Image src={img} alt={title}/><span>{n}</span><h3>{title}</h3><p>{body}</p></Link>)}</div></section>
  <section className="ev-merch-spotlight"><Image src={pics.creators} alt="Creative team working together"/><div><span>YOUR IDEA, BROUGHT TO LIFE</span><h2>EVERY DETAIL<br/>HAS A JOB.</h2><p>We think about the artwork, space, queue, guest journey and final piece. The result is an experience with more substance than just a branded table.</p><Button v={v} route="stories">EXPLORE CASE STUDIES</Button></div></section>
  <section className="ev-merch-end"><h2>MAKE IT<br/>SOMETHING.</h2><Button v={v} route="plan">BUILD YOUR EXPERIENCE</Button></section><Disclaimer/>
 </main>
}
function CreativeCharacter(){
 return <svg className="ev-creative-character" viewBox="0 0 660 620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Original illustration of a cheerful creative director holding a video clapperboard">
 <path d="M185 550 115 598 593 598 541 489Z" fill="#1b132a"/><path d="M212 335q-70 40-94 115l-45 137h490l-36-152q-18-67-115-105Z" fill="#7338e6" stroke="#100f16" strokeWidth="11"/><path d="M220 403q-15 48-15 135M443 404q17 44 14 136" fill="none" stroke="#ac84ff" strokeWidth="13" strokeLinecap="round"/>
 <path d="M194 365q-79 8-100-69l-42-62 24-25 66 78 59 13" fill="#cf835a" stroke="#100e1b" strokeWidth="11"/><path d="M53 233q-23-21-14-44 8-22 26-11l9-66q7-18 19-3l4 64 13-49q13-18 21-3l-1 59 9-19q14-16 18 3 5 39-38 92" fill="#dca078" stroke="#100d19" strokeWidth="10" strokeLinejoin="round"/>
 <path d="M227 282q-13 82 37 104 48 18 103-1 40-27 29-113" fill="#d89a72" stroke="#160f18" strokeWidth="11"/>
 <path d="M204 231Q139 139 218 82q43-29 93-7 45-34 98 3 58 44 17 126l-20 67-168 39Z" fill="#171120" stroke="#08060d" strokeWidth="12"/>
 <path d="M209 179q-48 10-50 59 6 24 39 35l12 40q-2 43 35 63 47 27 109 0 41-28 42-70l14-42q33-12 36-43-10-47-52-39" fill="#dda179" stroke="#0b0914" strokeWidth="11"/>
 <path d="M203 179q-45-37-20-85 24-53 88-32 53-40 103 2 44-14 64 32 18 40-21 72-9-34-43-27-36-23-72-2-50-18-99 40" fill="#1d102c" stroke="#0c0814" strokeWidth="11"/>
 <path d="M247 248q26-16 48 0M340 249q26-15 46 3" fill="none" stroke="#1a1016" strokeWidth="9" strokeLinecap="round"/>
 <circle cx="274" cy="271" r="7" fill="#0c0911"/><circle cx="363" cy="271" r="7" fill="#0c0911"/>
 <path d="M306 327q25 25 57-6" fill="none" stroke="#471f2a" strokeWidth="9" strokeLinecap="round"/>
 <path d="M443 392q46-66 78-22 29 32-20 90l-45 48" fill="#d89a72" stroke="#100d19" strokeWidth="11"/>
 <rect x="413" y="424" width="178" height="130" rx="15" fill="#252436" stroke="#100e1b" strokeWidth="10"/><path d="M413 448h178l-19 25H433Z" fill="#f0f0ed"/><path d="M419 429h167" stroke="#0e0d14" strokeWidth="15" strokeDasharray="32 20"/><path d="M465 505 465 535 498 520Z" fill="#b8ff1b"/>
 <path d="M260 490q80 14 147 0" stroke="#9f71f4" strokeWidth="11" strokeLinecap="round"/>
 <path d="M180 126q12-41 58-42M396 117q25-14 43 23" fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round"/>
 </svg>
}
function Doodle({type='star',className=''}){return <svg viewBox="0 0 110 110" aria-hidden="true" className={className}><g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">{type==='spark'?<path d="M55 4 65 44 105 56 66 65 55 106 45 64 5 55 46 44Z"/>:type==='arrow'?<path d="M14 22Q84 13 68 75l-25-17m25 17 16-24"/>:type==='squiggle'?<path d="M13 37q23-41 40 0t40 0m-80 32q23-41 40 0t40 0"/>:<><circle cx="55" cy="55" r="33"/><path d="M31 49q11 12 21 0m8 0q11 12 20 0M40 72q18 10 31-3"/></>}</g></svg>}
function Creative(){
 const v='minimal'
 return <main className="ev-creative-home">
  <div className="ev-creative-aura"><Header variant={v}/>
   <section className="ev-creative-hero"><div><span className="ev-hand-kicker">Oh, hey. We’re</span><h1>ODDLY<br/><em>STUDIO!</em></h1><p>MOTION DESIGN · VIDEO · STORYTELLING</p><div className="ev-creative-actions"><Button v={v} route="showreel">WATCH SHOWREEL</Button><Button v={v} route="explore">VIEW PROJECTS</Button></div><span className="ev-creative-scroll">SCROLL TO DISCOVER</span></div><CreativeCharacter/><Doodle type="spark" className="ev-doodle d1"/><Doodle type="arrow" className="ev-doodle d2"/><Doodle type="squiggle" className="ev-doodle d3"/></section>
  </div>
  <section className="ev-creative-showcase"><div><Doodle type="spark" className="ev-doodle"/><h2>THE SHOWREEL.</h2><p>A collection of moving ideas, characters and colourful experiments.</p><Button v={v} route="showreel">WATCH THE WORK</Button></div><Link className="ev-showcase-poster" to={href(v,'showreel')}><Image src={pics.editing} alt="Video motion design editing studio"/><span className="ev-video-play">PLAY</span></Link></section>
  <section className="ev-creative-projects"><div className="ev-section-row"><h2>FEATURED PROJECTS.</h2><Button v={v} route="explore">VIEW ALL</Button></div><div className="ev-project-grid">{[['FRAME BY FRAME','Animated brand story',pics.animation],['THE CREATOR CUT','Motion and editorial',pics.camera],['GOOD VIBRATIONS','Event identity and visuals',pics.festival],['THE LITTLE THINGS','Colourful social storytelling',pics.illustrator]].map(([title,cat,img],i)=><Link to={href(v,'item/'+eventOffers.minimal[i].id)} key={title}><Image src={img} alt={cat}/><span>{title}<small>{cat}</small></span></Link>)}</div></section>
  <section className="ev-creative-tools"><h2>WHAT WE LOVE.</h2><div>{['CHARACTER DESIGN','2D MOTION','ART DIRECTION','SHORT-FORM FILMS','ILLUSTRATION','VIDEO EDITING'].map(x=><span key={x}>{x}</span>)}</div></section>
  <section className="ev-creative-about"><div><Doodle type="star" className="ev-creative-about-doodle"/><h2>MAKE IDEAS<br/>HAPPEN.</h2></div><div><span>MEET THE STUDIO</span><h3>Small team. Loud imagination.</h3><p>We turn half-formed ideas into things you can actually see, hear and feel, from animated stories to playful live-event graphics.</p><Button v={v} route="about">MORE ABOUT US</Button></div></section>
  <section className="ev-creative-end"><h2>LET'S MAKE<br/>SOMETHING<br/><em>FUN.</em></h2><div><Button v={v} route="plan">START A PROJECT</Button><Doodle type="smile" className="ev-creative-smile"/></div></section><Disclaimer/>
 </main>
}
function Rainbow({className=''}){return <svg className={className} viewBox="0 0 1200 850" preserveAspectRatio="none" aria-hidden="true"><g fill="none" strokeLinecap="round"><path d="M-80 130C240 90 270 460 520 340S880 90 1180 170 1010 520 1270 700" stroke="#f0ac5d" strokeWidth="115"/><path d="M-80 130C240 90 270 460 520 340S880 90 1180 170 1010 520 1270 700" stroke="#f4c879" strokeWidth="88"/><path d="M-80 130C240 90 270 460 520 340S880 90 1180 170 1010 520 1270 700" stroke="#f08cb8" strokeWidth="65"/><path d="M-80 130C240 90 270 460 520 340S880 90 1180 170 1010 520 1270 700" stroke="#866ccf" strokeWidth="40"/><path d="M-80 130C240 90 270 460 520 340S880 90 1180 170 1010 520 1270 700" stroke="#f8e8cf" strokeWidth="16"/></g></svg>}
function Flower(){return <svg className="ev-fest-flower" aria-hidden="true" viewBox="0 0 230 230"><g fill="#fbf8e9" stroke="#171617" strokeWidth="5">{Array.from({length:9}).map((_,i)=><ellipse key={i} cx="115" cy="53" rx="23" ry="49" transform={'rotate('+i*40+' 115 115)'}/>)}</g><circle cx="115" cy="115" r="38" fill="#ffcb60" stroke="#111" strokeWidth="6"/><g fill="#111"><circle cx="101" cy="108" r="5"/><circle cx="130" cy="108" r="5"/></g><path d="M101 125q13 12 27-1" fill="none" stroke="#111" strokeWidth="5"/></svg>}
function Festival(){
 const v='playful'
 return <main className="ev-fest-home">
  <div className="ev-fest-strip">A LITTLE MAGIC GOES A LONG WAY <span>·</span> GOOD COMPANY, GREAT IDEAS <span>·</span> CREATE MORE TOGETHER <span>·</span> DECEMBER IN LAGOS</div>
  <div className="ev-fest-dark"><Header variant={v}/><section className="ev-fest-hero"><Rainbow className="ev-fest-rainbow"/>
   <div className="ev-fest-date"><span>THE CREATIVE WEEKEND</span><strong>19–20 DECEMBER 2026<br/>LAGOS, NIGERIA</strong></div><h1>MAKE ROOM<br/><em>FOR WONDER.</em></h1><Button v={v} route="plan">DISCOVER YOUR PASS</Button><div className="ev-fest-hero-note"><p>Good ideas. Better company. Very unexpected things.</p><span>CREATIVE PEOPLE / ALL WELCOME</span></div><Flower/><Doodle type="spark" className="ev-doodle ev-fest-smallstar"/><Doodle type="squiggle" className="ev-doodle ev-fest-smallcurve"/></section></div>
  <section className="ev-fest-cream"><div className="ev-fest-pipe"><svg viewBox="0 0 1000 330" preserveAspectRatio="none" aria-hidden="true"><path d="M0 94H270q65 0 65 65v25q0 56 56 56h240q54 0 54-54V95q0-54 54-54h260" fill="none" stroke="#181515" strokeWidth="12" strokeLinejoin="round"/><path d="M0 94H270q65 0 65 65v25q0 56 56 56h240q54 0 54-54V95q0-54 54-54h260" fill="none" stroke="#fbf5e7" strokeWidth="7" strokeLinejoin="round"/><circle cx="334" cy="179" r="25" fill="#f1ac59" stroke="#111" strokeWidth="6"/><circle cx="684" cy="82" r="25" fill="#94c6f3" stroke="#111" strokeWidth="6"/></svg></div>
   <span>02 / BRING YOUR CURIOSITY</span><h2>IDEAS, MAKERS<br/>& A LITTLE <em>MAGIC.</em></h2><p>Two days of hands-on workshops, ideas that stick and people who make ordinary things feel extraordinary.</p><Button v={v} route="explore">EXPLORE THE WORKSHOPS</Button>
   <div className="ev-fest-session-cards">{[['MAKE A LITTLE MOVIE',pics.camera],['THE ART OF THE STORY',pics.notebooks],['DESIGN SOMETHING FUN',pics.illustrator]].map(([title,img],i)=><Link to={href(v,'explore')} key={title}><Image src={img} alt={title}/><span>0{i+1} / HANDS-ON LAB</span><h3>{title}</h3></Link>)}</div>
  </section>
  <section className="ev-fest-agenda"><span>03 / THE VERY GOOD PLAN</span><h2>A PROGRAMME<br/>FULL OF SURPRISES.</h2><div>{[['DAY 01','Ideas meet people','Talks, introductions, collaborative making.'],['DAY 02','People make things','Experiments, demos, workshops and showcases.']].map(([day,title,desc])=><article key={day}><span>{day}</span><h3>{title}</h3><p>{desc}</p><Button v={v} route="agenda">SEE DETAILS</Button></article>)}</div></section>
  <section className="ev-fest-people"><span>04 / MEET THE DREAMERS</span><h2>GOOD PEOPLE MAKE<br/>GREAT THINGS.</h2><Collage items={[pics.speakerWoman,pics.speakerMan,pics.speakerGirl,pics.speaker]} altPrefix="Illustrative creative speaker portrait"/><Button v={v} route="speakers">MEET THE PEOPLE</Button></section>
  <section className="ev-fest-purple"><span>OUR CREATIVE COMMUNITY</span><h2>IMAGINATION IS<br/>BETTER SHARED.</h2><div>{['STUDIO 01','THE MAKERS ROOM','AFTER HOURS','IDEA CLUB','NEW PEOPLE'].map(x=><b key={x}>{x}</b>)}</div></section>
  <section className="ev-fest-tickets"><span>COME AND BE PART OF IT</span><h2>CHOOSE YOUR<br/><em>WAY IN.</em></h2><div>{[['DAY PASS','₦12,000','A whole day of creativity'],['WEEKEND PASS','₦20,000','Both days of ideas and good company'],['MAKER PASS','₦28,000','Weekend entry plus workshop request']].map(([name,price,text],i)=><article key={name}><span>0{i+1}</span><h3>{name}</h3><strong>{price}</strong><p>{text}</p><Button v={v} route="plan">PREVIEW PASS</Button></article>)}</div></section>
  <section className="ev-fest-end"><Rainbow className="ev-fest-bottom-rainbow"/><h2>COME CURIOUS.<br/>LEAVE INSPIRED.</h2><Button v={v} route="contact">TALK TO US</Button></section><Disclaimer/>
 </main>
}
const photosByVariant={
 editorial:[pics.keynote,pics.panel,pics.workshop,pics.crowd,pics.creators,pics.session],
 catalogue:[pics.shirt,pics.apparel,pics.fabric,pics.merchday,pics.friends,pics.apparel2],
 minimal:[pics.camera,pics.editing,pics.animation,pics.illustrator,pics.maker,pics.studio],
 playful:[pics.friends,pics.notebooks,pics.illustrator,pics.session,pics.festival,pics.creators]
}
function Inner({variant}){
 const c=word(variant),location=useLocation(),segment=location.pathname.slice(base(variant).length).replace(/^\/+/,'')
 const [section,id]=segment.split('/'),items=eventOffers[variant],visuals=photosByVariant[variant]
 const [filter,setFilter]=useState('All'),[saved,setSaved]=useState(false)
 const filtered=items.filter(p=>filter==='All'||p.category===filter)
 useEffect(()=>{document.title=(section==='item'?items.find(x=>x.id===id)?.title:section?section[0].toUpperCase()+section.slice(1):'Home')+' | '+c.brand+' | December Website Preview'},[segment,variant])
 if(!section)return <>{variant==='editorial'?<Conference/>:variant==='catalogue'?<Merch/>:variant==='minimal'?<Creative/>:<Festival/>}<Foot variant={variant}/></>;
 return <div className={'ev-inner ev-inner-'+variant}><Header variant={variant}/>{section==='explore'||section==='agenda'||section==='speakers'||section==='stories'||section==='showreel'?<main>
  <section className="ev-inner-banner"><div><span>{c.label} / THE EXPERIENCE</span><h1>{section==='agenda'?'THE GOOD PLAN.':section==='speakers'?'MEET THE PEOPLE.':section==='stories'?'OUR WORK SPEAKS.':section==='showreel'?'THINGS IN MOTION.':variant==='catalogue'?'BUILD A MOMENT.':variant==='minimal'?'WORK WORTH WATCHING.':'EXPLORE THE IDEAS.'}</h1><p>{section==='agenda'?'Follow the sessions, people and creative moments that shape the day.':section==='speakers'?'Illustrative speaker profiles. Real client sites can add verified credentials, images and talks.':section==='showreel'?'Browse our sample motion and film projects. There is no embedded playable reel in this demonstration.':'Every event and project has a story. Explore the example collections and request more information.'}</p><Button v={variant} route="plan">MAKE AN ENQUIRY</Button></div><Image src={visuals[0]} alt="Editorial photography for the selected creative site"/></section>
  {section==='speakers'?<section className="ev-inner-speakers"><h2>THE PEOPLE BEHIND THE IDEAS.</h2><div>{speakerNames.map((n,i)=><article key={n}><Image src={speakerPhotos[i%4]} alt={'Illustrative portrait for '+n}/><span>{String(i+1).padStart(2,'0')} / CREATIVE VOICE</span><h3>{n}</h3><p>{['Brand stories and culture','Design and experiences','Making meaningful content'][i%3]}</p></article>)}</div></section>
  :section==='agenda'?<section className="ev-inner-list"><h2>TWO DAYS. MANY GOOD MOMENTS.</h2>{[['10:00','OPENING SESSION','A first hello and welcome to the programme.'],['11:30','THE IDEAS PANEL','Thoughtful conversations with experienced makers.'],['13:30','OPEN STUDIO','A break to connect and explore the community.'],['15:00','THE MAKER LAB','Hands-on creative activities and guided sessions.']].map(([time,title,desc],i)=><article key={title}><span>{time}</span><h3>{title}</h3><p>{desc}</p><span>DAY {i<2?'01':'02'}</span></article>)}<Button v={variant} route="plan">PREVIEW YOUR REGISTRATION</Button></section>
  :<section className="ev-inner-projects"><div className="ev-inner-filters">{['All',...new Set(items.map(i=>i.category))].map(category=><button key={category} onClick={()=>setFilter(category)} className={filter===category?'active':''} aria-pressed={filter===category}>{category}</button>)}</div><div>{filtered.map((p,i)=><Link to={href(variant,'item/'+p.id)} key={p.id}><Image src={pics[p.imageKey]||visuals[(items.indexOf(p))%visuals.length]} alt={p.title+' illustrative case study photograph'}/><span>{p.category} / PROJECT {String(i+1).padStart(2,'0')}</span><h3>{p.title}</h3><p>{p.description}</p><strong>{money(p.price)} · EXAMPLE PACKAGE</strong></Link>)}</div></section>}
  <section className="ev-inner-next"><h2>LET’S MAKE THE NEXT<br/>ONE YOURS.</h2><Button v={variant} route="plan">START A CONVERSATION</Button></section><Disclaimer/>
 </main>:section==='item'?<Detail variant={variant} item={items.find(p=>p.id===id)} visuals={visuals}/>
 :section==='about'?<main><section className="ev-inner-banner"><div><span>WE BELIEVE IN THE LITTLE DETAILS</span><h1>GOOD IDEAS DESERVE A GOOD HOME.</h1><p>{c.tag} {c.hint} Every project starts with a conversation, grows through a thoughtful process and comes alive when people are part of it.</p><Button v={variant} route="explore">SEE WHAT WE DO</Button></div><Image src={visuals[2]} alt="Behind the scenes of an event or creative studio"/></section><section className="ev-inner-list"><h2>HOW WE BRING IDEAS TO LIFE.</h2>{[['01','DISCOVER','We begin with a brief, the audience and what success should feel like.'],['02','DESIGN','We develop a clear direction for the space, content and guest experience.'],['03','DELIVER','We bring the details together with real-time coordination and thoughtful follow-through.']].map(([n,t,body])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{body}</p></article>)}</section><div className="ev-inner-about-photos"><Image src={visuals[3]} alt="Creative process example"/><Image src={visuals[4]} alt="Team project imagery"/><Image src={visuals[5]} alt="Community and event imagery"/></div><Disclaimer/></main>
 :section==='plan'||section==='contact'?<Form variant={variant} type={section} images={visuals}/>
 :section==='faq'?<main className="ev-inner-faq"><span>YOUR QUESTIONS, ANSWERED</span><h1>THE DETAILS MATTER.</h1>{[['Are these events and prices real?','No. These are fictional demonstrations designed to show how the website could work for a real events or creative business.'],['Can I make a real purchase or booking?','Not here. The forms give a working preview, but no payment, booking or message is processed.'],['Can a business customise its own website?','Yes. Real brand imagery, offers, projects and verified details would replace the sample content.'],['Can I view all project details?','Yes. Open any card in the projects section to view the included services and example cost.']].map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</main>
 :<main className="ev-inner-missing"><h1>THAT PAGE ISN’T HERE.</h1><Button v={variant}>EXPLORE</Button></main>}
 <Foot variant={variant}/></div>
}
function Detail({variant,item,visuals}){
 if(!item)return <main className="ev-inner-missing"><h1>PROJECT NOT FOUND.</h1><Button v={variant}>BACK TO PROJECTS</Button></main>
 const idx=eventOffers[variant].indexOf(item)
 return <main className="ev-inner-detail"><div><Image src={pics[item.imageKey]||visuals[idx%visuals.length]} alt={item.title+' concept photography'}/></div><section><span>{item.category} / CONCEPT {String(idx+1).padStart(2,'0')}</span><h1>{item.title}</h1><p>{item.description}</p><strong>{money(item.price)} <small>ILLUSTRATIVE STARTING PACKAGE</small></strong><h2>WHAT’S IN THE EXPERIENCE</h2><ul>{(item.features||['Creative planning call','Project concept','Experience production']).map(x=><li key={x}>{x}</li>)}</ul><p>Every final package is designed around a business's actual needs, people, date, location and resources.</p><Button v={variant} route="plan">ENQUIRE ABOUT THIS PROJECT</Button></section></main>
}
function Form({variant,type,images}){
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[phone,setPhone]=useState(''),[kind,setKind]=useState(''),[message,setMessage]=useState(''),[sent,setSent]=useState(false)
 return <main className="ev-inner-form"><section><span>{word(variant).brand} / {type==='plan'?'PROJECT ENQUIRY':'LET’S TALK'}</span><h1>{type==='plan'?'LET’S MAKE IT HAPPEN.':'HELLO. GOOD TO MEET YOU.'}</h1><p>Tell us a little about the moment you want to create. This interactive form shows a complete client enquiry process without sending a real message.</p><Image src={images[2]} alt="Event planning and creative collaboration"/><span>WEBSITE SAMPLE / NO MESSAGE SENT</span></section><form onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<div className="ev-form-complete" role="status"><h2>EXAMPLE REQUEST RECEIVED.</h2><p>Thanks, {name}. In a real website, your business would receive the project brief and follow up through email or WhatsApp. No message was sent in this demonstration.</p><button type="button" onClick={()=>setSent(false)}>EDIT THE REQUEST</button></div>:<><h2>YOUR DETAILS.</h2><label>YOUR NAME<input value={name} onChange={e=>setName(e.target.value)} required autoComplete="name"/></label><label>EMAIL ADDRESS<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label><label>PHONE OR WHATSAPP<input value={phone} onChange={e=>setPhone(e.target.value)} required autoComplete="tel"/></label><label>YOUR INTEREST<select value={kind} onChange={e=>setKind(e.target.value)} required><option value="">Choose what fits your idea</option><option>Event registration</option><option>Creative direction</option><option>Brand activation</option><option>Production and coverage</option><option>Workshop participation</option></select></label><label>WHAT DO YOU HAVE IN MIND?<textarea rows={5} required value={message} onChange={e=>setMessage(e.target.value)} placeholder="Describe your event, occasion, desired date or creative project."/></label><button type="submit">PREVIEW MY ENQUIRY <Arrow/></button><small>Submitting only changes this demonstration. No actual bookings, transactions or messages occur.</small></>}</form></main>
}
export default function EventsReferenceStorefront({variant='editorial'}){
 const v=Object.prototype.hasOwnProperty.call(variants,variant)?variant:'editorial'
 return <div className={'ev-site ev-'+v}><Inner variant={v}/></div>
}
