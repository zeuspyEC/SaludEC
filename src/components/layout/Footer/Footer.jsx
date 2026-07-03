import { Link } from 'react-router-dom'
import { NAV_ITEMS, ROUTES } from '@config/routes'
import './Footer.css'

const FOOTER_LINKS = {
  plataforma: [
    { label: 'Inicio', path: ROUTES.HOME },
    { label: 'Atención Primaria', path: ROUTES.NUTRICION },
    { label: 'Vacunación', path: ROUTES.ACTIVIDAD_FISICA },
    { label: 'Salud Mental', path: ROUTES.SALUD_MENTAL },
    { label: 'Emergencias', path: ROUTES.PREVENCION },
  ],
  recursos: [
    { label: 'Biblioteca Digital', path: ROUTES.BIBLIOTECA },
    { label: 'Noticias', path: ROUTES.NOTICIAS },
  ],
  institucional: [
    { label: 'Nosotros', path: ROUTES.NOSOTROS },
    { label: 'Contacto', path: ROUTES.CONTACTO },
    { label: 'Declaración de accesibilidad', path: ROUTES.ACCESIBILIDAD },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__main container">
        <div className="footer__brand">
          <Link to={ROUTES.HOME} className="footer__logo" aria-label="SaludEC — Volver al inicio">
            <svg aria-hidden="true" focusable="false" width="40" height="40" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="12" fill="rgba(144,202,249,0.1)"/>
              <path d="M32 12 L32 52 M12 32 L52 32" stroke="#90caf9" strokeWidth="8" strokeLinecap="round"/>
              <circle cx="32" cy="32" r="8" fill="#1565c0"/>
            </svg>
            <span className="footer__logo-name">SaludEC</span>
          </Link>
          <p className="footer__description">
            Portal de servicios públicos de salud del Ecuador. Información oficial del MSP,
            IESS, ECU 911 y OPS para que ningún ciudadano quede fuera por falta de acceso.
          </p>
          <p className="footer__slogan">"Tu salud, un derecho garantizado."</p>
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
            &copy; {currentYear} SaludEC. Contenido con fines educativos.
          </p>
          <p className="footer__a11y">
            <span aria-hidden="true">♿</span>{' '}
            <Link to={ROUTES.ACCESIBILIDAD} className="footer__a11y-link">
              Declaración de accesibilidad WCAG 2.2 AA
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
