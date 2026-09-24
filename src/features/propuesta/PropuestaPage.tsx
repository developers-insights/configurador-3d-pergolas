import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, MessageCircle, Printer } from 'lucide-react'
import { PropuestaShell } from './PropuestaShell'
import { Inversion } from './Inversion'
import { MODULOS, PASOS, PASO_DESTACADO, WHATSAPP_PROPUESTA, type ModuloPropuesta } from './modulos'
import { Badge } from '@/components/ui/badge'
import { PoweredBy } from '@/components/shell/Brand'
import { useT } from '@/lib/i18n'
import { PROVEEDOR_DEMO, useSession } from '@/lib/session'
import { cn } from '@/lib/utils'

const ACENTO = '#1FA2FF'

export default function PropuestaPage() {
  const { t } = useT()
  const { abrirPreview, moduloDestacado, limpiarDestacado } = useSession()
  // Cada tarjeta guarda su nodo para poder volver a ella desde una preview.
  const tarjetas = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!moduloDestacado) return
    const nodo = tarjetas.current[moduloDestacado]
    nodo?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const id = window.setTimeout(limpiarDestacado, 4200)
    return () => window.clearTimeout(id)
  }, [moduloDestacado, limpiarDestacado])

  return (
    <PropuestaShell>
      {/* ── Encabezado ───────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          <Badge variant="blue" className="mb-3">
            {t('prop.badge')}
          </Badge>
          <h1 className="font-display text-[28px] font-semibold leading-[1.15] tracking-tight sm:text-[38px]">
            {t('prop.title', { nombre: PROVEEDOR_DEMO })}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('prop.subtitle')}
          </p>
        </div>

        <div className="no-print flex shrink-0 gap-2">
          <button
            onClick={() => window.print()}
            className="no-tap-highlight inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Printer className="h-3.5 w-3.5" />
            {t('prop.print')}
          </button>
          <a
            href={WHATSAPP_PROPUESTA}
            target="_blank"
            rel="noreferrer"
            className="no-tap-highlight inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {t('prop.whatsapp')}
          </a>
        </div>
      </motion.header>

      {/* ── El circuito ──────────────────────────────────────────────────── */}
      <section className="print-break pt-9">
        <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          {t('prop.flowTitle')}
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PASOS.map((k, i) => {
            const n = i + 1
            const destacado = n === PASO_DESTACADO
            return (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
                className={cn(
                  'flex flex-col rounded-xl border bg-card p-4',
                  destacado ? 'border-[#1FA2FF]/50 bg-[#1FA2FF]/[0.04]' : 'border-border',
                )}
              >
                <span
                  className={cn(
                    'mb-3 inline-flex h-7 w-fit items-center gap-1.5 rounded-full px-2.5 text-[10px] font-bold uppercase tracking-wider',
                    destacado
                      ? 'bg-[#1FA2FF] text-white'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {t('prop.step')} {n}
                </span>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{t(k)}</p>
              </motion.div>
            )
          })}
        </div>

        <p className="mt-4 text-[13px] text-muted-foreground/80">{t('prop.flowFoot')}</p>
      </section>

      {/* ── Módulos ──────────────────────────────────────────────────────── */}
      <section className="print-break pt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {t('prop.modulesTitle')}
          </h2>
          <Badge variant="outline" className="shrink-0">
            {t('prop.modulesCount', { n: MODULOS.length })}
          </Badge>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODULOS.map((m, i) => (
            <TarjetaModulo
              key={m.n}
              modulo={m}
              indice={i}
              destacado={moduloDestacado === m.n}
              onVerDemo={() => abrirPreview(m, t(m.nombreKey))}
              refCb={(nodo) => {
                tarjetas.current[m.n] = nodo
              }}
            />
          ))}
        </div>
      </section>

      {/* ── Inversión ────────────────────────────────────────────────────── */}
      <Inversion />

      {/* ── Cierre ───────────────────────────────────────────────────────── */}
      <section className="print-break pt-12">
        <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
          <h2 className="font-display text-xl font-semibold tracking-tight">{t('prop.closeTitle')}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t('prop.closeDesc')}</p>
          <a
            href={WHATSAPP_PROPUESTA}
            target="_blank"
            rel="noreferrer"
            className="no-tap-highlight mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99]"
          >
            <MessageCircle className="h-4 w-4" />
            {t('prop.whatsapp')}
          </a>
          <PoweredBy className="mt-5" />
        </div>
      </section>
    </PropuestaShell>
  )
}

/* ── Tarjeta de módulo ───────────────────────────────────────────────────── */

function TarjetaModulo({
  modulo,
  indice,
  destacado,
  onVerDemo,
  refCb,
}: {
  modulo: ModuloPropuesta
  indice: number
  destacado: boolean
  onVerDemo: () => void
  refCb: (nodo: HTMLDivElement | null) => void
}) {
  const { t } = useT()

  return (
    <motion.div
      ref={refCb}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.04 * indice }}
      className={cn(
        'flex flex-col rounded-xl border border-border bg-card p-5 transition-[box-shadow,border-color,translate] duration-300',
        destacado && 'ins-destacado',
      )}
    >
      <span className="num mb-2 text-[11px] font-semibold text-muted-foreground/70">
        {String(modulo.n).padStart(2, '0')}
      </span>
      <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight">
        {t(modulo.nombreKey)}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{t(modulo.descKey)}</p>

      <ul className="mt-4 flex-1 space-y-1.5">
        {modulo.bulletKeys.map((b) => (
          <li key={b} className="flex items-start gap-2 text-[12px] leading-relaxed">
            <Check className="mt-[3px] h-3 w-3 shrink-0" style={{ color: ACENTO }} />
            <span className="text-muted-foreground">{t(b)}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onVerDemo}
        className="no-print no-tap-highlight mt-5 inline-flex items-center gap-1 self-start text-xs font-semibold transition-opacity hover:opacity-70"
        style={{ color: ACENTO }}
      >
        {t('prop.seeDemo')}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}
