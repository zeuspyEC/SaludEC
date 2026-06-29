import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Badge from '@components/ui/Badge/Badge'
import './ArticleCard.css'

export default function ArticleCard({ articulo, moduloBase }) {
  const { titulo, resumen, imagen, categoria, slug, fechaActualizacion } = articulo

  const fecha = fechaActualizacion?.toDate?.()
  const fechaStr = fecha
    ? fecha.toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  const href = `/${moduloBase}/${slug}`

  return (
    <article className="article-card">
      {imagen?.url && (
        <Link to={href} tabIndex={-1} aria-hidden="true" className="article-card__img-link">
          <img
            src={imagen.url}
            alt={imagen.alt || ''}
            className="article-card__img"
            loading="lazy"
            width={400}
            height={240}
          />
        </Link>
      )}

      <div className="article-card__body">
        {categoria && (
          <Badge variant="primary" size="sm">{categoria}</Badge>
        )}

        <h3 className="article-card__title">
          <Link to={href} className="article-card__title-link">
            {titulo}
          </Link>
        </h3>

        {resumen && (
          <p className="article-card__summary">{resumen}</p>
        )}

        {fechaStr && (
          <time dateTime={fecha.toISOString()} className="article-card__date">
            {fechaStr}
          </time>
        )}
      </div>
    </article>
  )
}

ArticleCard.propTypes = {
  articulo: PropTypes.shape({
    titulo: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    resumen: PropTypes.string,
    imagen: PropTypes.shape({ url: PropTypes.string, alt: PropTypes.string }),
    categoria: PropTypes.string,
    fechaActualizacion: PropTypes.object,
  }).isRequired,
  moduloBase: PropTypes.string.isRequired,
}
