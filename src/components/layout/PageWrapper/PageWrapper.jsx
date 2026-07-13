import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import PropTypes from 'prop-types'
import './PageWrapper.css'

// Persiste entre desmontajes: evita mover foco en la carga inicial
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

    // POP (back/forward del navegador): el navegador restaura posición y foco
    if (navType === 'POP') return

    // Ir al tope en navegación hacia adelante
    window.scrollTo({ top: 0, behavior: 'instant' })

    const main = mainRef.current
    if (!main) return

    // Mueve foco al H1 de la nueva página (WCAG 2.4.3)
    // H1 anuncia el título al lector de pantalla y permite Shift+Tab para volver al nav
    const focusHeading = () => {
      const h1 = main.querySelector('h1')
      if (!h1) return false
      if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1')
      h1.focus()
      // Limpia tabindex al perder foco para no romper el orden de tabulación
      h1.addEventListener('blur', () => h1.removeAttribute('tabindex'), { once: true })
      return true
    }

    if (focusHeading()) return

    // Página lazy-loaded aún en Suspense: espera a que el H1 aparezca en el DOM
    const observer = new MutationObserver(() => {
      if (focusHeading()) observer.disconnect()
    })
    observer.observe(main, { childList: true, subtree: true })

    // Fallback: si el H1 no aparece en 3 s, foco en <main>
    const timeout = setTimeout(() => {
      observer.disconnect()
      main.focus()
    }, 3000)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
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

      {/* Link de retorno al nav — visible solo al recibir foco (WCAG 2.4.1) */}
      <a href="#main-nav" className="page-wrapper__back-to-nav">
        Ir al menú de navegación
      </a>
    </main>
  )
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
}
