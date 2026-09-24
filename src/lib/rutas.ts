import type { Rol } from '@/types'

/** Vista por defecto de cada rol dentro de la app. */
export const HOME: Record<Rol, string> = { config: '/configurador', admin: '/admin' }

/** Después de iniciar sesión los dos roles aterrizan en la propuesta. */
export const ENTRADA = '/propuesta'
