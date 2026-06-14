import { useState } from 'react'
  const EMAIL = 'bigqinggg@gmail.com'
  const X_PROFILE = 'https://x.com/qingthecreator_'
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
  function ContactModal({ offer, onClose }) {
    return (
      <div className="fixed inset-0 z-[100] bg-ink/60 flex items-center justify-center px-5" onClick={onClose}>
        <div className="bg-paper border border-ink rounded-blob p-6 max-w-md w-full shadow-[8px_8px_0_0_#16161D]" onClick={e => e.stopPropagation()}>
          <h3 className="font-display text-2xl font-bold mb-3">
            Contact Qing
          </h3>
          <p className="text-mid text-sm mb-6 leading-relaxed">
            Reach out about <strong>{offer.title}</strong> — choose how you want to connect.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(offer.subject)}`}
              className="px-5 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase text-center hover:bg-electric transition-colors"
            >
              Email me
            </a>
            <a
              href={X_PROFILE}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-full border border-ink font-mono text-xs uppercase text-center hover:bg-lime transition-colors"
            >
              DM me on X
            </a>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-full font-mono text-xs uppercase text-center hover:bg-line transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }
  export default function Hire() {
    const [selected, setSelected] = useState(null)
    return (
      <div className="pt-10 sm:pt-12 pb-20 sm:pb-24 animate-fadeUp">
        <p className="font-mono text-xs uppercase tracking-widest text-electric mb-3">
          Work with Qing
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Bring me in when the idea needs shape, voice, and fire.
        </h1>
        <p className="text-mid max-w-2xl mb-12 sm:mb-16 leading-relaxed">
          I work with founders, creators, teams, and communities that need sharper
          stories, better campaigns, stronger content, and products people can
          understand quickly.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
          {offers.map((offer) => (
            <div
              key={offer.title}
              className="noise-card border border-ink rounded-blob p-6 sm:p-7 flex flex-col hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#16161D] transition-all duration-300"
            >
              <span className="font-mono text-xs uppercase px-3 py-1 rounded-full border border-ink self-start mb-4">
                {offer.badge}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-3 leading-tight">
                {offer.title}
              </h2>
              <p className="text-sm text-mid mb-6 leading-relaxed">
                {offer.desc}
              </p>
              <button
                onClick={() => setSelected(offer)}
                className="mt-auto px-4 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase text-center hover:bg-electric transition-colors"
              >
                Contact me
              </button>
            </div>
          ))}
        </div>
        <section className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">
            Consultations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Book the session that fits.
          </h2>
          <p className="text-mid max-w-2xl mb-8 leading-relaxed">
            These are focused, high-signal sessions. Come with the problem. Leave with a plan.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {consultations.map((session) => (
              <div
                key={session.title}
                className="border border-ink rounded-blob p-6 bg-white/60 noise-card hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#16161D] transition-all duration-300 flex flex-col"
              >
                <h3 className="font-display text-xl font-bold mb-2">
                  {session.title}
                </h3>
                <p className="font-display text-4xl font-extrabold mb-4 text-electric">
                  {session.price}
                </p>
                <p className="text-sm text-mid leading-relaxed mb-6">
                  {session.desc}
                </p>
                <button
                  onClick={() => setSelected(session)}
                  className="mt-auto px-4 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase text-center hover:bg-electric transition-colors"
                >
                  Book session
                </button>
              </div>
            ))}
          </div>
        </section>
        {selected && <ContactModal offer={selected} onClose={() => setSelected(null)} />}
      </div>
    )
  }
  