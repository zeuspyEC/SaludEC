import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import './Toast.css'

export default function Toast({ toasts, onRemove }) {
  return createPortal(
    <div className="toast-container" aria-label="Notificaciones">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  )
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration ?? 5000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={`toast toast--${toast.type ?? 'info'}`}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <p className="toast__message">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="toast__close"
        aria-label="Cerrar notificación"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  )
}

Toast.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    duration: PropTypes.number,
  })).isRequired,
  onRemove: PropTypes.func.isRequired,
}

ToastItem.propTypes = {
  toast: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
}
