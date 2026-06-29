import { createContext, useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Toast from '@components/common/Toast/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'info', duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }, [])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ success: (m) => add(m, 'success'), error: (m) => add(m, 'error'), warning: (m) => add(m, 'warning'), info: (m) => add(m, 'info') }}>
      {children}
      <Toast toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = { children: PropTypes.node.isRequired }

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}
