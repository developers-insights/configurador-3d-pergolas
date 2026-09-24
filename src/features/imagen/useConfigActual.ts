import { useMemo } from 'react'
import { KEY_SOLSTICE, KEY_TUUCI } from '@/features/configurator/useConfig'
import { readJSON } from '@/lib/storage'
import { DEFAULT_SOLSTICE, DEFAULT_TUUCI } from '@/data/mock'
import type { Config, ConfigSolstice, ConfigTuuci, ModeloPergola } from '@/types'

/** Lee del sessionStorage la configuración con la que se está trabajando. */
export function useConfigActual(modelo: ModeloPergola): Config {
  return useMemo(() => {
    if (modelo === 'tuuci') {
      const g = readJSON<ConfigTuuci | null>(window.sessionStorage, KEY_TUUCI, null)
      return g ? { ...DEFAULT_TUUCI, ...g } : DEFAULT_TUUCI
    }
    const g = readJSON<ConfigSolstice | null>(window.sessionStorage, KEY_SOLSTICE, null)
    return g ? { ...DEFAULT_SOLSTICE, ...g } : DEFAULT_SOLSTICE
  }, [modelo])
}

export function modeloDeParam(v: string | null): ModeloPergola {
  return v === 'tuuci' ? 'tuuci' : 'solstice'
}
