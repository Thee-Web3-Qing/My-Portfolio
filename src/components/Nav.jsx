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
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <NavLink
          to="/"
          className="font-display text-2xl sm:text-xl font-bold tracking-tight leading-tight"
        >
          Giwa <br className="sm:hidden" />
          Sheedah<span className="text-electric">.</span>
        </NavLink>

        <nav className="w-full sm:w-auto flex gap-2 font-mono text-xs sm:text-sm uppercase overflow-x-auto pb-1 sm:pb-0">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `shrink-0 px-4 py-3 rounded-full transition-colors ${
                  isActive
                    ? 'bg-ink text-paper'
                    : 'hover:bg-line text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}