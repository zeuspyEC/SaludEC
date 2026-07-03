import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import NewsCard from '@components/common/NewsCard/NewsCard'
import { SkeletonGrid } from '@components/common/Skeleton/Skeleton'
import { ROUTES } from '@config/routes'
import { getNoticias } from '@services/noticias.service'
import './Home.css'

const CUBE_MODS = [
  { pos: 'front', icon: '🏥', title: 'Atención Primaria', sub: 'Consultas y centros',  path: ROUTES.NUTRICION,        bg: 'rgba(22,163,74,0.10)',  glow: '#4ade80' },
  { pos: 'right', icon: '💉', title: 'Vacunación',         sub: 'Esquemas y programas', path: ROUTES.ACTIVIDAD_FISICA, bg: 'rgba(14,165,233,0.10)', glow: '#38bdf8' },
  { pos: 'back',  icon: '🧠', title: 'Salud Mental',       sub: 'Servicios públicos',   path: ROUTES.SALUD_MENTAL,    bg: 'rgba(147,51,234,0.10)', glow: '#c084fc' },
  { pos: 'left',  icon: '🚨', title: 'Emergencias',         sub: 'SAMU · ECU 911',      path: ROUTES.PREVENCION,      bg: 'rgba(220,38,38,0.10)',  glow: '#f87171' },
]

function HeroCube({ noticias, paused }) {
  const sceneRef = useRef(null)
  const rafRef   = useRef(null)
  const drag     = useRef({
    active: false, moved: false,
    startX: 0, startY: 0,
    lastX: 0,  lastY: 0,
    rotX: -20, rotY: 0,
  })
  const pausedRef = useRef(paused)
  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const d = drag.current
    const SPEED = 360 / (20 * 60)

    const tick = () => {
      if (!d.active && !pausedRef.current) d.rotY += SPEED
      if (sceneRef.current) {
        sceneRef.current.style.transform =
          `rotateX(${d.rotX}deg) rotateY(${d.rotY}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const onMove = (e) => {
      const dd = drag.current
      if (!dd.active) return
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      if (Math.hypot(cx - dd.startX, cy - dd.startY) > 4) dd.moved = true
      dd.rotY += (cx - dd.lastX) * 0.7
      dd.rotX -= (cy - dd.lastY) * 0.7
      dd.lastX = cx; dd.lastY = cy
    }
    const onUp = () => { drag.current.active = false }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend',  onUp,   { passive: true  })

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend',  onUp)
    }
  }, [])

  const onMouseDown = (e) => {
    if (e.button !== 0) return
    const d = drag.current
    d.active = true; d.moved = false
    d.startX = e.clientX; d.startY = e.clientY
    d.lastX  = e.clientX; d.lastY  = e.clientY
    e.preventDefault()
  }

  const onTouchStart = (e) => {
    const t = e.touches[0]
    const d = drag.current
    d.active = true; d.moved = false
    d.startX = t.clientX; d.startY = t.clientY
    d.lastX  = t.clientX; d.lastY  = t.clientY
    e.preventDefault()
  }

  const onClickCapture = (e) => { if (drag.current.moved) e.stopPropagation() }

  const topFace = noticias[0]
    ? { pos: 'top',    icon: '📰', title: noticias[0].titulo?.slice(0, 24) + (noticias[0].titulo?.length > 24 ? '…' : ''), sub: 'Última noticia',   path: `/noticias/${noticias[0].id}`, bg: 'rgba(8,145,178,0.10)', glow: '#22d3ee' }
    : { pos: 'top',    icon: '📋', title: 'Noticias',   sub: 'Actualidad en salud', path: ROUTES.NOTICIAS,    bg: 'rgba(8,145,178,0.10)', glow: '#22d3ee' }

  const bottomFace = noticias[1]
    ? { pos: 'bottom', icon: '🔔', title: noticias[1].titulo?.slice(0, 24) + (noticias[1].titulo?.length > 24 ? '…' : ''), sub: 'Noticia reciente', path: `/noticias/${noticias[1].id}`, bg: 'rgba(8,145,178,0.10)', glow: '#22d3ee' }
    : { pos: 'bottom', icon: '📚', title: 'Biblioteca', sub: 'Recursos digitales',  path: ROUTES.BIBLIOTECA,  bg: 'rgba(8,145,178,0.10)', glow: '#22d3ee' }

  const faces = [...CUBE_MODS, topFace, bottomFace]

  return (
    <div
      className="hero-cube"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onClickCapture={onClickCapture}
    >
      <div className="hero-cube__scene" ref={sceneRef}>
        {faces.map((f) => (
          <div
            key={f.pos}
            className={`hero-cube__face hero-cube__face--${f.pos}`}
            style={{ '--face-bg': f.bg, '--face-glow': f.glow }}
          >
            <Link to={f.path} tabIndex="-1" className="hero-cube__face-front">
              <span className="hero-cube__face-icon" aria-hidden="true">{f.icon}</span>
              <strong className="hero-cube__face-title">{f.title}</strong>
              <span className="hero-cube__face-sub">{f.sub}</span>
            </Link>
          </div>
        ))}
      </div>
      <p className="hero-cube__hint" aria-hidden="true">Arrastra para rotar · clic en una cara para explorar</p>
    </div>
  )
}

const MODULES = [
  { icon: '🏥', title: 'Atención Primaria', description: 'Centros de salud del MSP e IESS, cómo sacar turnos y qué servicios ofrece el primer nivel de atención.', path: ROUTES.NUTRICION, color: 'green' },
  { icon: '💉', title: 'Vacunación',         description: 'Esquema nacional de vacunación, campañas del MSP, requisitos y puntos de vacunación en tu provincia.', path: ROUTES.ACTIVIDAD_FISICA, color: 'orange' },
  { icon: '🧠', title: 'Salud Mental',       description: 'Servicios públicos de salud mental, líneas de crisis, centros de atención psicológica y recursos de apoyo.', path: ROUTES.SALUD_MENTAL, color: 'purple' },
  { icon: '🚨', title: 'Emergencias',         description: 'ECU 911, SAMU, protocolos ante emergencias médicas, hospitales de guardia y primeros auxilios básicos.', path: ROUTES.PREVENCION, color: 'blue' },
]

const STATS = [
  { value: '4', label: 'Servicios públicos', desc: 'Atención primaria, vacunación, salud mental y emergencias' },
  { value: 'AA', label: 'Cumple WCAG 2.2', desc: 'Accesible para todas las personas' },
  { value: '100%', label: 'Gratuito', desc: 'Sin registros ni pagos requeridos' },
  { value: '24/7', label: 'Disponible', desc: 'Acceso en cualquier dispositivo' },
]

/* Datos de salud pública Ecuador — fuentes: MSP 2023, INEC 2022, IESS 2024, ECU 911 2023 */
const EC_SALUD = [
  {
    valor: '3.279',
    unidad: 'establecimientos',
    titulo: 'Red pública de salud',
    desc: 'Centros del MSP a nivel nacional (primer y segundo nivel)',
    fuente: 'MSP 2023',
    color: 'green',
    pct: 82,
  },
  {
    valor: '81%',
    unidad: 'cobertura',
    titulo: 'Vacunación infantil',
    desc: 'Cobertura nacional de Pentavalente (3ra dosis) en menores de 1 año',
    fuente: 'MSP / PAI 2023',
    color: 'blue',
    pct: 81,
  },
  {
    valor: '4,2 M',
    unidad: 'afiliados activos',
    titulo: 'Cobertura IESS',
    desc: 'Trabajadores afiliados activos con derecho a atención de salud',
    fuente: 'IESS 2024',
    color: 'purple',
    pct: 58,
  },
  {
    valor: '46 M+',
    unidad: 'llamadas / año',
    titulo: 'ECU 911',
    desc: 'Llamadas de emergencia atendidas anualmente en todo el país',
    fuente: 'ECU 911 2023',
    color: 'red',
    pct: 92,
  },
]

const FEATURES = [
  {
    icon: '🏛️', color: 'blue',
    title: 'Fuentes oficiales del Estado',
    desc: 'Toda la información proviene de organismos oficiales: MSP, IESS, ECU 911, OPS y MINEDUC. Nada inventado, todo verificable.',
    tag: 'MSP · IESS · OPS',
  },
  {
    icon: '♿', color: 'violet',
    title: 'Accesible para todos',
    desc: 'Construido con WCAG 2.2 Nivel AA: lectores de pantalla, teclado, contraste alto y diseño responsive. Ningún ciudadano queda fuera.',
    tag: 'WCAG 2.2 AA',
    link: '/accesibilidad',
    linkLabel: 'Ver declaración de accesibilidad',
  },
  {
    icon: '🔒', color: 'green',
    title: 'Sin publicidad ni rastreo',
    desc: 'No vendemos datos ni mostramos publicidad. El sitio no usa Google Analytics ni cookies de seguimiento. Tu privacidad es un principio.',
    tag: 'Privacidad garantizada',
  },
  {
    icon: '📱', color: 'teal',
    title: 'Funciona en cualquier dispositivo',
    desc: 'Optimizado para celular, tablet y escritorio desde 320px. Carga rápida incluso con conexiones lentas gracias a code splitting y lazy loading.',
    tag: 'Móvil · Tablet · Escritorio',
  },
]

export default function Home() {
  const [noticias, setNoticias] = useState([])
  const [loadingNoticias, setLoadingNoticias] = useState(true)
  const [cubePaused, setCubePaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const toggleCube = useCallback(() => setCubePaused((p) => !p), [])

  useEffect(() => {
    getNoticias(null, 3)
      .then(({ docs }) => setNoticias(docs))
      .catch(() => {})
      .finally(() => setLoadingNoticias(false))
  }, [])

  return (
    <PageWrapper
      title="Inicio"
      description="Portal de servicios públicos de salud en Ecuador. Atención primaria, vacunación, salud mental y emergencias."
    >
      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__content container">
          <div className="hero__text animate-fade-in-up">
            <span className="hero__tag">Servicios públicos de salud · Ecuador</span>
            <h1 id="hero-title" className="hero__title">
              Tu salud,<br />
              <span className="hero__title-accent">un derecho</span><br />
              garantizado
            </h1>
            <p className="hero__description">
              Accede a información oficial sobre servicios públicos de salud en Ecuador.
              Atención primaria, vacunación, emergencias y más. Sin barreras.
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
              <span>✓ Fuentes MSP · OPS · IESS</span>
              <span>✓ WCAG 2.2 AA</span>
              <span>✓ Gratuito</span>
            </div>
          </div>

          <div className="hero__visual animate-fade-in">
            <div aria-hidden="true" role="presentation">
              <div className="hero__orb hero__orb--1" />
              <div className="hero__orb hero__orb--2" />
              <div className="hero__orb hero__orb--3" />
              <HeroCube noticias={noticias} paused={cubePaused} />
            </div>
            <button
              className="cube-pause-btn"
              onClick={toggleCube}
              aria-pressed={cubePaused}
              aria-label={cubePaused ? 'Reanudar rotación del cubo decorativo' : 'Pausar rotación del cubo decorativo'}
            >
              <span aria-hidden="true">{cubePaused ? '▶' : '⏸'}</span>
            </button>
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
            <span className="section__tag">Servicios</span>
            <h2 id="modules-title" className="section__title">Servicios públicos de salud</h2>
            <p className="section__subtitle">
              Encuentra información oficial sobre los servicios de salud disponibles para todos los ecuatorianos.
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

      {/* ── Ecuador en cifras de salud ── */}
      <section className="section" aria-labelledby="ec-salud-title">
        <div className="container">
          <header className="section__header">
            <span className="section__tag">Datos oficiales</span>
            <h2 id="ec-salud-title" className="section__title">Ecuador en cifras de salud</h2>
            <p className="section__subtitle">
              Indicadores del sistema de salud pública basados en fuentes oficiales del Estado ecuatoriano.
            </p>
          </header>
          <ul className="ec-salud__grid" role="list">
            {EC_SALUD.map((d) => (
              <li key={d.titulo} className={`ec-salud__card ec-salud__card--${d.color}`}>
                <div className="ec-salud__head">
                  <span className="ec-salud__valor" aria-label={`${d.valor} ${d.unidad}`}>
                    {d.valor}
                  </span>
                  <span className="ec-salud__unidad">{d.unidad}</span>
                </div>
                <h3 className="ec-salud__titulo">{d.titulo}</h3>
                <p className="ec-salud__desc">{d.desc}</p>
                {/* Barra de progreso visual */}
                <div
                  className="ec-salud__bar"
                  role="img"
                  aria-label={`Indicador: ${d.pct}%`}
                >
                  <div
                    className="ec-salud__bar-fill"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <cite className="ec-salud__fuente">Fuente: {d.fuente}</cite>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Por qué SaludEC ── */}
      <section className="section section--alt" aria-labelledby="features-title">
        <div className="container">
          <header className="section__header">
            <span className="section__tag">Nuestra propuesta</span>
            <h2 id="features-title" className="section__title">¿Por qué SaludEC?</h2>
            <p className="section__subtitle">
              Un portal diseñado para que cualquier ciudadano ecuatoriano pueda conocer
              y acceder a los servicios públicos de salud sin barreras.
            </p>
          </header>
          <ul className="features-grid" role="list">
            {FEATURES.map((f) => (
              <li key={f.title} className={`feature-card feature-card--${f.color}`}>
                <div className="feature-card__icon-wrap" aria-hidden="true">
                  <span className="feature-card__icon">{f.icon}</span>
                </div>
                <div className="feature-card__body">
                  {f.tag && <span className="feature-card__tag">{f.tag}</span>}
                  <h3 className="feature-card__title">{f.title}</h3>
                  <p className="feature-card__desc">{f.desc}</p>
                  {f.link && (
                    <Link to={f.link} className="feature-card__link">
                      {f.linkLabel}<span aria-hidden="true"> →</span>
                    </Link>
                  )}
                </div>
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
              Ver todas las noticias<span aria-hidden="true"> →</span>
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
