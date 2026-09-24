import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { capturarThumbnail } from '@/features/despiece/thumbnail'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { ModeloPergola } from '@/types'

/**
 * Lleva a la pantalla de imagen realista capturando antes el render actual
 * del canvas, que es lo que después se compone sobre la escena.
 */
export function BotonImagenRealista({
  modelo,
  tone = 'light',
  className,
}: {
  modelo: ModeloPergola
  tone?: 'light' | 'dark'
  className?: string
}) {
  const { t } = useT()
  const nav = useNavigate()

  return (
    <button
      onClick={() => {
        capturarThumbnail()
        nav(`/configurador/imagen-realista?m=${modelo}`)
      }}
      className={cn(
        'no-tap-highlight flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-xs font-semibold transition-all active:scale-[0.99]',
        tone === 'dark'
          ? 'border-[#1FA2FF]/40 bg-[#1FA2FF]/10 text-[#5CC0FF] hover:bg-[#1FA2FF]/18'
          : 'border-neutral-900/15 bg-neutral-900/[0.04] text-neutral-900 hover:bg-neutral-900/[0.08]',
        className,
      )}
    >
      <Sparkles className="h-4 w-4" />
      {t('ia.cta')}
    </button>
  )
}
