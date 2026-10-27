import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'

const channels = [
  {
    num: 'CH.01',
    name: 'Brand & Product Ambassadorships',
    desc: 'Videos for Web3 projects, ecosystem brands, wallets, campaigns, and product launches.',
    pieces: [
      {
        title: 'Morph Network - Content Ambassador Video',
        format: 'Brand Video',
        link: 'https://x.com/QingTheCreator_/status/2006329197287870488/video/1',
      },
      {
        title: 'OneKey Wallet Storytelling Promotion',
        format: 'Brand Promo',
        link: 'https://x.com/qingthecreator',
      },
      {
        title: 'Bitget Promotional Video',
        format: 'Brand Promo',
        link: 'https://x.com/qingthecreator/status/1815321091218309221?s=46',
      },
      {
        title: 'Bitgertbrise Contest Overview',
        format: 'Contest Overview',
        link: 'https://x.com/qingthecreator/status/1812907665393156398?s=46',
      },
      {
        title: 'Bayse - Product Showcase',
        format: 'Demo Video',
        link: 'https://x.com/QingTheCreator_/status/2030929573030809891/video/1',
      },
      {
        title: 'CatLumpurr - Project Spotlight',
        format: 'Project Video',
        link: 'https://x.com/QingTheCreator_/status/2008933035928932456/video/1',
      },
    ],
  },
  {
    num: 'CH.02',
    name: 'Educational & Creator-Focused Content',
    desc: 'Creator education, community management lessons, ideation systems, and content strategy.',
    pieces: [
      {
        title: 'Vibecoding Series 1',
        format: 'Vibecoding',
        link: 'https://x.com/QingTheCreator_/status/2079488973613773201/video/1?s=46',
      },
      {
        title: 'Vibecoding Series 2',
        format: 'Vibecoding',
        link: 'https://x.com/QingTheCreator_/status/2080589653208432655/video/1?s=46',
      },
      {
        title: 'Ideation Content on Time',
        format: 'Creator Education',
        link: 'https://x.com/qingthecreator/status/1892892146593591682?s=46',
      },
      {
        title: 'Community Management Education',
        format: 'Community Education',
        link: 'https://x.com/qingthecreator/status/1810239092975694200?s=46',
      },
      {
        title: 'Content Creation Tips for Creators',
        format: 'Creator Tips',
        link: 'https://x.com/qingthecreator/status/1780623483036197098?s=46',
      },
    ],
  },
  {
    num: 'CH.03',
    name: 'Analytical Discussions & Thought Leadership',
    desc: 'Protocol analysis, ecosystem takes, tokenomics breakdowns, and opinion-led Web3 essays.',
    pieces: [
      {
        title: 'RWA System Problems and Solutions',
        format: 'Analysis',
        link: 'https://x.com/qingthecreator/status/1844023287292068075?s=46',
      },
      {
        title: 'GameFi Economic Sustainability',
        format: 'GameFi',
        link: 'https://x.com/qingthecreator/status/1834568021748425014?s=46',
      },
      {
        title: 'Account Abstraction Explained',
        format: 'Explainer',
        link: 'https://x.com/qingthecreator/status/1724422133621649452?s=46',
      },
      {
        title: 'Tokenomics Breakdown - 0G Labs Feature',
        format: 'Tokenomics',
        link: 'https://x.com/qingthecreator/status/1904250650474516535?s=46',
      },
      {
        title: 'Airdrops Are Not Sustainable for Community Building',
        format: 'Opinion',
        link: 'https://x.com/msqinggg/status/1900823161383395340?s=46',
      },
    ],
  },
  {
    num: 'CH.04',
    name: 'Creative Productions',
    desc: 'Short films, documentaries, fundraising campaigns, pitch videos, and crypto culture stories.',
    pieces: [
      {
        title: 'Short Film - Why We Fell in Love with Crypto',
        format: 'Short Film',
        link: 'https://x.com/qingthecreator/status/1892865302578233531?s=46',
      },
      {
        title: 'Documentary - The Degen Throne',
        format: 'Documentary',
        link: 'https://x.com/qingthecreator/status/1837801974646944215?s=46',
      },
      {
        title: 'The Degen Throne on YouTube',
        format: 'YouTube',
        link: 'https://youtu.be/mjgcVDle2Wg?si=WqlNSPoOot9kpjR',
      },
      {
        title: 'Product Pitch Video',
        format: 'Pitch Video',
        link: 'https://x.com/QingTheCreator_/status/1982442346403779040/video/1',
      },
      {
        title: 'Raising $10k for CTNG House',
        format: 'Fundraising',
        link: 'https://x.com/QingTheCreator_/status/1988223990289125553/video/1',
      },
    ],
  },
  {
    num: 'CH.05',
    name: 'Music & Cultural Storytelling',
    desc: 'Songs, crypto culture tracks, contest entries, Web3 anthems, and narrative-led music.',
    pieces: [
      {
        title: 'Polygon Beef - Chain Roast Contest Song',
        format: 'Music',
        link: 'https://x.com/qingthecreator/status/1892170886712541632?s=46',
      },
      {
        title: 'Storyline Song on Stolen Capital',
        format: 'Music',
        link: 'https://x.com/qingthecreator/status/1890293012376453471?s=46',
      },
      {
        title: 'Everybody Wants a WL',
        format: 'Music',
        link: 'https://x.com/qingthecreator/status/1770872114834210891?s=46',
      },
      {
        title: 'Zulu Amapiano Web3 Track',
        format: 'Music',
        link: 'https://x.com/qingthecreator/status/1755891221476585963?s=46',
      },
      {
        title: 'AprilFull Promotional Song',
        format: 'Promo Song',
        link: 'https://x.com/qingthecreator/status/1753012771782865279?s=46',
      },
      {
        title: 'Ethereum Gas Fees Song',
        format: 'Music',
        link: 'https://x.com/qingthecreator/status/1751618571073982850?s=46',
      },
      {
        title: 'Solana Tribute Song',
        format: 'Music',
        link: 'https://x.com/qingthecreator/status/1740011981233594860?s=46',
      },
      {
        title: 'BTC Halving Song',
        format: 'Music',
        link: 'https://x.com/qingthecreator/status/1824127882366480799?s=46',
      },
    ],
  },
  {
    num: 'CH.06',
    name: 'Comics & Visual Storytelling',
    desc: 'Comic illustrations, visual explainers, campaign storytelling, and character-led Web3 content.',
    pieces: [
      {
        title: 'Union Build Comic Illustration',
        format: 'Comic',
        link: 'https://x.com/qingthecreator_/status/1922198581517185088?s=46',
      },
      {
        title: 'Wallchain Comic Illustration',
        format: 'Comic',
        link: 'https://x.com/qingthecreator_/status/1947258496916824132?s=46',
      },
      {
        title: 'Anoma Comic Illustration',
        format: 'Comic',
        link: 'https://x.com/qingthecreator_/status/1945423518511841706?s=46',
      },
      {
        title: 'Blockfest Event - Comic Promo',
        format: 'Comic Promo',
        link: 'https://x.com/QingTheCreator_/status/1966467144951959643/video/1',
      },
    ],
  },
  {
    num: 'CH.07',
    name: 'Creative Writing & Spoken Word',
    desc: 'Poetic Web3 writing, spoken-word pieces, emotional storytelling, and culture commentary.',
    pieces: [
      {
        title: 'Spoken Word - Web3 Liquidity Struggles',
        format: 'Spoken Word',
        link: 'https://x.com/qingthecreator/status/1758436848995615073?s=46',
      },
      {
        title: 'Blockchain Love Letter',
        format: 'Creative Writing',
        link: 'https://x.com/qingthecreator/status/1724868703542513897?s=46',
      },
    ],
  },
  {
    num: 'CH.08',
    featured: true,
    name: 'Web3 Product Campaigns & Platform Features',
    desc: 'Campaign videos, product features, and platform storytelling for emerging Web3 brands.',
    pieces: [
      {
        slug: 'codexero',
        title: 'CodeXero - Product Feature',
        format: 'Product Video',
        link: 'https://x.com/QingTheCreator_/status/2071183931710325103/video/1?s=46',
        thumbnail: '/content-thumbs/codexero.webp',
        caption: 'Most people will tell you what an AI builder can do. I wanted to see it for myself, hypothetically. So if I was to test CodeXero with a completely random idea like Founder Tinder, a platform where founders swipe startup ideas instead of people, I’d watch it go from a simple prompt to an interactive product. That was the interesting part. CodeXero is the builder. Cluster Protocol is the unified AI infrastructure powering it underneath. If you’ve got an idea sitting in your notes app, this is probably the fastest way to find out what it could become. Try it yourself: app.codexero.xyz. Built on @codexero_xyz. Powered by @clusterprotocol.',
      },
      {
        slug: 'margin-trade',
        title: 'Margin Trade - Trading Platform Campaign',
        format: 'Trading Platform',
        link: 'https://x.com/QingTheCreator_/status/2073869608415842416/video/1?s=46',
        thumbnail: '/content-thumbs/margin-trade.webp',
        caption: 'Earlier this year, I had about a million to hypothetically play with. I split it in half and it gave me an interesting outcome that led to a thought. What if the profit from one trade could help cushion the loss from another? Margin Trade brings crypto, stocks, and commodities into one cross-margin account, giving traders a more capital-efficient way to manage their positions onchain. I took a closer look at how it works. @margin_trade',
      },
      {
        slug: 'ramphub',
        title: 'Ramphub - Product Spotlight',
        format: 'Product Video',
        link: 'https://x.com/QingTheCreator_/status/2065842444415955061/video/1?s=46',
        thumbnail: '/content-thumbs/ramphub.webp',
        caption: 'Five years ago, a tin of sardines cost around ₦250. Today, some sell for over ₦1,700. But what’s even more interesting is that despite inflation, you’ll still find different prices in different stores for the exact same product. The cheapest option isn’t always the best option either. Sometimes they’re out of stock. Sometimes they’re unavailable. Sometimes they can’t fulfill what you need. And that’s exactly what buying and selling crypto can feel like. In this video, I break down how @ramphub is solving that problem by comparing multiple providers in real time, optimizing for both price and availability, and giving users access to deeper liquidity through a single platform. One KYC. Multiple providers. Smarter execution. Watch till the end and let me know if you’ve ever experienced this while off-ramping crypto.',
      },
      {
        slug: 'clapmi',
        title: 'Clapmi - Product Campaign',
        format: 'Brand Video',
        link: 'https://x.com/QingTheCreator_/status/2068302555482923351/video/1?s=46',
        thumbnail: '/content-thumbs/clapmi.webp',
        caption: 'Some days I want to build products. Some days I want to tell stories. Some days I want to make music. The problem isn’t finding something to create. The problem is finding a platform that grows with your creativity. That’s what caught my attention about @Clapmihq. A livestreaming platform on Solana where creators can go live, engage their communities, host competitions, and turn audiences into active participants. Whether you’re a builder, musician, educator, storyteller, or something completely different tomorrow, ClapMi gives you one place to create, compete, engage, and earn.',
      },
      {
        slug: 'vaqno',
        title: 'Vaqno, Free AI Models and The Impossible Build',
        format: 'Builder Story',
        link: 'https://x.com/QingTheCreator_/status/2111728996979503591?s=20',
        thumbnail: '/content-thumbs/vaqno-livestream.webp',
        caption: 'Yesterday, while building Vaqno, I needed an AI model to test websites and generate feedback, but I wasn’t ready to burn through API credits just experimenting. So I went looking for free models and found a whole catalogue on @Antseed, including Qwen, GLM, Nemotron, and coding models. They’re currently listed as FREE! 👀 Also, I’m hosting THE IMPOSSIBLE BUILD, a six-hour livestream where I’ll build a product from scratch, and YOU get to decide what I build. 🗳️ Vote here: theimpossiblebuild.vercel.app. Brands interested in being part of the livestream can send me a DM. And if you find my content useful, you can support me with a malt 🥹❤️',
      },
    ],
  },
]

export default function Content() {
  const [searchParams, setSearchParams] = useSearchParams()
  const featuredChannel = channels.find((channel) => channel.featured)
  const otherChannels = channels.filter((channel) => !channel.featured)
  const requestedStory = searchParams.get('story')
  const [selectedPiece, setSelectedPiece] = useState(
    () => featuredChannel.pieces.find((piece) => piece.slug === requestedStory) || null,
  )

  useEffect(() => {
    setSelectedPiece(featuredChannel.pieces.find((piece) => piece.slug === requestedStory) || null)
  }, [requestedStory, featuredChannel.pieces])

  const openStory = (piece) => {
    setSelectedPiece(piece)
    setSearchParams({ story: piece.slug })
  }

  const closeStory = () => {
    setSelectedPiece(null)
    setSearchParams({})
  }

  return (
    <div className="portfolio-content content-editorial animate-fadeUp">
      <header className="content-editorial-hero">
        <p>Content archive · 08 channels</p>
        <h1>Stories, ideas and<br /><em>internet culture.</em></h1>
        <div className="content-editorial-intro">
          <p>I make technical products understandable, useful ideas memorable, and internet stories worth sharing.</p>
          <span>Scroll to explore ↓</span>
        </div>
        <div className="content-hero-profiles" aria-label="Qing and ThenaiRL on X">
          <a href="https://x.com/QingTheCreator_" target="_blank" rel="noreferrer" className="content-profile-card content-profile-qing">
            <img src="/content-profiles/qing-x-profile.webp" alt="Qing's X profile" />
            <span>Creator · @QingTheCreator_</span>
          </a>
          <a href="https://x.com/thenawave" target="_blank" rel="noreferrer" className="content-profile-card content-profile-editor">
            <img src="/content-profiles/thenairl-x-profile.webp" alt="ThenaiRL's X profile" />
            <span>Editor · @thenawave</span>
          </a>
        </div>
      </header>

      <section className="content-featured">
        <div className="content-section-heading">
          <div><p>Top content videos</p><h2>Stories people remember.</h2></div>
          <span>01 — 05</span>
        </div>
        <div className="content-vertical-grid">
          {featuredChannel.pieces.map((piece, index) => (
            <button key={piece.title} type="button" onClick={() => openStory(piece)} className="content-vertical-card">
              <div className="content-vertical-media">
                <img src={piece.thumbnail} alt={`${piece.title} thumbnail`} loading={index > 1 ? 'lazy' : 'eager'} />
                <span className="content-vertical-number">0{index + 1}</span>
                <span className="content-vertical-play">▶</span>
              </div>
              <p>{piece.format}</p>
              <h3>{piece.title}</h3>
              {piece.caption && <p className="content-featured-caption">{piece.caption}</p>}
            </button>
          ))}
        </div>
      </section>

      <section className="content-channel-index">
        <div className="content-section-heading">
          <div><p>The archive</p><h2>Explore every channel.</h2></div>
          <span>Selected work across formats</span>
        </div>
        <div className="content-channel-list">
          {otherChannels.map((channel) => (
            <article key={channel.num} className="content-channel-row">
              <div className="content-channel-heading">
                <span>{channel.num}</span>
                <div><h2>{channel.name}</h2><p>{channel.desc}</p></div>
              </div>
              <div className="content-link-list">
                {channel.pieces.map((piece, index) => (
                  <a key={piece.title} href={piece.link} target="_blank" rel="noreferrer">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><p>{piece.format}</p><h3>{piece.title}</h3></div>
                    <b>↗</b>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedPiece && createPortal(
        <div className="content-detail-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeStory()}>
          <article className="content-detail-modal" role="dialog" aria-modal="true" aria-labelledby="content-detail-title">
            <button type="button" className="content-detail-close" onClick={closeStory} aria-label="Close content details">×</button>
            <div className="content-detail-layout">
              <img src={selectedPiece.thumbnail} alt={`${selectedPiece.title} thumbnail`} />
              <div className="content-detail-copy">
                <p>{selectedPiece.format}</p>
                <h2 id="content-detail-title">{selectedPiece.title}</h2>
                <div className="content-detail-caption">{selectedPiece.caption}</div>
                <a href={selectedPiece.link} target="_blank" rel="noreferrer">View original post <span>↗</span></a>
              </div>
            </div>
          </article>
        </div>,
        document.body,
      )}
    </div>
  )
}
