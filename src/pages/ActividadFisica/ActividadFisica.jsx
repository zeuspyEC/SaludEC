import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import SectionHero from '@components/common/SectionHero/SectionHero'
import ArticleCard from '@components/common/ArticleCard/ArticleCard'
import Accordion from '@components/common/Accordion/Accordion'
import Spinner from '@components/ui/Spinner/Spinner'
import { getArticulosByModulo, getArticuloBySlug } from '@services/articulos.service'
import './ActividadFisica.css'

const NIVELES = ['Todos', 'Principiante', 'Intermedio', 'Avanzado']

const BENEFICIOS = [
  { icon: '❤️', title: 'Salud cardiovascular', desc: 'Reduce el riesgo de enfermedades del corazón hasta en un 35%.' },
  { icon: '🧠', title: 'Salud mental', desc: 'Libera endorfinas que mejoran el estado de ánimo y reducen el estrés.' },
  { icon: '💪', title: 'Fuerza muscular', desc: 'Mantiene la masa muscular y mejora la postura y la movilidad.' },
  { icon: '😴', title: 'Mejor sueño', desc: 'La actividad física regular favorece un sueño más profundo y reparador.' },
  { icon: '⚡', title: 'Más energía', desc: 'Aumenta los niveles de energía y reduce la fatiga crónica.' },
  { icon: '🛡️', title: 'Sistema inmune', desc: 'Fortalece las defensas del organismo frente a enfermedades.' },
]

const FAQS = [
  { id: 'af1', question: '¿Cuánto ejercicio debo hacer a la semana?', answer: 'La OMS recomienda al menos 150–300 minutos de actividad aeróbica moderada o 75–150 minutos de actividad vigorosa por semana para adultos, más ejercicios de fortalecimiento muscular 2 días a la semana.' },
  { id: 'af2', question: '¿Puedo ejercitarme si tengo problemas de salud?', answer: 'Sí, con la orientación adecuada. Consulta con tu médico antes de iniciar cualquier programa de ejercicio si tienes condiciones crónicas como hipertensión, diabetes o problemas articulares.' },
  { id: 'af3', question: '¿Es mejor ejercitarse en ayunas?', answer: 'No existe una respuesta única. Depende del tipo de ejercicio y de cada persona. Para actividades de baja-media intensidad, el ejercicio en ayunas puede ser bien tolerado. Para entrenamientos intensos, es recomendable comer algo ligero 1-2 horas antes.' },
  { id: 'af4', question: '¿Cuánto tiempo debe durar el calentamiento?', answer: 'Un calentamiento adecuado dura entre 5 y 10 minutos e incluye movilidad articular y ejercicio aeróbico suave. Es fundamental para prevenir lesiones y preparar el cuerpo para el esfuerzo.' },
]

export default function ActividadFisica() {
  const { slug } = useParams()
  const [articulos, setArticulos] = useState([])
  const [nivel, setNivel] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [articulo, setArticulo] = useState(null)

  useEffect(() => {
    if (slug) {
      getArticuloBySlug(slug).then((a) => { setArticulo(a); setLoading(false) })
    } else {
      setLoading(true)
      getArticulosByModulo('actividad-fisica', nivel === 'Todos' ? null : nivel)
        .then(setArticulos).finally(() => setLoading(false))
    }
  }, [slug, nivel])

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
    <PageWrapper title="Actividad Física" description="Rutinas de ejercicio, estiramientos y consejos de actividad física para todos los niveles y edades.">
      <SectionHero
        tag="Movimiento y bienestar"
        title="Actividad Física"
        description="Rutinas adaptadas a tu nivel, estiramientos, ejercicios de oficina y todo lo que necesitas para mantenerte activo."
        icon="🏃"
        gradient="orange"
      />

      <div className="module-page container">
        <Breadcrumb />

        {/* Beneficios */}
        <section aria-labelledby="beneficios-title" className="benefits-section">
          <h2 id="beneficios-title" className="module-section-title">Beneficios de la actividad regular</h2>
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
            <h2 id="rutinas-title" className="module-section-title">Rutinas y guías</h2>
            <div className="module-filters" role="group" aria-label="Filtrar por nivel">
              {NIVELES.map((n) => (
                <button key={n} onClick={() => setNivel(n)} className={`filter-btn ${nivel === n ? 'filter-btn--active' : ''}`} aria-pressed={nivel === n}>{n}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="module-loading"><Spinner size="lg" label="Cargando rutinas…" /></div>
          ) : articulos.length > 0 ? (
            <div className="cards-grid">
              {articulos.map((a) => <ArticleCard key={a.id} articulo={a} moduloBase="actividad-fisica" />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🏃</div>
              <h3>Próximamente</h3>
              <p>Estamos preparando rutinas de ejercicio. ¡Vuelve pronto!</p>
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
