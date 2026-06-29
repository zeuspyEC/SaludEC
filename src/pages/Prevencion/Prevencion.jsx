import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import SectionHero from '@components/common/SectionHero/SectionHero'
import ArticleCard from '@components/common/ArticleCard/ArticleCard'
import Accordion from '@components/common/Accordion/Accordion'
import Spinner from '@components/ui/Spinner/Spinner'
import { getArticulosByModulo, getArticuloBySlug } from '@services/articulos.service'
import './Prevencion.css'

const AREAS = ['Todos', 'Vacunación', 'Factores de riesgo', 'Enfermedades crónicas', 'Tamizajes', 'Medio ambiente']

const PILARES = [
  { icon: '💉', title: 'Vacunación', desc: 'Las vacunas son la herramienta de salud pública más efectiva para prevenir enfermedades infecciosas.', color: 'blue' },
  { icon: '🔬', title: 'Tamizajes y chequeos', desc: 'Los controles médicos periódicos permiten detectar enfermedades en etapas tempranas cuando son más tratables.', color: 'teal' },
  { icon: '🚭', title: 'Factores de riesgo', desc: 'Identificar y modificar factores de riesgo como el tabaco, el sedentarismo o la dieta reduce la carga de enfermedad.', color: 'orange' },
  { icon: '🌿', title: 'Entorno saludable', desc: 'El ambiente físico y social donde vivimos influye directamente en nuestra salud y calidad de vida.', color: 'green' },
]

const FAQS = [
  { id: 'pv1', question: '¿Cuáles son las enfermedades crónicas más prevalentes en Ecuador?', answer: 'Las enfermedades cardiovasculares, la diabetes tipo 2, la hipertensión arterial y el cáncer son las principales causas de morbimortalidad en Ecuador, muchas de ellas prevenibles con cambios de estilo de vida.' },
  { id: 'pv2', question: '¿Con qué frecuencia debo hacerme chequeos médicos?', answer: 'Para adultos sanos se recomienda un chequeo general anual. La frecuencia puede variar según la edad, sexo, antecedentes familiares y factores de riesgo presentes. Tu médico es quien mejor puede orientarte.' },
  { id: 'pv3', question: '¿Qué vacunas deben tener los adultos?', answer: 'Además del esquema infantil completo, los adultos deben actualizar la vacuna contra el tétanos, y según su situación: influenza anual, hepatitis B, neumococo, herpes zóster y otras recomendadas por el MSP.' },
  { id: 'pv4', question: '¿La prevención primaria y secundaria son lo mismo?', answer: 'No. La prevención primaria evita que aparezca la enfermedad (vacunas, dieta, ejercicio). La secundaria detecta enfermedades en etapas tempranas mediante tamizajes (mamografías, Papanicolau, glucosa en ayunas). La terciaria reduce complicaciones de enfermedades ya establecidas.' },
]

export default function Prevencion() {
  const { slug } = useParams()
  const [articulos, setArticulos] = useState([])
  const [area, setArea] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [articulo, setArticulo] = useState(null)

  useEffect(() => {
    if (slug) {
      getArticuloBySlug(slug).then((a) => { setArticulo(a); setLoading(false) })
    } else {
      setLoading(true)
      getArticulosByModulo('prevencion', area === 'Todos' ? null : area)
        .then(setArticulos).finally(() => setLoading(false))
    }
  }, [slug, area])

  if (slug && articulo) {
    return (
      <PageWrapper title={articulo.titulo}>
        <div className="container module-article">
          <Breadcrumb />
          {articulo.imagen?.url && <img src={articulo.imagen.url} alt={articulo.imagen.alt || ''} className="module-article__img" />}
          <article className="prose"><h1>{articulo.titulo}</h1><div dangerouslySetInnerHTML={{ __html: articulo.contenido }} /></article>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Prevención de Enfermedades" description="Vacunación, factores de riesgo, chequeos médicos y estrategias para prevenir enfermedades crónicas.">
      <SectionHero
        tag="Salud preventiva"
        title="Prevención de enfermedades"
        description="La mejor medicina es la que se anticipa. Descubre cómo los hábitos preventivos y los controles periódicos pueden proteger tu salud a largo plazo."
        icon="🛡️"
        gradient="teal"
      />

      <div className="module-page container">
        <Breadcrumb />

        {/* Pilares */}
        <section aria-labelledby="pilares-title" className="benefits-section">
          <h2 id="pilares-title" className="module-section-title">Pilares de la prevención</h2>
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
              {AREAS.map((a) => (
                <button key={a} onClick={() => setArea(a)} className={`filter-btn ${area === a ? 'filter-btn--active' : ''}`} aria-pressed={area === a}>{a}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="module-loading"><Spinner size="lg" label="Cargando artículos de prevención…" /></div>
          ) : articulos.length > 0 ? (
            <div className="cards-grid">{articulos.map((a) => <ArticleCard key={a.id} articulo={a} moduloBase="prevencion" />)}</div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🛡️</div>
              <h3>Próximamente</h3>
              <p>Estamos preparando guías de prevención. ¡Vuelve pronto!</p>
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
