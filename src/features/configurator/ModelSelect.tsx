import { motion } from 'framer-motion'
import { ArrowRight, Hammer, Home, Layers, Palette } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/shell/TopBar'
import { PoweredBy } from '@/components/shell/Brand'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DevNotice } from '@/components/DevNotice'
import { SolsticeArt, TuuciArt } from './ModelPreviewArt'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const MODELOS = [
  {
    id: 'solstice',
    to: '/configurador/solstice',
    nameKey: 'solstice.name',
    shortKey: 'solstice.short',
    longKey: 'solstice.long',
    Art: SolsticeArt,
    accent: '#1FA2FF',
    chips: ['Aluminio', 'LED', 'Bioclimática'],
    chipsEn: ['Aluminum', 'LED', 'Bioclimatic'],
  },
  {
    id: 'tuuci',
    to: '/configurador/tuuci',
    nameKey: 'tuuci.name',
    shortKey: 'tuuci.short',
    longKey: 'tuuci.long',
    Art: TuuciArt,
    accent: '#B07B48',
    chips: ['Teca', 'Lona', '3 modelos'],
    chipsEn: ['Teak', 'Canvas', '3 models'],
  },
] as const

const FILAS = [
  { labelKey: 'select.material', Icon: Hammer, sol: 'solstice.material', tu: 'tuuci.material' },
  { labelKey: 'select.roof', Icon: Layers, sol: 'solstice.roof', tu: 'tuuci.roof' },
  { labelKey: 'select.style', Icon: Palette, sol: 'solstice.style', tu: 'tuuci.style' },
  { labelKey: 'select.use', Icon: Home, sol: 'solstice.use', tu: 'tuuci.use' },
] as const

export default function ModelSelect() {
  const { t, lang } = useT()
  const nav = useNavigate()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopBar />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Badge variant="muted" className="mb-3">
            {t('select.eyebrow')}
          </Badge>
          <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-4xl">
            {t('select.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('select.subtitle')}
          </p>
        </motion.div>

        {/* ── Tarjetas de modelo ─────────────────────────────────────────── */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {MODELOS.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => nav(m.to)}
              className="no-tap-highlight group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <m.Art className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {(lang === 'es' ? m.chips : m.chipsEn).map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-xl font-semibold tracking-tight">{t(m.nameKey)}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{t(m.shortKey)}</p>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground/85">
                  {t(m.longKey)}
                </p>
                <span
                  className={cn(
                    'mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium text-white transition-all',
                  )}
                  style={{ backgroundColor: m.accent }}
                >
                  {t('select.configure')} {t(m.nameKey)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Comparador ─────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-10 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="border-b border-border px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('select.compare')}
            </p>
            <h3 className="mt-0.5 font-display text-lg font-semibold tracking-tight">
              {t('select.compareTitle')}
            </h3>
          </div>

          <div className="grid grid-cols-[1fr] divide-y divide-border sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:divide-x sm:divide-y-0">
            {MODELOS.map((m) => (
              <div key={m.id} className="p-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.accent }} />
                  <p className="font-display text-sm font-semibold">{t(m.nameKey)}</p>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{t(m.longKey)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border">
            <p className="px-5 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('select.diffKey')}
            </p>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="w-[30%] px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground" />
                    <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#0B84D8] dark:text-[#5CC0FF]">
                      {t('solstice.name')}
                    </th>
                    <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#8A5C2E] dark:text-[#D6A36B]">
                      {t('tuuci.name')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FILAS.map((f) => (
                    <tr key={f.labelKey} className="border-t border-border/70">
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-2 text-[13px] font-medium">
                          <f.Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          {t(f.labelKey)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-muted-foreground">{t(f.sol)}</td>
                      <td className="px-5 py-3 text-[13px] text-muted-foreground">{t(f.tu)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        <DevNotice k="dev.3d" className="mt-6" />

        <div className="mt-8 flex justify-center gap-3 lg:hidden">
          <Button variant="outline" onClick={() => nav('/configurador/solstice')}>
            {t('solstice.name')}
          </Button>
          <Button variant="outline" onClick={() => nav('/configurador/tuuci')}>
            {t('tuuci.name')}
          </Button>
        </div>
      </main>

      <footer className="flex items-center justify-center gap-3 border-t border-border py-5">
        <PoweredBy />
        <span className="rounded border border-border px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">
          {t('app.demoPreview')}
        </span>
      </footer>
    </div>
  )
}
