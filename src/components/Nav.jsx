import { useState } from 'react'
import { useLocation } from 'react-router-dom'
  import { NavLink } from 'react-router-dom'
  const links = [
    { to: '/', label: 'Home' },
    { to: '/content', label: 'Content' },
    { to: '/products', label: 'Products' },
    { to: '/hire', label: 'Hire Me' },
    { to: '/experience', label: 'Experience' },
    { to: '/class', label: 'Class' },
  ]
  export default function Nav() {
    const [open, setOpen] = useState(false)
    const { pathname } = useLocation()
    const section = pathname === '/' ? 'home' : pathname.startsWith('/products') ? 'products' : pathname.startsWith('/class') ? 'class' : pathname.startsWith('/experience') ? 'experience' : pathname.startsWith('/content') ? 'content' : 'other'
    return (
      <header className={`portfolio-nav portfolio-nav-${section} sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-line`}>
        <div className="portfolio-nav-inner max-w-6xl mx-auto px-5 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="portfolio-brand font-display text-xl sm:text-2xl font-bold tracking-tight leading-tight"
            >
              Giwa Oluwasheedah<span className="text-electric">.</span>
            </NavLink>
            <button
              onClick={() => setOpen(!open)}
              className="portfolio-menu-button sm:hidden px-4 py-2 rounded-full border border-ink font-mono text-xs uppercase"
            >
              {open ? 'Close' : 'Menu'}
            </button>
            <nav className="portfolio-desktop-nav hidden sm:flex gap-2 font-mono text-sm uppercase">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `portfolio-nav-link px-4 py-3 rounded-full transition-colors ${
                      isActive ? 'bg-ink text-paper' : 'hover:bg-line text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <NavLink to="/hire" className="portfolio-nav-cta hidden sm:inline-flex">Book a project <span>→</span></NavLink>
          </div>
          {open && (
            <nav className="portfolio-mobile-nav sm:hidden mt-4 grid gap-2 font-mono text-xs uppercase">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `portfolio-nav-link px-4 py-3 rounded-full transition-colors ${
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
