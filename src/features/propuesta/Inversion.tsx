import { useState } from 'react'
import { CalendarDays, Check, CreditCard, Eye, EyeOff, Sparkles } from 'lucide-react'
import { INVERSION } from './modulos'
import { useT } from '@/lib/i18n'
import { cn, money } from '@/lib/utils'

const ACENTO = '#1FA2FF'

/**
 * Bloque de inversión: arranca SIEMPRE oculto (el estado no se persiste, así
 * que cada F5 vuelve a taparlo) y revela todo de una al tocar el ojito.
 * El monto recién se monta al revelar, para que no quede legible en el DOM
 * de una pantalla compartida antes de tiempo.
 */
export function Inversion() {
  const { t } = useT()
  const [visible, setVisible] = useState(false)

  return (
    <section className="print-break pt-12">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {/* Fila del ojito */}
        <button
          onClick={() => setVisible((v) => !v)}
          aria-expanded={visible}
          className="no-tap-highlight flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/40 sm:px-6"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="font-display text-base font-semibold tracking-tight">
              {t('prop.investTitle')}
            </span>
            {!visible && (
              <span className="num select-none text-lg font-semibold tracking-[0.2em] text-muted-foreground/60">
                ••••••
              </span>
            )}
          </span>

          <span className="flex shrink-0 items-center gap-2 text-xs font-medium" style={{ color: ACENTO }}>
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {visible ? t('prop.investHide') : t('prop.investShow')}
          </span>
        </button>

        {/* Revelado: transición de altura para que no salte en pantalla compartida */}
        <div className="ins-reveal" data-open={visible}>
          <div>
            {visible && (
              <div className="border-t border-border px-5 py-6 sm:px-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                  {/* Monto */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('prop.investTotal')}
                    </p>
                    <p className="num mt-1 font-display text-[44px] font-semibold leading-none tracking-tight sm:text-[56px]">
                      {money(INVERSION.total)}
                      <span className="ml-2 align-middle text-base font-medium text-muted-foreground">
                        USD
                      </span>
                    </p>

                    <dl className="mt-6 space-y-3">
                      <Fila Icon={CalendarDays} label={t('prop.delivery')} valor={t('prop.deliveryValue')} />
                      <Fila Icon={CreditCard} label={t('prop.payment')} valor={t('prop.paymentValue')} />
                    </dl>
                  </div>

                  {/* Alcance + descuento */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('prop.includes')}
                    </p>
                    <p className="mt-2 flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
                      <Check className="mt-[3px] h-3.5 w-3.5 shrink-0" style={{ color: ACENTO }} />
                      <span>{t('prop.includesValue')}</span>
                    </p>

                    <div
                      className="mt-5 rounded-xl border-2 p-4"
                      style={{ borderColor: ACENTO, backgroundColor: 'rgba(31,162,255,0.06)' }}
                    >
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: ACENTO }}>
                        <Sparkles className="h-3.5 w-3.5" />
                        {t('prop.discount')}
                      </p>
                      <p className="num mt-1.5 font-display text-3xl font-semibold tracking-tight">
                        {money(INVERSION.totalConDescuento)}
                        <span className="ml-1.5 align-middle text-sm font-medium text-muted-foreground">
                          USD
                        </span>
                      </p>
                      <p className="num mt-1 text-xs text-muted-foreground line-through">
                        {money(INVERSION.total)} USD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Fila({
  Icon,
  label,
  valor,
}: {
  Icon: React.ComponentType<{ className?: string }>
  label: string
  valor: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0">
        <span className={cn('block text-[10px] uppercase tracking-wider text-muted-foreground')}>
          {label}
        </span>
        <span className="block text-sm font-medium">{valor}</span>
      </span>
    </div>
  )
}
