import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useParams, useLocation, useNavigationType } from 'react-router-dom'
import SkipLink from '@components/layout/SkipLink/SkipLink'
import Navbar from '@components/layout/Navbar/Navbar'
import Footer from '@components/layout/Footer/Footer'
import Spinner from '@components/ui/Spinner/Spinner'
import ProtectedRoute from '@components/layout/ProtectedRoute/ProtectedRoute'
import AdminShell from '@components/layout/AdminShell/AdminShell'
import BackToTop from '@components/ui/BackToTop/BackToTop'
import { ROUTES } from '@config/routes'

// Páginas públicas
const Home            = lazy(() => import('@pages/Home/Home'))
const Nutricion       = lazy(() => import('@pages/Nutricion/Nutricion'))
const ActividadFisica = lazy(() => import('@pages/ActividadFisica/ActividadFisica'))
const SaludMental     = lazy(() => import('@pages/SaludMental/SaludMental'))
const Prevencion      = lazy(() => import('@pages/Prevencion/Prevencion'))
const Noticias        = lazy(() => import('@pages/Noticias/Noticias'))
const Contacto        = lazy(() => import('@pages/Contacto/Contacto'))
const Nosotros        = lazy(() => import('@pages/Nosotros/Nosotros'))
const NotFound        = lazy(() => import('@pages/NotFound/NotFound'))

// Panel de administración
const AdminLogin      = lazy(() => import('@pages/Admin/Login/Login'))
const AdminDashboard  = lazy(() => import('@pages/Admin/Dashboard/Dashboard'))
const AdminArticulos  = lazy(() => import('@pages/Admin/Articulos/Articulos'))
const AdminMensajes   = lazy(() => import('@pages/Admin/Mensajes/Mensajes'))
const AdminNoticias     = lazy(() => import('@pages/Admin/Noticias/Noticias'))
const AdminRecursos     = lazy(() => import('@pages/Admin/Recursos/Recursos'))
const NoticiasDetalle   = lazy(() => import('@pages/NoticiasDetalle/NoticiasDetalle'))
const Accesibilidad     = lazy(() => import('@pages/Accesibilidad/Accesibilidad'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    if (navType === 'POP') return
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else window.scrollTo(0, 0)
      }, 80)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, navType])
  return null
}

// Redirige /viejo-modulo/:slug → /nuevo-modulo/:slug
function SlugRedirect({ to }) {
  const { slug } = useParams()
  return <Navigate to={`${to}/${slug}`} replace />
}

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
      <ScrollToTop />
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
          <Route path="noticias" element={<AdminNoticias />} />
          <Route path="recursos" element={<AdminRecursos />} />
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

                  {/* ── Módulos actuales ── */}
                  <Route path={ROUTES.NUTRICION}        element={<Nutricion />} />
                  <Route path="/atencion-primaria/:slug" element={<Nutricion />} />
                  <Route path={ROUTES.ACTIVIDAD_FISICA} element={<ActividadFisica />} />
                  <Route path="/vacunacion/:slug"        element={<ActividadFisica />} />
                  <Route path={ROUTES.SALUD_MENTAL}     element={<SaludMental />} />
                  <Route path="/salud-mental/:slug"     element={<SaludMental />} />
                  <Route path={ROUTES.PREVENCION}       element={<Prevencion />} />
                  <Route path="/emergencias/:slug"      element={<Prevencion />} />

                  {/* ── Redirects de rutas antiguas → nuevas (301 equivalente) ── */}
                  <Route path="/nutricion"              element={<Navigate to="/atencion-primaria" replace />} />
                  <Route path="/nutricion/:slug"        element={<SlugRedirect to="/atencion-primaria" />} />
                  <Route path="/actividad-fisica"       element={<Navigate to="/vacunacion" replace />} />
                  <Route path="/actividad-fisica/:slug" element={<SlugRedirect to="/vacunacion" />} />
                  <Route path="/prevencion"             element={<Navigate to="/emergencias" replace />} />
                  <Route path="/prevencion/:slug"       element={<SlugRedirect to="/emergencias" />} />
                  <Route path="/biblioteca"             element={<Navigate to="/" replace />} />
                  <Route path={ROUTES.NOTICIAS}         element={<Noticias />} />
                  <Route path="/noticias/:id"           element={<NoticiasDetalle />} />
                  <Route path={ROUTES.CONTACTO}         element={<Contacto />} />
                  <Route path={ROUTES.NOSOTROS}         element={<Nosotros />} />
                  <Route path={ROUTES.ACCESIBILIDAD}    element={<Accesibilidad />} />
                  <Route path="*"                       element={<NotFound />} />
                </Routes>
              </Suspense>
              <Footer />
              <BackToTop />
            </>
          }
        />
      </Routes>
    </Suspense>
  )
}
