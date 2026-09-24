import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Mail, MapPin, Phone, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { DevNotice } from '@/components/DevNotice'
import { useT } from '@/lib/i18n'
import { useSession } from '@/lib/session'
import { cn, fmtDate, money } from '@/lib/utils'
import { EMPRESAS_MOCK } from '@/data/mock'
import type { Empresa, EstadoEmpresa } from '@/types'

type Filtro = 'todas' | EstadoEmpresa

export default function Empresas() {
  const { t, lang } = useT()
  const { pedidos } = useSession()
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [q, setQ] = useState('')
  const [detalle, setDetalle] = useState<Empresa | null>(null)

  const lista = useMemo(() => {
    const term = q.trim().toLowerCase()
    return EMPRESAS_MOCK.filter(
      (e) =>
        (filtro === 'todas' || e.estado === filtro) &&
        (!term ||
          e.nombre.toLowerCase().includes(term) ||
          e.contacto.toLowerCase().includes(term) ||
          e.region.toLowerCase().includes(term)),
    )
  }, [filtro, q])

  const pedidosDe = (nombre: string) => pedidos.filter((p) => p.empresa === nombre)

  return (
    <div className="mx-auto max-w-[1180px]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{t('users.title')}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t('users.desc')}</p>
      </motion.div>

      {/* Filtros */}
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('users.search')}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {(['todas', 'activo', 'inactivo'] as Filtro[]).map((f) => (
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
              {f === 'todas' ? t('users.all') : f === 'activo' ? t('users.active') : t('users.inactive')}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">{t('users.company')}</th>
                <th className="px-3 py-3 font-medium">{t('users.status')}</th>
                <th className="px-3 py-3 font-medium">{t('users.plan')}</th>
                <th className="px-3 py-3 font-medium">{t('users.lastAccess')}</th>
                <th className="px-5 py-3 text-right font-medium">{t('users.orders')}</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setDetalle(e)}
                  className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-accent/50"
                >
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-[11px] font-semibold uppercase">
                        {e.nombre.slice(0, 2)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium">{e.nombre}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {e.contacto} · {e.region}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={e.estado === 'activo' ? 'success' : 'muted'}>
                      {e.estado === 'activo' ? t('users.active') : t('users.inactive')}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={e.plan === 'Enterprise' ? 'blue' : 'outline'}>{e.plan}</Badge>
                  </td>
                  <td className="num px-3 py-3 text-xs text-muted-foreground">
                    {fmtDate(e.ultimoAcceso, lang)}
                  </td>
                  <td className="num px-5 py-3 text-right text-[13px] font-medium">{e.cantidadPedidos}</td>
                </tr>
              ))}
              {!lista.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    {t('users.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DevNotice k="dev.users" className="mt-4" />

      {/* Detalle */}
      <Modal
        open={!!detalle}
        onClose={() => setDetalle(null)}
        title={detalle?.nombre}
        subtitle={t('users.detail')}
      >
        {detalle && (
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={detalle.estado === 'activo' ? 'success' : 'muted'}>
                {detalle.estado === 'activo' ? t('users.active') : t('users.inactive')}
              </Badge>
              <Badge variant={detalle.plan === 'Enterprise' ? 'blue' : 'outline'}>{detalle.plan}</Badge>
              <span className="text-[11px] text-muted-foreground">
                {t('users.since')} {fmtDate(detalle.desde, lang)}
              </span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Dato Icon={Building2} label={t('users.contact')} valor={detalle.contacto} />
              <Dato Icon={MapPin} label={t('users.region')} valor={detalle.region} />
              <Dato Icon={Mail} label={t('order.email')} valor={detalle.email} />
              <Dato Icon={Phone} label={t('order.phone')} valor={detalle.telefono} />
            </div>

            <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('users.lastOrders')}
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              {pedidosDe(detalle.nombre).slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 border-b border-border/60 px-3.5 py-2.5 last:border-0"
                >
                  <span className="min-w-0">
                    <span className="num block text-[11px] text-muted-foreground">{p.id}</span>
                    <span className="block truncate text-xs font-medium">{p.clienteFinal}</span>
                  </span>
                  <span className="num shrink-0 text-xs">{money(p.totalRef)}</span>
                </div>
              ))}
              {!pedidosDe(detalle.nombre).length && (
                <p className="px-3.5 py-6 text-center text-xs text-muted-foreground">{t('users.noOrders')}</p>
              )}
            </div>

            <DevNotice k="dev.users" className="mt-5" compact />
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
        <span className="block truncate text-xs font-medium">{valor}</span>
      </span>
    </div>
  )
}
