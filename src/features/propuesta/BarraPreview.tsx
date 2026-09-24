import { useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '@/lib/session'
import { useT } from '@/lib/i18n'

const ACENTO = '#1FA2FF'

/**
 * Señaliza que se está mirando un módulo desde la propuesta y ofrece la
 * vuelta. Se cancela sola si la persona navega por su cuenta con el menú.
 */
export function BarraPreview() {
  const { preview, cerrarPreview } = useSession()
  const { t } = useT()
  const nav = useNavigate()
  const loc = useLocation()
  // Ruta con la que se abrió la preview: si cambia, la persona navegó sola.
  const rutaInicial = useRef<string | null>(null)

  useEffect(() => {
    if (!preview) {
      rutaInicial.current = null
      return
    }
    const actual = `${loc.pathname}${loc.search}`
    if (rutaInicial.current === null) {
      rutaInicial.current = actual
      return
    }
    if (actual !== rutaInicial.current && loc.pathname !== '/propuesta') {
      cerrarPreview()
    }
  }, [preview, loc.pathname, loc.search, cerrarPreview])

  const volver = () => {
    cerrarPreview()
    nav('/propuesta')
  }

  useEffect(() => {
    if (!preview) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') volver()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview])

  // Mientras la preview está activa, el contenido baja para no quedar tapado.
  useEffect(() => {
    const activa = !!preview && loc.pathname !== '/propuesta'
    document.documentElement.classList.toggle('preview-activa', activa)
    return () => document.documentElement.classList.remove('preview-activa')
  }, [preview, loc.pathname])

  if (!preview || loc.pathname === '/propuesta') return null

  return (
    <div className="no-print pointer-events-none fixed left-0 right-0 top-14 z-[60] px-3 sm:px-5">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2">
        <span className="pointer-events-auto relative inline-flex">
          {/* Halo que late alrededor del botón */}
          <span
            aria-hidden
            className="ins-halo absolute inset-0 rounded-full"
            style={{ backgroundColor: ACENTO }}
          />
          <button
            onClick={volver}
            className="no-tap-highlight relative inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
            style={{ backgroundColor: ACENTO }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('prop.backToProposal')}
          </button>
        </span>

        <span className="pointer-events-none inline-flex h-9 max-w-[min(100%,420px)] items-center gap-1.5 rounded-full border border-border bg-background/75 px-3 text-[11px] backdrop-blur-md glass">
          <span className="shrink-0 text-muted-foreground">{t('prop.watching')}</span>
          <span className="truncate font-medium">{preview.titulo}</span>
        </span>
      </div>
    </div>
  )
}
