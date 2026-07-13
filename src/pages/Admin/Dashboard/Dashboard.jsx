import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '@config/firebase'
import Spinner from '@components/ui/Spinner/Spinner'
import { ejecutarSeed } from '@services/seed.service'
import { ejecutarCleanup } from '@services/cleanup.service'
import './Dashboard.css'

const STATS_CONFIG = [
  { key: 'articulos', label: 'Artículos', icon: '📝', color: 'blue', to: '/admin/articulos' },
  { key: 'noticias',  label: 'Noticias',  icon: '📰', color: 'teal', to: '/admin/noticias' },
  { key: 'recursos',  label: 'Recursos',  icon: '📚', color: 'violet', to: '/admin/recursos' },
  { key: 'mensajes',  label: 'Mensajes',  icon: '✉️', color: 'amber', to: '/admin/mensajes' },
]

const ACCIONES = [
  { to: '/admin/articulos/nuevo', icon: '✏️', label: 'Nuevo artículo', desc: 'Redactar y publicar contenido para un módulo' },
  { to: '/admin/noticias/nuevo',  icon: '📡', label: 'Nueva noticia',  desc: 'Agregar una noticia de salud pública' },
  { to: '/admin/recursos/nuevo',  icon: '📎', label: 'Nuevo recurso',  desc: 'Subir PDF, video, podcast o infografía' },
  { to: '/admin/mensajes',        icon: '✉️', label: 'Ver mensajes',   desc: 'Revisar consultas del formulario de contacto' },
]

const SEED_LABELS = {
  idle:    '🌱 Cargar contenido de ejemplo',
  running: 'Cargando…',
  done:    '✔ Contenido cargado',
  error:   '⚠ Error — reintentar',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [seedState, setSeedState] = useState('idle')
  const [seedLog, setSeedLog] = useState([])
  const [seedOpen, setSeedOpen] = useState(false)
  const [cleanState, setCleanState] = useState('idle')
  const [cleanLog, setCleanLog] = useState([])
  const [cleanOpen, setCleanOpen] = useState(false)
  const logRef = useRef(null)
  const cleanLogRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      try {
        const refs = ['articulos', 'noticias', 'recursos', 'mensajes'].map((c) => collection(db, c))
        const counts = await Promise.all(refs.map((r) => getCountFromServer(r)))
        setStats({
          articulos: counts[0].data().count,
          noticias:  counts[1].data().count,
          recursos:  counts[2].data().count,
          mensajes:  counts[3].data().count,
        })
      } catch {
        setStats({ articulos: 0, noticias: 0, recursos: 0, mensajes: 0 })
      }
    })()
  }, [])

  const handleClean = async () => {
    if (cleanState === 'running') return
    setCleanState('running')
    setCleanLog([])
    setCleanOpen(true)
    try {
      await ejecutarCleanup((msg) => {
        setCleanLog((prev) => [...prev, msg])
        setTimeout(() => cleanLogRef.current?.scrollTo(0, cleanLogRef.current.scrollHeight), 40)
      })
      setCleanState('done')
    } catch (e) {
      setCleanLog((prev) => [...prev, `Error: ${e.message}`])
      setCleanState('error')
    }
  }

  const handleSeed = async () => {
    if (seedState === 'running') return
    setSeedState('running')
    setSeedLog([])
    setSeedOpen(true)
    try {
      await ejecutarSeed((msg) => {
        setSeedLog((prev) => [...prev, msg])
        setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 40)
      })
      setSeedState('done')
    } catch (e) {
      setSeedLog((prev) => [...prev, `Error: ${e.message}`])
      setSeedState('error')
    }
  }

  return (
    <div className="dash">
      {/* ── Header ── */}
      <header className="dash__header">
        <div>
          <h1 className="dash__title">Dashboard</h1>
          <p className="dash__subtitle">Panel de administración de SaludEC</p>
        </div>
      </header>

      {/* ── Stats ── */}
      <section aria-labelledby="dash-stats-h">
        <h2 id="dash-stats-h" className="dash__section-label">Resumen</h2>
        <div className="dash__stats">
          {STATS_CONFIG.map(({ key, label, icon, color, to }) => (
            <Link key={key} to={to} className={`dash__stat dash__stat--${color}`}>
              <span className="dash__stat-icon" aria-hidden="true">{icon}</span>
              <div className="dash__stat-body">
                <span className="dash__stat-value">
                  {stats ? stats[key] : <Spinner size="sm" label="" />}
                </span>
                <span className="dash__stat-label">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Acciones rápidas ── */}
      <section aria-labelledby="dash-actions-h">
        <h2 id="dash-actions-h" className="dash__section-label">Acciones rápidas</h2>
        <div className="dash__actions">
          {ACCIONES.map((a) => (
            <Link key={a.to} to={a.to} className="dash__action">
              <span className="dash__action-icon" aria-hidden="true">{a.icon}</span>
              <div>
                <span className="dash__action-label">{a.label}</span>
                <span className="dash__action-desc">{a.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Cleanup ── */}
      <section aria-labelledby="dash-clean-h" className="dash__seed-section">
        <div className="dash__seed-bar">
          <div className="dash__seed-meta">
            <h2 id="dash-clean-h" className="dash__seed-title">Limpiar y corregir contenido</h2>
            <p className="dash__seed-hint">
              Elimina artículos duplicados, añade imágenes a los que no tienen y genera slugs en noticias sin URL. Seguro de re-ejecutar.
            </p>
          </div>
          <button
            className={`dash__seed-btn dash__seed-btn--${cleanState}`}
            onClick={handleClean}
            disabled={cleanState === 'running'}
            aria-busy={cleanState === 'running'}
          >
            {cleanState === 'running' && <Spinner size="sm" label="" />}
            {{ idle: '🧹 Limpiar contenido', running: 'Limpiando…', done: '✔ Limpieza completada', error: '⚠ Error — reintentar' }[cleanState]}
          </button>
        </div>
        {cleanOpen && cleanLog.length > 0 && (
          <div ref={cleanLogRef} className="dash__seed-log" role="log" aria-label="Registro de limpieza" tabIndex={0}>
            {cleanLog.map((line, i) => <p key={i} className="dash__seed-log-line">{line}</p>)}
          </div>
        )}
      </section>

      {/* ── Seed ── */}
      <section aria-labelledby="dash-seed-h" className="dash__seed-section">
        <div className="dash__seed-bar">
          <div className="dash__seed-meta">
            <h2 id="dash-seed-h" className="dash__seed-title">Contenido inicial</h2>
            <p className="dash__seed-hint">
              Carga artículos, noticias y recursos de ejemplo con fuentes del MSP, IESS y ECU 911.
              Los documentos ya existentes se omiten.
            </p>
          </div>
          <button
            className={`dash__seed-btn dash__seed-btn--${seedState}`}
            onClick={handleSeed}
            disabled={seedState === 'running' || seedState === 'done'}
            aria-busy={seedState === 'running'}
          >
            {seedState === 'running' && <Spinner size="sm" label="" />}
            {SEED_LABELS[seedState]}
          </button>
        </div>

        {seedOpen && seedLog.length > 0 && (
          <div
            ref={logRef}
            className="dash__seed-log"
            role="log"
            aria-label="Registro de importación"
            tabIndex={0}
          >
            {seedLog.map((line, i) => (
              <p key={i} className="dash__seed-log-line">{line}</p>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
