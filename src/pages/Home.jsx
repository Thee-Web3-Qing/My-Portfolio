import { Link } from 'react-router-dom'
import StorefrontPreviewGallery from '../components/StorefrontPreviewGallery.jsx'
import './QingRecognitionHero.css'

const WHATSAPP_URL = 'https://askbookie.xyz/store/qingthecreator'

// Fixed desktop captures keep every selected-build card visually consistent on mobile.
const projects = [
  { number: '01', title: 'Bookie', type: 'AI receptionist', copy: 'Booking conversations that feel human.', link: 'https://askbookie.xyz/', image: '/project-thumbs/bookie-interface.webp' },
  { number: '02', title: 'Man of Ubuntu', type: 'Education platform', copy: 'Community, culture and opportunity.', link: 'https://manofubuntu.org/', image: '/project-thumbs/ubuntu-interface.webp' },
  { number: '03', title: 'Dragon Universe', type: 'Creative technology', copy: 'Strategy, creativity and technology for brand growth.', link: 'https://www.thedragonuniverse.io/', image: '/project-thumbs/dragon-universe-interface.webp' },
  { number: '04', title: 'Jacha Advisory', type: 'Finance and AI advisory', copy: 'Clearer financial decisions, practical learning and responsible AI.', link: 'https://jachaadvisory.com/', image: 'https://www.jachaadvisory.com/images/hero.png' },
  { number: '05', title: 'Tab', type: 'Shared spending', copy: 'Simple tools for real shared expenses.', link: 'https://clearyourtab.xyz/', image: '/project-thumbs/tab-interface.webp' },
]

const stories = [
  { slug: 'codexero', title: 'CodeXero', kicker: 'Product feature', image: '/content-thumbs/codexero.webp' },
  { slug: 'margin-trade', title: 'Margin Trade', kicker: 'Platform campaign', image: '/content-thumbs/margin-trade.webp' },
  { slug: 'ramphub', title: 'Ramphub', kicker: 'Product spotlight', image: '/content-thumbs/ramphub.webp' },
  { slug: 'clapmi', title: 'Clapmi', kicker: 'Brand video', image: '/content-thumbs/clapmi.webp' },
  { slug: 'vaqno', title: 'Vaqno + The Impossible Build', kicker: 'Builder story', image: '/content-thumbs/vaqno-livestream.webp' },
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

export default function Home() {
  return (
    <div className="portfolio-home editorial-home">
      <div className="editorial-december-banner" role="region" aria-label="December website sale">
        <div><span className="editorial-december-tag">THE DECEMBER EDIT 2026 ✳</span><p>Your brand deserves a beautiful place to sell this season. <strong>Websites from ₦100,000.</strong></p></div>
        <Link to="/december" className="editorial-december-button">December sales <span aria-hidden="true">↗</span></Link>
      </div>
      <section className="qing-recognition-hero" aria-labelledby="qing-hero-title">
        <div className="qing-recognition-stage">
          <h1 id="qing-hero-title" className="qing-recognition-sr">Qing builds ideas people remember.</h1>
          <picture className="qing-recognition-lettering" aria-hidden="true">
            <source media="(max-width: 820px)" srcSet="/qing-final-lettering-mobile.png" />
            <img src="/qing-final-lettering-desktop.png" alt="" fetchPriority="high" />
          </picture>
          <img className="qing-recognition-portrait" src="/qing-hero-balanced-portrait.png" alt="Qing in a white blazer with a blonde bob" width="1128" height="1394" fetchPriority="high" />
          <p className="qing-recognition-role">Creative developer &amp; designer</p>
          <p className="qing-recognition-product">AI product builder<span className="qing-recognition-desktop-dot"> · </span></p>
          <p className="qing-recognition-story">Storyteller</p>
          <p className="qing-recognition-founder">Founder, BountyPilot</p>
          <p className="qing-recognition-desktop-intro">Digital products, brands<br />and experiences.</p>
          <Link to="/products" className="qing-recognition-desktop-work">See my work <Arrow /></Link>
        </div>
        <div className="qing-recognition-mobile-footer">
          <p>Digital products, brands and experiences.</p>
          <div className="qing-recognition-mobile-actions">
            <Link to="/products">See my work <Arrow /></Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Book a project <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-builds">
        <div className="editorial-section-head">
          <div><h2>Selected builds</h2></div>
          <Link to="/products">View all projects <Arrow /></Link>
        </div>
        <div className="editorial-project-grid">
          {projects.map((project) => (
            <a key={project.title} href={project.link} target="_blank" rel="noreferrer" className="editorial-project-card">
              <div className="editorial-project-visual">
                <img src={project.image} alt={`${project.title} website interface`} loading="lazy" />
              </div>
              <div className="editorial-project-meta">
                <span>{project.number}</span>
                <span className="project-arrow"><Arrow /></span>
              </div>
              <h3>{project.title}</h3>
              <p className="editorial-project-type">{project.type}</p>
              <p>{project.copy}</p>
            </a>
          ))}
        </div>
      </section>

      <StorefrontPreviewGallery placement="home" />

      <section className="editorial-section editorial-stories">
        <div className="editorial-section-head">
          <div><p className="editorial-kicker">Top content videos</p><h2>Stories people <em>remember.</em></h2></div>
          <Link to="/content">Watch all videos <Arrow /></Link>
        </div>
        <div className="editorial-story-grid">
          {stories.map((story, index) => (
            <Link key={story.title} to={`/content?story=${story.slug}`} className="editorial-story-card">
              <img src={story.image} alt={`${story.title} video thumbnail`} loading="lazy" />
              <span className="story-index">0{index + 1}</span>
              <div className="story-copy"><p>{story.kicker}</p><h3>{story.title}</h3></div>
              <span className="story-play" aria-hidden="true">▶</span>
            </Link>
          ))}
        </div>
      </section>

      <aside className="editorial-credit">
        <span>Video editor</span>
        <p>Stories cut with <strong>ThenaiRL</strong></p>
        <a href="https://x.com/thenawave" target="_blank" rel="noreferrer">@thenawave <Arrow /></a>
      </aside>

      <section className="editorial-cta">
        <div><p>Have an idea worth building?</p><h2>Let’s make it real.</h2></div>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Start a project <Arrow /></a>
      </section>
    </div>
  )
}
