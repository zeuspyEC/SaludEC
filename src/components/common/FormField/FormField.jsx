import PropTypes from 'prop-types'
import './FormField.css'

export default function FormField({
  id,
  label,
  type = 'text',
  required = false,
  error,
  hint,
  as: Tag = 'input',
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined
  const hintId  = hint  ? `${id}-hint`  : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && (
          <span className="form-field__required" aria-hidden="true"> *</span>
        )}
      </label>

      {hint && (
        <span id={hintId} className="form-field__hint">
          {hint}
        </span>
      )}

      <Tag
        id={id}
        name={id}
        type={Tag === 'input' ? type : undefined}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className="form-field__control"
        {...props}
      />

      {error && (
        <span id={errorId} role="alert" className="form-field__error">
          <span aria-hidden="true">⚠ </span>
          {error}
        </span>
      )}
    </div>
  )
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  as: PropTypes.elementType,
}
