import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

/** Marca del producto: isotipo de pérgola + wordmark + pill DEMO. */
export function Brand({
  size = 'md',
  tone = 'auto',
  showDemo = true,
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  tone?: 'auto' | 'dark'
  showDemo?: boolean
  className?: string
}) {
  const { t } = useT()
  const box = size === 'lg' ? 'h-11 w-11' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  const txt = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'grid shrink-0 place-items-center rounded-xl bg-[#0B0F14] shadow-sm dark:bg-white/10',
          box,
        )}
      >
        <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none" aria-hidden="true">
          <path d="M2 8.5 12 3l10 5.5" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
          <path
            d="M4.5 8.5v12M19.5 8.5v12M9.5 8.5v12M14.5 8.5v12M3 8.5h18"
            stroke="#1FA2FF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="min-w-0 leading-tight">
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              'font-display font-semibold tracking-tight',
              txt,
              tone === 'dark' && 'text-white',
            )}
          >
            {t('app.name')}
          </span>
          {showDemo && (
            <span className="rounded border border-[#1FA2FF]/35 bg-[#1FA2FF]/10 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-[#0B84D8] dark:text-[#5CC0FF]">
              {t('app.demo')}
            </span>
          )}
        </span>
        <span
          className={cn(
            'block truncate text-[11px]',
            tone === 'dark' ? 'text-white/45' : 'text-muted-foreground',
          )}
        >
          {t('app.tagline')}
        </span>
      </span>
    </div>
  )
}

export function PoweredBy({ tone = 'auto', className }: { tone?: 'auto' | 'dark'; className?: string }) {
  const { t } = useT()
  return (
    <p
      className={cn(
        'text-[10px] font-medium uppercase tracking-[0.14em]',
        tone === 'dark' ? 'text-white/35' : 'text-muted-foreground/70',
        className,
      )}
    >
      {t('app.poweredBy')}
    </p>
  )
}
