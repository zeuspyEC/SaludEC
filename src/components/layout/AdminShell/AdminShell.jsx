import { Link, NavLink, Outlet } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@config/firebase'
import { useAuth } from '@contexts/AuthContext'
import './AdminShell.css'

const NAV_ITEMS = [
  { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
  { to: '/admin/articulos', icon: '📝', label: 'Artículos' },
  { to: '/admin/noticias', icon: '📰', label: 'Noticias' },
  { to: '/admin/recursos', icon: '📚', label: 'Recursos' },
  { to: '/admin/mensajes', icon: '✉️', label: 'Mensajes' },
]

export default function AdminShell() {
  const { user } = useAuth()

  const handleSignOut = async () => {
    try { await signOut(auth) } catch {}
  }

  return (
    <div className="admin-shell">
      <div className="skip-links">
        <a href="#admin-content" className="skip-link">Saltar al contenido</a>
      </div>

      <aside className="admin-sidebar" aria-label="Panel de administración">
        <Link to="/admin" className="admin-sidebar__brand" aria-label="SaludEC Admin — ir al dashboard">
          <span className="admin-sidebar__logo-mark" aria-hidden="true">VP</span>
          <span className="admin-sidebar__brand-name">Admin</span>
        </Link>

        <nav aria-label="Menú de administración">
          <ul role="list" className="admin-nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `admin-nav__item${isActive ? ' admin-nav__item--active' : ''}`}
                  aria-current={undefined}
                >
                  {({ isActive }) => (
                    <>
                      <span aria-hidden="true">{item.icon}</span>
                      {item.label}
                      {isActive && <span className="sr-only">(página actual)</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <p className="admin-sidebar__email" title={user?.email}>{user?.email}</p>
          <Link to="/" className="admin-sidebar__public-link">← Ir al sitio</Link>
          <button onClick={handleSignOut} className="admin-signout">Cerrar sesión</button>
        </div>
      </aside>

      <main className="admin-main" id="admin-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
