import { KEYS, readJSON, writeJSON } from '@/lib/storage'

const KEY = `${KEYS.solstice}.thumb`

/**
 * Guarda una miniatura del canvas 3D para mostrarla en el encabezado del
 * despiece. Se captura al salir del configurador; si no hay canvas, el
 * despiece cae en una ilustración vectorial.
 */
export function capturarThumbnail() {
  try {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const img = document.createElement('canvas')
    const ratio = canvas.height / canvas.width
    img.width = 480
    img.height = Math.round(480 * ratio)
    const ctx = img.getContext('2d')
    if (!ctx) return
    ctx.drawImage(canvas, 0, 0, img.width, img.height)
    writeJSON(window.sessionStorage, KEY, img.toDataURL('image/jpeg', 0.72))
  } catch {
    /* si el navegador bloquea la lectura del canvas, seguimos sin thumbnail */
  }
}

export function leerThumbnail(): string | null {
  return readJSON<string | null>(window.sessionStorage, KEY, null)
}
