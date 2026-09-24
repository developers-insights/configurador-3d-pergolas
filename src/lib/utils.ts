import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatea un número como moneda USD sin decimales (precios de referencia del catálogo). */
export function money(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

/** 12.5 -> "12.5'"  ·  8 -> "8'" */
export function ft(n: number) {
  return `${Number.isInteger(n) ? n : n.toFixed(1)}'`
}

export function fmtDate(iso: string, lang: 'es' | 'en' = 'es') {
  return new Date(iso).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}

/** Correlativo corto con el mismo formato que los pedidos históricos: PED-2610. */
export function nuevoIdPedido(existentes: number) {
  return `PED-${2610 + existentes}`
}
