import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import SectionHero from '@components/common/SectionHero/SectionHero'
import ArticleCard from '@components/common/ArticleCard/ArticleCard'
import ArticleDetail from '@components/common/ArticleDetail/ArticleDetail'
import Accordion from '@components/common/Accordion/Accordion'
import Spinner from '@components/ui/Spinner/Spinner'
import { getArticulosByModulo, getArticuloBySlug } from '@services/articulos.service'
import './Prevencion.css'

const CATEGORIAS = [
  { label: 'Todos', valor: null },
  { label: 'Protocolos', valor: 'protocolos' },
  { label: 'Primeros auxilios', valor: 'primeros-auxilios' },
  { label: 'SAMU · ECU 911', valor: 'samu' },
]

const PILARES = [
  { icon: '📞', title: 'ECU 911', desc: 'Número único de emergencias en Ecuador para policía, bomberos y emergencias médicas. Disponible 24/7.', color: 'blue' },
  { icon: '🚑', title: 'SAMU', desc: 'Servicio de Atención Médica de Urgencias: ambulancias medicalizadas para emergencias graves y críticas.', color: 'teal' },
  { icon: '🏥', title: 'Hospitales de guardia', desc: 'Los hospitales del MSP mantienen guardia permanente para atención de emergencias sin necesidad de turno.', color: 'orange' },
  { icon: '🩹', title: 'Primeros auxilios', desc: 'Conocer los protocolos básicos de primeros auxilios puede salvar una vida mientras llega la ayuda profesional.', color: 'green' },
]

const FAQS = [
  { id: 'em1', question: '¿Cuándo debo llamar al ECU 911?', answer: 'Llama al 911 ante cualquier emergencia que requiera respuesta inmediata: pérdida de consciencia, dificultad para respirar, dolor de pecho intenso, accidente grave, incendio, crimen en curso o cualquier situación que ponga en riesgo una vida.' },
  { id: 'em2', question: '¿Qué es el SAMU y cómo se activa?', answer: 'El SAMU (Servicio de Atención Médica de Urgencias) es activado automáticamente cuando el ECU 911 determina que se necesita una ambulancia medicalizada. También puedes solicitarlo directamente al llamar al 911 describiendo la emergencia médica.' },
  { id: 'em3', question: '¿La atención de emergencias en hospitales del MSP es gratuita?', answer: 'Sí. Por ley, ningún hospital público puede negar la atención de emergencias ni condicionarla al pago previo. La atención de urgencias y emergencias en la red pública es gratuita para todos, independientemente de si son afiliados al IESS o no.' },
  { id: 'em4', question: '¿Qué hago ante un infarto o ACV?', answer: 'Ante dolor de pecho intenso o síntomas de ACV (cara caída, brazo débil, dificultad para hablar): llama inmediatamente al 911. No conduzcas al hospital por tu cuenta. El tiempo de respuesta en los primeros minutos es crítico para sobrevivir sin secuelas graves.' },
]

export default function Prevencion() {
  const { slug } = useParams()
  const [articulos, setArticulos] = useState([])
  const [categoria, setCategoria] = useState(null)
  const [loading, setLoading] = useState(true)
  const [articulo, setArticulo] = useState(null)

  useEffect(() => {
    if (slug) {
      getArticuloBySlug(slug).then((a) => { setArticulo(a); setLoading(false) })
    } else {
      setLoading(true)
      getArticulosByModulo('prevencion', categoria)
        .then(setArticulos).finally(() => setLoading(false))
    }
  }, [slug, categoria])

  if (slug && articulo) {
    return <ArticleDetail articulo={articulo} volverRuta="/emergencias" volverLabel="Volver a Emergencias" />
  }

  return (
    <PageWrapper title="Emergencias" description="Servicios de emergencia en Ecuador: ECU 911, SAMU, hospitales de guardia y protocolos de primeros auxilios.">
      <SectionHero
        tag="Servicios de emergencia"
        title="Emergencias"
        description="Información sobre el sistema de emergencias en Ecuador: cuándo llamar al 911, qué hace el SAMU, hospitales de guardia y primeros auxilios básicos."
        icon="🚨"
        gradient="teal"
      />

      <div className="module-page container">
        <Breadcrumb />

        {/* Pilares */}
        <section aria-labelledby="pilares-title" className="benefits-section">
          <h2 id="pilares-title" className="module-section-title">Sistema de emergencias de Ecuador</h2>
          <ul className="benefits-grid" role="list">
            {PILARES.map((p) => (
              <li key={p.title} className={`benefit-card info-card--${p.color}`}>
                <span className="benefit-card__icon" aria-hidden="true">{p.icon}</span>
                <h3 className="benefit-card__title">{p.title}</h3>
                <p className="benefit-card__desc">{p.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Artículos */}
        <section aria-labelledby="articulos-pv-title">
          <div className="module-section-header">
            <h2 id="articulos-pv-title" className="module-section-title">Guías y artículos</h2>
            <div className="module-filters" role="group" aria-label="Filtrar por área de prevención">
              {CATEGORIAS.map((c) => (
                <button key={c.label} onClick={() => setCategoria(c.valor)} className={`filter-btn ${categoria === c.valor ? 'filter-btn--active' : ''}`} aria-pressed={categoria === c.valor}>{c.label}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="module-loading"><Spinner size="lg" label="Cargando artículos de prevención…" /></div>
          ) : articulos.length > 0 ? (
            <div className="cards-grid">{articulos.map((a) => <ArticleCard key={a.id} articulo={a} moduloBase="emergencias" />)}</div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon" aria-hidden="true">🛡️</div>
              <h3>Sin artículos en esta categoría</h3>
              <p>Prueba seleccionando «Todos» para ver todo el contenido disponible.</p>
            </div>
          )}
        </section>

        {/* FAQs */}
        <section className="module-faqs" aria-labelledby="faqs-pv-title">
          <h2 id="faqs-pv-title" className="module-section-title">Preguntas frecuentes</h2>
          <Accordion items={FAQS.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} allowMultiple />
        </section>
      </div>
    </PageWrapper>
  )
}
