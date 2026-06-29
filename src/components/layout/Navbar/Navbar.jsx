import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { NAV_ITEMS, ROUTES } from '@config/routes'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const burgerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cierra el menú con Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        burgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Bloquea scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="navbar__logo" aria-label="VitaPrevent — Ir al inicio">
          <svg aria-hidden="true" focusable="false" width="36" height="36" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="12" fill="#0d1b2a"/>
            <path d="M32 12 L32 52 M12 32 L52 32" stroke="#90caf9" strokeWidth="8" strokeLinecap="round"/>
            <circle cx="32" cy="32" r="8" fill="#1565c0"/>
          </svg>
          <span className="navbar__brand">
            <span className="navbar__brand-name">VitaPrevent</span>
            <span className="navbar__brand-slogan">Tu bienestar comienza aquí</span>
          </span>
        </Link>

        {/* Navegación escritorio */}
        <nav className="navbar__nav" aria-label="Navegación principal">
          <ul role="list" className="navbar__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                  }
                  aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA + hamburger */}
        <div className="navbar__actions">
          <Link to={ROUTES.CONTACTO} className="navbar__cta">
            Contacto
          </Link>

          <button
            ref={burgerRef}
            className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="navbar__burger-bar" aria-hidden="true" />
            <span className="navbar__burger-bar" aria-hidden="true" />
            <span className="navbar__burger-bar" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Navegación móvil">
          <ul role="list" className="navbar__mobile-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                  }
                  onClick={closeMenu}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to={ROUTES.CONTACTO}
                className="navbar__mobile-cta"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="navbar__overlay"
          aria-hidden="true"
          onClick={closeMenu}
        />
      )}
    </header>
  )
}
