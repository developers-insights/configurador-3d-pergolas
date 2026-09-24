import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from '@/features/auth/Login'
import { useSession } from '@/lib/session'
import { PageLoader } from '@/components/shell/PageLoader'
import { WelcomeModal } from '@/features/propuesta/WelcomeModal'
import { BarraPreview } from '@/features/propuesta/BarraPreview'
import { NotFound } from '@/components/shell/NotFound'
import { ENTRADA, HOME } from '@/lib/rutas'
import type { Rol } from '@/types'

const ModelSelect = lazy(() => import('@/features/configurator/ModelSelect'))
const SolsticeConfigurator = lazy(() => import('@/features/configurator/SolsticeConfigurator'))
const TuuciConfigurator = lazy(() => import('@/features/configurator/TuuciConfigurator'))
const ImagenRealista = lazy(() => import('@/features/imagen/ImagenRealistaPage'))
const Despiece = lazy(() => import('@/features/despiece/DespiecePage'))
const Propuesta = lazy(() => import('@/features/propuesta/PropuestaPage'))
const AdminLayout = lazy(() => import('@/features/admin/AdminLayout'))
const Dashboard = lazy(() => import('@/features/admin/Dashboard'))
const Empresas = lazy(() => import('@/features/admin/Empresas'))
const Pedidos = lazy(() => import('@/features/admin/Pedidos'))



/** Exige sesión, sin importar el rol: lo usa la capa comercial. */
function SoloSesion({ children }: { children: React.ReactNode }) {
  const { sesion } = useSession()
  const loc = useLocation()
  if (!sesion) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <>{children}</>
}

/** Exige sesión y, además, que el rol activo sea el correcto para la sección. */
function Guard({ rol, children }: { rol: Rol; children: React.ReactNode }) {
  const { sesion } = useSession()
  const loc = useLocation()
  if (!sesion) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (sesion.rol !== rol) return <Navigate to={HOME[sesion.rol]} replace />
  return <>{children}</>
}

export default function App() {
  const { sesion } = useSession()

  return (
    <>
      {sesion && <WelcomeModal />}
      {sesion && <BarraPreview />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={sesion ? <Navigate to={ENTRADA} replace /> : <Login />} />
          <Route path="/" element={<Navigate to={sesion ? ENTRADA : '/login'} replace />} />

          {/* ── Capa comercial: visible para los dos roles ──────────────── */}
          <Route
            path="/propuesta"
            element={
              <SoloSesion>
                <Propuesta />
              </SoloSesion>
            }
          />

        {/* ── Sección 1 y 2: configurador + despiece ───────────────────── */}
        <Route
          path="/configurador"
          element={
            <Guard rol="config">
              <ModelSelect />
            </Guard>
          }
        />
        <Route
          path="/configurador/solstice"
          element={
            <Guard rol="config">
              <SolsticeConfigurator />
            </Guard>
          }
        />
        <Route
          path="/configurador/tuuci"
          element={
            <Guard rol="config">
              <TuuciConfigurator />
            </Guard>
          }
        />
        <Route
          path="/configurador/imagen-realista"
          element={
            <Guard rol="config">
              <ImagenRealista />
            </Guard>
          }
        />
        <Route
          path="/despiece"
          element={
            <Guard rol="config">
              <Despiece />
            </Guard>
          }
        />

        {/* ── Sección 3: panel del proveedor ───────────────────────────── */}
        <Route
          path="/admin"
          element={
            <Guard rol="admin">
              <AdminLayout />
            </Guard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="pedidos" element={<Pedidos />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
