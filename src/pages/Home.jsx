import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="pt-16 sm:pt-24 pb-16 grid sm:grid-cols-[1fr_auto] gap-8 items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-electric mb-4">
            Web3 community architect — voices that move millions
          </p>
          <h1 className="font-display text-5xl sm:text-7xl font-extrabold leading-[1.05] tracking-tight">
            I host spaces
            <br />
            <span className="text-stroke">where ideas</span>
            <br />
            become movements.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-mid">
            Twitter Spaces host. Conference moderator. Brand storyteller.
            Creative director for Web3 communities across Africa and beyond.
            80K+ attendees. Multiple awards. Founder of Africa's first
            Creators &amp; Hackers Residency.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/content" className="px-5 py-3 rounded-full bg-ink text-paper font-mono text-sm uppercase hover:bg-electric transition-colors">
              See my content
            </Link>
            <Link to="/products" className="px-5 py-3 rounded-full border border-ink font-mono text-sm uppercase hover:bg-lime transition-colors">
              See my builds
            </Link>
            <Link to="/hire" className="px-5 py-3 rounded-full border border-ink font-mono text-sm uppercase hover:bg-coral hover:text-paper transition-colors">
              Work with me
            </Link>
          </div>
        </div>

        {/* tuning dial */}
        <div className="hidden sm:flex flex-col items-end gap-2 font-mono text-sm">
          <span className="text-mid uppercase text-xs">Currently tuned to</span>
          <span className="font-display text-4xl font-bold text-electric">CH.01</span>
          <span className="text-mid">Web3 Community</span>
        </div>
      </section>

      {/* QUICK NAV STRIP */}
      <section className="grid sm:grid-cols-3 gap-4 pb-16">
        {[
          {
            to: '/content',
            label: 'Content',
            desc: 'Project breakdowns, threads, videos, spoken word.',
            color: 'bg-electric',
          },
          {
            to: '/products',
            label: 'Products',
            desc: 'Verniq, BountyPilot, OrbitGuard, Tracium — built and shipped.',
            color: 'bg-coral',
          },
          {
            to: '/hire',
            label: 'Hire Me',
            desc: 'Creative direction, hosting, hackathon teams, build-for-hire.',
            color: 'bg-lime',
          },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group block p-6 rounded-blob border border-ink noise-card hover:shadow-[6px_6px_0_0_#16161D] transition-shadow"
          >
            <span className={`inline-block w-3 h-3 rounded-full ${c.color} mb-4`} />
            <h3 className="font-display text-2xl font-bold mb-2">{c.label}</h3>
            <p className="text-sm text-mid">{c.desc}</p>
            <span className="mt-4 inline-block font-mono text-xs uppercase group-hover:text-electric">
              Tune in →
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}
