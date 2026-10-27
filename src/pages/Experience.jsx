import { useState, useRef } from 'react'

const roles = [
  {
    period: "2025 - Present",
    title: "Web3 Community Host & Creative Strategist",
    org: "Freelance / Multiple Projects",
    desc: "Leading Twitter Spaces, moderating conferences, and directing creative strategy for Web3 projects across Africa.",
  },
  {
    period: "2024 - 2025",
    title: "Founder - Creators & Hackers Residency Africa",
    org: "CTNG House",
    desc: "Built Africa's first Creators & Hackers Residency, bridging creative and technical communities.",
  },
  {
    period: "2024",
    title: "Primary Twitter Spaces Host",
    org: "Crypto Community",
    desc: "Hosted daily live Web3 conversations across DeFi, gaming, and ecosystem events, translating technical topics into accessible community discussions.",
  },
]
const events = [
  {
    role: "Chief Host",
    name: "Technova",
    date: "Jan 2025",
    desc: "Primary host for tech innovation event across Africa.",
    link: "https://x.com/qingthecreator_/status/2033109218811670897",
  },
  {
    role: "Convener",
    name: "The Sunset Experience",
    date: "Dec 2024",
    desc: "Founded an intimate gathering for creators and builders to connect and share ideas.",
    link: "https://x.com/qingthecreator_/status/2064391631457989092",
  },
  {
    role: "Host / Moderator",
    name: "NFT NG 2025 - Fireside Chat",
    date: "Nov 2024",
    desc: "Moderated fireside chat at Nigeria's flagship NFT conference.",
    link: "https://x.com/nft__ng/status/1972617355198107941",
  },
  {
    role: "Host",
    name: "Blockfest Africa 2025",
    date: "Jan 2025",
    desc: "Hosted sessions at Africa's major blockchain festival.",
    link: "https://x.com/qingthecreator_/status/1977276685977313536",
  },
  {
    role: "Co-Host",
    name: "BIU 2024 - Builder & Campus Ecosystem",
    date: "Sep 2024",
    desc: "Co-hosted builder and campus networking events.",
    link: "https://x.com/qingthecreator_/status/1857424416700829791",
  },
  {
    role: "Host / Moderator",
    name: "Bitget Africa Community Meet & Greet",
    date: "Aug 2024",
    desc: "Community engagement and moderation for Bitget Africa.",
    link: "https://x.com/bitgetafrica/status/1830573377150448000",
  },
]
const awards = [
  { title: "Web3 Creator of the Year", organizer: "Onchain Fest Awards", link: "https://x.com/onchainfestival/status/1993585219010458081", year: "2025", description: "Recognised for creative storytelling and impact across the African Web3 community.", accent: "#34110e" },
  { title: "Creator of the Year", organizer: "Web3 Nigeria Awards", link: "https://x.com/web3nigeria/status/2014977975410655486", year: "2025", description: "Recognised for leading creative communities, mentoring emerging creators and making African blockchain innovation easier to understand.", accent: "#254532" },
  { title: "Content Creator of the Year", organizer: "DeFi Tigers", link: "https://x.com/cwembassy/status/1874712672622481887", year: "2024", description: "Celebrated for creativity, dedication and a distinctive voice in the Web3 space.", accent: "#58391b" },
  { title: "Content Creator of the Year", organizer: "DeFi Tigers", link: "https://x.com/cwembassy/status/1736740698647298368", year: "2023", description: "Recognised for content that inspired others to explore decentralized platforms and helped bring the Web3 community together.", accent: "#262026" },
]

export default function Experience() {
  const [active, setActive] = useState(0)
  const touchStart = useRef(null)
  const selectNext = () => setActive(current => (current + 1) % awards.length)
  const selected = awards[active]
  return (
    <div className="editorial-experience">
      <header className="editorial-experience-hero editorial-award-showcase">
        <div className="editorial-award-copy" key={active}>
          <p className="editorial-kicker">THE WORK. THE PEOPLE. THE RECOGNITION. / {String(active + 1).padStart(2, '0')}</p>
          <h1>Experience worth <em>remembering.</em></h1>
          <p className="editorial-award-selected-year">{selected.year} / {selected.organizer}</p>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>
          <a className="editorial-experience-link" href={selected.link} target="_blank" rel="noopener noreferrer">View original announcement ↗</a>
          <div className="editorial-award-controls">
            <button type="button" onClick={() => setActive((active + awards.length - 1) % awards.length)} aria-label="Previous award">←</button>
            <span>{String(active + 1).padStart(2, '0')} / 04</span>
            <button type="button" onClick={selectNext} aria-label="Next award">→</button>
          </div>
        </div>
        <div className="editorial-award-stack" aria-label="Swipe or tap to browse awards"
          onTouchStart={event => { touchStart.current = event.touches[0].clientX }}
          onTouchEnd={event => { if (touchStart.current !== null && Math.abs(event.changedTouches[0].clientX - touchStart.current) > 35) { setActive(current => (current + (event.changedTouches[0].clientX < touchStart.current ? 1 : awards.length - 1)) % awards.length) } touchStart.current = null }}>
          {awards.map((award, index) => {
            const offset = (index - active + awards.length) % awards.length
            return <button key={award.link} type="button" className="editorial-award-stack-card"
              style={{ '--stack-index': offset, '--award-accent': award.accent, zIndex: awards.length - offset, transform: `translate(${offset * 11}%, ${offset * -4}%) rotate(${offset * 5 - 3}deg) scale(${1 - offset * .07})`, opacity: offset === 3 ? .72 : 1 }}
              onClick={() => offset === 0 ? selectNext() : setActive(index)} aria-label={`Show ${award.title} ${award.year}`}>
              <span className="editorial-award-stack-label">{award.organizer} · {award.year}</span>
              <strong>WINNER<span>.</span></strong>
              <span className="editorial-award-stack-title">{award.title}</span>
              <small>TAP TO EXPLORE ↗</small>
            </button>
          })}
        </div>
      </header>
      <section className="editorial-experience-section">
        <div className="editorial-experience-heading"><span>02 / CAREER</span><h2>The work behind <em>the work.</em></h2></div>
        <div className="editorial-experience-rows">
          {roles.map((role, index) => <article className="editorial-experience-row" key={index}>
            <span>{role.period}</span><div><h3>{role.title}</h3><strong>{role.org}</strong><p>{role.desc}</p></div><b>{String(index+1).padStart(2,'0')}</b>
          </article>)}
        </div>
      </section>
      <section className="editorial-experience-section">
        <div className="editorial-experience-heading"><span>03 / ON STAGE</span><h2>Rooms I've <em>been in.</em></h2></div>
        <div className="editorial-experience-rows">
          {events.map((event,index) => <a key={event.link} href={event.link} target="_blank" rel="noopener noreferrer" className="editorial-experience-row">
            <span>{event.date}<br />{event.role}</span><div><h3>{event.name} ↗</h3><p>{event.desc}</p></div><b>{String(index+1).padStart(2,'0')}</b>
          </a>)}
        </div>
      </section>
    </div>
  )
}      <section className="editorial-experience-section">
        <div className="editorial-experience-heading"><span>02 / CAREER</span><h2>The work behind <em>the work.</em></h2></div>
        <div className="editorial-experience-rows">
          {roles.map((role, index) => <article className="editorial-experience-row" key={index}>
            <span>{role.period}</span><div><h3>{role.title}</h3><strong>{role.org}</strong><p>{role.desc}</p></div><b>{String(index+1).padStart(2,'0')}</b>
          </article>)}
        </div>
      </section>
      <section className="editorial-experience-section">
        <div className="editorial-experience-heading"><span>03 / ON STAGE</span><h2>Rooms I've <em>been in.</em></h2></div>
        <div className="editorial-experience-rows">
          {events.map((event,index) => <a key={event.link} href={event.link} target="_blank" rel="noopener noreferrer" className="editorial-experience-row">
            <span>{event.date}<br />{event.role}</span><div><h3>{event.name} ↗</h3><p>{event.desc}</p></div><b>{String(index+1).padStart(2,'0')}</b>
          </a>)}
        </div>
      </section>
    </div>
  )
}
