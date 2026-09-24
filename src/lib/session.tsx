import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Pedido, Rol, Sesion } from '@/types'
import type { ModuloPropuesta } from '@/features/propuesta/modulos'
import { KEYS, ls, readJSON, removeKey, ss, writeJSON } from './storage'
import { PEDIDOS_MOCK } from '@/data/mock'

/** Contexto de una previsualización abierta desde la propuesta. */
export interface Preview {
  modulo: number
  view: string
  rolPrevio: Rol
  titulo: string
}

interface Ctx {
  sesion: Sesion | null
  login: (s: Sesion) => void
  logout: () => void
  switchRol: (r: Rol) => void
  /** histórico mock + los pedidos creados durante la demo, ordenados */
  pedidos: Pedido[]
  addPedido: (p: Pedido) => void
  setEstadoPedido: (id: string, estado: Pedido['estado']) => void
  /** Previsualización en curso lanzada desde la propuesta, o null. */
  preview: Preview | null
  abrirPreview: (m: ModuloPropuesta, titulo: string) => void
  cerrarPreview: () => void
  /** Módulo al que hay que volver y resaltar al cerrar la previsualización. */
  moduloDestacado: number | null
  limpiarDestacado: () => void
}

const SessionCtx = createContext<Ctx | null>(null)

const CREDENCIALES: Record<string, { pass: string; rol: Rol; empresa: string }> = {
  empresa: { pass: 'Pergola2026', rol: 'config', empresa: 'Aurora Outdoor Living' },
  admin: { pass: 'Admin2026', rol: 'admin', empresa: 'Solmar Materiales' },
}

export function verificarCredenciales(usuario: string, pass: string): Sesion | null {
  const found = CREDENCIALES[usuario.trim().toLowerCase()]
  if (!found || found.pass !== pass) return null
  return { rol: found.rol, usuario: usuario.trim().toLowerCase(), empresa: found.empresa }
}

export const EMPRESA_DEMO = CREDENCIALES.empresa.empresa
/** El proveedor de materiales: el destinatario de la propuesta. */
export const PROVEEDOR_DEMO = CREDENCIALES.admin.empresa

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(() =>
    readJSON<Sesion | null>(window.localStorage, KEYS.session, null),
  )
  // Sólo los pedidos generados durante la demo viven en sessionStorage.
  const [nuevos, setNuevos] = useState<Pedido[]>(() =>
    readJSON<Pedido[]>(window.sessionStorage, KEYS.orders, []),
  )
  // Cambios de estado aplicados sobre el histórico mock durante la demo.
  const [estados, setEstados] = useState<Record<string, Pedido['estado']>>(() =>
    readJSON<Record<string, Pedido['estado']>>(window.sessionStorage, `${KEYS.orders}.estados`, {}),
  )

  useEffect(() => {
    if (sesion) writeJSON(ls(), KEYS.session, sesion)
    else removeKey(ls(), KEYS.session)
  }, [sesion])

  useEffect(() => writeJSON(ss(), KEYS.orders, nuevos), [nuevos])
  useEffect(() => writeJSON(ss(), `${KEYS.orders}.estados`, estados), [estados])

  const login = useCallback((s: Sesion) => setSesion(s), [])
  const logout = useCallback(() => setSesion(null), [])
  const switchRol = useCallback((rol: Rol) => {
    // Cambiar de rol a mano cancela cualquier previsualización en curso.
    setPreview(null)
    setSesion((prev) =>
        prev
          ? {
              ...prev,
              rol,
              usuario: rol === 'admin' ? 'admin' : 'empresa',
              empresa: rol === 'admin' ? CREDENCIALES.admin.empresa : CREDENCIALES.empresa.empresa,
            }
          : prev,
    )
  }, [])

  const addPedido = useCallback((p: Pedido) => setNuevos((prev) => [p, ...prev]), [])

  /* ── Previsualización de módulos desde la propuesta ───────────────────── */
  const [preview, setPreview] = useState<Preview | null>(null)
  const [moduloDestacado, setModuloDestacado] = useState<number | null>(null)

  const abrirPreview = useCallback((m: ModuloPropuesta, titulo: string) => {
    setSesion((prev) => {
      if (!prev) return prev
      setPreview({ modulo: m.n, view: m.ruta, rolPrevio: prev.rol, titulo })
      // Los módulos del proveedor viven en el rol Admin: cambiamos solos.
      if (prev.rol === m.rol) return prev
      return {
        ...prev,
        rol: m.rol,
        usuario: m.rol === 'admin' ? 'admin' : 'empresa',
        empresa: m.rol === 'admin' ? CREDENCIALES.admin.empresa : CREDENCIALES.empresa.empresa,
      }
    })
  }, [])

  const cerrarPreview = useCallback(() => {
    setPreview((p) => {
      if (!p) return null
      setModuloDestacado(p.modulo)
      setSesion((prev) =>
        prev && prev.rol !== p.rolPrevio
          ? {
              ...prev,
              rol: p.rolPrevio,
              usuario: p.rolPrevio === 'admin' ? 'admin' : 'empresa',
              empresa:
                p.rolPrevio === 'admin' ? CREDENCIALES.admin.empresa : CREDENCIALES.empresa.empresa,
            }
          : prev,
      )
      return null
    })
  }, [])

  const limpiarDestacado = useCallback(() => setModuloDestacado(null), [])

  const setEstadoPedido = useCallback((id: string, estado: Pedido['estado']) => {
    setNuevos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)))
    setEstados((prev) => ({ ...prev, [id]: estado }))
  }, [])

  const pedidos = useMemo<Pedido[]>(() => {
    const historicos = PEDIDOS_MOCK.map((p) => (estados[p.id] ? { ...p, estado: estados[p.id] } : p))
    return [...nuevos, ...historicos]
  }, [nuevos, estados])

  const value = useMemo<Ctx>(
    () => ({
      sesion,
      login,
      logout,
      switchRol,
      pedidos,
      addPedido,
      setEstadoPedido,
      preview,
      abrirPreview,
      cerrarPreview,
      moduloDestacado,
      limpiarDestacado,
    }),
    [
      sesion,
      login,
      logout,
      switchRol,
      pedidos,
      addPedido,
      setEstadoPedido,
      preview,
      abrirPreview,
      cerrarPreview,
      moduloDestacado,
      limpiarDestacado,
    ],
  )

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>
}

export function useSession() {
  const ctx = useContext(SessionCtx)
  if (!ctx) throw new Error('useSession debe usarse dentro de <SessionProvider>')
  return ctx
}
