import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  /** Color del track activo y del thumb. */
  tone?: string
  onChange: (v: number) => void
  className?: string
}

/**
 * Slider accesible sobre <input type=range>, con track pintado según el valor.
 * Se usa en ambos configuradores; sólo cambia el `tone`.
 */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  tone = '#1FA2FF',
  onChange,
  className,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  const id = React.useId()

  return (
    <div className={cn('select-none', className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide opacity-70">
          {label}
        </label>
        <span className="num text-sm font-semibold" style={{ color: tone }}>
          {Number.isInteger(value) ? value : value.toFixed(1)}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="ins-range h-6 w-full cursor-pointer appearance-none bg-transparent"
        style={
          {
            '--pct': `${pct}%`,
            '--tone': tone,
          } as React.CSSProperties
        }
      />
      <div className="mt-1 flex justify-between text-[10px] opacity-40">
        <span className="num">
          {min}
          {suffix}
        </span>
        <span className="num">
          {max}
          {suffix}
        </span>
      </div>
    </div>
  )
}
