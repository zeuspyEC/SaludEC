import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@config/firebase'
import { useAuth } from '@contexts/AuthContext'
import FormField from '@components/common/FormField/FormField'
import Button from '@components/ui/Button/Button'
import './Login.css'

export default function AdminLogin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  if (user) {
    navigate(from, { replace: true })
    return null
  }

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'El correo es obligatorio.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un correo válido.'
    if (!form.password) e.password = 'La contraseña es obligatoria.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setAuthError('')
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      const MSG = {
        'auth/user-not-found': 'No existe una cuenta con ese correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-credential': 'Credenciales inválidas.',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Espera unos minutos.',
      }
      setAuthError(MSG[err.code] || 'Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <div className="admin-login__logo" aria-hidden="true">VP</div>
          <h1 className="admin-login__title">Panel de administración</h1>
          <p className="admin-login__subtitle">Acceso exclusivo para el equipo de SaludEC</p>
        </div>

        {authError && (
          <div role="alert" className="admin-login__error">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Formulario de inicio de sesión administrativo">
          <FormField
            id="admin-email"
            label="Correo electrónico"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            error={errors.email}
            autoComplete="username"
          />
          <FormField
            id="admin-password"
            label="Contraseña"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            error={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
            {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </Button>
        </form>
      </div>
    </div>
  )
}
