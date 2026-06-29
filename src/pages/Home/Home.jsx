import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import NewsCard from '@components/common/NewsCard/NewsCard'
import { SkeletonGrid } from '@components/common/Skeleton/Skeleton'
import { ROUTES } from '@config/routes'
import { getNoticias } from '@services/noticias.service'
import './Home.css'

const CUBE_MODS = [
  { pos: 'front',  icon: '🥗', title: 'Nutrición',       sub: 'Alimentación saludable',  path: ROUTES.NUTRICION,        bg: 'rgba(22,163,74,0.22)',   glow: '#22c55e' },
  { pos: 'right',  icon: '🏃', title: 'Actividad Física', sub: 'Rutinas y ejercicio',     path: ROUTES.ACTIVIDAD_FISICA, bg: 'rgba(234,88,12,0.22)',   glow: '#f97316' },
  { pos: 'back',   icon: '🧠', title: 'Salud Mental',     sub: 'Bienestar emocional',     path: ROUTES.SALUD_MENTAL,    bg: 'rgba(147,51,234,0.22)',  glow: '#a855f7' },
  { pos: 'left',   icon: '🛡️', title: 'Prevención',       sub: 'Cuida tu salud',          path: ROUTES.PREVENCION,      bg: 'rgba(21,101,192,0.22)',  glow: '#60a5fa' },
]

function HeroCube({ noticias }) {
  const sceneRef = useRef(null)
  const rafRef = useRef(null)
  const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, lastX: 0, lastY: 0, rotX: -25, rotY: 0 })

  useEffect(() => {
    const d = drag.current
    const tick = () => {
      if (!d.active) d.rotY += 360 / (18 * 60)
      if (sceneRef.current) {
        sceneRef.current.style.transform = `rotateX(${d.rotX}deg) rotateY(${d.rotY}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const onPointerDown = (e) => {
    const d = drag.current
    d.active = true
    d.moved = false
    d.startX = e.clientX; d.startY = e.clientY
    d.lastX  = e.clientX; d.lastY  = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active) return
    if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 6) d.moved = true
    d.rotY += (e.clientX - d.lastX) * 0.6
    d.rotX  = Math.max(-70, Math.min(30, d.rotX - (e.clientY - d.lastY) * 0.6))
    d.lastX = e.clientX; d.lastY = e.clientY
  }

  const onPointerUp = () => { drag.current.active = false }

  const onClickCapture = (e) => { if (drag.current.moved) e.stopPropagation() }

  const topFace = noticias[0]
    ? { pos: 'top',    icon: '📰', title: noticias[0].titulo?.slice(0, 26) + (noticias[0].titulo?.length > 26 ? '…' : ''), sub: 'Última noticia',   path: `/noticias/${noticias[0].id}`, bg: 'rgba(8,145,178,0.22)', glow: '#22d3ee' }
    : { pos: 'top',    icon: '📋', title: 'Noticias',   sub: 'Actualidad en salud', path: ROUTES.NOTICIAS,    bg: 'rgba(8,145,178,0.22)', glow: '#22d3ee' }

  const bottomFace = noticias[1]
    ? { pos: 'bottom', icon: '🔔', title: noticias[1].titulo?.slice(0, 26) + (noticias[1].titulo?.length > 26 ? '…' : ''), sub: 'Noticia reciente', path: `/noticias/${noticias[1].id}`, bg: 'rgba(8,145,178,0.22)', glow: '#22d3ee' }
    : { pos: 'bottom', icon: '📚', title: 'Biblioteca', sub: 'Recursos digitales',  path: ROUTES.BIBLIOTECA,  bg: 'rgba(8,145,178,0.22)', glow: '#22d3ee' }

  const faces = [...CUBE_MODS, topFace, bottomFace]

  return (
    <div
      className="hero-cube"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClickCapture={onClickCapture}
    >
      <div className="hero-cube__scene" ref={sceneRef}>
        {faces.map((f) => (
          <Link
            key={f.pos}
            to={f.path}
            tabIndex="-1"
            className={`hero-cube__face hero-cube__face--${f.pos}`}
            style={{ '--face-bg': f.bg, '--face-glow': f.glow }}
          >
            <span className="hero-cube__face-icon" aria-hidden="true">{f.icon}</span>
            <strong className="hero-cube__face-title">{f.title}</strong>
            <span className="hero-cube__face-sub">{f.sub}</span>
          </Link>
        ))}
      </div>
      <p className="hero-cube__hint">Arrastra para rotar · clic en una cara para explorar</p>
    </div>
  )
}

const MODULES = [
  { icon: '🥗', title: 'Nutrición', description: 'Guías alimenticias, recetas saludables y todo sobre hidratación y vitaminas.', path: ROUTES.NUTRICION, color: 'green' },
  { icon: '🏃', title: 'Actividad Física', description: 'Rutinas para todos los niveles, estiramientos y ejercicios de oficina.', path: ROUTES.ACTIVIDAD_FISICA, color: 'orange' },
  { icon: '🧠', title: 'Salud Mental', description: 'Mindfulness, manejo del estrés, sueño y bienestar emocional.', path: ROUTES.SALUD_MENTAL, color: 'purple' },
  { icon: '🛡️', title: 'Prevención', description: 'Información sobre diabetes, hipertensión, vacunación y chequeos médicos.', path: ROUTES.PREVENCION, color: 'blue' },
]

const STATS = [
  { value: '4', label: 'Módulos temáticos', desc: 'Nutrición, Actividad Física, Salud Mental y Prevención' },
  { value: 'AA', label: 'Cumple WCAG 2.2', desc: 'Accesible para todas las personas' },
  { value: '100%', label: 'Gratuito', desc: 'Sin registros ni pagos requeridos' },
  { value: '24/7', label: 'Disponible', desc: 'Acceso en cualquier dispositivo' },
]

const FEATURES = [
  { icon: '🔬', title: 'Basado en evidencia', desc: 'Contenido respaldado por guías de la OMS, CDC y el Ministerio de Salud del Ecuador.' },
  { icon: '♿', title: 'Universalmente accesible', desc: 'Diseñado bajo WCAG 2.2 Nivel AA para que nadie quede fuera por sus capacidades.' },
  { icon: '🔒', title: 'Sin publicidad ni datos', desc: 'No rastreamos a nuestros usuarios. Tu privacidad es un principio, no una política.' },
  { icon: '📱', title: 'Funciona en todo', desc: 'Optimizado para móvil, tablet y escritorio. Instalable como app desde el navegador.' },
]

export default function Home() {
  const [noticias, setNoticias] = useState([])
  const [loadingNoticias, setLoadingNoticias] = useState(true)

  useEffect(() => {
    getNoticias(null, 3)
      .then(({ docs }) => setNoticias(docs))
      .catch(() => {})
      .finally(() => setLoadingNoticias(false))
  }, [])

  return (
    <PageWrapper
      title="Inicio"
      description="Plataforma digital de salud preventiva. Nutrición, actividad física, salud mental y prevención de enfermedades."
    >
      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__content container">
          <div className="hero__text animate-fade-in-up">
            <span className="hero__tag">Plataforma de salud preventiva · Ecuador</span>
            <h1 id="hero-title" className="hero__title">
              Tu bienestar<br />
              <span className="hero__title-accent">comienza con la</span><br />
              prevención
            </h1>
            <p className="hero__description">
              Información confiable sobre salud física y mental, diseñada para
              todas las personas. Sin publicidad, sin registro, sin barreras.
            </p>
            <div className="hero__actions">
              <Link to={ROUTES.NUTRICION} className="btn btn--primary btn--lg">
                Explorar contenido
              </Link>
              <Link to={ROUTES.BIBLIOTECA} className="btn btn--outline btn--lg hero__btn-outline">
                Ver biblioteca
              </Link>
            </div>
            <div className="hero__trust">
              <span>✓ Basado en evidencia OMS</span>
              <span>✓ WCAG 2.2 AA</span>
              <span>✓ Gratuito</span>
            </div>
          </div>

          <div className="hero__visual animate-fade-in" aria-hidden="true">
            <div className="hero__orb hero__orb--1" />
            <div className="hero__orb hero__orb--2" />
            <div className="hero__orb hero__orb--3" />
            <HeroCube noticias={noticias} />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="home-stats section section--sm" aria-labelledby="stats-title">
        <div className="container">
          <h2 id="stats-title" className="sr-only">Datos de la plataforma</h2>
          <ul className="home-stats__list" role="list">
            {STATS.map((s) => (
              <li key={s.label} className="home-stats__item">
                <span className="home-stats__value">{s.value}</span>
                <span className="home-stats__label">{s.label}</span>
                <span className="home-stats__desc">{s.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Módulos ── */}
      <section className="section" aria-labelledby="modules-title">
        <div className="container">
          <header className="section__header">
            <span className="section__tag">Explora</span>
            <h2 id="modules-title" className="section__title">Áreas de salud preventiva</h2>
            <p className="section__subtitle">
              Información organizada por especialidades, accesible para toda la familia.
            </p>
          </header>
          <ul className="modules-grid" role="list">
            {MODULES.map((mod) => (
              <li key={mod.path}>
                <Link to={mod.path} className={`module-card module-card--${mod.color}`}>
                  <span className="module-card__icon" aria-hidden="true">{mod.icon}</span>
                  <h3 className="module-card__title">{mod.title}</h3>
                  <p className="module-card__desc">{mod.description}</p>
                  <span className="module-card__arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Por qué VitaPrevent ── */}
      <section className="section section--alt" aria-labelledby="features-title">
        <div className="container">
          <header className="section__header">
            <span className="section__tag">Nuestra propuesta</span>
            <h2 id="features-title" className="section__title">¿Por qué VitaPrevent?</h2>
            <p className="section__subtitle">
              Una plataforma diseñada con un propósito claro: democratizar el acceso a
              información de salud confiable para todos los ecuatorianos.
            </p>
          </header>
          <ul className="features-grid" role="list">
            {FEATURES.map((f) => (
              <li key={f.title} className="feature-card">
                <span className="feature-card__icon" aria-hidden="true">{f.icon}</span>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Últimas noticias ── */}
      <section className="section" aria-labelledby="news-home-title">
        <div className="container">
          <header className="section__header section__header--row">
            <div>
              <span className="section__tag">Actualidad</span>
              <h2 id="news-home-title" className="section__title">Últimas noticias de salud</h2>
            </div>
            <Link to={ROUTES.NOTICIAS} className="section__link">
              Ver todas las noticias →
            </Link>
          </header>

          {loadingNoticias ? (
            <SkeletonGrid count={3} />
          ) : noticias.length > 0 ? (
            <div className="cards-grid">
              {noticias.map((n) => <NewsCard key={n.id} noticia={n} />)}
            </div>
          ) : (
            <div className="home-news-empty">
              <p>Pronto publicaremos las primeras noticias de salud. ¡Mantente pendiente!</p>
              <Link to={ROUTES.CONTACTO} className="btn btn--outline">Contactar al equipo</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Biblioteca ── */}
      <section className="section section--dark" aria-labelledby="resources-title">
        <div className="container">
          <header className="section__header">
            <span className="section__tag" style={{ color: 'var(--color-blue-300)' }}>Recursos</span>
            <h2 id="resources-title" className="section__title" style={{ color: 'var(--color-white)' }}>
              Accede a nuestra biblioteca digital
            </h2>
            <p className="section__subtitle" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Infografías, videos, podcasts y guías descargables completamente gratuitos.
            </p>
          </header>
          <div className="home-cta-row">
            <Link to={ROUTES.BIBLIOTECA} className="btn btn--primary btn--lg">Ver biblioteca digital</Link>
            <Link to={ROUTES.NOTICIAS} className="btn btn--outline btn--lg home-cta-row__outline">Leer noticias de salud</Link>
          </div>
        </div>
      </section>

      {/* ── Contacto CTA ── */}
      <section className="section section--sm" aria-labelledby="contact-cta-title">
        <div className="container home-contact-cta">
          <div>
            <h2 id="contact-cta-title" className="home-contact-cta__title">¿Tienes preguntas sobre tu salud?</h2>
            <p className="home-contact-cta__desc">Nuestro equipo puede orientarte y recomendarte los recursos más adecuados.</p>
          </div>
          <Link to={ROUTES.CONTACTO} className="btn btn--primary btn--lg">Contactarnos</Link>
        </div>
      </section>
    </PageWrapper>
  )
}
