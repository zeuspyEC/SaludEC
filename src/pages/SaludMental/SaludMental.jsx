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
import './SaludMental.css'

const CATEGORIAS = [
  { label: 'Todos', valor: null },
  { label: 'Técnicas', valor: 'tecnicas' },
  { label: 'Hábitos', valor: 'habitos' },
]

const SENALES = [
  { icon: '😴', text: 'Trastornos del sueño persistentes' },
  { icon: '😟', text: 'Tristeza o vacío emocional prolongados' },
  { icon: '⚡', text: 'Irritabilidad o cambios de humor frecuentes' },
  { icon: '🧠', text: 'Dificultad para concentrarse o tomar decisiones' },
  { icon: '🍽️', text: 'Cambios bruscos en el apetito o peso' },
  { icon: '🚪', text: 'Aislamiento social o pérdida de interés en actividades' },
  { icon: '💭', text: 'Pensamientos negativos recurrentes o sentimientos de culpa' },
  { icon: '💪', text: 'Fatiga extrema sin causa física aparente' },
]

const FAQS = [
  { id: 'sm1', question: '¿Cuál es la diferencia entre tristeza y depresión?', answer: 'La tristeza es una emoción normal ante eventos difíciles y suele ser temporal. La depresión es un trastorno clínico que persiste por semanas o meses, afecta el funcionamiento diario y requiere atención profesional.' },
  { id: 'sm2', question: '¿Qué es el mindfulness y cómo ayuda?', answer: 'El mindfulness o atención plena es la práctica de prestar atención al momento presente de forma consciente y sin juicio. Estudios clínicos demuestran que reduce el estrés, la ansiedad y mejora el bienestar general.' },
  { id: 'sm3', question: '¿Cuándo debo buscar ayuda profesional?', answer: 'Busca apoyo profesional si los síntomas persisten más de 2 semanas, interfieren con tu vida diaria, laboral o relaciones, o si experimentas pensamientos de hacerte daño. No hay que esperar una "crisis" para pedir ayuda.' },
  { id: 'sm4', question: '¿La salud mental puede afectar la salud física?', answer: 'Sí. El estrés crónico y los trastornos mentales pueden provocar o agravar enfermedades cardiovasculares, digestivas, inmunológicas y crónicas. La conexión mente-cuerpo es bidireccional.' },
]

export default function SaludMental() {
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
      getArticulosByModulo('salud-mental', categoria)
        .then(setArticulos).finally(() => setLoading(false))
    }
  }, [slug, categoria])

  if (slug && articulo) {
    return <ArticleDetail articulo={articulo} volverRuta="/salud-mental" volverLabel="Volver a Salud Mental" />
  }

  return (
    <PageWrapper title="Salud Mental" description="Servicios públicos de salud mental en Ecuador: centros de atención psicológica, líneas de crisis y recursos de apoyo emocional.">
      <SectionHero
        tag="Bienestar emocional"
        title="Salud Mental"
        description="Servicios públicos de salud mental en Ecuador: centros de atención del MSP e IESS, líneas de crisis disponibles 24/7 y recursos de apoyo."
        icon="🧠"
        gradient="purple"
      />

      <div className="module-page container">
        <Breadcrumb />

        <section className="alert-signals" aria-labelledby="signals-title">
          <h2 id="signals-title" className="module-section-title">Señales que merecen atención</h2>
          <p className="signals-intro">Identificar estas señales temprano puede marcar una gran diferencia. No ignores lo que te dice tu mente.</p>
          <ul className="signals-grid" role="list">
            {SENALES.map((s) => (
              <li key={s.text} className="signal-item">
                <span className="signal-item__icon" aria-hidden="true">{s.icon}</span>
                <span>{s.text}</span>
              </li>
            ))}
          </ul>
          <div className="signals-note" role="note">
            <strong>Importante:</strong> Si experimentas pensamientos de hacerte daño, busca ayuda profesional de inmediato o acude a urgencias.
          </div>
        </section>

        <section aria-labelledby="recursos-sm-title">
          <div className="module-section-header">
            <h2 id="recursos-sm-title" className="module-section-title">Artículos y recursos</h2>
            <div className="module-filters" role="group" aria-label="Filtrar artículos por categoría">
              {CATEGORIAS.map((c) => (
                <button key={c.label} onClick={() => setCategoria(c.valor)} className={`filter-btn ${categoria === c.valor ? 'filter-btn--active' : ''}`} aria-pressed={categoria === c.valor}>{c.label}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="module-loading"><Spinner size="lg" label="Cargando recursos de salud mental…" /></div>
          ) : articulos.length > 0 ? (
            <div className="cards-grid">{articulos.map((a) => <ArticleCard key={a.id} articulo={a} moduloBase="salud-mental" />)}</div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon" aria-hidden="true">🧠</div>
              <h3>Sin artículos en esta categoría</h3>
              <p>Prueba seleccionando «Todos» para ver todo el contenido disponible.</p>
            </div>
          )}
        </section>

        <section className="module-faqs" aria-labelledby="faqs-sm-title">
          <h2 id="faqs-sm-title" className="module-section-title">Preguntas frecuentes</h2>
          <Accordion items={FAQS.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} allowMultiple />
        </section>
      </div>
    </PageWrapper>
  )
}
