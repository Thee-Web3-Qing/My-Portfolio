import { useState } from 'react'

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/your-link-here'
const CRYPTO_ADDRESS = '0xYourWalletAddressHere'

const offers = [
  {
    title: 'Hire me as your Creative Director',
    desc:
      'I lead creative strategy end-to-end. Community direction, content voice, brand narrative, campaign concepts, and the ideas that make people actually care.',
    cta: 'mailto:bigqinggg@gmail.com?subject=Creative Director inquiry',
    ctaLabel: 'Start a conversation',
    badge: 'Ongoing / Retainer',
  },
  {
    title: 'Hire me as your Content or Creative Ambassador',
    desc:
      'I help projects become easier to understand, easier to trust, and easier to talk about. From ambassador videos to product storytelling, campaign content, community education, and creative direction.',
    cta: 'mailto:bigqinggg@gmail.com?subject=Content or Creative Ambassador inquiry',
    ctaLabel: 'Hire me as ambassador',
    badge: 'Campaign / Monthly',
  },
  {
    title: 'Join your hackathon team as Chief of Idea',
    desc:
      'I join as the ideas person. I help frame the concept, sharpen the pitch, shape the story, and make the memo judges remember.',
    cta: 'mailto:bigqinggg@gmail.com?subject=Hackathon team inquiry',
    ctaLabel: 'Pitch me your team',
    badge: 'Equity / Prize split',
  },
  {
    title: 'Host your Twitter Space or event',
    desc:
      'Live moderation and community engagement. Founder AMAs, fireside chats, ecosystem conversations, conference hosting, and spaces people do not sleep through.',
    cta: 'mailto:bigqinggg@gmail.com?subject=Host my Twitter Space or event',
    ctaLabel: 'Book a host',
    badge: 'Per-event / Retainer',
  },
  {
    title: 'I build your product for you',
    desc:
      'Full product build support for AI tools, Web3 integrations, autonomous agents, landing pages, MVPs, and hackathon products.',
    cta: 'mailto:bigqinggg@gmail.com?subject=Build for hire',
    ctaLabel: 'Send me the brief',
    badge: 'Fixed fee / Retainer',
  },
]

export default function Hire() {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(CRYPTO_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="pt-10 sm:pt-12 pb-20 sm:pb-24 animate-fadeUp">
      <p className="font-mono text-xs uppercase tracking-widest text-electric mb-3">
        Let&apos;s work together
      </p>

      <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
        Five ways in.
      </h1>

      <p className="text-mid max-w-2xl mb-12 sm:mb-16 leading-relaxed">
        Creative direction. Content ambassadorship. Hackathon teams. Event
        hosting. Product builds. Pick the lane that fits, or email me and we can
        shape the right thing together.
      </p>

      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-16 sm:mb-20">
        {offers.map((offer, index) => (
          <div
            key={offer.title}
            className="noise-card border border-ink rounded-blob p-6 sm:p-7 flex flex-col hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#16161D] transition-all duration-300"
            style={{ animationDelay: `${index * 80}ms` }}
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

            <a
              href={offer.cta}
              className="mt-auto px-4 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase text-center hover:bg-electric transition-colors"
            >
              {offer.ctaLabel}
            </a>
          </div>
        ))}
      </div>

      <div className="border border-ink rounded-blob p-6 sm:p-10 noise-card">
        <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">
          1:1 consultation
        </p>

        <h2 className="font-display text-3xl font-bold mb-3 leading-tight">
          Book a strategy session
        </h2>

        <p className="text-mid max-w-2xl mb-8 leading-relaxed">
          One hour on your content strategy, brand voice, hackathon pitch,
          product idea, or community growth. You pick the focus. Pay with card
          or crypto.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="border border-ink rounded-blob p-5 sm:p-6 bg-white/60">
            <h3 className="font-display text-lg font-bold mb-2">
              Pay with card
            </h3>

            <p className="text-sm text-mid mb-4 leading-relaxed">
              Secure Stripe checkout. You will get a confirmation email with a
              scheduling link.
            </p>

            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-5 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase hover:bg-electric transition-colors"
            >
              Pay with Stripe
            </a>
          </div>

          <div className="border border-ink rounded-blob p-5 sm:p-6 bg-white/60">
            <h3 className="font-display text-lg font-bold mb-2">
              Pay with crypto
            </h3>

            <p className="text-sm text-mid mb-4 leading-relaxed">
              Send to the address below, then email me the transaction hash and
              your preferred time.
            </p>

            <div className="flex items-center gap-2 font-mono text-xs bg-paper border border-ink rounded-full px-4 py-3 overflow-x-auto">
              <span className="truncate">{CRYPTO_ADDRESS}</span>

              <button
                onClick={copyAddress}
                className="ml-auto px-3 py-1 rounded-full border border-ink uppercase shrink-0 hover:bg-lime transition-colors"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}