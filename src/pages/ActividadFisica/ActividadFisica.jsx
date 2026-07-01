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
import './ActividadFisica.css'

const CATEGORIAS = [
  { label: 'Todos', valor: null },
  { label: 'Esquema infantil', valor: 'infantil' },
  { label: 'Adultos', valor: 'adultos' },
  { label: 'Campaña MSP', valor: 'campanas' },
]

const BENEFICIOS = [
  { icon: '🛡️', title: 'Protección individual', desc: 'Las vacunas entrenan al sistema inmune para combatir enfermedades infecciosas.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Inmunidad de rebaño', desc: 'Al vacunarse, protege también a quienes no pueden recibir vacunas por edad o condición médica.' },
  { icon: '🦠', title: 'Control de epidemias', desc: 'La vacunación masiva ha erradicado la viruela y eliminado la polio en Ecuador.' },
  { icon: '💰', title: 'Gratuitas en el MSP', desc: 'El esquema nacional de vacunación es completamente gratuito en todos los centros del MSP.' },
  { icon: '📋', title: 'Carnet de vacunas', desc: 'El carnet de vacunación es un documento oficial que debes conservar toda la vida.' },
  { icon: '🌍', title: 'Reconocidas internacionalmente', desc: 'Las vacunas del MSP son reconocidas por organismos internacionales para viajes y trámites.' },
]

const FAQS = [
  { id: 'vac1', question: '¿Dónde me puedo vacunar gratis en Ecuador?', answer: 'En cualquier centro de salud del MSP a nivel nacional. No necesitas turno previo para la mayoría de vacunas del esquema regular. También en vacunatorios del IESS si eres afiliado.' },
  { id: 'vac2', question: '¿Qué vacunas necesita un recién nacido?', answer: 'Al nacer: BCG (tuberculosis) y Hepatitis B. Al mes: Hepatitis B. A los 2, 4 y 6 meses: Pentavalente, Polio, Rotavirus yNeumococo. Consulta el esquema completo en el MSP o en el carnet de salud infantil.' },
  { id: 'vac3', question: '¿Los adultos también necesitan vacunarse?', answer: 'Sí. Los adultos deben mantener actualizada la vacuna antitetánica (cada 10 años), influenza anual, y según su situación: hepatitis B, neumococo (mayores de 65 años) y otras recomendadas por el MSP.' },
  { id: 'vac4', question: '¿Son seguras las vacunas del MSP?', answer: 'Sí. Todas las vacunas del esquema nacional pasan por rigurosos controles de calidad internacionales (OPS/OMS) antes de ser aprobadas. Los efectos secundarios leves (dolor local, fiebre baja) son normales y temporales.' },
]

export default function ActividadFisica() {
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
      getArticulosByModulo('actividad-fisica', categoria)
        .then(setArticulos).finally(() => setLoading(false))
    }
  }, [slug, categoria])

  if (slug && articulo) {
    return <ArticleDetail articulo={articulo} volverRuta="/vacunacion" volverLabel="Volver a Vacunación" />
  }

  return (
    <PageWrapper title="Vacunación" description="Esquema nacional de vacunación del MSP en Ecuador: vacunas gratuitas, calendario infantil y programas para adultos.">
      <SectionHero
        tag="Salud pública"
        title="Vacunación"
        description="Esquema nacional de vacunación del MSP: vacunas gratuitas para niños, niñas, adolescentes y adultos en todo Ecuador."
        icon="💉"
        gradient="orange"
      />

      <div className="module-page container">
        <Breadcrumb />

        {/* Beneficios */}
        <section aria-labelledby="beneficios-title" className="benefits-section">
          <h2 id="beneficios-title" className="module-section-title">¿Por qué vacunarse?</h2>
          <ul className="benefits-grid" role="list">
            {BENEFICIOS.map((b) => (
              <li key={b.title} className="benefit-card">
                <span className="benefit-card__icon" aria-hidden="true">{b.icon}</span>
                <h3 className="benefit-card__title">{b.title}</h3>
                <p className="benefit-card__desc">{b.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Artículos */}
        <section aria-labelledby="rutinas-title">
          <div className="module-section-header">
            <h2 id="rutinas-title" className="module-section-title">Campañas y guías</h2>
            <div className="module-filters" role="group" aria-label="Filtrar artículos por categoría">
              {CATEGORIAS.map((c) => (
                <button key={c.label} onClick={() => setCategoria(c.valor)} className={`filter-btn ${categoria === c.valor ? 'filter-btn--active' : ''}`} aria-pressed={categoria === c.valor}>{c.label}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="module-loading"><Spinner size="lg" label="Cargando artículos de vacunación…" /></div>
          ) : articulos.length > 0 ? (
            <div className="cards-grid">
              {articulos.map((a) => <ArticleCard key={a.id} articulo={a} moduloBase="vacunacion" />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon" aria-hidden="true">🏃</div>
              <h3>Sin artículos en esta categoría</h3>
              <p>Prueba seleccionando «Todos» para ver todo el contenido disponible.</p>
            </div>
          )}
        </section>

        {/* FAQs */}
        <section className="module-faqs" aria-labelledby="faqs-af-title">
          <h2 id="faqs-af-title" className="module-section-title">Preguntas frecuentes</h2>
          <Accordion items={FAQS.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} allowMultiple />
        </section>
      </div>
    </PageWrapper>
  )
}
