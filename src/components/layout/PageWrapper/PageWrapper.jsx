import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import PropTypes from 'prop-types'
import './PageWrapper.css'

// Module-level: persists across page unmounts/remounts (lazy-loaded pages each mount fresh)
let appHasHydrated = false

export default function PageWrapper({ children, title, description }) {
  const { pathname } = useLocation()
  const navType = useNavigationType()
  const mainRef = useRef(null)

  useEffect(() => {
    const pageTitle = title ? `${title} | SaludEC` : 'SaludEC — Servicios públicos de salud'
    document.title = pageTitle

    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }

    if (!appHasHydrated) {
      appHasHydrated = true
      return
    }
    // Only shift focus on forward/replace navigation; back/forward restores naturally
    if (navType !== 'POP') {
      mainRef.current?.focus({ preventScroll: true })
    }
  }, [pathname, navType, title, description])

  return (
    <main
      id="main-content"
      ref={mainRef}
      tabIndex={-1}
      className="page-wrapper"
      aria-label={title || 'Contenido principal'}
    >
      {children}
    </main>
  )
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
}
