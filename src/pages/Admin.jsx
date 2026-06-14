import { useState, useEffect } from 'react'

  const API_BASE = import.meta.env.VITE_API_BASE || ''
  const ADMIN_KEY = 'qing-admin-2025'

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const STATUS_COLORS = {
    pending: 'bg-lime/60 text-ink',
    confirmed: 'bg-electric/20 text-electric',
    declined: 'bg-coral/20 text-coral',
  }

  export default function Admin() {
    const [auth, setAuth] = useState(() => localStorage.getItem('admin_auth') === ADMIN_KEY)
    const [pw, setPw] = useState('')
    const [tab, setTab] = useState('bookings')
    const [bookings, setBookings] = useState([])
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [notes, setNotes] = useState('')
    const [saving, setSaving] = useState(false)

    function login() {
      if (pw === ADMIN_KEY) {
        localStorage.setItem('admin_auth', ADMIN_KEY)
        setAuth(true)
      }
    }

    async function fetchData() {
      setLoading(true)
      try {
        const [b, a] = await Promise.all([
          fetch(API_BASE + '/api/admin/bookings').then(r => r.json()),
          fetch(API_BASE + '/api/admin/analytics').then(r => r.json()),
        ])
        setBookings(Array.isArray(b) ? b : [])
        setAnalytics(a)
      } catch {}
      setLoading(false)
    }

    useEffect(() => { if (auth) fetchData() }, [auth])

    async function updateBooking(id, payload) {
      setSaving(true)
      try {
        const res = await fetch(API_BASE + '/api/admin/bookings/' + id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) { await fetchData(); setSelected(null) }
      } catch {}
      setSaving(false)
    }

    if (!auth) {
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center px-5">
          <div className="border border-ink rounded-blob p-8 max-w-sm w-full noise-card shadow-[8px_8px_0_0_#16161D]">
            <h1 className="font-display text-3xl font-bold mb-2">Admin</h1>
            <p className="text-mid text-sm mb-6">Qing only.</p>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Password"
              className="w-full border border-ink rounded-xl px-4 py-3 font-body text-sm bg-paper mb-4 focus:outline-none focus:ring-2 focus:ring-electric"
            />
            <button
              onClick={login}
              className="w-full px-5 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase hover:bg-electric transition-colors"
            >
              Enter
            </button>
          </div>
        </div>
      )
    }

    const activeBookings = bookings.filter(b => !b.archived)

    return (
      <div className="min-h-screen bg-paper">
        <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-line">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
            <span className="font-display text-xl font-bold">Admin Panel</span>
            <button
              onClick={() => { localStorage.removeItem('admin_auth'); setAuth(false) }}
              className="font-mono text-xs uppercase text-mid hover:text-ink transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
          {loading ? (
            <p className="font-mono text-sm text-mid">Loading...</p>
          ) : (
            <>
              {analytics && (
                <div className="grid sm:grid-cols-4 gap-4 mb-10">
                  {[
                    { label: 'Total bookings', value: analytics.bookings?.total ?? 0 },
                    { label: 'Pending', value: analytics.bookings?.pending ?? 0 },
                    { label: 'Confirmed', value: analytics.bookings?.confirmed ?? 0 },
                    { label: 'Reach-outs tracked', value: analytics.reachOuts ?? 0 },
                  ].map(stat => (
                    <div key={stat.label} className="noise-card border border-ink rounded-blob p-5">
                      <p className="font-mono text-xs uppercase text-mid mb-1">{stat.label}</p>
                      <p className="font-display text-4xl font-extrabold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 font-mono text-xs uppercase mb-8">
                {['bookings', 'analytics'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={'px-4 py-2 rounded-full transition-colors ' + (tab === t ? 'bg-ink text-paper' : 'border border-ink hover:bg-line')}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {tab === 'bookings' && (
                <div className="space-y-4">
                  {activeBookings.length === 0 && (
                    <p className="text-mid font-mono text-sm">No bookings yet.</p>
                  )}
                  {activeBookings.map(booking => (
                    <div key={booking.id} className="border border-ink rounded-blob p-5 sm:p-6 noise-card">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-display text-lg font-bold">{booking.name}</p>
                          <p className="font-mono text-xs text-mid">{booking.email}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={'font-mono text-xs uppercase px-3 py-1 rounded-full ' + (STATUS_COLORS[booking.status] || 'bg-line')}>
                            {booking.status}
                          </span>
                          <span className="font-mono text-xs text-mid">{formatDate(booking.createdAt)}</span>
                        </div>
                      </div>
                      <p className="font-mono text-xs uppercase text-electric mb-2">{booking.sessionType}</p>
                      {booking.message && <p className="text-sm text-mid mb-4 leading-relaxed">{booking.message}</p>}
                      {booking.adminNotes && (
                        <p className="text-xs text-mid italic mb-4 border-l-2 border-line pl-3">{booking.adminNotes}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => updateBooking(booking.id, { status: 'confirmed' })}
                            className="px-4 py-2 rounded-full bg-ink text-paper font-mono text-xs uppercase hover:bg-electric transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => updateBooking(booking.id, { status: 'declined' })}
                            className="px-4 py-2 rounded-full border border-ink font-mono text-xs uppercase hover:bg-coral hover:text-paper transition-colors"
                          >
                            Decline
                          </button>
                        )}
                        <button
                          onClick={() => { setSelected(booking); setNotes(booking.adminNotes || '') }}
                          className="px-4 py-2 rounded-full border border-ink font-mono text-xs uppercase hover:bg-line transition-colors"
                        >
                          Add notes
                        </button>
                        <button
                          onClick={() => updateBooking(booking.id, { archived: true })}
                          className="px-4 py-2 rounded-full font-mono text-xs uppercase text-mid hover:bg-line transition-colors"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'analytics' && analytics && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4">Button clicks and reach-outs</h2>
                    <div className="space-y-3">
                      {(analytics.eventCounts || []).map((e, i) => (
                        <div key={i} className="border border-line rounded-blob p-4 flex items-center justify-between">
                          <div>
                            <p className="font-mono text-xs uppercase text-electric">{e.event}</p>
                            <p className="font-display text-lg font-bold">{e.label || 'unlabeled'}</p>
                          </div>
                          <p className="font-display text-3xl font-extrabold">{e.count}</p>
                        </div>
                      ))}
                      {(analytics.eventCounts || []).length === 0 && (
                        <p className="text-mid font-mono text-sm">No events tracked yet.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4">Bookings by session type</h2>
                    <div className="space-y-3">
                      {(analytics.bySessionType || []).map((s, i) => (
                        <div key={i} className="border border-line rounded-blob p-4 flex items-center justify-between">
                          <p className="font-display text-lg font-bold">{s.sessionType}</p>
                          <p className="font-display text-3xl font-extrabold">{s.count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
        {selected && (
          <div className="fixed inset-0 z-[100] bg-ink/60 flex items-center justify-center px-5" onClick={() => setSelected(null)}>
            <div className="bg-paper border border-ink rounded-blob p-6 max-w-md w-full shadow-[8px_8px_0_0_#16161D]" onClick={e => e.stopPropagation()}>
              <h3 className="font-display text-xl font-bold mb-4">Notes for {selected.name}</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                className="w-full border border-ink rounded-xl px-4 py-3 font-body text-sm bg-paper mb-4 focus:outline-none focus:ring-2 focus:ring-electric resize-none"
                placeholder="Internal notes..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => updateBooking(selected.id, { adminNotes: notes })}
                  disabled={saving}
                  className="flex-1 px-5 py-3 rounded-full bg-ink text-paper font-mono text-xs uppercase hover:bg-electric transition-colors disabled:opacity-40"
                >
                  {saving ? 'Saving...' : 'Save notes'}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-5 py-3 rounded-full border border-ink font-mono text-xs uppercase hover:bg-line transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  