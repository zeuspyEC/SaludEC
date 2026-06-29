import { Link } from 'react-router-dom'
import { NAV_ITEMS, ROUTES } from '@config/routes'
import './Footer.css'

const FOOTER_LINKS = {
  plataforma: [
    { label: 'Inicio', path: ROUTES.HOME },
    { label: 'Nutrición', path: ROUTES.NUTRICION },
    { label: 'Actividad Física', path: ROUTES.ACTIVIDAD_FISICA },
    { label: 'Salud Mental', path: ROUTES.SALUD_MENTAL },
  ],
  recursos: [
    { label: 'Prevención', path: ROUTES.PREVENCION },
    { label: 'Biblioteca Digital', path: ROUTES.BIBLIOTECA },
    { label: 'Noticias', path: ROUTES.NOTICIAS },
  ],
  institucional: [
    { label: 'Nosotros', path: ROUTES.NOSOTROS },
    { label: 'Contacto', path: ROUTES.CONTACTO },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__main container">
        <div className="footer__brand">
          <Link to={ROUTES.HOME} className="footer__logo" aria-label="VitaPrevent — Volver al inicio">
            <svg aria-hidden="true" focusable="false" width="40" height="40" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="12" fill="rgba(144,202,249,0.1)"/>
              <path d="M32 12 L32 52 M12 32 L52 32" stroke="#90caf9" strokeWidth="8" strokeLinecap="round"/>
              <circle cx="32" cy="32" r="8" fill="#1565c0"/>
            </svg>
            <span className="footer__logo-name">VitaPrevent</span>
          </Link>
          <p className="footer__description">
            Plataforma digital dedicada a promover hábitos saludables, educación preventiva y
            recursos informativos confiables sobre salud física y mental.
          </p>
          <p className="footer__slogan">"Tu bienestar comienza con la prevención."</p>
        </div>

        <nav aria-label="Navegación del pie de página">
          <div className="footer__links">
            <div className="footer__col">
              <h3 className="footer__col-title">Plataforma</h3>
              <ul role="list">
                {FOOTER_LINKS.plataforma.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h3 className="footer__col-title">Recursos</h3>
              <ul role="list">
                {FOOTER_LINKS.recursos.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h3 className="footer__col-title">Institucional</h3>
              <ul role="list">
                {FOOTER_LINKS.institucional.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner container">
          <p className="footer__copy">
            &copy; {currentYear} VitaPrevent. Contenido con fines educativos.
          </p>
          <p className="footer__a11y">
            <span aria-hidden="true">♿</span>{' '}
            Accesible conforme a{' '}
            <a
              href="https://www.w3.org/TR/WCAG22/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__a11y-link"
            >
              WCAG 2.2 Nivel AA
              <span className="sr-only"> (abre en nueva pestaña)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
