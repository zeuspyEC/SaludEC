import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import SkipLink from '@components/layout/SkipLink/SkipLink'
import Navbar from '@components/layout/Navbar/Navbar'
import Footer from '@components/layout/Footer/Footer'
import Spinner from '@components/ui/Spinner/Spinner'
import ProtectedRoute from '@components/layout/ProtectedRoute/ProtectedRoute'
import AdminShell from '@components/layout/AdminShell/AdminShell'
import { ROUTES } from '@config/routes'

// Páginas públicas
const Home            = lazy(() => import('@pages/Home/Home'))
const Nutricion       = lazy(() => import('@pages/Nutricion/Nutricion'))
const ActividadFisica = lazy(() => import('@pages/ActividadFisica/ActividadFisica'))
const SaludMental     = lazy(() => import('@pages/SaludMental/SaludMental'))
const Prevencion      = lazy(() => import('@pages/Prevencion/Prevencion'))
const Biblioteca      = lazy(() => import('@pages/Biblioteca/Biblioteca'))
const Noticias        = lazy(() => import('@pages/Noticias/Noticias'))
const Contacto        = lazy(() => import('@pages/Contacto/Contacto'))
const Nosotros        = lazy(() => import('@pages/Nosotros/Nosotros'))
const NotFound        = lazy(() => import('@pages/NotFound/NotFound'))

// Panel de administración
const AdminLogin      = lazy(() => import('@pages/Admin/Login/Login'))
const AdminDashboard  = lazy(() => import('@pages/Admin/Dashboard/Dashboard'))
const AdminArticulos  = lazy(() => import('@pages/Admin/Articulos/Articulos'))
const AdminMensajes   = lazy(() => import('@pages/Admin/Mensajes/Mensajes'))

function PageLoader() {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      role="status"
      aria-label="Cargando página…"
    >
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Login del admin (sin shell) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Rutas del panel de administración ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="articulos" element={<AdminArticulos />} />
          <Route path="mensajes" element={<AdminMensajes />} />
        </Route>

        {/* ── Sitio público ── */}
        <Route
          path="*"
          element={
            <>
              <SkipLink />
              <Navbar />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/"                       element={<Home />} />
                  <Route path={ROUTES.NUTRICION}        element={<Nutricion />} />
                  <Route path="/nutricion/:slug"        element={<Nutricion />} />
                  <Route path={ROUTES.ACTIVIDAD_FISICA} element={<ActividadFisica />} />
                  <Route path="/actividad-fisica/:slug" element={<ActividadFisica />} />
                  <Route path={ROUTES.SALUD_MENTAL}     element={<SaludMental />} />
                  <Route path="/salud-mental/:slug"     element={<SaludMental />} />
                  <Route path={ROUTES.PREVENCION}       element={<Prevencion />} />
                  <Route path="/prevencion/:slug"       element={<Prevencion />} />
                  <Route path={ROUTES.BIBLIOTECA}       element={<Biblioteca />} />
                  <Route path={ROUTES.NOTICIAS}         element={<Noticias />} />
                  <Route path="/noticias/:id"           element={<Noticias />} />
                  <Route path={ROUTES.CONTACTO}         element={<Contacto />} />
                  <Route path={ROUTES.NOSOTROS}         element={<Nosotros />} />
                  <Route path="*"                       element={<NotFound />} />
                </Routes>
              </Suspense>
              <Footer />
            </>
          }
        />
      </Routes>
    </Suspense>
  )
}
