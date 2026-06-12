import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/content', label: 'Content' },
  { to: '/products', label: 'Products' },
  { to: '/hire', label: 'Hire Me' },
  { to: '/experience', label: 'Experience' },
]

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to="/" className="font-display text-xl font-bold tracking-tight">
          Giwa Sheedah<span className="text-electric">.</span>
        </NavLink>
        <nav className="flex gap-1 sm:gap-2 font-mono text-xs sm:text-sm uppercase">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full transition-colors ${
                  isActive
                    ? 'bg-ink text-paper'
                    : 'hover:bg-line text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}