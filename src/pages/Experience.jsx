import { useEffect, useRef, useState } from 'react'

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
    note: "Hosting a full series of fireside conversations at Nigeria's flagship NFT gathering.",
    images: [
      "/experience-moments/nft-ng-2025-01.webp",
      "/experience-moments/nft-ng-2025-02.webp",
      "/experience-moments/nft-ng-2025-03.webp",
      "/experience-moments/nft-ng-2025-04.webp",
      "/experience-moments/nft-ng-2025-05.webp",
    ],
    link: "https://x.com/nft__ng/status/1972617355198107941",
  },
  {
    label: "FIRESIDE CHAT HOST",
    title: "NFT NG 2026",
    note: "Hosting a fireside conversation on the Building the Future Stack stage.",
    images: ["/experience-moments/nft-ng-2026-01.webp", "/experience-moments/nft-ng-2026-02.webp"],
    link: "https://x.com/qingthecreator_/status/2085669295867011168?s=46",
  },
]

export default function Experience() {
  const [active, setActive] = useState(0)
  const [openMoment, setOpenMoment] = useState(null)
  const [openImage, setOpenImage] = useState(0)
  const touchStart = useRef(null)
  const selectNext = () => setActive(current => (current + 1) % awards.length)
  const selected = awards[active]
  const gallery = openMoment === null ? null : selectedMoments[openMoment]
  const showGallery = index => { setOpenMoment(index); setOpenImage(0) }
  const stepImage = direction => setOpenImage(current => (current + direction + gallery.images.length) % gallery.images.length)

  useEffect(() => {
    if (openMoment === null) return undefined
    const closeOnEscape = event => { if (event.key === 'Escape') setOpenMoment(null) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [openMoment])
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
        <div className="editorial-moment-board" aria-label="Experience photo board">
          {selectedMoments.map((item, eventIndex) => (
            <button className="editorial-moment-pin" type="button" onClick={() => showGallery(eventIndex)} key={item.title} aria-label={`Open ${item.title} photo gallery`}>
              <figure>
              <img src={item.images[0]} alt={`${item.title} gallery cover`} loading="lazy" />
              <figcaption>
                <span>{String(eventIndex + 1).padStart(2, '0')} · {item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
                <b>{String(item.images.length).padStart(2, '0')} {item.images.length === 1 ? 'photo' : 'photos'} · Open gallery ↗</b>
              </figcaption>
              </figure>
            </button>
          ))}
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
      {gallery && <div className="editorial-gallery-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setOpenMoment(null) }}>
        <section className="editorial-gallery-modal" role="dialog" aria-modal="true" aria-label={`${gallery.title} photo gallery`}>
          <button className="editorial-gallery-close" type="button" onClick={() => setOpenMoment(null)} aria-label="Close gallery">×</button>
          <div className="editorial-gallery-media">
            <img src={gallery.images[openImage]} alt={`${gallery.title}, photograph ${openImage + 1} of ${gallery.images.length}`} />
            {gallery.images.length > 1 && <>
              <button className="editorial-gallery-arrow is-previous" type="button" onClick={() => stepImage(-1)} aria-label="Previous photograph">←</button>
              <button className="editorial-gallery-arrow is-next" type="button" onClick={() => stepImage(1)} aria-label="Next photograph">→</button>
            </>}
          </div>
          <div className="editorial-gallery-details">
            <span>{String(openMoment + 1).padStart(2, '0')} · {gallery.label}</span>
            <h2>{gallery.title}</h2>
            <p>{gallery.note}</p>
            <strong>{String(openImage + 1).padStart(2, '0')} / {String(gallery.images.length).padStart(2, '0')}</strong>
            {gallery.link && <a href={gallery.link} target="_blank" rel="noopener noreferrer">View original post ↗</a>}
            {gallery.images.length > 1 && <div className="editorial-gallery-thumbnails" aria-label="Choose a photograph">
              {gallery.images.map((image, imageIndex) => <button type="button" key={image} className={imageIndex === openImage ? 'is-active' : ''} onClick={() => setOpenImage(imageIndex)} aria-label={`Show photograph ${imageIndex + 1}`} aria-pressed={imageIndex === openImage}>
                <img src={image} alt="" />
              </button>)}
            </div>}
          </div>
        </section>
      </div>}
    </div>
  )
}
