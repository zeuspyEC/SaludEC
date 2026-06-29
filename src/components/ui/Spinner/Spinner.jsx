import PropTypes from 'prop-types'
import './Spinner.css'

export default function Spinner({ size = 'md', label = 'Cargando…' }) {
  return (
    <div className={`spinner spinner--${size}`} role="status" aria-label={label}>
      <div className="spinner__ring" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  label: PropTypes.string,
}
