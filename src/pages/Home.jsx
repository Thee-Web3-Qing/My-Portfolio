import { Link } from 'react-router-dom'
  const stats = [
    '80K+ space attendees',
    'Multiple creator awards',
    'Founder, CTNG House',
    'Product builder',
    'Conference host',
  ]
  const featured = [
    {
      title: 'The Degen Throne',
      type: 'Documentary',
      link: 'https://youtu.be/mjgcVDle2Wg?si=WqlNSPoOot9kpjR',
    },
    {
      title: 'Union Build Comic',
      type: 'Comic',
      link: 'https://x.com/qingthecreator_/status/1922198581517185088?s=46',
    },
    {
      title: 'Polygon Beef',
      type: 'Music',
      link: 'https://x.com/qingthecreator/status/1892170886712541632?s=46',
    },
    {
      title: 'BountyPilot AI',
      type: 'Product',
      link: 'https://bountypilot.xyz',
    },
  ]
  export default function Home() {
    return (
      <div>
        <section className="pt-12 sm:pt-24 pb-12 sm:pb-16 grid sm:grid-cols-[1fr_auto] gap-8 items-end animate-fadeUp">
          <div>
            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-electric mb-4 leading-relaxed">
              Storyteller. Product Builder. Community Architect.
            </p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.02] tracking-tight max-w-4xl">
              I turn ideas
              <br />
              <span className="text-stroke">into stories</span>
              <br />
              people remember.
            </h1>
            <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-mid">
              I help founders, creators, and communities turn ideas into movements
              through content, products, events, music, comics, and culture.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/content" className="px-5 py-3 rounded-full bg-ink text-paper font-mono text-sm uppercase hover:bg-electric transition-colors">
                See my work
              </Link>
              <Link to="/hire" className="px-5 py-3 rounded-full border border-ink font-mono text-sm uppercase hover:bg-lime transition-colors">
                Hire me
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2 font-mono text-sm animate-softFloat">
            <span className="text-mid uppercase text-xs">Currently tuned to</span>
            <span className="font-display text-4xl font-bold text-electric">CH.01</span>
            <span className="text-mid">Culture & Products</span>
          </div>
        </section>
        <section className="grid sm:grid-cols-5 gap-4 pb-14">
          {stats.map((stat) => (
            <div key={stat} className="noise-card border border-ink rounded-blob p-5 bg-white/60">
              <p className="font-display text-xl font-bold leading-tight">{stat}</p>
            </div>
          ))}
        </section>
        <section className="pb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">
            About Qing
          </p>
          <div className="border border-ink rounded-blob p-6 sm:p-10 noise-card">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              I am not just a creator. I am a creative system.
            </h2>
            <p className="text-mid max-w-3xl leading-relaxed">
              Most people know me as Qing. Over time, I have moved through Web3 as
              a content creator, community builder, conference host, musician,
              comic storyteller, hackathon builder, product founder, and creative
              director. My work sits at the intersection of story, culture,
              product, and community.
            </p>
          </div>
        </section>
        <section className="pb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-electric mb-3">
            Featured work
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
            Start here.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((item) => (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="group border border-ink rounded-blob p-6 bg-white/60 noise-card hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#16161D] transition-all duration-300"
              >
                <span className="font-mono text-xs uppercase text-electric">
                  {item.type}
                </span>
                <h3 className="font-display text-xl font-bold mt-3 mb-5 leading-tight">
                  {item.title}
                </h3>
                <span className="font-mono text-xs uppercase group-hover:text-electric">
                  View work
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    )
  }
  