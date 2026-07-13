import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import SectionHero from '@components/common/SectionHero/SectionHero'
import ArticleCard from '@components/common/ArticleCard/ArticleCard'
import ArticleDetail from '@components/common/ArticleDetail/ArticleDetail'
import Accordion from '@components/common/Accordion/Accordion'
import Spinner from '@components/ui/Spinner/Spinner'
import FormField from '@components/common/FormField/FormField'
import Button from '@components/ui/Button/Button'
import Badge from '@components/ui/Badge/Badge'
import { getArticulosByModulo, getArticuloBySlug } from '@services/articulos.service'
import { calcularIMC, interpretarIMC, validateIMC } from '@utils/validators'
import ContextualHelp from '@components/common/ContextualHelp/ContextualHelp'
import './Nutricion.css'

const AYUDA_LINKS = [
  { href: 'tel:171', label: 'Línea 171 del MSP', desc: 'Información sobre centros de salud, citas y servicios — gratuita, 24/7', tel: true },
  { href: '/contacto', label: 'Formulario de contacto', desc: 'Envíanos tu consulta y te respondemos en breve' },
]

const CATEGORIAS = [
  { label: 'Todos', valor: null },
  { label: 'Consultas', valor: 'consultas' },
  { label: 'Centros MSP', valor: 'centros-msp' },
  { label: 'IESS', valor: 'iess' },
]

const FAQS_ESTATICAS = [
  { id: 'f1', question: '¿Cómo saco un turno en un centro de salud del MSP?', answer: 'Puedes solicitar turno de forma presencial en el centro de salud más cercano, por llamada al 171 (línea del MSP) o en algunos casos a través de la aplicación Salud en Línea del Ministerio de Salud Pública del Ecuador.' },
  { id: 'f2', question: '¿Qué servicios ofrece el primer nivel de atención?', answer: 'El primer nivel incluye consulta médica general, control prenatal, vacunación, salud bucal, medicina preventiva, enfermería y farmacia básica. Es la puerta de entrada al sistema de salud pública.' },
  { id: 'f3', question: '¿Necesito cédula para atenderme en el MSP?', answer: 'No. El MSP atiende a toda persona que requiera atención, independientemente de si tiene cédula ecuatoriana. Los extranjeros en situación irregular también tienen derecho a atención en emergencias y salud materno-infantil.' },
  { id: 'f4', question: '¿Cuál es la diferencia entre el MSP y el IESS?', answer: 'El MSP (Ministerio de Salud Pública) atiende a toda la ciudadanía de forma gratuita. El IESS (Instituto Ecuatoriano de Seguridad Social) atiende a trabajadores afiliados y sus dependientes. Ambos forman parte de la red pública integral de salud (RPIS).' },
]

export default function Nutricion() {
  const { slug } = useParams()
  const [articulos, setArticulos] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [loading, setLoading] = useState(true)
  const [articuloDetalle, setArticuloDetalle] = useState(null)
  const [imc, setImc] = useState({ peso: '', talla: '' })
  const [imcErrors, setImcErrors] = useState({})
  const [imcResult, setImcResult] = useState(null)

  useEffect(() => {
    if (slug) {
      getArticuloBySlug(slug).then((a) => { setArticuloDetalle(a); setLoading(false) })
    } else {
      setLoading(true)
      getArticulosByModulo('nutricion', categoriaActiva)
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
    return <ArticleDetail articulo={articuloDetalle} volverRuta="/atencion-primaria" volverLabel="Volver a Atención Primaria" />
  }

  return (
    <PageWrapper title="Atención Primaria" description="Servicios de atención primaria de salud en Ecuador: centros del MSP, IESS, cómo sacar turnos y qué incluye el primer nivel de atención.">
      <SectionHero
        tag="Red pública de salud"
        title="Atención Primaria de Salud"
        description="Conoce los servicios del primer nivel de atención en Ecuador: centros del MSP, unidades del IESS, cómo acceder, turnos y más."
        icon="🏥"
        gradient="green"
      />

      <div className="nutricion-page container">
        <Breadcrumb />

        {/* Filtros */}
        <div className="nutricion-filters" role="group" aria-label="Filtrar artículos por categoría">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategoriaActiva(cat.valor)}
              className={`filter-btn ${categoriaActiva === cat.valor ? 'filter-btn--active' : ''}`}
              aria-pressed={categoriaActiva === cat.valor}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Artículos */}
        <section aria-labelledby="articulos-title" className="section--sm">
          <h2 id="articulos-title" className="nutricion-section-title">Artículos de atención primaria</h2>
          {loading ? (
            <div className="nutricion-loading"><Spinner size="lg" label="Cargando artículos…" /></div>
          ) : articulos.length > 0 ? (
            <div className="cards-grid">
              {articulos.map((a) => <ArticleCard key={a.id} articulo={a} moduloBase="atencion-primaria" />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon" aria-hidden="true">🥗</div>
              <h3>Sin artículos en esta categoría</h3>
              <p>Prueba seleccionando «Todos» para ver todo el contenido disponible.</p>
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
                type="text"
                inputMode="decimal"
                pattern="[0-9]+([.,][0-9]+)?"
                autoComplete="off"
                required
                hint="En kilogramos (ej: 70 o 70,5)"
                error={imcErrors.peso}
                value={imc.peso}
                onChange={(e) => setImc((p) => ({ ...p, peso: e.target.value }))}
              />
              <FormField
                id="talla"
                label="Talla"
                type="text"
                inputMode="decimal"
                pattern="[0-9]+([.,][0-9]+)?"
                autoComplete="off"
                required
                hint="En centímetros (ej: 170 o 170,5)"
                error={imcErrors.talla}
                value={imc.talla}
                onChange={(e) => setImc((p) => ({ ...p, talla: e.target.value }))}
              />
              <Button type="submit" variant="primary">Calcular IMC</Button>
            </form>

            {imcResult && (
              <div
                className={`imc-result imc-result--${imcResult.color}`}
                role="status"
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
                  <tr className="imc-table__ok"><td><span className="imc-table__check" aria-hidden="true">✓ </span>Peso normal</td><td>18.5 – 24.9</td></tr>
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

        <ContextualHelp links={AYUDA_LINKS} />
      </div>
    </PageWrapper>
  )
}
