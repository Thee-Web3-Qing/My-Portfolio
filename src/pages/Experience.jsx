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
const awards = [
  { title: "Web3 Creator of the Year", organizer: "Onchain Fest Awards", link: "https://x.com/onchainfestival/status/1993585219010458081", image: "/experience-awards/onchainfest-2025.jpg", year: "2025", description: "Recognised for creative storytelling and impact across the African Web3 community.", accent: "#34110e" },
  { title: "Creator of the Year", organizer: "Web3 Nigeria Awards", link: "https://x.com/web3nigeria/status/2014977975410655486", image: "/experience-awards/web3-nigeria-2025.jpg", year: "2025", description: "Recognised for leading creative communities, mentoring emerging creators and making African blockchain innovation easier to understand.", accent: "#254532" },
  { title: "Content Creator of the Year", organizer: "DeFi Tigers", link: "https://x.com/cwembassy/status/1874712672622481887", image: "/experience-awards/defi-tigers-2024.jpg", year: "2024", description: "Celebrated for creativity, dedication and a distinctive voice in the Web3 space.", accent: "#58391b" },
  { title: "Content Creator of the Year", organizer: "DeFi Tigers", link: "https://x.com/cwembassy/status/1736740698647298368", image: "/experience-awards/defi-tigers-2023.jpg", year: "2023", description: "Recognised for content that inspired others to explore decentralized platforms and helped bring the Web3 community together.", accent: "#262026" },
]

const selectedMoments = [
  {
    label: "RED CARPET HOST",
    title: "Blockfest Africa 2026",
    note: "Hosting conversations and meeting the people shaping the ecosystem.",
    images: ["/experience-moments/blockfest-2026.webp"],
    link: "https://x.com/qingthecreator_/status/2113533061262631181?s=46",
  },
  {
    label: "PRODUCT PITCH / KENYA",
    title: "Pitching Zortal",
    note: "Presenting a gamified prediction layer for creator coins in Kenya.",
    images: ["/experience-moments/kenya-based-founders.webp", "/experience-moments/kenya-product-pitch.webp"],
    link: "https://x.com/qingthecreator_/status/1980672270486884673?s=46",
  },
  {
    label: "CHIEF HOST",
    title: "Technova",
    note: "Leading the room and moderating conversations about technology, innovation and opportunity.",
    images: ["/experience-moments/technova-stage.webp", "/experience-moments/technova-panel.webp"],
    layout: "stack",
    link: "https://x.com/qingthecreator_/status/2033109218811670897",
  },
  {
    label: "HOST",
    title: "Blockfest Africa 2025",
    note: "Representing culture and community at one of Africa's major blockchain gatherings.",
    images: ["/experience-moments/blockfest-2025.webp"],
    link: "https://x.com/qingthecreator_/status/1977276685977313536",
  },
  {
    label: "FOUNDER",
    title: "CTNG House",
    note: "Building a home for creators and hackers, then taking its conversations live.",
    images: ["/experience-moments/ctng-house-live.webp", "/experience-moments/ctng-house-founder.webp"],
    layout: "pair",
  },
  {
    label: "ON STAGE / UNILAG",
    title: "UNILAG Dream × Konoha Financial Conference",
    note: "Bringing the programme to life from the stage at UNILAG.",
    images: ["/experience-moments/konoha-solo.webp", "/experience-moments/konoha-stage.webp"],
    layout: "pair",
    link: "https://x.com/qingthecreator_/status/1994823171728707780?s=46",
  },
  {
    label: "CONVENER",
    title: "The Sunset Experience",
    note: "Convening an intimate gathering where creators and builders could connect, exchange ideas and find community.",
    images: ["/experience-moments/sunset-convener.webp", "/experience-moments/sunset-community.webp"],
    link: "https://x.com/qingthecreator_/status/2064391631457989092",
  },
  {
    label: "CO-HOST / CAMPUS",
    title: "BIU 2024",
    note: "Bringing builders, students and the campus ecosystem together through conversation and community.",
    images: ["/experience-moments/biu-2024.webp", "/experience-moments/biu-stage.webp"],
    link: "https://x.com/qingthecreator_/status/1857424416700829791",
  },
  {
    label: "HOST / MODERATOR",
    title: "NFT NG 2025",
    note: "Moderating a fireside conversation at Nigeria's flagship NFT gathering.",
    images: ["/experience-moments/nft-ng-2025.webp"],
    link: "https://x.com/nft__ng/status/1972617355198107941",
  },
]

export default function Experience() {
  const [active, setActive] = useState(0)
  const [activeMoment, setActiveMoment] = useState(0)
  const [activeMomentImage, setActiveMomentImage] = useState(0)
  const touchStart = useRef(null)
  const momentTouchStart = useRef(null)
  const selectNext = () => setActive(current => (current + 1) % awards.length)
  const selected = awards[active]
  const moment = selectedMoments[activeMoment]
  const showMoment = direction => {
    setActiveMoment(current => (current + direction + selectedMoments.length) % selectedMoments.length)
    setActiveMomentImage(0)
  }
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
              <img src={award.image} alt={`${award.title}, ${award.organizer} ${award.year}`} loading={offset > 1 ? 'lazy' : 'eager'} />
              <span className="editorial-award-stack-label">{award.organizer} · {award.year}</span>
            </button>
          })}
        </div>
      </header>
      <section className="editorial-experience-section editorial-moments-section">
        <div className="editorial-experience-heading"><span>02 / SELECTED MOMENTS</span><h2>Proof I was <em>in the room.</em></h2></div>
        <div className="editorial-moment-showcase"
          onTouchStart={event => { momentTouchStart.current = event.touches[0].clientX }}
          onTouchEnd={event => { if (momentTouchStart.current !== null && Math.abs(event.changedTouches[0].clientX - momentTouchStart.current) > 45) showMoment(event.changedTouches[0].clientX < momentTouchStart.current ? 1 : -1); momentTouchStart.current = null }}>
          <div className="editorial-moment-stage-media" key={`${moment.title}-media`}>
            <img src={moment.images[activeMomentImage]} alt={`${moment.title}${moment.images.length > 1 ? `, photograph ${activeMomentImage + 1} of ${moment.images.length}` : ''}`} />
            {moment.images.length > 1 && <span className="editorial-moment-image-count">{String(activeMomentImage + 1).padStart(2, '0')} / {String(moment.images.length).padStart(2, '0')}</span>}
          </div>
          <div className="editorial-moment-stage-copy" key={`${moment.title}-copy`}>
            <span>{String(activeMoment + 1).padStart(2, '0')} / {String(selectedMoments.length).padStart(2, '0')} · {moment.label}</span>
            <h3>{moment.title}</h3>
            <p>{moment.note}</p>
            {moment.images.length > 1 && <div className="editorial-moment-image-picker" aria-label={`${moment.title} photographs`}>
              {moment.images.map((image, imageIndex) => <button key={image} type="button" className={imageIndex === activeMomentImage ? 'is-active' : ''} onClick={() => setActiveMomentImage(imageIndex)} aria-label={`Show photograph ${imageIndex + 1} of ${moment.images.length}`} aria-pressed={imageIndex === activeMomentImage}>
                <img src={image} alt="" loading="lazy" />
                <span>{String(imageIndex + 1).padStart(2, '0')}</span>
              </button>)}
            </div>}
            {moment.link && <a href={moment.link} target="_blank" rel="noopener noreferrer">View the moment ↗</a>}
            <div className="editorial-moment-controls">
              <button type="button" onClick={() => showMoment(-1)} aria-label="Previous moment">←</button>
              <button type="button" onClick={() => showMoment(1)} aria-label="Next moment">→</button>
            </div>
          </div>
        </div>
        <div className="editorial-moment-rail" aria-label="Select an experience">
          {selectedMoments.map((item, index) => <button type="button" key={item.title} className={index === activeMoment ? 'is-active' : ''} onClick={() => { setActiveMoment(index); setActiveMomentImage(0) }} aria-pressed={index === activeMoment}>
            <img src={item.images[0]} alt="" loading="lazy" />
            <span>{String(index + 1).padStart(2, '0')} · {item.title}</span>
          </button>)}
        </div>
      </section>
      <section className="editorial-experience-section">
        <div className="editorial-experience-heading"><span>03 / CAREER</span><h2>The work behind <em>the work.</em></h2></div>
        <div className="editorial-experience-rows">
          {roles.map((role, index) => <article className="editorial-experience-row" key={index}>
            <span>{role.period}</span><div><h3>{role.title}</h3><strong>{role.org}</strong><p>{role.desc}</p></div><b>{String(index+1).padStart(2,'0')}</b>
          </article>)}
        </div>
      </section>
    </div>
  )
}
