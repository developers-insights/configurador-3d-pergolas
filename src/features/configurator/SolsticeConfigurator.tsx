import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Box,
  ChevronLeft,
  CloudRain,
  Columns3,
  Droplet,
  Eye,
  Fan,
  Flame,
  Layers,
  Lightbulb,
  RotateCcw,
  Rows3,
  SquarePlus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Viewer } from './3d/Viewer'
import { SolsticeModel } from './3d/SolsticeModel'
import { FieldLabel, OptionGrid, SectionTitle, SwatchRow, ToggleRow } from './Controls3d'
import { BotonImagenRealista } from '@/features/imagen/BotonImagenRealista'
import { capturarThumbnail } from '@/features/despiece/thumbnail'
import { KEY_SOLSTICE, useConfig } from './useConfig'
import { Slider } from '@/components/ui/slider'
import { RoleSwitcher } from '@/components/shell/RoleSwitcher'
import { TopControls } from '@/components/shell/Controls'
import { PoweredBy } from '@/components/shell/Brand'
import { DevNotice } from '@/components/DevNotice'
import { useToast } from '@/components/ui/toast'
import { useT } from '@/lib/i18n'
import { cn, money } from '@/lib/utils'
import { DEFAULT_SOLSTICE } from '@/data/mock'
import { FINISH_HEX, calcularDespiece, totalDespiece } from '@/data/catalogo'
import type { AcabadoSolstice, ConfigSolstice } from '@/types'

const BLUE = '#1FA2FF'

const SECCIONES = [
  { id: 'dimensions', key: 'sol.dimensions', Icon: Box },
  { id: 'posts', key: 'sol.posts', Icon: Columns3 },
  { id: 'walls', key: 'sol.walls', Icon: Rows3 },
  { id: 'cladding', key: 'sol.cladding', Icon: Layers },
  { id: 'addons', key: 'sol.addons', Icon: SquarePlus },
  { id: 'styling', key: 'sol.styling', Icon: Droplet },
  { id: 'overview', key: 'sol.overview', Icon: Eye },
] as const

type SeccionId = (typeof SECCIONES)[number]['id']

export default function SolsticeConfigurator() {
  const { t } = useT()
  const nav = useNavigate()
  const { toast } = useToast()
  const { cfg, set, reset } = useConfig<ConfigSolstice>(KEY_SOLSTICE, DEFAULT_SOLSTICE)
  const [seccion, setSeccion] = useState<SeccionId>('dimensions')

  const total = useMemo(() => totalDespiece(calcularDespiece(cfg)), [cfg])
  // El encuadre sólo se calcula al montar: después manda OrbitControls.
  // Radio de la esfera que contiene la pérgola, para encuadrarla sin recortes.
  const encuadre = useMemo(() => {
    const L = (cfg.length + cfg.sideOH * 2) * 0.3048
    const P = (cfg.projection + cfg.frontOH) * 0.3048
    const H = cfg.height * 0.3048
    const radioObjeto = 0.5 * Math.sqrt(L * L + P * P + H * H)
    return { radioObjeto, centroY: H * 0.5, sombra: Math.max(6, radioObjeto * 1.7) }
  }, [cfg.length, cfg.projection, cfg.height, cfg.sideOH, cfg.frontOH])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0B0F14] lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      {/* ── Visor 3D ──────────────────────────────────────────────────────── */}
      <div className="relative h-[46dvh] w-full shrink-0 lg:h-full lg:flex-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2F5F8] to-[#DFE6EC]" />
        <Viewer encuadre={encuadre} tone="light" preset="city" className="absolute inset-0">
          <SolsticeModel cfg={cfg} />
        </Viewer>

        {/* Encabezado flotante sobre el visor */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
          <button
            onClick={() => nav('/configurador')}
            className="no-tap-highlight pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/[0.07] bg-white/80 px-2.5 text-[11px] font-medium text-neutral-700 backdrop-blur-md transition-colors hover:bg-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            {t('cfg.changeModel')}
          </button>
          <div className="pointer-events-auto rounded-lg border border-black/[0.07] bg-white/80 px-3 py-1.5 backdrop-blur-md">
            <p className="font-display text-xs font-semibold tracking-tight text-neutral-900">
              Solstice
            </p>
            <p className="num text-[10px] text-neutral-500">
              {cfg.length}′ × {cfg.projection}′ × {cfg.height}′
            </p>
          </div>
        </div>
      </div>

      {/* ── Panel de opciones (oscuro) ────────────────────────────────────── */}
      <aside className="flex w-full flex-col border-t border-white/[0.07] bg-[#11161D] lg:sticky lg:top-0 lg:h-[100dvh] lg:w-[400px] lg:shrink-0 lg:border-l lg:border-t-0 xl:w-[430px]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.07] px-4 py-3">
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold tracking-tight text-white">
              {t('cfg.options')}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-white/35">Solstice</p>
          </div>
          <div className="flex items-center gap-1">
            <RoleSwitcher tone="dark" className="w-[130px]" />
            <TopControls tone="dark" />
          </div>
        </div>

        {/* Tabs de sección */}
        <nav className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-white/[0.07] px-2 py-2">
          {SECCIONES.map((s) => {
            const active = s.id === seccion
            return (
              <button
                key={s.id}
                onClick={() => setSeccion(s.id)}
                aria-current={active}
                className={cn(
                  'no-tap-highlight flex shrink-0 flex-col items-center gap-1 rounded-lg px-2.5 py-2 transition-colors',
                  active ? 'bg-[#1FA2FF]/12 text-[#5CC0FF]' : 'text-white/45 hover:bg-white/5 hover:text-white/75',
                )}
              >
                <s.Icon className="h-4 w-4" />
                <span className="text-[9px] font-semibold uppercase tracking-wide">{t(s.key)}</span>
              </button>
            )
          })}
        </nav>

        {/* Contenido */}
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={seccion}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {seccion === 'dimensions' && (
                <>
                  <SectionTitle title={t('sol.dimensions')} hint={t('sol.dimHint')} tone="dark" />
                  <div className="space-y-5 text-white">
                    <Slider label={t('sol.length')} value={cfg.length} min={8} max={40} step={1} suffix="′" tone={BLUE} onChange={(v) => set('length', v)} />
                    <Slider label={t('sol.projection')} value={cfg.projection} min={8} max={20} step={1} suffix="′" tone={BLUE} onChange={(v) => set('projection', v)} />
                    <Slider label={t('sol.height')} value={cfg.height} min={8} max={12} step={0.5} suffix="′" tone={BLUE} onChange={(v) => set('height', v)} />
                    <Slider label={t('sol.sideOH')} value={cfg.sideOH} min={0} max={3} step={0.5} suffix="′" tone={BLUE} onChange={(v) => set('sideOH', v)} />
                    <Slider label={t('sol.frontOH')} value={cfg.frontOH} min={0} max={3} step={0.5} suffix="′" tone={BLUE} onChange={(v) => set('frontOH', v)} />
                  </div>
                </>
              )}

              {seccion === 'posts' && (
                <>
                  <SectionTitle title={t('sol.posts')} tone="dark" />
                  <FieldLabel tone="dark">{t('sol.postCount')}</FieldLabel>
                  <OptionGrid
                    tone="dark"
                    cols={3}
                    value={cfg.postCount}
                    onChange={(v) => set('postCount', v as ConfigSolstice['postCount'])}
                    options={[
                      { value: 2, label: '2' },
                      { value: 4, label: '4' },
                      { value: 6, label: '6' },
                    ]}
                  />
                  <div className="mt-5">
                    <FieldLabel tone="dark">{t('sol.postStyle')}</FieldLabel>
                    <OptionGrid
                      tone="dark"
                      cols={3}
                      value={cfg.postStyle}
                      onChange={(v) => set('postStyle', v)}
                      options={[
                        { value: 'square', label: t('sol.postSquare') },
                        { value: 'slim', label: t('sol.postSlim') },
                        { value: 'round', label: t('sol.postRound') },
                      ]}
                    />
                  </div>
                  <div className="mt-5">
                    <FieldLabel tone="dark">{t('sol.anchor')}</FieldLabel>
                    <OptionGrid
                      tone="dark"
                      value={cfg.anchor}
                      onChange={(v) => set('anchor', v)}
                      options={[
                        { value: 'floor', label: t('sol.anchorFloor') },
                        { value: 'wall', label: t('sol.anchorWall') },
                      ]}
                    />
                  </div>
                </>
              )}

              {seccion === 'walls' && (
                <>
                  <SectionTitle title={t('sol.walls')} tone="dark" />
                  <FieldLabel tone="dark">{t('sol.wallSides')}</FieldLabel>
                  <OptionGrid
                    tone="dark"
                    cols={4}
                    value={cfg.wallSides}
                    onChange={(v) => set('wallSides', v as ConfigSolstice['wallSides'])}
                    options={[
                      { value: 0, label: t('sol.wallNone') },
                      { value: 1, label: '1' },
                      { value: 2, label: '2' },
                      { value: 3, label: '3' },
                    ]}
                  />
                  <div className={cn('mt-5 transition-opacity', cfg.wallSides === 0 && 'pointer-events-none opacity-35')}>
                    <FieldLabel tone="dark">{t('sol.wallType')}</FieldLabel>
                    <OptionGrid
                      tone="dark"
                      cols={3}
                      value={cfg.wallType}
                      onChange={(v) => set('wallType', v)}
                      options={[
                        { value: 'glass', label: t('sol.wallGlass') },
                        { value: 'louver', label: t('sol.wallLouver') },
                        { value: 'solid', label: t('sol.wallSolid') },
                      ]}
                    />
                  </div>
                </>
              )}

              {seccion === 'cladding' && (
                <>
                  <SectionTitle title={t('sol.cladding')} tone="dark" />
                  <FieldLabel tone="dark">{t('sol.roofType')}</FieldLabel>
                  <OptionGrid
                    tone="dark"
                    cols={3}
                    value={cfg.cladding}
                    onChange={(v) => set('cladding', v)}
                    options={[
                      { value: 'louvered', label: t('sol.roofLouvered') },
                      { value: 'panel', label: t('sol.roofPanel') },
                      { value: 'open', label: t('sol.roofOpen') },
                    ]}
                  />
                  <div className={cn('mt-6 text-white transition-opacity', cfg.cladding !== 'louvered' && 'pointer-events-none opacity-35')}>
                    <Slider
                      label={t('sol.louverAngle')}
                      value={cfg.louverAngle}
                      min={0}
                      max={90}
                      step={5}
                      suffix="°"
                      tone={BLUE}
                      onChange={(v) => set('louverAngle', v)}
                    />
                  </div>
                </>
              )}

              {seccion === 'addons' && (
                <>
                  <SectionTitle title={t('sol.addons')} hint={t('sol.addonsHint')} tone="dark" />
                  <div className="space-y-2">
                    <ToggleRow tone="dark" label={t('sol.led')} checked={cfg.led} onChange={(v) => set('led', v)} />
                    <ToggleRow tone="dark" label={t('sol.fan')} checked={cfg.fan} onChange={(v) => set('fan', v)} />
                    <ToggleRow tone="dark" label={t('sol.heater')} checked={cfg.heater} onChange={(v) => set('heater', v)} />
                    <ToggleRow tone="dark" label={t('sol.rain')} checked={cfg.rainSensor} onChange={(v) => set('rainSensor', v)} />
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-white/30">
                    {[Lightbulb, Fan, Flame, CloudRain].map((I, i) => (
                      <span
                        key={i}
                        className={cn(
                          'grid h-9 place-items-center rounded-lg border border-white/[0.07] transition-colors',
                          [cfg.led, cfg.fan, cfg.heater, cfg.rainSensor][i] && 'border-[#1FA2FF]/40 text-[#5CC0FF]',
                        )}
                      >
                        <I className="h-4 w-4" />
                      </span>
                    ))}
                  </div>
                </>
              )}

              {seccion === 'styling' && (
                <>
                  <SectionTitle title={t('sol.styling')} tone="dark" />
                  <FieldLabel tone="dark">{t('sol.finish')}</FieldLabel>
                  <SwatchRow
                    tone="dark"
                    value={cfg.finish}
                    onChange={(v) => set('finish', v)}
                    options={(['charcoal', 'white', 'bronze', 'anthracite'] as AcabadoSolstice[]).map((f) => ({
                      value: f,
                      label: t(`sol.${f === 'anthracite' ? 'anthracite' : f}`),
                      hex: FINISH_HEX[f],
                    }))}
                  />
                  <DevNotice k="dev.catalog" className="mt-6" compact />
                </>
              )}

              {seccion === 'overview' && <Overview cfg={cfg} total={total} />}
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => {
              reset()
              toast({ title: t('cfg.resetDone'), kind: 'info' })
            }}
            className="mt-7 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/35 transition-colors hover:text-white/70"
          >
            <RotateCcw className="h-3 w-3" />
            {t('cfg.reset')}
          </button>
        </div>

        {/* Footer con CTA */}
        <div className="border-t border-white/[0.07] bg-[#0E131A] px-4 py-3.5">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-wider text-white/35">{t('cfg.estimate')}</span>
            <span className="num text-sm font-semibold text-white">{money(total)}</span>
          </div>
          <button
            onClick={() => {
                capturarThumbnail()
                nav('/despiece?m=solstice')
              }}
            className="no-tap-highlight flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1FA2FF] text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(31,162,255,0.9)] transition-all hover:bg-[#0B84D8] active:scale-[0.99]"
          >
            {t('cfg.seeBom')}
            <ArrowRight className="h-4 w-4" />
          </button>
          <PoweredBy tone="dark" className="mt-3 text-center" />
        </div>
      </aside>
    </div>
  )
}

/* ── Resumen ─────────────────────────────────────────────────────────────── */

function Overview({ cfg, total }: { cfg: ConfigSolstice; total: number }) {
  const { t } = useT()

  const filas: [string, string][] = [
    [t('sol.length'), `${cfg.length}′`],
    [t('sol.projection'), `${cfg.projection}′`],
    [t('sol.height'), `${cfg.height}′`],
    [t('sol.sideOH'), `${cfg.sideOH}′`],
    [t('sol.frontOH'), `${cfg.frontOH}′`],
    [t('sol.postCount'), String(cfg.postCount)],
    [
      t('sol.postStyle'),
      cfg.postStyle === 'square' ? t('sol.postSquare') : cfg.postStyle === 'slim' ? t('sol.postSlim') : t('sol.postRound'),
    ],
    [t('sol.anchor'), cfg.anchor === 'floor' ? t('sol.anchorFloor') : t('sol.anchorWall')],
    [t('sol.wallSides'), cfg.wallSides === 0 ? t('sol.wallNone') : String(cfg.wallSides)],
    ...(cfg.wallSides > 0
      ? ([
          [
            t('sol.wallType'),
            cfg.wallType === 'glass' ? t('sol.wallGlass') : cfg.wallType === 'louver' ? t('sol.wallLouver') : t('sol.wallSolid'),
          ],
        ] as [string, string][])
      : []),
    [
      t('sol.roofType'),
      cfg.cladding === 'louvered' ? t('sol.roofLouvered') : cfg.cladding === 'panel' ? t('sol.roofPanel') : t('sol.roofOpen'),
    ],
    ...(cfg.cladding === 'louvered' ? ([[t('sol.louverAngle'), `${cfg.louverAngle}°`]] as [string, string][]) : []),
    [
      t('sol.finish'),
      t(`sol.${cfg.finish}`),
    ],
  ]

  const extras = [
    cfg.led && t('sol.led'),
    cfg.fan && t('sol.fan'),
    cfg.heater && t('sol.heater'),
    cfg.rainSensor && t('sol.rain'),
  ].filter(Boolean) as string[]

  return (
    <>
      <SectionTitle title={t('sol.overview')} tone="dark" />
      <dl className="divide-y divide-white/[0.06] overflow-hidden rounded-lg border border-white/[0.07]">
        {filas.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 px-3 py-2">
            <dt className="text-[11px] text-white/45">{k}</dt>
            <dd className="num truncate text-[11px] font-medium text-white">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <FieldLabel tone="dark">{t('sol.addons')}</FieldLabel>
        {extras.length ? (
          <div className="flex flex-wrap gap-1.5">
            {extras.map((e) => (
              <span key={e} className="rounded-full border border-[#1FA2FF]/30 bg-[#1FA2FF]/10 px-2.5 py-1 text-[10px] font-medium text-[#5CC0FF]">
                {e}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-white/35">{t('misc.none')}</p>
        )}
      </div>

      <div className="mt-5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-3">
        <p className="text-[10px] uppercase tracking-wider text-white/35">{t('cfg.estimate')}</p>
        <p className="num mt-0.5 text-xl font-semibold text-white">{money(total)}</p>
      </div>

      <BotonImagenRealista modelo="solstice" tone="dark" className="mt-3" />
    </>
  )
}
