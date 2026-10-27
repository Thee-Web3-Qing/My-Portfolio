import { Link } from 'react-router-dom'
  import { serviceList } from '../data/services'
  const offers = [
    {
      title: 'Creative Director',
      desc: 'I help shape the campaign, the story, the creative direction, and the reason people should care.',
      badge: 'Retainer / Project',
      subject: 'Creative Director inquiry',
    },
    {
      title: 'Content Ambassador',
      desc: 'I create educational content, threads, videos, explainers, and campaign stories that make your product easier to understand.',
      badge: 'Monthly / Campaign',
      subject: 'Content Ambassador inquiry',
    },
    {
      title: 'Creative Ambassador',
      desc: 'I represent your brand through content, culture, community engagement, events, music, and story-led campaigns.',
      badge: 'Partnership',
      subject: 'Creative Ambassador inquiry',
    },
    {
      title: 'Event or Twitter Space Host',
      desc: 'I host AMAs, panels, fireside chats, launches, ecosystem conversations, and live events people actually stay for.',
      badge: 'Per event',
      subject: 'Event Hosting inquiry',
    },
    {
      title: 'Hackathon Idea Partner',
      desc: 'I help teams sharpen the idea, pitch, story, product angle, demo flow, and final submission.',
      badge: 'Prize split / Team',
      subject: 'Hackathon inquiry',
    },
    {
      title: 'Website & Landing Page Builder',
      desc: 'I design and build responsive websites and high-converting landing pages for brands, businesses, campaigns, and product launches.',
      badge: 'Fixed fee / Scope',
      subject: 'Website or landing page inquiry',
    },
    {
      title: 'Product Builder',
      desc: 'I help build and shape MVPs, AI tools, landing pages, vibecoded products, and product narratives.',
      badge: 'Fixed fee / Scope',
      subject: 'Product Build inquiry',
    },
  ]
  const consultations = [
    {
      title: 'Project Creative Direction',
      price: '$300',
      desc: 'A pick-my-brain hour for founders and product builders who need positioning, storytelling, launch angles, or campaign direction from someone who has been in the trenches.',
      subject: 'Creative Direction session booking',
    },
    {
      title: 'Creative to Creative',
      price: '$30/hr',
      desc: 'For creators who need help with personal branding, content strategy, storytelling, and positioning your audience the right way.',
      subject: 'Creative consultation booking',
    },
    {
      title: 'Vibecoding Products',
      price: '$50/hr',
      desc: 'For builders using AI tools to ship MVPs, hackathon products, landing pages, or early-stage product ideas. I help you think clearer and move faster.',
      subject: 'Vibecoding session booking',
    },
  ]
  const contentPackages = [
    { term: 'Monthly', price: '$700', detail: '4 videos every month' },
    { term: '3 months', price: '$1,500', detail: '12 videos across three months', featured: true },
    { term: '6 months', price: '$2,800', detail: '24 videos across six months' },
  ]
  const BOOKING_URL = 'https://askbookie.xyz/store/qingthecreator'

  export default function Hire() {
    return (
      <div className="portfolio-hire hire-editorial animate-fadeUp">
        <header className="hire-editorial-hero">
          <p>Work with Qing</p>
          <h1>Bring me in when<br />the idea needs <em>fire.</em></h1>
          <div><p>I work with founders, creators, teams, and communities that need sharper stories, stronger content, and products people understand quickly.</p><span>Available worldwide · Remote</span></div>
          <aside className="hire-hero-system" aria-label="Strategy, story and product services">
            <div className="hire-hero-orbit"><i /><i /><i /></div>
            <p>From loose idea to<br /><strong>clear direction.</strong></p>
            <ol><li><span>01</span> Strategy</li><li><span>02</span> Story</li><li><span>03</span> Product</li></ol>
            <b>Let’s build something useful ↗</b>
          </aside>
        </header>
        <section className="hire-packages">
          <div className="hire-packages-intro">
            <p>Content packages</p>
            <h2>Consistent videos,<br />handled end to end.</h2>
            <span>I handle the research, scripting, and full production for every video.</span>
          </div>
          <div className="hire-package-grid">
            {contentPackages.map((contentPackage) => (
              <article key={contentPackage.term} className={contentPackage.featured ? 'hire-package-card is-featured' : 'hire-package-card'}>
                <p>{contentPackage.term}</p>
                <h3>{contentPackage.price}</h3>
                <span>{contentPackage.detail}</span>
                <ul><li>Research</li><li>Scripting</li><li>Full production</li></ul>
                <a href={BOOKING_URL} target="_blank" rel="noreferrer">Choose package ↗</a>
              </article>
            ))}
          </div>
        </section>
        <section className="hire-editorial-section">
          <div className="hire-section-heading"><p>Core services</p><h2>What I can do for you.</h2></div>
          <div className="hire-service-grid">
            {serviceList.map((service, index) => (
              <Link key={service.slug} to={`/services/${service.slug}`} className="hire-service-card">
                <span>0{index + 1}</span>
                <h3>{service.eyebrow}</h3>
                <p>{service.summary}</p>
                <b>View service ↗</b>
              </Link>
            ))}
          </div>
        </section>
        <section className="hire-editorial-section hire-roles-section">
          <div className="hire-section-heading"><p>Ways to work together</p><h2>Choose the role you need.</h2></div>
          <div className="hire-role-list">
          {offers.map((offer) => (
            <div
              key={offer.title}
              className="hire-role-row"
            >
              <span>{offer.badge}</span>
              <h3>{offer.title}</h3>
              <p>{offer.desc}</p>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer">
                Contact me ↗
              </a>
            </div>
          ))}
          </div>
        </section>
        <section className="hire-consultations">
          <div className="hire-section-heading"><p>Consultations</p><h2>Come with the problem.<br />Leave with a plan.</h2></div>
          <div className="hire-consult-grid">
            {consultations.map((session) => (
              <div
                key={session.title}
                className="hire-consult-card"
              >
                <p>{session.price}</p>
                <h3>{session.title}</h3>
                <span>{session.desc}</span>
                <a href={BOOKING_URL} target="_blank" rel="noreferrer">Book session ↗</a>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }
