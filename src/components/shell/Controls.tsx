import { Globe, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/** Toggle de tema e idioma. `tone="dark"` lo adapta al panel oscuro de Solstice. */
export function TopControls({ className, tone = 'auto' }: { className?: string; tone?: 'auto' | 'dark' }) {
  const { theme, toggle } = useTheme()
  const { lang, setLang, t } = useT()

  const btn = cn(
    'no-tap-highlight inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors',
    tone === 'dark'
      ? 'text-white/70 hover:bg-white/10 hover:text-white'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
  )

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button onClick={toggle} className={btn} aria-label={t('nav.theme')} title={t('nav.theme')}>
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <button
        onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
        className={btn}
        aria-label={t('nav.lang')}
        title={t('nav.lang')}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{lang}</span>
      </button>
    </div>
  )
}
