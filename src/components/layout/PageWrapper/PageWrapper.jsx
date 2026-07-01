import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import './PageWrapper.css'

export default function PageWrapper({ children, title, description }) {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const pageTitle = title ? `${title} | VitaPrevent` : 'VitaPrevent — Servicios públicos de salud'
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

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    mainRef.current?.focus()
  }, [pathname, title, description])

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
