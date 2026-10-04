import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Logo } from './Logo'

const links = [
  { label: 'Решения', href: '/solutions' },
  { label: 'Для бизнеса', href: '/industries' },
  { label: '1С', href: '/1c' },
  { label: 'Как работаем', href: '/approach' },
  { label: 'Обо мне', href: '/about' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)

  return (
    <header className="site-header" id="top">
      <div className="container header-inner">
        <Logo />
        <nav
          className={`main-nav${open ? ' main-nav--open' : ''}`}
          id="primary-navigation"
          aria-label="Основная навигация"
        >
          {links.map(({ label, href }) => (
            <NavLink
              key={href}
              to={href}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? 'nav-active' : '')}
            >
              {label}
            </NavLink>
          ))}
          <Link className="mobile-nav-cta" to="/contact" onClick={closeMenu}>
            Обсудить задачу <ArrowUpRight size={16} />
          </Link>
        </nav>
        <Link className="button button--small header-cta" to="/contact">
          Обсудить задачу <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-controls="primary-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
    </header>
  )
}
