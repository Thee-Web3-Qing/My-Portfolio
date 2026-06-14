import { useState } from 'react'

  const EMAIL = 'bigqinggg@gmail.com'
  const X_PROFILE = 'https://x.com/qingthecreator_'
  const API_BASE = import.meta.env.VITE_API_BASE || ''

  export default function BookingModal({ offer, onClose }) {
    const [step, setStep] = useState('contact')
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')

    async function track(event, label) {
      try {
        await fetch(API_BASE + '/api/bookings/../analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, label, page: 'hire' }),
        })
      } catch {}
    }

    async function submitBooking() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(API_BASE + '/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            sessionType: offer.title,
            message: form.message,
          }),
        })
        if (!res.ok) throw new Error('Failed')
        await track('booking_submitted', offer.title)
        setDone(true)
      } catch {
        setError("Something went wrong. Try emailing me directly.")
      } finally {
        setLoading(false)
      }
    }

    return (
      <div
        className="fixed inset-0 z-[100] bg-ink/60 flex items-center justify-center px-5"
        onClick={onClose}
      >
        <div
          className="bg-paper border border-ink rounded-blob p-6 max-w-md w-full shadow-[8px_8px_0_0_#16161D]"
          onClick={(e) => e.stopPropagation()}
        >
          {done ? (
            <>
              <h3 className="font-display text-2xl font-bold mb-3">You are in.</h3>
              <p className="text-mid text-sm mb-6 leading-relaxed">
                Your booking request for <strong>{offer.title}</strong> was received.
                Qing will reach out within 48 hours to confirm and set up the session.
              </p>
              <button
                onClick={onClose}
                className="w-full px-5 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase hover:bg-electric transition-colors"
              >
                Done
              </button>
            </>
          ) : step === 'contact' ? (
            <>
              <h3 className="font-display text-2xl font-bold mb-1">Contact Qing</h3>
              <p className="text-mid text-sm mb-6 leading-relaxed">
                Reach out about <strong>{offer.title}</strong>.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { track('reach_out', 'book_session'); setStep('form') }}
                  className="px-5 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase text-center hover:bg-electric transition-colors"
                >
                  Book a session
                </button>
                <a
                  href={'mailto:' + EMAIL + '?subject=' + encodeURIComponent(offer.subject || offer.title)}
                  onClick={() => track('reach_out', 'email')}
                  className="px-5 py-3 rounded-full border border-ink font-mono text-xs uppercase text-center hover:bg-lime transition-colors"
                >
                  Email me
                </a>
                <a
                  href={X_PROFILE}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('reach_out', 'x_dm')}
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
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('contact')}
                className="font-mono text-xs uppercase text-mid mb-4 hover:text-ink transition-colors"
              >
                Back
              </button>
              <h3 className="font-display text-2xl font-bold mb-1">Book your session</h3>
              <p className="text-mid text-sm mb-6">
                <strong>{offer.title}</strong>{offer.price ? ' — ' + offer.price : ''}
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-mid block mb-1">Your name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-ink rounded-xl px-4 py-3 font-body text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-electric"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-mid block mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-ink rounded-xl px-4 py-3 font-body text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-electric"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-mid block mb-1">What do you want to work on?</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full border border-ink rounded-xl px-4 py-3 font-body text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-electric resize-none"
                    placeholder="Give me context — the more specific, the better the session."
                  />
                </div>
                {error && <p className="text-coral font-mono text-xs">{error}</p>}
                <button
                  onClick={submitBooking}
                  disabled={loading || !form.name || !form.email}
                  className="px-5 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase hover:bg-electric transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Request session'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
  