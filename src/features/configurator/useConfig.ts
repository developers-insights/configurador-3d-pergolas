import { useCallback, useEffect, useState } from 'react'
import { KEYS, readJSON, ss, writeJSON } from '@/lib/storage'
import type { ConfigSolstice, ConfigTuuci } from '@/types'

/**
 * Estado del configurador persistido en sessionStorage, para que al ir al
 * despiece y volver no se pierda lo que el cliente ya eligió.
 */
export function useConfig<T extends ConfigSolstice | ConfigTuuci>(key: string, inicial: T) {
  const [cfg, setCfg] = useState<T>(() => {
    const guardado = readJSON<T | null>(window.sessionStorage, key, null)
    return guardado ? { ...inicial, ...guardado } : inicial
  })

  useEffect(() => {
    writeJSON(ss(), key, cfg)
  }, [key, cfg])

  const set = useCallback(<K extends keyof T>(campo: K, valor: T[K]) => {
    setCfg((prev) => ({ ...prev, [campo]: valor }))
  }, [])

  const reset = useCallback(() => setCfg(inicial), [inicial])

  return { cfg, set, reset, setCfg }
}

export const KEY_SOLSTICE = KEYS.solstice
export const KEY_TUUCI = KEYS.tuuci
