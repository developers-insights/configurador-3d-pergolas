import { Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

interface Props {
  /** clave del diccionario con el copy honesto de qué se simula y qué se activa */
  k: string
  className?: string
  compact?: boolean
}

/**
 * Aviso ámbar que marca todo lo que hoy está simulado en la previsualización.
 * Aparece en PDF, catálogo de materiales, base de datos de pedidos e integraciones.
 */
export function DevNotice({ k, className, compact = false }: Props) {
  const { t } = useT()
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] text-amber-800 dark:text-amber-300',
        compact ? 'p-2.5' : 'p-3.5',
        className,
      )}
    >
      <Wrench className={cn('mt-0.5 shrink-0 text-amber-500', compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
      <div className="min-w-0">
        {!compact && (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            {t('dev.title')}
          </p>
        )}
        <p className={cn('leading-relaxed', compact ? 'text-[11px]' : 'mt-0.5 text-xs')}>{t(k)}</p>
      </div>
    </div>
  )
}
