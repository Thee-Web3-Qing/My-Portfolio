import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="pt-12 sm:pt-24 pb-12 sm:pb-16 grid sm:grid-cols-[1fr_auto] gap-8 items-end animate-fadeUp">
        <div>
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-electric mb-4 leading-relaxed">
            Web3 community architect. Voices that move millions.
          </p>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.02] tracking-tight max-w-4xl">
            I host spaces
            <br />
            <span className="text-stroke">where ideas</span>
            <br />
            become movements.
          </h1>

          <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-mid">
            Twitter Spaces host. Conference moderator. Brand storyteller.
            Creative director for Web3 communities across Africa and beyond.
            80K+ attendees. Multiple awards. Founder of Africa&apos;s first
            Creators & Hackers Residency.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/content"
              className="px-5 py-3 rounded-full bg-ink text-paper font-mono text-sm uppercase hover:bg-electric transition-colors"
            >
              See my content
            </Link>

            <Link
              to="/products"
              className="px-5 py-3 rounded-full border border-ink font-mono text-sm uppercase hover:bg-lime transition-colors"
            >
              See my builds
            </Link>

            <Link
              to="/hire"
              className="px-5 py-3 rounded-full border border-ink font-mono text-sm uppercase hover:bg-coral hover:text-paper transition-colors"
            >
              Work with me
            </Link>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-2 font-mono text-sm animate-softFloat">
          <span className="text-mid uppercase text-xs">Currently tuned to</span>
          <span className="font-display text-4xl font-bold text-electric">
            CH.01
          </span>
          <span className="text-mid">Web3 Community</span>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-5 sm:gap-4 pb-12 sm:pb-16">
        {[
          {
            to: '/content',
            label: 'Content',
            desc: 'Project breakdowns, threads, videos, spoken word, and Web3 storytelling.',
            color: 'bg-electric',
          },
          {
            to: '/products',
            label: 'Products',
            desc: 'Verniq, BountyPilot, OrbitGuard, Tracium, and other shipped builds.',
            color: 'bg-coral',
          },
          {
            to: '/hire',
            label: 'Hire Me',
            desc: 'Creative direction, content ambassadorship, hosting, hackathon teams, and product builds.',
            color: 'bg-lime',
          },
        ].map((card, index) => (
          <Link
            key={card.to}
            to={card.to}
            className="group block p-6 rounded-blob border border-ink noise-card hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#16161D] transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span
              className={`inline-block w-3 h-3 rounded-full ${card.color} mb-4`}
            />

            <h3 className="font-display text-2xl font-bold mb-2">
              {card.label}
            </h3>

            <p className="text-sm text-mid leading-relaxed">
              {card.desc}
            </p>

            <span className="mt-4 inline-block font-mono text-xs uppercase group-hover:text-electric">
              Tune in
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}