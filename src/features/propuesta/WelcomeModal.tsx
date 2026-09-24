import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Brand } from '@/components/shell/Brand'
import { useT } from '@/lib/i18n'
import { PROVEEDOR_DEMO } from '@/lib/session'

const KEY = 'welcome_modal_seen'

/**
 * Saludo de bienvenida de Insights, una sola vez por sesión y ~400 ms después
 * del login. No cierra haciendo clic afuera: el único salida es el botón.
 */
export function WelcomeModal() {
  const { t } = useT()
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    let visto = false
    try {
      visto = window.sessionStorage.getItem(KEY) === '1'
    } catch {
      /* modo privado: mostramos el saludo igual */
    }
    if (visto) return
    const id = window.setTimeout(() => setAbierto(true), 400)
    return () => window.clearTimeout(id)
  }, [])

  const cerrar = () => {
    setAbierto(false)
    try {
      window.sessionStorage.setItem(KEY, '1')
    } catch {
      /* noop */
    }
  }

  useEffect(() => {
    if (!abierto) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [abierto])

  if (!abierto) return null

  return (
    <div className="no-print fixed inset-0 z-[130]">
      <div
        aria-hidden
        className="ins-fade-in absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,.55)' }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="ins-scale-in scrollbar-thin fixed inset-0 m-auto h-fit max-h-[88vh] w-[calc(100%-2rem)] max-w-[440px] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-7"
      >
        <Brand size="md" className="mb-5" />

        <h2 id="welcome-title" className="font-display text-xl font-semibold tracking-tight">
          {t('welcome.hi', { nombre: PROVEEDOR_DEMO })}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('welcome.intro')}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('welcome.body')}</p>
        <p className="mt-4 text-sm italic leading-relaxed">{t('welcome.close')}</p>

        <button
          onClick={cerrar}
          autoFocus
          className="no-tap-highlight mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99]"
        >
          {t('welcome.cta')}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
