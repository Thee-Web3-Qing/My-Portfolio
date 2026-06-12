// Giwa's actual products from CV
const products = [
  {
    name: 'Verniq',
    tagline: 'Your voice, repurposed everywhere. AI agent that extracts voice DNA from your writing and videos, then generates platform-native content.',
    tags: ['AI Pipeline', 'Creator Tools', 'Multi-Platform'],
    status: 'Live Demo',
    links: {
      demo: 'https://verniqxyz.lovable.app/',
      slides: '#',
      repo: '#',
    },
  },
  {
    name: 'BountyPilot AI',
    tagline: 'Autonomous web scraper and opportunity scorer for hackathon bounties. Pulls from Superteam, GibWork, DoraHacks, auto-rates by profile fit.',
    tags: ['Web3 Automation', 'SQLite', 'Scraping'],
    status: 'Shipped',
    links: {
      demo: 'https://bountypilot.xyz',
      slides: '#',
      repo: '#',
    },
  },
  {
    name: 'OrbitGuard',
    tagline: 'AI-powered code review agent for GitLab. Analyzes merge requests, blast radius, and risk — runs as an AI Flow.',
    tags: ['DevOps', 'AI Review', 'GitLab'],
    status: 'Live / Open Source',
    links: {
      demo: 'https://gitlab.com/OrbitGuard/OrbitGuard',
      slides: '#',
      repo: 'https://gitlab.com/OrbitGuard/OrbitGuard',
    },
  },
  {
    name: 'Tracium',
    tagline: 'AI task manager and team tracker for Slack. Keeps distributed teams in sync with contextual reminders and progress updates.',
    tags: ['Slack Integration', 'Task Management', 'AI'],
    status: 'Live',
    links: {
      demo: 'https://traciumai.vercel.app/',
      slides: '#',
      repo: '#',
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
        Products & hackathon builds
      </h1>
      <p className="text-mid max-w-2xl mb-16">
        AI-powered tools, autonomous pipelines, and creative products. Most
        built in hackathons or personal projects. All live and demo-ready.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {products.map((p) => (
          <div key={p.name} className="noise-card border border-ink rounded-blob p-7 flex flex-col">
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
              {p.links.repo && p.links.repo !== '#' && (
                <a
                  href={p.links.repo}
                  target="_blank"
                  rel="noreferrer"
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
