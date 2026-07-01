import PropTypes from 'prop-types'
import './ResourceCard.css'
import Badge from '@components/ui/Badge/Badge'

const TYPE_CONFIG = {
  video:      { label: 'Video',       icon: '▶', color: 'danger' },
  podcast:    { label: 'Podcast',     icon: '🎙', color: 'primary' },
  pdf:        { label: 'PDF',         icon: '📄', color: 'warning' },
  infografia: { label: 'Infografía',  icon: '📊', color: 'info' },
  guia:       { label: 'Guía',        icon: '📖', color: 'success' },
}

export default function ResourceCard({ recurso }) {
  const { titulo, descripcion, tipo, url, thumbnail } = recurso
  const config = TYPE_CONFIG[tipo] ?? { label: tipo, icon: '📁', color: 'default' }
  const isExternal = url?.startsWith('http')

  return (
    <article className="resource-card">
      <div className="resource-card__thumb">
        {thumbnail?.url ? (
          <img
            src={thumbnail.url}
            alt={thumbnail.alt || titulo}
            loading="lazy"
            className="resource-card__img"
            width={320}
            height={180}
          />
        ) : (
          <div className="resource-card__placeholder" aria-hidden="true">
            <span>{config.icon}</span>
          </div>
        )}
        <Badge variant={config.color} size="sm" className="resource-card__type-badge">
          {config.label}
        </Badge>
      </div>

      <div className="resource-card__body">
        <h3 className="resource-card__title">{titulo}</h3>
        {descripcion && <p className="resource-card__desc">{descripcion}</p>}

        <a
          href={url}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="resource-card__link"
          aria-label={`${config.label}: ${titulo}${isExternal ? ' (abre en nueva pestaña)' : ''}`}
        >
          {tipo === 'pdf' ? 'Descargar PDF' : tipo === 'video' ? 'Ver video' : 'Acceder'}
          {isExternal && <span className="sr-only"> (abre en nueva pestaña)</span>}
        </a>
      </div>
    </article>
  )
}

ResourceCard.propTypes = {
  recurso: PropTypes.shape({
    titulo: PropTypes.string.isRequired,
    tipo: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    thumbnail: PropTypes.shape({ url: PropTypes.string, alt: PropTypes.string }),
  }).isRequired,
}
