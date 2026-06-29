import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import SectionHero from '@components/common/SectionHero/SectionHero'
import ArticleCard from '@components/common/ArticleCard/ArticleCard'
import Accordion from '@components/common/Accordion/Accordion'
import Spinner from '@components/ui/Spinner/Spinner'
import FormField from '@components/common/FormField/FormField'
import Button from '@components/ui/Button/Button'
import Badge from '@components/ui/Badge/Badge'
import { getArticulosByModulo, getArticuloBySlug } from '@services/articulos.service'
import { calcularIMC, interpretarIMC, validateIMC } from '@utils/validators'
import './Nutricion.css'

const CATEGORIAS = ['Todos', 'Alimentación', 'Vitaminas', 'Hidratación', 'Recetas', 'Mitos']

const FAQS_ESTATICAS = [
  { id: 'f1', question: '¿Cuántas porciones de frutas y verduras debo comer al día?', answer: 'La OMS recomienda consumir al menos 400 g (cinco porciones) de frutas y hortalizas al día, excluyendo las papas, los camotes y otras raíces feculentas.' },
  { id: 'f2', question: '¿Es necesario tomar suplementos vitamínicos?', answer: 'En general, una dieta equilibrada y variada proporciona todos los nutrientes necesarios. Los suplementos se recomiendan en casos específicos como embarazo, déficit comprobado o dietas restrictivas.' },
  { id: 'f3', question: '¿Cuánta agua debo tomar al día?', answer: 'Para adultos sanos se recomiendan aproximadamente 2 litros de agua al día. Esto varía según el peso, la actividad física, el clima y el estado de salud individual.' },
  { id: 'f4', question: '¿Qué es el índice de masa corporal (IMC)?', answer: 'El IMC relaciona el peso y la talla para clasificar el estado nutricional. Se calcula dividiendo el peso en kg entre la talla en metros al cuadrado. Es una referencia orientativa, no un diagnóstico clínico.' },
]

export default function Nutricion() {
  const { slug } = useParams()
  const [articulos, setArticulos] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [articuloDetalle, setArticuloDetalle] = useState(null)
  const [imc, setImc] = useState({ peso: '', talla: '' })
  const [imcErrors, setImcErrors] = useState({})
  const [imcResult, setImcResult] = useState(null)

  useEffect(() => {
    if (slug) {
      getArticuloBySlug(slug).then((a) => { setArticuloDetalle(a); setLoading(false) })
    } else {
      const cat = categoriaActiva === 'Todos' ? null : categoriaActiva
      setLoading(true)
      getArticulosByModulo('nutricion', cat)
        .then(setArticulos)
        .finally(() => setLoading(false))
    }
  }, [slug, categoriaActiva])

  const calcularHandler = (e) => {
    e.preventDefault()
    const errors = validateIMC(imc)
    if (Object.keys(errors).length) { setImcErrors(errors); return }
    const valor = calcularIMC(parseFloat(imc.peso), parseFloat(imc.talla))
    setImcResult({ valor: valor.toFixed(1), ...interpretarIMC(valor) })
    setImcErrors({})
  }

  if (slug && articuloDetalle) {
    return (
      <PageWrapper title={articuloDetalle.titulo}>
        <div className="container nutricion-article">
          <Breadcrumb />
          {articuloDetalle.imagen?.url && (
            <img src={articuloDetalle.imagen.url} alt={articuloDetalle.imagen.alt || ''} className="nutricion-article__hero-img" />
          )}
          <article className="prose">
            <h1>{articuloDetalle.titulo}</h1>
            <div dangerouslySetInnerHTML={{ __html: articuloDetalle.contenido }} />
          </article>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Nutrición" description="Guías de alimentación saludable, recetas, vitaminas, hidratación y calculadora de IMC.">
      <SectionHero
        tag="Salud preventiva"
        title="Nutrición saludable"
        description="Información confiable sobre alimentación equilibrada, vitaminas esenciales, hidratación y hábitos nutritivos para toda la familia."
        icon="🥗"
        gradient="green"
      />

      <div className="nutricion-page container">
        <Breadcrumb />

        {/* Filtros */}
        <div className="nutricion-filters" role="group" aria-label="Filtrar artículos por categoría">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`filter-btn ${categoriaActiva === cat ? 'filter-btn--active' : ''}`}
              aria-pressed={categoriaActiva === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Artículos */}
        <section aria-labelledby="articulos-title" className="section--sm">
          <h2 id="articulos-title" className="nutricion-section-title">Artículos de nutrición</h2>
          {loading ? (
            <div className="nutricion-loading"><Spinner size="lg" label="Cargando artículos…" /></div>
          ) : articulos.length > 0 ? (
            <div className="cards-grid">
              {articulos.map((a) => <ArticleCard key={a.id} articulo={a} moduloBase="nutricion" />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🥗</div>
              <h3>Próximamente</h3>
              <p>Estamos preparando artículos de nutrición. ¡Vuelve pronto!</p>
            </div>
          )}
        </section>

        {/* Calculadora IMC */}
        <section className="imc-section" aria-labelledby="imc-title">
          <div className="imc-section__intro">
            <h2 id="imc-title">Calculadora de IMC</h2>
            <p>El Índice de Masa Corporal (IMC) es una medida orientativa del estado nutricional. No sustituye la evaluación médica profesional.</p>
          </div>

          <div className="imc-section__layout">
            <form onSubmit={calcularHandler} className="imc-form" noValidate aria-label="Calculadora de Índice de Masa Corporal">
              <FormField
                id="peso"
                label="Peso"
                type="number"
                required
                hint="En kilogramos (ej: 70)"
                error={imcErrors.peso}
                value={imc.peso}
                onChange={(e) => setImc((p) => ({ ...p, peso: e.target.value }))}
                min="10" max="500" step="0.1"
              />
              <FormField
                id="talla"
                label="Talla"
                type="number"
                required
                hint="En centímetros (ej: 170)"
                error={imcErrors.talla}
                value={imc.talla}
                onChange={(e) => setImc((p) => ({ ...p, talla: e.target.value }))}
                min="50" max="250" step="0.1"
              />
              <Button type="submit" variant="primary">Calcular IMC</Button>
            </form>

            {imcResult && (
              <div
                className={`imc-result imc-result--${imcResult.color}`}
                role="status"
                aria-live="polite"
              >
                <span className="imc-result__value" aria-label={`IMC: ${imcResult.valor}`}>
                  {imcResult.valor}
                </span>
                <Badge variant={imcResult.color}>{imcResult.categoria}</Badge>
                <p className="imc-result__desc">{imcResult.descripcion}</p>
                <p className="imc-result__disclaimer">
                  Resultado orientativo. Consulta a un profesional de la salud.
                </p>
              </div>
            )}

            <div className="imc-table-wrap">
              <h3 className="imc-table__title">Tabla de referencia (adultos)</h3>
              <table className="imc-table">
                <caption className="sr-only">Clasificación del IMC según la OMS para adultos</caption>
                <thead>
                  <tr>
                    <th scope="col">Clasificación</th>
                    <th scope="col">IMC (kg/m²)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Bajo peso</td><td>&lt; 18.5</td></tr>
                  <tr className="imc-table__ok"><td>Peso normal</td><td>18.5 – 24.9</td></tr>
                  <tr><td>Sobrepeso</td><td>25.0 – 29.9</td></tr>
                  <tr><td>Obesidad grado I</td><td>30.0 – 34.9</td></tr>
                  <tr><td>Obesidad grado II</td><td>35.0 – 39.9</td></tr>
                  <tr><td>Obesidad grado III</td><td>≥ 40.0</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="section--sm" aria-labelledby="faqs-nutri-title">
          <h2 id="faqs-nutri-title" className="nutricion-section-title">Preguntas frecuentes</h2>
          <Accordion
            items={FAQS_ESTATICAS.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
            allowMultiple
          />
        </section>
      </div>
    </PageWrapper>
  )
}
