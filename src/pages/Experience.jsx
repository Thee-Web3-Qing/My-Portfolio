
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
  { title: "Web3 Creator of the Year 2025", organizer: "Onchain Fest Awards", link: "https://x.com/onchainfestival/status/1993585219010458081", year: "2025" },
  { title: "Web3 Nigeria Creative of the Year 2025", organizer: "Web3 Nigeria Awards", link: "https://x.com/web3nigeria/status/2014977975410655486", year: "2025" },
  { title: "Content Creator of the Year 2024", organizer: "DeFi Tigers", link: "https://x.com/cwembassy/status/1874712672622481887", year: "2024" },
  { title: "Content Creator of the Year 2023", organizer: "DeFi Tigers", link: "https://x.com/cwembassy/status/1736740698647298368", year: "2023" },
]

export default function Experience() {
  return (
    <div className="editorial-experience">
      <header className="editorial-experience-hero">
        <p className="editorial-kicker">THE WORK. THE PEOPLE. THE RECOGNITION.</p>
        <h1>Experience worth <em>remembering.</em></h1>
        <p>From hosting conversations and building communities to creating stories recognised across Web3.</p>
        <a href="#recognition" className="editorial-experience-link">Explore the recognition ↘</a>
      </header>
      <section id="recognition" className="editorial-experience-section">
        <div className="editorial-experience-heading"><span>01 / RECOGNITION</span><h2>Awards & <em>recognition.</em></h2></div>
        <div className="editorial-awards-grid">
          {awards.map((award, index) => (
            <a key={award.link} className="editorial-award" href={award.link} target="_blank" rel="noopener noreferrer">
              <div className="editorial-award-top"><span>{String(index + 1).padStart(2, '0')} / {award.organizer}</span><span>{award.year} ↗</span></div>
              <div className="editorial-award-art" aria-hidden="true"><span>{award.year}</span><strong>WINNER<span>.</span></strong><small>{award.organizer}</small></div>
              <h3>{award.title}</h3>
              <span className="editorial-award-action">View original announcement ↗</span>
            </a>
          ))}
        </div>
        <p className="editorial-experience-note">Original award artwork can be added to these cards when the image files are available in the repository.</p>
      </section>
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
}
