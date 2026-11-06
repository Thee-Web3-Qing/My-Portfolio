import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const WHATSAPP_URL = 'https://askbookie.xyz/store/qingthecreator'

const projects = [
  { number: '01', title: 'Bookie', type: 'AI receptionist', copy: 'Booking conversations that feel human.', link: 'https://askbookie.xyz/', image: '/project-thumbs/bookie-interface.webp' },
  { number: '02', title: 'Man of Ubuntu', type: 'Education platform', copy: 'Community, culture and opportunity.', link: 'https://manofubuntu.org/', image: '/project-thumbs/ubuntu-interface.webp' },
  { number: '03', title: 'Dragon Universe', type: 'Creative technology', copy: 'Strategy, creativity and technology for brand growth.', link: 'https://www.thedragonuniverse.io/', livePreview: true },
  { number: '04', title: 'Gigga', type: 'Student wallet', copy: 'Money tools made for student life.', link: 'https://get-gigga.vercel.app/', image: '/project-thumbs/gigga-interface.webp' },
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

function LiveProjectPreview({ url, title }) {
  const frame = useRef(null)
  const screen = useRef(null)

  useEffect(() => {
    if (!frame.current || !screen.current) return undefined

    const fitDesktopPreview = () => {
      const scale = screen.current.clientWidth / 1440
      frame.current.style.transform = `scale(${scale})`
    }

    fitDesktopPreview()
    const observer = new ResizeObserver(fitDesktopPreview)
    observer.observe(screen.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="editorial-project-visual" ref={screen}>
      <iframe
        ref={frame}
        src={url}
        title={`${title} website interface`}
        loading="lazy"
        width="1440"
        height="1060"
        tabIndex="-1"
        aria-hidden="true"
      />
    </div>
  )
}

export default function Home() {
  return (
    <div className="portfolio-home editorial-home">
      <section className="editorial-hero">
        <div className="editorial-hero-copy">
          <p className="editorial-eyebrow"><span /> Creative developer &amp; designer</p>
          <h1>Qing builds ideas<br />people <em>remember.</em></h1>
          <p className="editorial-intro">Digital products, brands and experiences<br />{' '}with real people at the centre.</p>
          <div className="editorial-actions">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="editorial-primary">Book a project <Arrow /></a>
            <Link to="/products" className="editorial-secondary">See my work <Arrow /></Link>
          </div>
        </div>

        <div className="editorial-portrait-wrap" aria-label="Portrait of Qing">
          <span className="editorial-orbit orbit-one" />
          <span className="editorial-orbit orbit-two" />
          <span className="editorial-orbit-dot dot-one" />
          <span className="editorial-orbit-dot dot-two" />
          <span className="editorial-spark">✦</span>
          <div className="editorial-grid" />
          <img src="/qing-studio-cutout.webp" alt="Qing, creative developer and storyteller" />
          <p className="editorial-note">Ideas.<br />Products.<br />Stories.</p>
        </div>

        <div className="editorial-scroll" aria-hidden="true"><span>Scroll</span><i /></div>
      </section>

      <section className="editorial-section editorial-builds">
        <div className="editorial-section-head">
          <div><h2>Selected builds</h2></div>
          <Link to="/products">View all projects <Arrow /></Link>
        </div>
        <div className="editorial-project-grid">
          {projects.map((project) => (
            <a key={project.title} href={project.link} target="_blank" rel="noreferrer" className="editorial-project-card">
              {project.livePreview ? (
                <LiveProjectPreview url={project.link} title={project.title} />
              ) : (
                <div className="editorial-project-visual">
                  <img src={project.image} alt={`${project.title} website interface`} loading="lazy" />
                </div>
              )}
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
