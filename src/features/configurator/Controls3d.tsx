import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/* Controles compartidos por los dos configuradores.
   `tone` los adapta: 'dark' para Solstice, 'light' para Tuuci. */

type Tone = 'dark' | 'light'

const toneCls = (tone: Tone) => ({
  label: tone === 'dark' ? 'text-white/50' : 'text-neutral-500',
  card:
    tone === 'dark'
      ? 'border-white/10 bg-white/[0.03] text-white/75 hover:border-white/25 hover:bg-white/[0.07]'
      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50',
  active:
    tone === 'dark'
      ? 'border-[#1FA2FF] bg-[#1FA2FF]/12 text-white'
      : 'border-neutral-900 bg-neutral-900 text-white',
})

export function SectionTitle({ title, hint, tone }: { title: string; hint?: string; tone: Tone }) {
  const c = toneCls(tone)
  return (
    <div className="mb-4">
      <h3 className={cn('font-display text-sm font-semibold uppercase tracking-wider', tone === 'dark' ? 'text-white' : 'text-neutral-900')}>
        {title}
      </h3>
      {hint && <p className={cn('mt-1 text-[11px] leading-relaxed', c.label)}>{hint}</p>}
    </div>
  )
}

export function FieldLabel({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  const c = toneCls(tone)
  return (
    <p className={cn('mb-2 text-[11px] font-medium uppercase tracking-wide', c.label)}>{children}</p>
  )
}

export interface Opcion<T extends string | number> {
  value: T
  label: string
  sub?: string
}

export function OptionGrid<T extends string | number>({
  options,
  value,
  onChange,
  tone,
  cols = 2,
}: {
  options: Opcion<T>[]
  value: T
  onChange: (v: T) => void
  tone: Tone
  cols?: 2 | 3 | 4
}) {
  const c = toneCls(tone)
  return (
    <div
      className={cn(
        'grid gap-2',
        cols === 2 && 'grid-cols-2',
        cols === 3 && 'grid-cols-3',
        cols === 4 && 'grid-cols-4',
      )}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cn(
              'no-tap-highlight rounded-lg border px-2.5 py-2.5 text-left text-xs font-medium transition-all duration-150',
              active ? c.active : c.card,
            )}
          >
            <span className="block truncate">{o.label}</span>
            {o.sub && (
              <span className={cn('mt-0.5 block truncate text-[10px] font-normal opacity-60')}>{o.sub}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function ToggleRow({
  label,
  desc,
  checked,
  onChange,
  tone,
}: {
  label: string
  desc?: string
  checked: boolean
  onChange: (v: boolean) => void
  tone: Tone
}) {
  const c = toneCls(tone)
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={cn(
        'no-tap-highlight flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-150',
        checked ? c.active : c.card,
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium">{label}</span>
        {desc && <span className="mt-0.5 block text-[10px] opacity-60">{desc}</span>}
      </span>
      <span
        className={cn(
          'relative grid h-5 w-9 shrink-0 place-items-start rounded-full transition-colors',
          checked
            ? tone === 'dark'
              ? 'bg-[#1FA2FF]'
              : 'bg-white/90'
            : tone === 'dark'
              ? 'bg-white/15'
              : 'bg-neutral-300',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full shadow-sm transition-all duration-200',
            checked
              ? tone === 'dark'
                ? 'left-[18px] bg-white'
                : 'left-[18px] bg-neutral-900'
              : 'left-0.5 bg-white',
          )}
        />
      </span>
    </button>
  )
}

export function SwatchRow<T extends string>({
  options,
  value,
  onChange,
  tone,
}: {
  options: { value: T; label: string; hex: string }[]
  value: T
  onChange: (v: T) => void
  tone: Tone
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            title={o.label}
            className="no-tap-highlight group flex flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                'relative grid h-11 w-full place-items-center rounded-lg border-2 transition-all duration-150',
                active
                  ? tone === 'dark'
                    ? 'border-[#1FA2FF] ring-2 ring-[#1FA2FF]/25'
                    : 'border-neutral-900 ring-2 ring-neutral-900/15'
                  : tone === 'dark'
                    ? 'border-white/12 group-hover:border-white/35'
                    : 'border-neutral-200 group-hover:border-neutral-400',
              )}
              style={{ backgroundColor: o.hex }}
            >
              {active && (
                <Check
                  className="h-4 w-4 drop-shadow"
                  style={{ color: needsDarkTick(o.hex) ? '#0B0F14' : '#fff' }}
                />
              )}
            </span>
            <span
              className={cn(
                'w-full truncate text-center text-[10px] font-medium',
                tone === 'dark' ? 'text-white/60' : 'text-neutral-500',
              )}
            >
              {o.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Decide el color del tilde según la luminancia del swatch. */
function needsDarkTick(hex: string) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62
}
