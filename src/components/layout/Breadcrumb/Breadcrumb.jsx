import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Breadcrumb.css'

const ROUTE_LABELS = {
  'atencion-primaria': 'Atención Primaria',
  'vacunacion': 'Vacunación',
  'salud-mental': 'Salud Mental',
  'emergencias': 'Emergencias',
  'noticias': 'Noticias',
  'contacto': 'Contacto',
  'nosotros': 'Nosotros',
  'accesibilidad': 'Declaración de accesibilidad',
  'admin': 'Panel Admin',
  'articulos': 'Artículos',
  'recursos': 'Recursos',
  'faqs': 'Preguntas Frecuentes',
  'mensajes': 'Mensajes',
}

export default function Breadcrumb({ customItems }) {
  const { pathname } = useLocation()

  const items = customItems ?? buildItems(pathname)

  if (items.length <= 1) return null

  return (
    <nav aria-label="Ruta de navegación" className="breadcrumb">
      <ol className="breadcrumb__list" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.path} className="breadcrumb__item">
              {isLast ? (
                <span aria-current="page" className="breadcrumb__current">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link to={item.path} className="breadcrumb__link">
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="breadcrumb__separator">›</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function buildItems(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  const items = [{ label: 'Inicio', path: '/' }]

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    items.push({
      label: ROUTE_LABELS[segment] ?? decodeURIComponent(segment),
      path: currentPath,
    })
  }

  return items
}

Breadcrumb.propTypes = {
  customItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ),
}
