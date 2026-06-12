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
    desc: "Hosted live Web3 conversations with 80K+ attendees. Daily spaces across DeFi, gaming, and ecosystem events.",
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
  "Web3 Creator of the Year 2025 - Onchain Fest Awards",
  "Web3 Nigeria Creative of the Year 2025",
  "Content Creator of the Year 2024 - DeFi Tigers",
  "Content Creator of the Year 2023 - DeFi Tigers",
  "Base Storyteller - Sponsored to BFF Kenya representing African creators",
]
export default function Experience() {
  return (
    <div className="pt-12 pb-24">
      <p className="font-mono text-xs uppercase tracking-widest text-electric mb-3">
        Track Record
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-16">
        Experience & Awards
      </h1>
      <section className="mb-20">
        <h2 className="font-display text-2xl font-bold mb-6">
          Awards & Recognition
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {awards.map((award, index) => (
            <div
              key={index}
              className="noise-card border border-ink rounded-blob p-5 bg-white/60"
            >
              <span className="font-mono text-xs uppercase text-coral">
                Award
              </span>
              <p className="font-display text-lg font-bold mt-2">
                {award}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-20">
        <h2 className="font-display text-2xl font-bold mb-6">
          Roles & Positions
        </h2>
        <div className="space-y-6">
          {roles.map((role, index) => (
            <div
              key={index}
              className="grid sm:grid-cols-[140px_1fr] gap-4 border-t border-line pt-6"
            >
              <span className="font-mono text-xs uppercase text-mid">
                {role.period}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold">
                  {role.title}
                  <span className="text-mid font-body font-normal">
                    {" "} - {role.org}
                  </span>
                </h3>
                <p className="text-sm text-mid mt-1">
                  {role.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold mb-6">
          Events Hosted & Convened
        </h2>
        <div className="space-y-6">
          {events.map((event, index) => (
            <a
              key={index}
              href={event.link}
              target="_blank"
              rel="noreferrer"
              className="grid sm:grid-cols-[140px_1fr] gap-4 border-t border-line pt-6 group hover:text-electric transition-colors"
            >
              <span className="font-mono text-xs uppercase text-coral">
                {event.role} - {event.date}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold group-hover:underline">
                  {event.name}
                </h3>
                <p className="text-sm text-mid mt-1">
                  {event.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}