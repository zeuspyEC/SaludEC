import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Badge from '@components/ui/Badge/Badge'
import './NewsCard.css'

export default function NewsCard({ noticia, featured = false }) {
  const { id, titulo, resumen, imagen, fecha, categoria } = noticia

  const fechaObj = fecha?.toDate?.()
  const fechaStr = fechaObj
    ? fechaObj.toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <article className={`news-card ${featured ? 'news-card--featured' : ''}`}>
      {imagen?.url && (
        <Link to={`/noticias/${id}`} tabIndex={-1} aria-hidden="true" className="news-card__img-link">
          <img
            src={imagen.url}
            alt={imagen.alt || ''}
            className="news-card__img"
            loading={featured ? 'eager' : 'lazy'}
            width={featured ? 800 : 400}
            height={featured ? 450 : 225}
          />
        </Link>
      )}

      <div className="news-card__body">
        <div className="news-card__meta">
          {categoria && <Badge variant="primary" size="sm">{categoria}</Badge>}
          {fechaStr && (
            <time dateTime={fechaObj?.toISOString()} className="news-card__date">
              {fechaStr}
            </time>
          )}
        </div>

        <h3 className={`news-card__title ${featured ? 'news-card__title--lg' : ''}`}>
          <Link to={`/noticias/${id}`} className="news-card__title-link">
            {titulo}
          </Link>
        </h3>

        {resumen && <p className="news-card__summary">{resumen}</p>}

        <Link to={`/noticias/${id}`} className="news-card__read-more" aria-label={`Leer más sobre ${titulo}`}>
          Leer más &rarr;
        </Link>
      </div>
    </article>
  )
}

NewsCard.propTypes = {
  noticia: PropTypes.shape({
    id: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    resumen: PropTypes.string,
    imagen: PropTypes.shape({ url: PropTypes.string, alt: PropTypes.string }),
    fecha: PropTypes.object,
    categoria: PropTypes.string,
  }).isRequired,
  featured: PropTypes.bool,
}
