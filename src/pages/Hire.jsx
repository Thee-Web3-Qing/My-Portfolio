import { useState } from 'react'

// EDIT: Add your real Stripe Payment Link + crypto wallet
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/your-link-here'
const CRYPTO_ADDRESS = '0xYourWalletAddressHere'

const offers = [
  {
    title: 'Hire me as your Creative Director',
    desc:
      'Lead creative strategy end-to-end. Community direction, content voice, brand narrative, campaign concepts. Works with founders, DAOs, and Web3 projects looking to move culture.',
    cta: 'mailto:qinglidah@gmail.com?subject=Creative Director inquiry',
    ctaLabel: 'Start a conversation',
    badge: 'Ongoing / Retainer',
  },
  {
    title: 'Join your hackathon team — Chief of Idea',
    desc:
      'I join as the ideas person: framing concepts, sharpening pitches, narrative direction, and the memo the judges remember. Take a % of the prize. Building in 36 hours is my jam.',
    cta: 'mailto:qinglidah@gmail.com?subject=Hackathon team — Chief of Idea',
    ctaLabel: 'Pitch me your team',
    badge: 'Equity / % of prize',
  },
  {
    title: 'Host your Twitter Space or event',
    desc:
      'Live moderation and community engagement. 80K+ attendees in past spaces. Founder AMAs, fireside chats, ecosystem conversations. I bring the energy and keep it real.',
    cta: 'mailto:qinglidah@gmail.com?subject=Host my Twitter Space or event',
    ctaLabel: 'Book a host',
    badge: 'Per-event / Retainer',
  },
  {
    title: 'I build your product for you',
    desc:
      'Full product build: AI pipelines, Web3 integrations, autonomous agents. Upfront fee for fixed scope, or monthly retainer for ongoing development and iteration.',
    cta: 'mailto:qinglidah@gmail.com?subject=Build for hire',
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
    <div className="pt-12 pb-24">
      <p className="font-mono text-xs uppercase tracking-widest text-electric mb-3">
        Let's work together
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
        Four ways in.
      </h1>
      <p className="text-mid max-w-2xl mb-16">
        Creative direction. Hackathon teams. Event hosting. Product builds.
        Pick the lane that fits, or DM and we'll design the right shape.
      </p>

      {/* HIRE OFFERS */}
      <div className="grid sm:grid-cols-2 gap-6 mb-20">
        {offers.map((o) => (
          <div key={o.title} className="noise-card border border-ink rounded-blob p-7 flex flex-col">
            <span className="font-mono text-xs uppercase px-3 py-1 rounded-full border border-ink self-start mb-4">
              {o.badge}
            </span>
            <h2 className="font-display text-xl font-bold mb-3">{o.title}</h2>
            <p className="text-sm text-mid mb-6">{o.desc}</p>
            <a
              href={o.cta}
              className="mt-auto px-4 py-2 rounded-full bg-ink text-paper font-mono text-xs uppercase text-center hover:bg-electric transition-colors"
            >
              {o.ctaLabel}
            </a>
          </div>
        ))}
      </div>

      {/* CONSULTATION / PAYMENTS */}
      <div className="border border-ink rounded-blob p-8 sm:p-10 noise-card">
        <p className="font-mono text-xs uppercase tracking-widest text-coral mb-3">
          1:1 consultation
        </p>
        <h2 className="font-display text-3xl font-bold mb-3">
          Book a strategy session
        </h2>
        <p className="text-mid max-w-2xl mb-8">
          1 hour on your content strategy, brand voice, hackathon pitch, or
          community growth. You pick the focus. Pay how it's easiest — card or
          crypto.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="border border-ink rounded-blob p-6 bg-white/60">
            <h3 className="font-display text-lg font-bold mb-2">Pay with card</h3>
            <p className="text-sm text-mid mb-4">
              Secure Stripe checkout. You'll get a confirmation email with a
              scheduling link.
            </p>
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-5 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase hover:bg-electric transition-colors"
            >
              Pay with Stripe →
            </a>
          </div>

          <div className="border border-ink rounded-blob p-6 bg-white/60">
            <h3 className="font-display text-lg font-bold mb-2">Pay with crypto</h3>
            <p className="text-sm text-mid mb-4">
              Send to the address below, then email me the tx hash + preferred
              time.
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