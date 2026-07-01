import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PropTypes from 'prop-types'
import Breadcrumb from '@components/layout/Breadcrumb/Breadcrumb'
import Badge from '@components/ui/Badge/Badge'
import PageWrapper from '@components/layout/PageWrapper/PageWrapper'
import './ArticleDetail.css'

const MODULO_LABEL = {
  'nutricion': 'Nutrición',
  'actividad-fisica': 'Actividad Física',
  'salud-mental': 'Salud Mental',
  'prevencion': 'Prevención',
}

// Renderer para imágenes dentro del contenido Markdown
const mdComponents = {
  img({ src, alt, title }) {
    const descr = alt || title || 'Imagen del artículo'
    return (
      <img
        src={src}
        alt={descr}
        title={title || descr}
        loading="lazy"
        className="prose-img"
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
      />
    )
  },
}

export default function ArticleDetail({ articulo, volverRuta, volverLabel, moduloPath }) {
  const fecha = articulo.actualizadoEn?.toDate?.() ?? articulo.creadoEn?.toDate?.()
  const fechaStr = fecha?.toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })

  const breadcrumbItems = [
    { label: 'Inicio', path: '/' },
    { label: volverLabel.replace('Volver a ', ''), path: volverRuta },
    { label: articulo.titulo, path: moduloPath ?? volverRuta },
  ]

  // Evita mostrar fuentes duplicadas si el contenido ya las incluye al final
  const contenidoLimpio = (articulo.contenido || '').replace(/\n\*\*Fuentes:\*\*.*$/s, '')

  return (
    <PageWrapper title={articulo.titulo} description={articulo.resumen}>
      <div className="article-detail container">
        <Breadcrumb customItems={breadcrumbItems} />

        <article aria-labelledby="articulo-titulo">
          {articulo.imagen?.url && (
            <div className="article-detail__hero">
              <img
                src={articulo.imagen.url}
                alt={articulo.imagen.alt || articulo.titulo}
                title={articulo.imagen.alt || articulo.titulo}
                className="article-detail__hero-img"
                loading="eager"
                width={1200}
                height={500}
              />
            </div>
          )}

          <header className="article-detail__header">
            <div className="article-detail__meta">
              {articulo.modulo && (
                <Badge variant="primary" size="sm">{MODULO_LABEL[articulo.modulo] ?? articulo.modulo}</Badge>
              )}
              {articulo.categoria && (
                <Badge variant="info" size="sm">{articulo.categoria}</Badge>
              )}
              {fechaStr && (
                <time dateTime={fecha.toISOString()} className="article-detail__fecha">
                  <span className="sr-only">Actualizado el </span>{fechaStr}
                </time>
              )}
            </div>

            <h1 id="articulo-titulo" className="article-detail__titulo">
              {articulo.titulo}
            </h1>

            {articulo.resumen && (
              <p className="article-detail__resumen">{articulo.resumen}</p>
            )}
          </header>

          <div className="prose article-detail__body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {contenidoLimpio}
            </ReactMarkdown>
          </div>

          {articulo.fuentes && (
            <aside className="article-detail__fuentes" aria-label="Fuentes y referencias del artículo">
              <h2 className="article-detail__fuentes-title">Fuentes y referencias</h2>
              <p className="article-detail__fuentes-text">{articulo.fuentes}</p>
              {articulo.fuenteUrl && (
                <a
                  href={articulo.fuenteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-detail__fuente-link"
                  aria-label={`Ver fuente original de este artículo (abre en nueva pestaña)`}
                >
                  Ver fuente original<span aria-hidden="true"> →</span><span className="sr-only"> (abre en nueva pestaña)</span>
                </a>
              )}
            </aside>
          )}

          <footer className="article-detail__footer">
            <Link to={volverRuta} className="article-detail__volver">
              ← {volverLabel}
            </Link>
          </footer>
        </article>
      </div>
    </PageWrapper>
  )
}

ArticleDetail.propTypes = {
  articulo: PropTypes.shape({
    titulo: PropTypes.string.isRequired,
    resumen: PropTypes.string,
    contenido: PropTypes.string,
    imagen: PropTypes.shape({ url: PropTypes.string, alt: PropTypes.string }),
    fuentes: PropTypes.string,
    fuenteUrl: PropTypes.string,
    modulo: PropTypes.string,
    categoria: PropTypes.string,
    actualizadoEn: PropTypes.object,
    creadoEn: PropTypes.object,
  }).isRequired,
  volverRuta: PropTypes.string.isRequired,
  volverLabel: PropTypes.string.isRequired,
  moduloPath: PropTypes.string,
}
