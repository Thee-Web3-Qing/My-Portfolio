// Giwa's three content styles — from CV + X/portfolio
const channels = [
  {
    num: 'CH.01',
    name: 'Brand & Product Ambassadorships',
    desc: 'Videos for Web3 projects, products, and ecosystem brands.',
    pieces: [
      { 
        title: 'Morph Network — Content Ambassador Video',
        format: 'Brand Video',
        link: 'https://x.com/QingTheCreator_/status/2006329197287870488/video/1' 
      },
      { 
        title: 'Bayse — Product Showcase',
        format: 'Demo Video',
        link: 'https://x.com/QingTheCreator_/status/2030929573030809891/video/1' 
      },
      { 
        title: 'CatLumpurr — Project Spotlight',
        format: 'Project Video',
        link: 'https://x.com/QingTheCreator_/status/2008933035928932456/video/1' 
      },
    ],
  },
  {
    num: 'CH.02',
    name: 'Creative Productions & Pitches',
    desc: 'Films, fundraising videos, product pitches, and event content.',
    pieces: [
      { 
        title: 'Raising $10k for CTNG House — Fundraising Video',
        format: 'Fundraising',
        link: 'https://x.com/QingTheCreator_/status/1988223990289125553/video/1' 
      },
      { 
        title: 'Product Pitch Video',
        format: 'Pitch Deck',
        link: 'https://x.com/QingTheCreator_/status/1982442346403779040/video/1' 
      },
      { 
        title: 'Blockfest Event — Comic Promo',
        format: 'Event Promo',
        link: 'https://x.com/QingTheCreator_/status/1966467144951959643/video/1' 
      },
    ],
  },
  {
    num: 'CH.03',
    name: 'Project Breakdowns & Technical Storytelling',
    desc: 'Deep dives into Web3 protocols, tokenomics, and ecosystem projects.',
    pieces: [
      { 
        title: 'Story Protocol Overview Series', 
        format: 'Thread / Video', 
        link: 'https://x.com/qingthecreator_/status/1894456624615481682' 
      },
      { 
        title: 'Haven.World Overview — Bridging Web3 & Real World Assets', 
        format: 'Thread',
        link: 'https://x.com/qingthecreator_/status/1879828965864730626' 
      },
      { 
        title: 'Account Abstraction Explained — Simplifying the Future of Wallets', 
        format: 'Thread',
        link: 'https://x.com/qingthecreator_/status/1724422133621649452' 
      },
    ],
  },
]

export default function Content() {
  return (
    <div className="pt-12 pb-24">
      <p className="font-mono text-xs uppercase tracking-widest text-electric mb-3">
        Frequencies
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
        Three content channels.
      </h1>
      <p className="text-mid max-w-2xl mb-16">
        Project breakdowns. Creative films and music. Community education.
        Hosted on X (Twitter), YouTube, and in live spaces. Hover a channel to
        see the top 3 pieces.
      </p>

      <div className="space-y-20">
        {channels.map((ch) => (
          <div key={ch.num}>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-display text-3xl font-extrabold text-electric">{ch.num}</span>
              <div>
                <h2 className="font-display text-2xl font-bold">{ch.name}</h2>
                <p className="text-sm text-mid">{ch.desc}</p>
              </div>
            </div>

            <div className="channel-stack grid sm:grid-cols-3 gap-6 sm:gap-4">
              {ch.pieces.map((p, i) => (
                <a
                  key={i}
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="channel-card noise-card border border-ink rounded-blob p-6 bg-white/60 hover:shadow-[6px_6px_0_0_#16161D] block"
                >
                  <span className="font-mono text-xs uppercase text-mid">{p.format}</span>
                  <h3 className="font-display text-lg font-bold mt-2 mb-4">{p.title}</h3>
                  <span className="font-mono text-xs uppercase text-electric">View on X →</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}