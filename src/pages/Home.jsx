import { Link } from 'react-router-dom'

const WHATSAPP_URL = 'https://wa.me/2348124320659?text=Hi%20Qing%2C%20I%20found%20your%20portfolio%20and%20I%20would%20like%20to%20discuss%20a%20project.'

const stats = [
  { value: '80K+', label: 'live Space attendees' },
  { value: '14 days', label: 'typical website delivery window' },
  { value: '10+', label: 'products and client builds' },
  { value: 'Multi-format', label: 'content, products and experiences' },
]

const services = [
  {
    number: '01',
    title: 'Websites and digital products',
    copy: 'Mobile-first landing pages, marketplaces, dashboards and product prototypes designed around what your users actually need to do.',
    link: '/services/mobile-first-websites',
    action: 'View website service',
  },
  {
    number: '02',
    title: 'AI-powered business systems',
    copy: 'Useful AI workflows that reduce repetitive work, organise information and help businesses move from scattered ideas to working systems.',
    link: '/services/ai-business-automation',
    action: 'View AI automation service',
  },
  {
    number: '03',
    title: 'Content and creative direction',
    copy: 'Campaign ideas, scripts, storytelling and launch content that make technical or unfamiliar products easier for people to understand.',
    link: '/services/web3-content-strategy',
    action: 'View content service',
  },
]

const caseStudies = [
  {
    title: 'Beauty by 3lle',
    type: 'Beauty e-commerce',
    copy: 'A polished product catalogue and shopping experience built to make browsing feel visual, premium and easy on mobile.',
    link: 'https://beauty-by3ll3.vercel.app/',
    accent: 'bg-coral',
  },
  {
    title: 'Moment',
    type: 'Events platform',
    copy: 'A marketing and ticketing product for event discovery, registrations, voting and organiser workflows.',
    link: 'https://moment-blush.vercel.app/',
    accent: 'bg-lime',
  },
  {
    title: 'The Authors Room',
    type: 'Author marketplace',
    copy: 'A community-led marketplace where authors can publish, build profiles and give readers a better way to discover their work.',
    link: 'https://my-authors-room.vercel.app/',
    accent: 'bg-electric',
  },
  {
    title: '22Energy',
    type: 'Solar distributor',
    copy: 'A sales-focused landing page that guides homes, businesses and dealers towards the right solar enquiry path.',
    link: 'https://22-energy-rho.vercel.app/',
    accent: 'bg-ink',
  },
]

const creativeWork = [
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
      <section className="relative pt-10 sm:pt-20 pb-14 sm:pb-20 grid lg:grid-cols-[1.08fr_.72fr] gap-10 lg:gap-14 items-center animate-fadeUp">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink bg-white/60 px-3 py-2 mb-5">
            <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em]">Available for selected projects</p>
          </div>
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-electric mb-4 leading-relaxed">
            AI product builder · Creative strategist · Storyteller
          </p>
          <h1 className="font-display text-[3.3rem] sm:text-7xl lg:text-[5.65rem] font-extrabold leading-[0.96] tracking-[-0.045em] max-w-4xl">
            Your idea deserves
            <br />
            <span className="text-stroke">more than a draft.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-mid">
            I turn rough ideas into clear stories, beautiful websites and useful digital products that people can understand, trust and use.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-center px-6 py-4 rounded-full bg-ink text-paper font-mono text-sm uppercase hover:bg-electric transition-colors">
              Start a project on WhatsApp
            </a>
            <Link to="/products" className="text-center px-6 py-4 rounded-full border border-ink font-mono text-sm uppercase hover:bg-lime transition-colors">
              Explore my work
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-mid">
            <span>Mobile-first</span>
            <span>Clear project scope</span>
            <span>Launch-ready handoff</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[430px] lg:justify-self-end">
          <div className="absolute -inset-3 rounded-[2.5rem] border border-ink translate-x-3 translate-y-3 bg-lime" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-ink bg-ink aspect-[4/5]">
            <img src="/qing-class-portrait.jpg" alt="Qing, AI product builder and creative strategist" className="h-full w-full object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-ink/90 text-paper p-5 sm:p-6 border-t border-paper/20">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">Qing The Creator</p>
              <p className="font-display text-2xl sm:text-3xl font-bold mt-1">Giwa Oluwasheedah</p>
              <p className="text-sm text-paper/70 mt-1">Ideas, products, content and culture.</p>
            </div>
          </div>
          <div className="absolute -left-4 sm:-left-8 top-8 rotate-[-5deg] rounded-2xl border border-ink bg-paper px-4 py-3 shadow-[4px_4px_0_0_#16161D]">
            <p className="font-mono text-[10px] uppercase text-mid">Builder mode</p>
            <p className="font-display font-bold">Idea → Live product</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="noise-card border border-ink rounded-blob p-4 sm:p-5 bg-white/60">
            <strong className="block font-display text-2xl sm:text-3xl font-extrabold leading-none">{stat.value}</strong>
            <p className="mt-2 text-xs sm:text-sm text-mid leading-snug">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="py-16 border-t border-line">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">What I can build with you</p>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.02]">One creative partner from idea to launch.</h2>
          <p className="text-mid text-lg mt-5 leading-relaxed">You do not need to arrive with a perfect brief. Bring the idea, the problem or the business goal. I will help shape it into something clear enough to build and strong enough to share.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-5 mt-10">
          {services.map((service) => (
            <article key={service.number} className="group border border-ink rounded-blob p-6 sm:p-7 bg-white/60 noise-card hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#16161D] transition-all duration-300">
              <span className="font-mono text-xs text-electric">{service.number}</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold mt-8 leading-tight">{service.title}</h3>
              <p className="text-mid mt-4 leading-relaxed">{service.copy}</p>
              <Link to={service.link} className="inline-block mt-7 font-mono text-xs uppercase underline decoration-electric decoration-2 underline-offset-4">
                {service.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 border-t border-line">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-electric mb-3">Selected client builds</p>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold">Built for real goals.</h2>
          </div>
          <Link to="/products" className="font-mono text-xs uppercase underline underline-offset-4">View every product</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {caseStudies.map((item, index) => (
            <a key={item.title} href={item.link} target="_blank" rel="noreferrer" className="group relative overflow-hidden border border-ink rounded-blob bg-white/60 p-6 sm:p-8 min-h-[280px] flex flex-col justify-between hover:shadow-[8px_8px_0_0_#16161D] transition-all duration-300">
              <div className={`absolute top-0 right-0 h-20 w-20 sm:h-28 sm:w-28 ${item.accent} border-l border-b border-ink rounded-bl-[3rem] transition-transform duration-300 group-hover:scale-110`} />
              <div className="relative pr-16 sm:pr-24">
                <span className="font-mono text-xs uppercase text-electric">0{index + 1} · {item.type}</span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold mt-4">{item.title}</h3>
                <p className="text-mid mt-4 leading-relaxed max-w-md">{item.copy}</p>
              </div>
              <span className="relative mt-8 font-mono text-xs uppercase group-hover:text-electric">Open live product ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="py-16 border-t border-line grid lg:grid-cols-[.8fr_1.2fr] gap-8 lg:gap-14 items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">About Qing</p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight">I am not just a creator. I am a creative system.</h2>
        </div>
        <div>
          <p className="text-mid text-lg leading-relaxed">
            Most people know me as Qing. I have worked across Web3 as a content creator, community builder, conference host, musician, comic storyteller, product founder and creative director. That range helps me see both sides of a project: what needs to work and what will make people care.
          </p>
          <p className="text-mid text-lg leading-relaxed mt-5">
            My work sits at the intersection of story, culture, product and community. Whether I am building a client platform or explaining a technical product, the goal stays the same: make the idea feel clear, useful and memorable.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/experience" className="px-5 py-3 rounded-full border border-ink font-mono text-xs uppercase hover:bg-lime transition-colors">View my experience</Link>
            <Link to="/hire" className="px-5 py-3 rounded-full border border-ink font-mono text-xs uppercase hover:bg-electric hover:text-paper transition-colors">How to work with me</Link>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-line">
        <p className="font-mono text-xs uppercase tracking-widest text-electric mb-3">More than websites</p>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-8">Stories people remember.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {creativeWork.map((item) => (
            <a key={item.title} href={item.link} target="_blank" rel="noreferrer" className="group border border-ink rounded-blob p-6 bg-white/60 noise-card hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#16161D] transition-all duration-300">
              <span className="font-mono text-xs uppercase text-electric">{item.type}</span>
              <h3 className="font-display text-xl font-bold mt-3 mb-8 leading-tight">{item.title}</h3>
              <span className="font-mono text-xs uppercase group-hover:text-electric">View work ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="my-8 sm:my-14 mb-16 sm:mb-24 rounded-[2.5rem] border border-ink bg-ink text-paper p-7 sm:p-12 lg:p-16 overflow-hidden relative">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-electric" />
        <div className="absolute right-20 -bottom-20 h-40 w-40 rounded-full bg-lime" />
        <div className="relative max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime mb-4">Have an idea in your notes?</p>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.02]">Let’s turn it into something people can use.</h2>
          <p className="text-paper/70 text-lg mt-5 leading-relaxed max-w-2xl">Tell me what you want to build, who it is for and what success should look like. I will help you find the clearest way forward.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-center px-6 py-4 rounded-full bg-lime text-ink font-mono text-sm uppercase font-bold hover:bg-paper transition-colors">Discuss your project</a>
            <Link to="/hire" className="text-center px-6 py-4 rounded-full border border-paper/40 font-mono text-sm uppercase hover:bg-paper hover:text-ink transition-colors">View services first</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
