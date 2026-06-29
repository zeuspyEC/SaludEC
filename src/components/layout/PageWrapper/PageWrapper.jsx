import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import './PageWrapper.css'

export default function PageWrapper({ children, title, description }) {
  const { pathname } = useLocation()
  const mainRef = useRef(null)

  // Actualiza el título del documento y anuncia el cambio de página
  useEffect(() => {
    const pageTitle = title ? `${title} | VitaPrevent` : 'VitaPrevent — Tu bienestar comienza con la prevención'
    document.title = pageTitle

    // Mueve el foco al main para que los lectores anuncien el nuevo contenido
    mainRef.current?.focus()
  }, [pathname, title])

  return (
    <main
      id="main-content"
      ref={mainRef}
      tabIndex={-1}
      className="page-wrapper"
      aria-label={title || 'Contenido principal'}
    >
      {description && (
        <meta name="description" content={description} />
      )}
      {children}
    </main>
  )
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
}
