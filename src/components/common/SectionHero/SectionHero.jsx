import PropTypes from 'prop-types'
import './SectionHero.css'

export default function SectionHero({ tag, title, description, icon, gradient = 'blue', children }) {
  return (
    <section className={`section-hero section-hero--${gradient}`} aria-labelledby="section-hero-title">
      <div className="section-hero__bg" aria-hidden="true" />
      <div className="section-hero__content container">
        {icon && <span className="section-hero__icon" aria-hidden="true">{icon}</span>}
        {tag && <span className="section-hero__tag">{tag}</span>}
        <h1 id="section-hero-title" className="section-hero__title">{title}</h1>
        {description && <p className="section-hero__desc">{description}</p>}
        {children}
      </div>
    </section>
  )
}

SectionHero.propTypes = {
  tag: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.string,
  gradient: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'teal']),
  children: PropTypes.node,
}
