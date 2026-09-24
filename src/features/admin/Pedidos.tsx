import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, MapPin, Package, Search, Sparkles, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { DevNotice } from '@/components/DevNotice'
import { useToast } from '@/components/ui/toast'
import { useT } from '@/lib/i18n'
import { useSession } from '@/lib/session'
import { cn, fmtDate, money } from '@/lib/utils'
import type { EstadoPedido, Pedido } from '@/types'

const ESTADOS: EstadoPedido[] = ['nuevo', 'preparacion', 'enviado']

const LABEL: Record<EstadoPedido, string> = {
  nuevo: 'orders.new',
  preparacion: 'orders.prep',
  enviado: 'orders.sentSt',
}

const VARIANTE: Record<EstadoPedido, 'blue' | 'warn' | 'success'> = {
  nuevo: 'blue',
  preparacion: 'warn',
  enviado: 'success',
}

export default function Pedidos() {
  const { t, lang } = useT()
  const { pedidos, setEstadoPedido } = useSession()
  const { toast } = useToast()
  const [filtro, setFiltro] = useState<'todos' | EstadoPedido>('todos')
  const [q, setQ] = useState('')
  const [detalleId, setDetalleId] = useState<string | null>(null)

  const lista = useMemo(() => {
    const term = q.trim().toLowerCase()
    return pedidos.filter(
      (p) =>
        (filtro === 'todos' || p.estado === filtro) &&
        (!term ||
          p.id.toLowerCase().includes(term) ||
          p.empresa.toLowerCase().includes(term) ||
          p.clienteFinal.toLowerCase().includes(term)),
    )
  }, [pedidos, filtro, q])

  const detalle = pedidos.find((p) => p.id === detalleId) ?? null

  const cambiar = (p: Pedido, estado: EstadoPedido) => {
    setEstadoPedido(p.id, estado)
    toast({ title: t('orders.statusChanged'), desc: `${p.id} → ${t(LABEL[estado])}`, kind: 'info' })
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{t('orders.title')}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t('orders.desc')}</p>
      </motion.div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('users.search')} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['todos', ...ESTADOS] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={cn(
                'no-tap-highlight rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                filtro === f
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {f === 'todos' ? t('users.all') : t(LABEL[f])}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {lista.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.02 }}
            onClick={() => setDetalleId(p.id)}
            className={cn(
              'no-tap-highlight flex w-full flex-col gap-2 rounded-xl border bg-card p-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:gap-4',
              p.deSesion ? 'border-[#1FA2FF]/45 ring-1 ring-[#1FA2FF]/15' : 'border-border',
            )}
          >
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
                <Package className="h-4 w-4 text-muted-foreground" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="num text-[11px] text-muted-foreground">{p.id}</span>
                  {p.deSesion && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#1FA2FF]/12 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-[#0B84D8] dark:text-[#5CC0FF]">
                      <Sparkles className="h-2.5 w-2.5" />
                      {t('orders.fromDemo')}
                    </span>
                  )}
                </span>
                <span className="block truncate text-[13px] font-medium">{p.clienteFinal}</span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {p.empresa} · {p.resumenConfig}
                </span>
              </span>
            </span>

            <span className="flex shrink-0 items-center gap-3 pl-12 sm:pl-0">
              <span className="num text-xs text-muted-foreground">{fmtDate(p.fecha, lang)}</span>
              <span className="num w-20 text-right text-[13px] font-semibold">{money(p.totalRef)}</span>
              <Badge variant={VARIANTE[p.estado]}>{t(LABEL[p.estado])}</Badge>
            </span>
          </motion.button>
        ))}

        {!lista.length && (
          <p className="rounded-xl border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
            {t('orders.empty')}
          </p>
        )}
      </div>

      <DevNotice k="dev.db" className="mt-4" />

      {/* Detalle del pedido */}
      <Modal open={!!detalle} onClose={() => setDetalleId(null)} title={detalle?.id} subtitle={t('orders.detail')}>
        {detalle && (
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={VARIANTE[detalle.estado]}>{t(LABEL[detalle.estado])}</Badge>
              <span className="num text-[11px] text-muted-foreground">{fmtDate(detalle.fecha, lang)}</span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Dato Icon={Building2} label={t('orders.from')} valor={`${detalle.empresa} · ${detalle.contacto}`} />
              <Dato Icon={User} label={t('orders.client')} valor={detalle.clienteFinal} />
              <Dato Icon={MapPin} label={t('order.address')} valor={`${detalle.direccion}${detalle.ciudad ? `, ${detalle.ciudad}` : ''}`} />
              <Dato Icon={Package} label={t('orders.model')} valor={detalle.resumenConfig} />
            </div>

            {detalle.notas && (
              <div className="mt-3 rounded-lg border border-border bg-muted/40 px-3.5 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t('orders.notesLabel')}
                </p>
                <p className="mt-0.5 text-xs">{detalle.notas}</p>
              </div>
            )}

            {/* Cambiar estado */}
            <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('orders.changeStatus')}
            </p>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map((e) => (
                <Button
                  key={e}
                  size="sm"
                  variant={detalle.estado === e ? 'default' : 'outline'}
                  onClick={() => cambiar(detalle, e)}
                >
                  {t(LABEL[e])}
                </Button>
              ))}
            </div>

            {/* Materiales */}
            <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('orders.materials')}
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="scrollbar-thin max-h-72 overflow-y-auto">
                <table className="w-full text-[11px]">
                  <tbody>
                    {detalle.items.map((i) => (
                      <tr key={i.sku} className="border-b border-border/60 last:border-0">
                        <td className="num w-24 px-3.5 py-2 text-muted-foreground">{i.sku}</td>
                        <td className="px-2 py-2">{lang === 'es' ? i.descripcion : i.descripcionEn}</td>
                        <td className="num w-20 px-3.5 py-2 text-right">
                          {i.cantidad} {i.unidad}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-border bg-muted/50 px-3.5 py-2.5">
                <span className="text-[11px] text-muted-foreground">
                  {detalle.items.length} {t('bom.items')}
                </span>
                <span className="num text-sm font-semibold">{money(detalle.totalRef)}</span>
              </div>
            </div>

            <DevNotice k="dev.db" className="mt-5" compact />
          </div>
        )}
      </Modal>
    </div>
  )
}

function Dato({
  Icon,
  label,
  valor,
}: {
  Icon: React.ComponentType<{ className?: string }>
  label: string
  valor: string
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border px-3 py-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0">
        <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="block text-xs font-medium">{valor}</span>
      </span>
    </div>
  )
}
