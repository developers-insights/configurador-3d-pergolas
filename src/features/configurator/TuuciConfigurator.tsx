import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, Menu, RotateCcw, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Viewer } from './3d/Viewer'
import { TuuciModel } from './3d/TuuciModel'
import { FieldLabel, SwatchRow, ToggleRow } from './Controls3d'
import { BotonImagenRealista } from '@/features/imagen/BotonImagenRealista'
import { capturarThumbnail } from '@/features/despiece/thumbnail'
import { KEY_TUUCI, useConfig } from './useConfig'
import { Slider } from '@/components/ui/slider'
import { RoleSwitcher } from '@/components/shell/RoleSwitcher'
import { TopControls } from '@/components/shell/Controls'
import { PoweredBy } from '@/components/shell/Brand'
import { DevNotice } from '@/components/DevNotice'
import { useToast } from '@/components/ui/toast'
import { useT } from '@/lib/i18n'
import { cn, money } from '@/lib/utils'
import { DEFAULT_TUUCI } from '@/data/mock'
import { CANOPY_HEX, WOOD_HEX, calcularDespiece, totalDespiece } from '@/data/catalogo'
import { TuuciCollectionArt } from './TuuciCollectionArt'
import type { AcabadoMadera, ColorCanopy, ConfigTuuci, SubModeloTuuci } from '@/types'

const INK = '#141414'

const SUBMODELOS: { id: SubModeloTuuci; nameKey: string; descKey: string; rango: string }[] = [
  { id: 'maxSolanox', nameKey: 'tu.maxSolanox', descKey: 'tu.maxSolanoxDesc', rango: "8'-14.0' (2.45-4.25 M)" },
  { id: 'pergola', nameKey: 'tu.pergola', descKey: 'tu.pergolaDesc', rango: "8'-12.0' (2.45-3.65 M)" },
  { id: 'lulu', nameKey: 'tu.lulu', descKey: 'tu.luluDesc', rango: "8' (2.45 M) SIZE" },
]

const MADERAS: AcabadoMadera[] = ['teak', 'walnut', 'ipe', 'ash', 'mahogany', 'driftwood']
const LONAS: ColorCanopy[] = ['white', 'sand', 'blue', 'stripe']

/** Rango de tamaño permitido por sub-modelo (la Lulu es de medida única). */
const RANGO: Record<SubModeloTuuci, [number, number]> = {
  maxSolanox: [8, 14],
  pergola: [8, 12],
  lulu: [8, 8],
}

export default function TuuciConfigurator() {
  const { t } = useT()
  const nav = useNavigate()
  const { toast } = useToast()
  const { cfg, set, setCfg, reset } = useConfig<ConfigTuuci>(KEY_TUUCI, DEFAULT_TUUCI)
  const [panelAbierto, setPanelAbierto] = useState(false)

  const total = useMemo(() => totalDespiece(calcularDespiece(cfg)), [cfg])
  const encuadre = useMemo(() => {
    const S = cfg.size * 0.3048
    const H = cfg.sub === 'lulu' ? 2.9 : cfg.sub === 'maxSolanox' ? 3.3 : 3.1
    const radioObjeto = 0.5 * Math.sqrt(S * S * 2 + H * H) * 1.08
    return { radioObjeto, centroY: H * 0.46, sombra: Math.max(5, radioObjeto * 1.7) }
  }, [cfg.size, cfg.sub])

  const [min, max] = RANGO[cfg.sub]
  const indice = SUBMODELOS.findIndex((s) => s.id === cfg.sub)

  const elegirSub = (sub: SubModeloTuuci) => {
    const [mn, mx] = RANGO[sub]
    setCfg((prev) => ({ ...prev, sub, size: Math.min(mx, Math.max(mn, prev.size)) }))
    setPanelAbierto(false)
  }

  const irA = (delta: number) => {
    const next = SUBMODELOS[(indice + delta + SUBMODELOS.length) % SUBMODELOS.length]
    elegirSub(next.id)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FBFAF7] lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      {/* ── Visor 3D ──────────────────────────────────────────────────────── */}
      <div className="relative h-[46dvh] w-full shrink-0 bg-white lg:h-full lg:flex-1">
        <Viewer encuadre={encuadre} tone="light" preset="apartment" shadowOpacity={0.5} className="absolute inset-0">
          <TuuciModel cfg={cfg} />
        </Viewer>

        <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
          <button
            onClick={() => nav('/configurador')}
            className="no-tap-highlight pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/[0.06] bg-white/85 px-2.5 text-[11px] font-medium text-neutral-700 backdrop-blur-md transition-colors hover:bg-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            {t('cfg.changeModel')}
          </button>
          <div className="pointer-events-none text-center">
            <p className="font-display text-[15px] font-semibold tracking-[0.3em] text-neutral-900">
              TUUCI
            </p>
            <p className="num text-[10px] tracking-wide text-neutral-400">
              {t(SUBMODELOS[indice].nameKey)} · {cfg.size}′
            </p>
          </div>
          <span className="w-[104px]" aria-hidden />
        </div>
      </div>

      {/* ── Panel de colección + opciones ─────────────────────────────────── */}
      <aside className="flex w-full flex-col border-t border-tuuci-line bg-white text-neutral-900 lg:sticky lg:top-0 lg:h-[100dvh] lg:w-[420px] lg:shrink-0 lg:border-l lg:border-t-0 xl:w-[460px]">
        {/* Header estilo colección */}
        <div className="flex items-center justify-between gap-2 border-b border-tuuci-line px-4 py-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setPanelAbierto((v) => !v)}
              className="no-tap-highlight grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              aria-label={t('tu.collection')}
            >
              {panelAbierto ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <p className="font-display text-sm font-semibold tracking-tight text-neutral-900">
                {t('tu.collection')}
              </p>
              <p className="num text-[10px] text-neutral-400">
                {indice + 1} / {SUBMODELOS.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <RoleSwitcher className="w-[128px]" />
            <TopControls />
            <button
              onClick={() => irA(-1)}
              className="no-tap-highlight grid h-9 w-9 place-items-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
              aria-label="←"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => irA(1)}
              className="no-tap-highlight grid h-9 w-9 place-items-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700"
              aria-label="→"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-5">
          {/* Tarjetas de sub-modelo */}
          <div className="grid grid-cols-2 gap-3">
            {SUBMODELOS.map((s) => {
              const active = s.id === cfg.sub
              return (
                <button
                  key={s.id}
                  onClick={() => elegirSub(s.id)}
                  className={cn(
                    'no-tap-highlight group overflow-hidden rounded-lg border-2 text-left transition-all duration-200',
                    active
                      ? 'border-neutral-900 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]'
                      : 'border-transparent hover:border-neutral-300',
                  )}
                >
                  <TuuciCollectionArt sub={s.id} className="aspect-[4/3] w-full" />
                  <div className="px-1.5 py-2">
                    <p className="truncate text-center text-[12px] font-semibold text-neutral-900">
                      {t(s.nameKey)}
                    </p>
                    <p className="mt-1 text-center text-[9px] leading-[1.5] text-neutral-400">
                      {t('tu.warranty')}
                      <br />
                      {s.rango}
                      <br />
                      {t('tu.finishes')}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <AnimatePresence initial={false}>
            {panelAbierto && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden text-[11px] leading-relaxed text-neutral-500"
              >
                <span className="mt-3 block">{t(SUBMODELOS[indice].descKey)}</span>
              </motion.p>
            )}
          </AnimatePresence>

          <div className="my-6 h-px bg-tuuci-line" />

          {/* Opciones */}
          <div className={cn(min === max && 'pointer-events-none opacity-45')}>
            <Slider
              label={t('tu.size')}
              value={cfg.size}
              min={min}
              max={max === min ? min + 1 : max}
              step={1}
              suffix="′"
              tone={INK}
              onChange={(v) => set('size', v)}
            />
          </div>

          <div className="mt-6">
            <FieldLabel tone="light">{t('tu.wood')}</FieldLabel>
            <SwatchRow
              tone="light"
              value={cfg.wood}
              onChange={(v) => set('wood', v)}
              options={MADERAS.map((w) => ({ value: w, label: t(`tu.${w}`), hex: WOOD_HEX[w] }))}
            />
          </div>

          <div className="mt-6">
            <FieldLabel tone="light">{t('tu.canopy')}</FieldLabel>
            <SwatchRow
              tone="light"
              value={cfg.canopy}
              onChange={(v) => set('canopy', v)}
              options={LONAS.map((c) => ({
                value: c,
                label: t(`tu.can${c.charAt(0).toUpperCase()}${c.slice(1)}`),
                hex: CANOPY_HEX[c],
              }))}
            />
          </div>

          <div className="mt-6">
            <FieldLabel tone="light">{t('tu.addons')}</FieldLabel>
            <div className="space-y-2">
              <ToggleRow tone="light" label={t('tu.curtains')} checked={cfg.curtains} onChange={(v) => set('curtains', v)} />
              <ToggleRow tone="light" label={t('tu.cushions')} checked={cfg.cushions} onChange={(v) => set('cushions', v)} />
            </div>
          </div>

          <BotonImagenRealista modelo="tuuci" className="mt-6" />

          <DevNotice k="dev.catalog" className="mt-4" compact />

          <button
            onClick={() => {
              reset()
              toast({ title: t('cfg.resetDone'), kind: 'info' })
            }}
            className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 transition-colors hover:text-neutral-800"
          >
            <RotateCcw className="h-3 w-3" />
            {t('cfg.reset')}
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-tuuci-line px-4 py-3.5">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
              {t('cfg.estimate')}
            </span>
            <span className="num text-sm font-semibold text-neutral-900">{money(total)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => nav('/configurador')}
              className="no-tap-highlight h-12 flex-1 rounded-xl border border-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              {t('cfg.changeModel')}
            </button>
            <button
              onClick={() => {
                capturarThumbnail()
                nav('/despiece?m=tuuci')
              }}
              className="no-tap-highlight flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-neutral-900 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-neutral-700"
            >
              {t('cfg.seeBom')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <PoweredBy className="mt-3 text-center" />
        </div>
      </aside>
    </div>
  )
}
