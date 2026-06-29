import PropTypes from 'prop-types'
import './Button.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <Tag
      className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true" />
      )}
      <span className={loading ? 'btn__text--loading' : ''}>{children}</span>
    </Tag>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  as: PropTypes.elementType,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}
