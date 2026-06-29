import { Component } from 'react'
import Button from '@components/ui/Button/Button'
import './ErrorBoundary.css'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="error-boundary" role="alert" aria-live="assertive">
        <div className="error-boundary__inner">
          <span className="error-boundary__icon" aria-hidden="true">⚠️</span>
          <h2 className="error-boundary__title">Algo salió mal</h2>
          <p className="error-boundary__desc">
            Se produjo un error inesperado en esta sección. Puedes intentar recargar la página o volver al inicio.
          </p>
          <div className="error-boundary__actions">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Recargar página
            </Button>
            <Button variant="outline" onClick={() => { this.setState({ hasError: false }); window.history.back() }}>
              Volver
            </Button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details className="error-boundary__details">
              <summary>Detalle del error (solo desarrollo)</summary>
              <pre>{this.state.error.toString()}</pre>
            </details>
          )}
        </div>
      </div>
    )
  }
}
