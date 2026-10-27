import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

  const recentClientBuilds = [
    {
      name: "FastFlow",
      clientWanted: "A modern logistics website where staff could register parcels, generate unique tracking codes, record sender and receiver details, update each parcel’s location and status, notify both parties, and let customers follow deliveries without calling the company for every update.",
      delivered: "I designed and built a responsive logistics platform with a branded public website, no-account parcel tracking, complete delivery timelines, customer sign-in and parcel views, plus an admin workflow for parcel registration, search, sender and receiver records, status updates, and reusable notification templates.",
      tags: ["Logistics Platform", "Parcel Tracking", "Admin Dashboard"],
      status: "Live Client Build",
      links: {
        demo: "https://fastflow-web.vercel.app/",
        repo: null,
      },
    },
    {
      name: "Beauty by 3lle",
      clientWanted: "A polished beauty-brand website that could present skincare and makeup as one thoughtful collection, feel credible across different skin tones, and let customers explore products easily.",
      delivered: "I designed and built an editorial e-commerce demo with a responsive brand landing page, skincare and makeup collections, a filterable 30-product shop, individual product galleries and details, and clear paths into the full catalogue.",
      tags: ["Beauty E-commerce", "Product Catalogue", "Next.js"],
      status: "Live Demo",
      links: {
        demo: "https://beauty-by3ll3.vercel.app/",
        repo: "https://github.com/Thee-Web3-Qing/BeautyBy3ll3",
      },
    },
    {
      name: "The Author's Room",
      clientWanted: "An artsy author marketplace where readers and writers can create profiles, discover books, and use the platform from either a reader or author perspective.",
      delivered: "I designed and built a responsive marketplace prototype with role-based sign-up, reader and author dashboards, profile switching, book discovery, community features, and a Vercel-ready Next.js build.",
      tags: ["Marketplace Prototype", "Next.js", "Responsive Design"],
      status: "Prototype",
      links: {
        demo: "https://my-authors-room.vercel.app/",
        repo: "https://github.com/Thee-Web3-Qing/The-Authors-Room",
      },
    },
    {
      name: "Poysis",
      clientWanted: "A public-facing website that could move beyond a simple landing page and help people discover Poysis knowledge notebooks and understand the platform quickly.",
      delivered: "I turned the concept into a functional, mobile-friendly public directory with searchable notebook listings, categories, detail views, contributor submissions, and clear product positioning.",
      tags: ["Product Website", "Public Directory", "Next.js"],
      status: "Live",
      links: {
        demo: "https://poysis.vercel.app/",
        repo: "https://github.com/Thee-Web3-Qing/Poysis",
      },
    },
    {
      name: "Val Gadgets",
      clientWanted: "A modern gadget-store website that could showcase devices, support product discovery, and prepare the business for checkout, payments, orders, and an owner dashboard.",
      delivered: "I designed and built a responsive e-commerce storefront with product categories, search and filtering, product pages, a cart and checkout flow, and a structure prepared for Salesive payment and order-management integration.",
      tags: ["E-commerce Design", "Gadget Store", "Responsive UI"],
      status: "Live",
      links: {
        demo: "https://val-gadgets-one.vercel.app/",
        repo: "https://github.com/Thee-Web3-Qing/ValGadgets",
      },
    },
    {
      name: "Moment",
      clientWanted: "An event platform where people can discover events, buy tickets, vote or nominate talents, while organisers can market and manage their events from a dedicated dashboard.",
      delivered: "I created an expressive product landing experience for the first phase, with event discovery, ticketing, voting, nomination, and organiser-dashboard flows represented in a polished, responsive interface ready for Paystack integration.",
      tags: ["Event Platform", "Ticketing", "Product Design"],
      status: "First Build",
      links: {
        demo: "https://moment-blush.vercel.app/",
        repo: "https://github.com/Thee-Web3-Qing/Moment",
      },
    },
    {
      name: "22Energy",
      clientWanted: "A solar distributor landing page for households and companies that could explain high-capacity products, generate qualified enquiries, and support both individual and bulk buyers.",
      delivered: "I built a responsive solar sales website with a guided system-sizing calculator, inverter and battery catalogue, dealer and distributor pricing, WhatsApp quote handoff, bulk-order enquiries, and location and contact details.",
      tags: ["Solar Website", "Lead Generation", "Interactive Calculator"],
      status: "First Build",
      links: {
        demo: "https://22-energy-rho.vercel.app/",
        repo: "https://github.com/Thee-Web3-Qing/22Energy",
      },
    },
  ]

  function WebsitePreview({ url, title, image, interactive = false }) {
    if (!url) return null

    return (
      <div className={`products-browser${interactive ? ' is-interactive' : ''}`}>
        <div className="products-browser-bar">
          <span className="mac-dot mac-red" />
          <span className="mac-dot mac-yellow" />
          <span className="mac-dot mac-green" />
          <span className="products-browser-url">
            {url.replace(/^https?:\/\//, '')}
          </span>
          {interactive && <a className="products-browser-open" href={url} target="_blank" rel="noreferrer">Open site ↗</a>}
        </div>
        <div className="products-browser-screen">
          {image && !interactive ? (
            <img src={image} alt={`${title} website interface`} loading="lazy" />
          ) : (
            <iframe src={url} title={`${title} interactive website preview`} loading="lazy" width="1440" height="900" sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" />
          )}
        </div>
      </div>
    )
  }
  const products = [
    {
      name: 'Bookie',
      tagline: 'An AI receptionist for appointment-based businesses that answers customer questions, checks availability, handles booking conversations, and helps businesses manage enquiries without holding customer funds.',
      tags: ['AI Receptionist', 'Appointments', 'Business Automation'],
      status: 'Spotlight',
      spotlight: true,
      image: '/project-thumbs/bookie-interface.webp',
      links: {
        demo: 'https://askbookie.xyz/',
        repo: 'https://github.com/Thee-Web3-Qing/Askbookie',
      },
    },
    {
      name: 'Man of Ubuntu',
      tagline: 'A learning platform for boys in Kenya, with parent, guardian, and child journeys, structured programmes, academy access, and a growing library of guided educational content.',
      tags: ['Education Platform', 'Parent and Child Flows', 'Next.js'],
      status: 'Spotlight',
      spotlight: true,
      image: '/project-thumbs/ubuntu-interface.webp',
      links: {
        demo: 'https://manofubuntu.org/',
        repo: null,
      },
    },
    {
      name: 'Cleverson Industrial Equipment',
      tagline: 'A responsive catalogue website for an industrial equipment supplier, organising bakery, packaging, commercial kitchen, restaurant, laundry, and pure-water-line equipment into clear customer pathways.',
      tags: ['Industrial Catalogue', 'Business Website', 'Responsive Design'],
      status: 'Spotlight',
      spotlight: true,
      image: '/project-thumbs/cleverson-interface.webp',
      links: {
        demo: 'https://cleverson-industrial-equipment.vercel.app/',
        repo: null,
      },
    },
    {
      name: 'Gigga',
      tagline: 'A campus economy platform where students can post tasks, earn by completing Giggas, offer their skills, and discover student-run products and businesses through accountable campus profiles.',
      tags: ['Campus Marketplace', 'Student Economy', 'Next.js'],
      status: 'Spotlight',
      spotlight: true,
      image: '/project-thumbs/gigga-interface.webp',
      links: {
        demo: 'https://get-gigga.vercel.app/',
        repo: null,
      },
    },
    {
      name: 'Tab',
      tagline: 'A social spending app for friends, couples, roommates, travel groups and teams. Tab records who paid and who benefited, keeps the running debit and credit clear, calculates the final net balances, and lets everyone settle once.',
      tags: ['Shared Spending', 'Group Expenses', 'Product Design'],
      status: 'Spotlight',
      spotlight: true,
      image: '/project-thumbs/tab-interface.webp',
      links: {
        demo: 'https://clearyourtab.xyz/',
        repo: null,
      },
    },
    {
      name: 'Civora',
      tagline: 'An AI-powered civil engineering study companion that connects Year 4 course material, detailed notes and worked examples with camera-based structural analysis, evidence-aware labels, cautious load-path explanations, and a personal field notebook.',
      tags: ['Civil Engineering', 'AI Study Tool', 'Gemini Vision'],
      status: 'Live',
      links: {
        demo: 'https://civora-dun.vercel.app/',
        repo: null,
      },
    },
    {
      name: 'Verniq',
      tagline: 'Your voice, repurposed everywhere. AI agent that extracts voice DNA from your writing and videos, then generates platform-native content.',
      tags: ['AI Pipeline', 'Creator Tools', 'Multi-Platform'],
      status: 'Live Demo',
      links: {
        demo: 'https://verniqxyz.lovable.app/',
        repo: null,
      },
    },
    {
      name: 'Bizora OS',
      tagline: 'An AI business operating system for SMEs that brings business knowledge, audits, document intelligence, workflows, and practical automation into one workspace.',
      tags: ['AI for SMEs', 'Business OS', 'Automation'],
      status: 'Live Prototype',
      links: {
        demo: 'https://bizora-os.vercel.app/',
        repo: null,
      },
    },
    {
      name: 'AssetDNA',
      tagline: 'An AI and real-world asset platform that analyses business evidence, identifies valuable assets, and prepares verified asset records for onchain registration on X Layer.',
      tags: ['AI + RWA', 'X Layer', 'Asset Intelligence'],
      status: 'Live Prototype',
      links: {
        demo: 'https://asset-dna-gules.vercel.app/',
        repo: 'https://github.com/Thee-Web3-Qing/AssetDNA',
      },
    },
    {
      name: 'OrbitGuard',
      tagline: 'AI-powered code review agent for GitLab. Analyzes merge requests, blast radius, and risk — runs as an AI Flow.',
      tags: ['DevOps', 'AI Review', 'GitLab'],
      status: 'Live / Open Source',
      links: {
        demo: 'https://gitlab.com/OrbitGuard/OrbitGuard',
        repo: 'https://gitlab.com/OrbitGuard/OrbitGuard',
      },
    },
    {
      name: 'Spenda Advert',
      tagline: 'A focused advertising landing page built to present the Spenda offer clearly and turn visitors into customers.',
      tags: ['Web Design', 'Landing Page', 'Business'],
      status: 'Live',
      links: {
        demo: 'https://spendaadvert.vercel.app/',
        repo: null,
      },
    },
    {
      name: 'Tracium',
      tagline: 'AI task manager and team tracker for Slack. Keeps distributed teams in sync with contextual reminders and progress updates.',
      tags: ['Slack Integration', 'Task Management', 'AI'],
      status: 'Live',
      links: {
        demo: 'https://traciumai.vercel.app/',
        repo: 'https://github.com/Thee-Web3-Qing/Tracium',
      },
    },
  ]
  export default function Products() {
    const [selectedProduct, setSelectedProduct] = useState(null)

    useEffect(() => {
      if (!selectedProduct) return undefined
      const previousOverflow = document.body.style.overflow
      const closeOnEscape = (event) => event.key === 'Escape' && setSelectedProduct(null)
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', closeOnEscape)
      return () => {
        document.body.style.overflow = previousOverflow
        window.removeEventListener('keydown', closeOnEscape)
      }
    }, [selectedProduct])

    return (
      <div className="portfolio-products products-editorial pt-12 pb-24">
        <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">
          Shipped under pressure
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
          Products, websites & hackathon builds
        </h1>
        <p className="text-mid max-w-2xl mb-16">
          AI-powered tools, customer-facing websites, landing pages, and creative
          products built for real businesses, brands, hackathons, and communities.
        </p>
        <section className="mb-20">
          <p className="font-mono text-xs uppercase tracking-widest text-electric mb-2">
            Spotlight builds
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-7">
            The products I want you to see first.
          </h2>
          <div className="spotlight-products-grid">
            {products.filter((product) => product.spotlight).map((p, index) => (
              <div
                key={p.name}
                data-clay-tone={index % 4}
                role="link"
                tabIndex={0}
                onClick={() => setSelectedProduct(p)}
                onKeyDown={(event) => event.key === "Enter" && setSelectedProduct(p)}
                className="spotlight-product-card"
              >
                <WebsitePreview url={p.links.demo} title={p.name} image={p.image} />
                <div className="spotlight-product-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <a href={p.links.demo || p.links.repo} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`Open ${p.name} in a new tab`}>↗</a>
                </div>
                <h2>{p.name}</h2>
                <p>{p.tags[0]}</p>
                <span className="spotlight-product-hint">Click to know more</span>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-20">
          <div className="flex items-end justify-between gap-6 mb-7">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-electric mb-2">
                Recent client builds
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">
                The brief and the build.
              </h2>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {recentClientBuilds.map((project, index) => (
              <article
                key={project.name}
                data-clay-tone={index % 4}
                role="link"
                tabIndex={0}
                onClick={() => setSelectedProduct({ ...project, tagline: project.delivered })}
                onKeyDown={(event) => event.key === "Enter" && setSelectedProduct({ ...project, tagline: project.delivered })}
                className="portfolio-project-card portfolio-client-card noise-card border border-ink rounded-blob p-7 flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#16161D] transition-all duration-300"
              >
                <WebsitePreview url={project.links.demo} title={project.name} image={project.image} />
                <div className="flex items-start justify-between gap-4 mb-5">
                  <h3 className="font-display text-2xl font-bold">{project.name}</h3>
                  <span className="font-mono text-xs uppercase px-3 py-1 rounded-full border border-ink whitespace-nowrap">
                    {project.status}
                  </span>
                </div>
                <div className="space-y-5 mb-5">
                  <div>
                    <p className="font-mono text-xs uppercase text-coral mb-2">What the client wanted</p>
                    <p className="text-sm text-mid leading-relaxed">{project.clientWanted}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase text-electric mb-2">What I delivered</p>
                    <p className="text-sm text-mid leading-relaxed">{project.delivered}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-xs uppercase px-2 py-1 bg-lime/60 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex gap-3 font-mono text-xs uppercase flex-wrap">
                  {project.links.demo && (
                    <a href={project.links.demo} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="px-4 py-2 rounded-full bg-ink text-paper hover:bg-electric transition-colors">
                      View deployed site
                    </a>
                  )}
                  {project.links.repo && (
                    <a href={project.links.repo} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="px-4 py-2 rounded-full border border-ink hover:bg-line transition-colors">
                      View code
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
        {[
          {
            eyebrow: 'More shipped products',
            title: 'More experiments, tools and working builds.',
            items: products.filter((product) => !product.spotlight),
          },
        ].map((section) => (
          <section key={section.eyebrow} className="mb-20 last:mb-0">
            <p className="font-mono text-xs uppercase tracking-widest text-electric mb-2">
              {section.eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-7">
              {section.title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
          {section.items.map((p, index) => (
            <div
              key={p.name}
              data-clay-tone={index % 4}
              role="link"
              tabIndex={0}
              onClick={() => setSelectedProduct(p)}
              onKeyDown={(event) => event.key === "Enter" && setSelectedProduct(p)}
              className="portfolio-project-card portfolio-own-card products-editorial-card noise-card border border-ink rounded-blob p-7 flex flex-col cursor-pointer hover:-translate-y-1 transition-all duration-300"
            >
              <WebsitePreview url={p.links.demo} title={p.name} image={p.image} />
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-2xl font-bold">{p.name}</h2>
                <span className="font-mono text-xs uppercase px-3 py-1 rounded-full border border-ink">
                  {p.status}
                </span>
              </div>
              <p className="text-mid mb-4">{p.tagline}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {p.tags.map((t) => (
                  <span key={t} className="font-mono text-xs uppercase px-2 py-1 bg-lime/60 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex gap-3 font-mono text-xs uppercase flex-wrap">
                <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedProduct(p) }} className="products-details-button">
                  View details
                </button>
                {p.links.demo && (
                  <a
                    href={p.links.demo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="px-4 py-2 rounded-full bg-ink text-paper hover:bg-electric transition-colors"
                  >
                    Live demo
                  </a>
                )}
                {p.links.repo && (
                  <a
                    href={p.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="px-4 py-2 rounded-full border border-ink hover:bg-line transition-colors"
                  >
                    Code
                  </a>
                )}
              </div>
            </div>
          ))}
            </div>
          </section>
        ))}
        {selectedProduct && createPortal(
          <div className="product-detail-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedProduct(null)}>
            <article className="product-detail-modal" role="dialog" aria-modal="true" aria-labelledby="product-detail-title">
              <div className="product-detail-toolbar">
                <span>Live product preview</span>
                <a href={selectedProduct.links.demo || selectedProduct.links.repo} target="_blank" rel="noreferrer">Open in new tab ↗</a>
                <button type="button" className="product-detail-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details">×</button>
              </div>
              <WebsitePreview url={selectedProduct.links.demo || selectedProduct.links.repo} title={selectedProduct.name} interactive />
              <div className="product-detail-copy">
                <p>{selectedProduct.status}</p>
                <h2 id="product-detail-title">{selectedProduct.name}</h2>
                {selectedProduct.clientWanted && <><h3>The brief</h3><p>{selectedProduct.clientWanted}</p><h3>What I built</h3></>}
                <p>{selectedProduct.tagline || selectedProduct.delivered}</p>
                <div className="product-detail-tags">{selectedProduct.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <a href={selectedProduct.links.demo || selectedProduct.links.repo} target="_blank" rel="noreferrer">Open full product ↗</a>
              </div>
            </article>
          </div>,
          document.body,
        )}
      </div>
    )
  }
