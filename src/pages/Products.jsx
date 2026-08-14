  const recentClientBuilds = [
    {
      name: "The Author's Room",
      clientWanted: "An artsy author marketplace where readers and writers can create profiles, discover books, and use the platform from either a reader or author perspective.",
      delivered: "I designed and built a responsive marketplace prototype with role-based sign-up, reader and author dashboards, profile switching, book discovery, community features, and a Vercel-ready Next.js build.",
      tags: ["Marketplace Prototype", "Next.js", "Responsive Design"],
      status: "Prototype",
      links: {
        demo: "https://authors-room.qinglidah.chatgpt.site",
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

  function WebsitePreview({ url, title }) {
    if (!url) return null

    return (
      <div className="mb-6 overflow-hidden rounded-[1.2rem] border border-ink bg-white shadow-[4px_4px_0_0_#16161D]">
        <div className="flex items-center gap-2 border-b border-ink bg-paper px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-coral" />
          <span className="h-2.5 w-2.5 rounded-full bg-lime" />
          <span className="h-2.5 w-2.5 rounded-full bg-electric" />
          <span className="ml-2 min-w-0 flex-1 truncate rounded-full border border-line bg-white/80 px-3 py-1 font-mono text-[10px] text-mid">
            {url.replace(/^https?:\/\//, '')}
          </span>
        </div>
        <div className="relative h-52 sm:h-60 overflow-hidden bg-line">
          <iframe
            src={url}
            title={`${title} desktop website preview`}
            loading="lazy"
            tabIndex="-1"
            width="1440"
            height="900"
            className="absolute left-0 top-0 h-[900px] w-[1440px] origin-top-left scale-[0.24] sm:scale-[0.38] lg:scale-[0.31] pointer-events-none bg-white"
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-ink px-3 py-2 font-mono text-[10px] uppercase text-paper shadow-md">
            Open project ↗
          </span>
        </div>
      </div>
    )
  }

  const products = [
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
      name: 'BountyPilot AI',
      tagline: 'Autonomous web scraper and opportunity scorer for hackathon bounties. Pulls from Superteam, GibWork, DoraHacks, auto-rates by profile fit.',
      tags: ['Web3 Automation', 'SQLite', 'Scraping'],
      status: 'Shipped',
      links: {
        demo: 'https://bountypilot.xyz',
        repo: 'https://github.com/Thee-Web3-Qing/BountyPilot-Ai',
      },
    },
    {
      name: 'My Authors Room',
      tagline: 'A Nigerian reading, writing, and e-book marketplace where readers build communities, authors publish stories, and books can be sold in naira.',
      tags: ['Creator Marketplace', 'E-books', 'Community'],
      status: 'Live Prototype',
      links: {
        demo: 'https://my-authors-room.vercel.app/',
        repo: 'https://github.com/Thee-Web3-Qing/My-Authors-Room',
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
    return (
      <div className="pt-12 pb-24">
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
            {recentClientBuilds.map((project) => (
              <article
                key={project.name}
                role="link"
                tabIndex={0}
                onClick={() => window.open(project.links.demo || project.links.repo, "_blank", "noopener,noreferrer")}
                onKeyDown={(event) => event.key === "Enter" && window.open(project.links.demo || project.links.repo, "_blank", "noopener,noreferrer")}
                className="noise-card border border-ink rounded-blob p-7 flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#16161D] transition-all duration-300"
              >
                <WebsitePreview url={project.links.demo} title={project.name} />
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
                    <a href={project.links.demo} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-ink text-paper hover:bg-electric transition-colors">
                      View deployed site
                    </a>
                  )}
                  {project.links.repo && (
                    <a href={project.links.repo} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full border border-ink hover:bg-line transition-colors">
                      View code
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
        <div className="grid sm:grid-cols-2 gap-6">
          {products.map((p) => (
            <div
              key={p.name}
              role="link"
              tabIndex={0}
              onClick={() => window.open(p.links.demo || p.links.repo, "_blank", "noopener,noreferrer")}
              onKeyDown={(event) => event.key === "Enter" && window.open(p.links.demo || p.links.repo, "_blank", "noopener,noreferrer")}
              className="noise-card border border-ink rounded-blob p-7 flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#16161D] transition-all duration-300"
            >
              <WebsitePreview url={p.links.demo} title={p.name} />
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
                <a
                  href={p.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-ink text-paper hover:bg-electric transition-colors"
                >
                  Live demo
                </a>
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
      </div>
    )
  }
  