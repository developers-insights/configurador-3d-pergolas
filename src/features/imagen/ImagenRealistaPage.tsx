import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, FileSpreadsheet, RefreshCw, Sparkles, Wand2 } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { TopBar } from '@/components/shell/TopBar'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { DevNotice } from '@/components/DevNotice'
import { useToast } from '@/components/ui/toast'
import { EscenaRealista, type Escena, type Luz } from './EscenaRealista'
import { modeloDeParam, useConfigActual } from './useConfigActual'
import { leerThumbnail } from '@/features/despiece/thumbnail'
import { SolsticeArt, TuuciArt } from '@/features/configurator/ModelPreviewArt'
import { resumirConfig } from '@/data/catalogo'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const ESCENAS: { id: Escena; key: string }[] = [
  { id: 'patio', key: 'ia.scenePatio' },
  { id: 'pileta', key: 'ia.scenePool' },
  { id: 'terraza', key: 'ia.sceneTerrace' },
]

const LUCES: { id: Luz; key: string }[] = [
  { id: 'dia', key: 'ia.day' },
  { id: 'atardecer', key: 'ia.dusk' },
  { id: 'noche', key: 'ia.night' },
]

/** Graduación de color que se aplica a la pérgola según la hora de la escena. */
const FILTRO: Record<Luz, string> = {
  dia: 'saturate(1.02) contrast(1.02)',
  atardecer: 'sepia(0.22) saturate(1.12) brightness(0.93) contrast(1.05)',
  noche: 'brightness(0.55) saturate(0.75) contrast(1.1) hue-rotate(-8deg)',
}

/** Velo de ambiente por encima de toda la composición. */
const VELO: Record<Luz, { color: string; blend: string; opacity: number }> = {
  dia: { color: '#FFF6E0', blend: 'soft-light', opacity: 0.22 },
  atardecer: { color: '#FF9A4D', blend: 'soft-light', opacity: 0.4 },
  noche: { color: '#16345E', blend: 'multiply', opacity: 0.45 },
}

export default function ImagenRealistaPage() {
  const { t, lang } = useT()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const modelo = modeloDeParam(params.get('m'))
  const cfg = useConfigActual(modelo)

  const [escena, setEscena] = useState<Escena>(modelo === 'tuuci' ? 'pileta' : 'patio')
  const [luz, setLuz] = useState<Luz>('dia')
  const [generando, setGenerando] = useState(true)
  const [corte, setCorte] = useState(45)
  const lienzo = useRef<HTMLDivElement>(null)

  const thumb = useMemo(() => leerThumbnail(), [])
  const resumen = useMemo(() => resumirConfig(cfg, lang), [cfg, lang])
  const volver = modelo === 'tuuci' ? '/configurador/tuuci' : '/configurador/solstice'

  // "Generación": en la demo es una espera corta con feedback, no una llamada real.
  const generar = useCallback(() => {
    setGenerando(true)
    const id = window.setTimeout(() => setGenerando(false), 1200)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => generar(), [generar])

  const descargar = () => {
    toast({ title: t('ia.download'), desc: t('dev.ia'), kind: 'warn' })
  }

  const velo = VELO[luz]

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopBar />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 py-7 sm:px-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to={volver}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('ia.backToConfig')}
          </Link>

          <Badge variant="blue" className="mb-2">
            <Sparkles className="h-3 w-3" />
            {t('ia.eyebrow')}
          </Badge>
          <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight sm:text-3xl">
            {t('ia.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t('ia.subtitle')}</p>
          <p className="num mt-1.5 text-xs text-muted-foreground/80">{resumen}</p>
        </motion.div>

        {/* ── Composición ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-6 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div ref={lienzo} className="relative aspect-[16/10] w-full overflow-hidden bg-black">
            {/* Capa "antes": sólo la escena */}
            <EscenaRealista escena={escena} luz={luz} className="absolute inset-0 h-full w-full" />

            {/* Capa "después": escena + pérgola, recortada por el control */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${corte}%)` }}
            >
              <EscenaRealista escena={escena} luz={luz} className="absolute inset-0 h-full w-full" />

              <div className="absolute inset-x-0 bottom-[4%] flex items-end justify-center">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={resumen}
                    className={cn(
                      'w-[72%] max-w-[680px] object-contain transition-opacity duration-500',
                      generando ? 'opacity-0' : 'opacity-100',
                    )}
                    style={{ filter: FILTRO[luz] }}
                  />
                ) : modelo === 'tuuci' ? (
                  <TuuciArt className="w-[62%] opacity-95" />
                ) : (
                  <SolsticeArt className="w-[62%] opacity-95" />
                )}
              </div>

              {/* Velo de ambiente sobre la composición */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundColor: velo.color,
                  mixBlendMode: velo.blend as React.CSSProperties['mixBlendMode'],
                  opacity: velo.opacity,
                }}
              />
            </div>

            {/* Manija del comparador */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/90 shadow-[0_0_14px_rgba(0,0,0,0.45)]"
              style={{ left: `${corte}%` }}
            >
              <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-lg">
                <span className="text-[10px] font-bold text-neutral-700">◀▶</span>
              </span>
            </div>

            <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {t('ia.before')}
            </span>
            <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-[#1FA2FF]/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {t('ia.after')}
            </span>

            {/* Estado de generación */}
            {generando && (
              <div className="absolute inset-0 z-20 grid place-items-center bg-black/45 backdrop-blur-[2px]">
                <div className="flex flex-col items-center gap-3">
                  <span className="relative flex h-10 w-10">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#1FA2FF]/40" />
                    <Wand2 className="relative m-auto h-5 w-5 text-white" />
                  </span>
                  <p className="text-xs font-medium uppercase tracking-widest text-white/90">
                    {t('ia.generating')}
                  </p>
                </div>
              </div>
            )}

            {/* Control de comparación: cubre la imagen y es accesible por teclado */}
            <input
              type="range"
              min={0}
              max={100}
              value={corte}
              onChange={(e) => setCorte(Number(e.target.value))}
              aria-label={t('ia.compare')}
              className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>

          <p className="border-t border-border px-5 py-2.5 text-center text-[11px] text-muted-foreground">
            {t('ia.dragHint')}
          </p>
        </motion.div>

        {/* ── Controles ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mt-4 grid gap-3 sm:grid-cols-2"
        >
          <Grupo titulo={t('ia.light')}>
            {LUCES.map((l) => (
              <Opcion key={l.id} activo={l.id === luz} onClick={() => setLuz(l.id)}>
                {t(l.key)}
              </Opcion>
            ))}
          </Grupo>
          <Grupo titulo={t('ia.scene')}>
            {ESCENAS.map((e) => (
              <Opcion key={e.id} activo={e.id === escena} onClick={() => setEscena(e.id)}>
                {t(e.key)}
              </Opcion>
            ))}
          </Grupo>
        </motion.div>

        <DevNotice k="dev.ia" className="mt-4" />

        {/* ── Acciones ─────────────────────────────────────────────────── */}
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <Button variant="outline" size="lg" className="flex-1" onClick={generar} disabled={generando}>
            <RefreshCw className={cn('h-4 w-4', generando && 'animate-spin')} />
            {t('ia.regenerate')}
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={descargar}>
            <Download className="h-4 w-4" />
            {t('ia.download')}
          </Button>
          <Link
            to={`/despiece?m=${modelo}`}
            className={buttonVariants({ size: 'lg', className: 'flex-1' })}
          >
            <FileSpreadsheet className="h-4 w-4" />
            {t('ia.toBom')}
          </Link>
        </div>
      </main>
    </div>
  )
}

/* ── Piezas ──────────────────────────────────────────────────────────────── */

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {titulo}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Opcion({
  activo,
  onClick,
  children,
}: {
  activo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activo}
      className={cn(
        'no-tap-highlight rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
        activo
          ? 'border-transparent bg-primary text-primary-foreground'
          : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
