/**
 * Persistencia de la demo.
 * - localStorage  → preferencias del usuario (tema, idioma, sesión)
 * - sessionStorage → estado de trabajo de la demo (config actual, pedidos creados)
 */

function safeGet(store: Storage, key: string): string | null {
  try {
    return store.getItem(key)
  } catch {
    return null
  }
}

function safeSet(store: Storage, key: string, value: string) {
  try {
    store.setItem(key, value)
  } catch {
    /* modo privado / cuota llena: la demo sigue funcionando en memoria */
  }
}

export function readJSON<T>(store: Storage, key: string, fallback: T): T {
  const raw = safeGet(store, key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON(store: Storage, key: string, value: unknown) {
  safeSet(store, key, JSON.stringify(value))
}

export function removeKey(store: Storage, key: string) {
  try {
    store.removeItem(key)
  } catch {
    /* noop */
  }
}

export const KEYS = {
  session: 'ins.session',
  solstice: 'ins.cfg.solstice',
  tuuci: 'ins.cfg.tuuci',
  orders: 'ins.orders',
} as const

export const ls = () => window.localStorage
export const ss = () => window.sessionStorage
