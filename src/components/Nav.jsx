import { useState } from 'react'
  import { NavLink } from 'react-router-dom'
  const links = [
    { to: '/', label: 'Home' },
    { to: '/content', label: 'Content' },
    { to: '/products', label: 'Products' },
    { to: '/hire', label: 'Hire Me' },
    { to: '/experience', label: 'Experience' },
  ]
  export default function Nav() {
    const [open, setOpen] = useState(false)
    return (
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="font-display text-xl sm:text-2xl font-bold tracking-tight leading-tight"
            >
              Giwa Oluwasheedah<span className="text-electric">.</span>
            </NavLink>
            <button
              onClick={() => setOpen(!open)}
              className="sm:hidden px-4 py-2 rounded-full border border-ink font-mono text-xs uppercase"
            >
              {open ? 'Close' : 'Menu'}
            </button>
            <nav className="hidden sm:flex gap-2 font-mono text-sm uppercase">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-full transition-colors ${
                      isActive ? 'bg-ink text-paper' : 'hover:bg-line text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
          {open && (
            <nav className="sm:hidden mt-4 grid gap-2 font-mono text-xs uppercase">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-full transition-colors ${
                      isActive ? 'bg-ink text-paper' : 'bg-white/60 text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>
    )
  }
  