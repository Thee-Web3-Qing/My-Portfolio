import { Link, Navigate, useParams } from 'react-router-dom'
import { services } from '../data/services'

const WHATSAPP_URL = 'https://wa.me/2348124320659?text=Hi%20Qing%2C%20I%20found%20your%20portfolio%20and%20I%20would%20like%20to%20discuss%20a%20project.'

export default function Service() {
  const { serviceSlug } = useParams()
  const service = services[serviceSlug]

  if (!service) return <Navigate to="/hire" replace />

  return (
    <div className="py-10 sm:py-20">
      <section className="grid lg:grid-cols-[1.15fr_.65fr] gap-10 lg:gap-16 items-end pb-16 sm:pb-24 animate-fadeUp">
        <div>
          <Link to="/hire" className="font-mono text-xs uppercase text-mid hover:text-electric">Services / {service.eyebrow}</Link>
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-electric mt-8 mb-4">{service.eyebrow}</p>
          <h1 className="font-display text-5xl sm:text-7xl font-extrabold leading-[0.98] tracking-[-0.04em]">{service.title}</h1>
          <p className="mt-6 max-w-3xl text-lg sm:text-xl leading-relaxed text-mid">{service.summary}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-center px-6 py-4 rounded-full bg-ink text-paper font-mono text-sm uppercase hover:bg-electric transition-colors">Discuss your project</a>
            <Link to="/products" className="text-center px-6 py-4 rounded-full border border-ink font-mono text-sm uppercase hover:bg-lime transition-colors">See related work</Link>
          </div>
        </div>
        <aside className="noise-card border border-ink rounded-blob bg-white/60 p-6 sm:p-8">
          <p className="font-mono text-xs uppercase text-coral">A good fit for</p>
          <ul className="mt-5 space-y-4">
            {service.idealFor.map((item) => <li key={item} className="flex gap-3 text-mid leading-relaxed"><span className="text-electric font-bold">→</span><span>{item}</span></li>)}
          </ul>
        </aside>
      </section>

      <section className="py-16 border-t border-line grid lg:grid-cols-[.7fr_1.3fr] gap-8 lg:gap-14">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-coral">What you receive</p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-3">A clear path from idea to useful output.</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {service.deliverables.map((item, index) => (
            <article key={item} className="border border-ink rounded-blob bg-white/60 p-5 sm:p-6">
              <span className="font-mono text-xs text-electric">0{index + 1}</span>
              <h3 className="font-display text-xl font-bold mt-5">{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 border-t border-line">
        <p className="font-mono text-xs uppercase tracking-widest text-electric">How the work moves</p>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-3">Simple checkpoints. No mystery process.</h2>
        <div className="grid md:grid-cols-3 gap-5 mt-9">
          {service.process.map(([title, copy], index) => (
            <article key={title} className="noise-card border border-ink rounded-blob bg-white/60 p-6 sm:p-7">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper font-mono text-xs">{index + 1}</span>
              <h3 className="font-display text-2xl font-bold mt-7">{title}</h3>
              <p className="text-mid leading-relaxed mt-3">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 border-t border-line grid lg:grid-cols-2 gap-8 lg:gap-14">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-coral">Related proof</p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-3">The work already exists.</h2>
          <p className="text-mid text-lg leading-relaxed mt-5">Explore products and campaigns that demonstrate this part of my work.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            {service.proof.map((item) => <span key={item} className="rounded-full border border-ink px-4 py-2 font-mono text-xs uppercase bg-white/60">{item}</span>)}
          </div>
          <Link to="/products" className="inline-block mt-8 font-mono text-xs uppercase underline decoration-electric decoration-2 underline-offset-4">View project case studies</Link>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-electric">Common questions</p>
          <div className="mt-5 space-y-4">
            {service.faq.map(([question, answer]) => (
              <details key={question} className="group border border-ink rounded-blob bg-white/60 p-5 sm:p-6">
                <summary className="cursor-pointer list-none font-display text-xl font-bold flex justify-between gap-4"><span>{question}</span><span className="text-electric group-open:rotate-45 transition-transform">+</span></summary>
                <p className="text-mid leading-relaxed mt-4 pr-6">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 mb-8 sm:mb-16 rounded-[2.5rem] border border-ink bg-ink text-paper p-7 sm:p-12 lg:p-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime">Start with the idea you have</p>
        <h2 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.02] max-w-4xl mt-4">Tell me what you want people to be able to do.</h2>
        <p className="text-paper/70 text-lg leading-relaxed max-w-2xl mt-5">I will help you turn that goal into a realistic scope, timeline and next step.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="inline-block mt-8 text-center px-6 py-4 rounded-full bg-lime text-ink font-mono text-sm uppercase font-bold hover:bg-paper transition-colors">Message Qing on WhatsApp</a>
      </section>
    </div>
  )
}
