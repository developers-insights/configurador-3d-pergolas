import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  MessageCircle,
  Package,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { TopBar } from '@/components/shell/TopBar'
import { PoweredBy } from '@/components/shell/Brand'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { DevNotice } from '@/components/DevNotice'
import { useToast } from '@/components/ui/toast'
import { OrderForm, type DatosPedido } from './OrderForm'
import { leerThumbnail } from './thumbnail'
import { SolsticeArt, TuuciArt } from '@/features/configurator/ModelPreviewArt'
import { KEY_SOLSTICE, KEY_TUUCI } from '@/features/configurator/useConfig'
import { readJSON } from '@/lib/storage'
import { useT } from '@/lib/i18n'
import { cn, money, nuevoIdPedido } from '@/lib/utils'
import { useSession } from '@/lib/session'
import { whatsappUrl } from '@/lib/whatsapp'
import { DEFAULT_SOLSTICE, DEFAULT_TUUCI } from '@/data/mock'
import { calcularDespiece, resumirConfig, totalDespiece, totalPiezas } from '@/data/catalogo'
import type { Config, ConfigSolstice, ConfigTuuci, GrupoDespiece, ItemDespiece, Pedido } from '@/types'

const GRUPOS: GrupoDespiece[] = ['structure', 'roof', 'walls', 'addons', 'hardware', 'textile']

export default function DespiecePage() {
  const { t, lang } = useT()
  const { toast } = useToast()
  const { addPedido, pedidos } = useSession()
  const [params] = useSearchParams()
  const [formAbierto, setFormAbierto] = useState(false)
  const [pedidoOk, setPedidoOk] = useState<Pedido | null>(null)

  const modelo = params.get('m') === 'tuuci' ? 'tuuci' : 'solstice'

  const cfg = useMemo<Config>(() => {
    if (modelo === 'tuuci') {
      const g = readJSON<ConfigTuuci | null>(window.sessionStorage, KEY_TUUCI, null)
      return g ? { ...DEFAULT_TUUCI, ...g } : DEFAULT_TUUCI
    }
    const g = readJSON<ConfigSolstice | null>(window.sessionStorage, KEY_SOLSTICE, null)
    return g ? { ...DEFAULT_SOLSTICE, ...g } : DEFAULT_SOLSTICE
  }, [modelo])

  const items = useMemo(() => calcularDespiece(cfg), [cfg])
  const total = useMemo(() => totalDespiece(items), [items])
  const piezas = useMemo(() => totalPiezas(items), [items])
  const resumen = useMemo(() => resumirConfig(cfg, lang), [cfg, lang])
  const thumb = useMemo(() => leerThumbnail(), [])

  const volver = modelo === 'tuuci' ? '/configurador/tuuci' : '/configurador/solstice'

  const confirmar = (d: DatosPedido) => {
    const pedido: Pedido = {
      id: nuevoIdPedido(pedidos.filter((p) => p.deSesion).length),
      empresa: d.empresa,
      contacto: d.contacto,
      email: d.email,
      telefono: d.telefono,
      clienteFinal: d.clienteFinal,
      direccion: d.direccion,
      ciudad: d.ciudad,
      notas: d.notas,
      modelo,
      resumenConfig: resumen,
      items,
      totalRef: total,
      fecha: new Date().toISOString(),
      estado: 'nuevo',
      deSesion: true,
    }
    addPedido(pedido)
    setFormAbierto(false)
    setPedidoOk(pedido)
    toast({ title: t('order.sent'), desc: t('order.sentDesc') })
  }

  const textoWhatsapp = `${resumen}\n${items.length} ${t('bom.items')} · ${piezas} ${t('bom.pieces')} · ${money(total)}`

  if (pedidoOk) return <Exito pedido={pedidoOk} />

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopBar />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-7 sm:px-6 sm:py-10">
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
            {t('bom.backToConfig')}
          </Link>

          <Badge variant="muted" className="mb-2">
            {t('bom.eyebrow')}
          </Badge>
          <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight sm:text-3xl">
            {t('bom.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t('bom.subtitle')}</p>
        </motion.div>

        <DevNotice k="dev.catalog" className="mt-5" />

        {/* ── Encabezado del despiece ───────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="mt-5 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="grid gap-0 sm:grid-cols-[220px_minmax(0,1fr)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-muted sm:aspect-auto sm:border-b-0 sm:border-r">
              {thumb ? (
                <img src={thumb} alt={resumen} className="h-full w-full object-cover" />
              ) : modelo === 'tuuci' ? (
                <TuuciArt className="h-full w-full object-cover" />
              ) : (
                <SolsticeArt className="h-full w-full object-cover" />
              )}
              <span className="absolute left-2.5 top-2.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                3D
              </span>
            </div>

            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t('bom.config')}
              </p>
              <p className="mt-1 font-display text-lg font-semibold leading-snug tracking-tight">
                {resumen}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <Dato label={t('bom.items')} valor={String(items.length)} />
                <Dato label={t('bom.pieces')} valor={String(piezas)} />
                <Dato label={t('bom.total')} valor={money(total)} destacado />
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Tabla de materiales ──────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-5 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-sm font-semibold tracking-tight">{t('bom.title')}</h2>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5 font-medium">{t('bom.sku')}</th>
                  <th className="px-3 py-2.5 font-medium">{t('bom.desc')}</th>
                  <th className="px-3 py-2.5 text-right font-medium">{t('bom.qty')}</th>
                  <th className="px-3 py-2.5 font-medium">{t('bom.unit')}</th>
                  <th className="px-3 py-2.5 text-right font-medium">{t('bom.price')}</th>
                  <th className="px-5 py-2.5 text-right font-medium">{t('bom.subtotal')}</th>
                </tr>
              </thead>
              <tbody>
                {GRUPOS.map((grupo) => {
                  const delGrupo = items.filter((i) => i.grupo === grupo)
                  if (!delGrupo.length) return null
                  return (
                    <GrupoFilas key={grupo} grupo={grupo} items={delGrupo} />
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/40">
                  <td colSpan={5} className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">
                    {t('bom.total')}
                  </td>
                  <td className="num px-5 py-3.5 text-right text-base font-semibold">{money(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.section>

        {/* ── Acciones ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="mt-5 flex flex-col gap-2.5 sm:flex-row"
        >
          <Button size="lg" className="flex-1" onClick={() => setFormAbierto(true)}>
            <Send className="h-4 w-4" />
            {t('bom.send')}
          </Button>
          <a
            href={whatsappUrl(textoWhatsapp)}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: 'border-emerald-600/35 text-emerald-700 hover:bg-emerald-600/10 dark:text-emerald-400',
            })}
          >
            <MessageCircle className="h-4 w-4" />
            {t('bom.whatsapp')}
          </a>
          <Button
            variant="outline"
            size="lg"
            onClick={() => toast({ title: t('bom.pdf'), desc: t('dev.pdf'), kind: 'warn' })}
          >
            <Download className="h-4 w-4" />
            {t('bom.pdf')}
          </Button>
        </motion.div>

        <DevNotice k="dev.pdf" className="mt-5" />
      </main>

      <footer className="flex justify-center border-t border-border py-5">
        <PoweredBy />
      </footer>

      <Modal
        open={formAbierto}
        onClose={() => setFormAbierto(false)}
        title={t('order.title')}
        subtitle={resumen}
      >
        <OrderForm items={items} total={total} onSubmit={confirmar} onCancel={() => setFormAbierto(false)} />
      </Modal>
    </div>
  )
}

/* ── Piezas ──────────────────────────────────────────────────────────────── */

function Dato({ label, valor, destacado }: { label: string; valor: string; destacado?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('num mt-0.5 font-semibold', destacado ? 'text-base' : 'text-sm')}>{valor}</p>
    </div>
  )
}

function GrupoFilas({ grupo, items }: { grupo: GrupoDespiece; items: ItemDespiece[] }) {
  const { t, lang } = useT()
  return (
    <>
      <tr className="bg-muted/40">
        <td colSpan={6} className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Package className="h-3 w-3" />
            {t(`bom.group.${grupo}`)}
          </span>
        </td>
      </tr>
      {items.map((i) => (
        <tr key={i.sku} className="border-b border-border/60 transition-colors hover:bg-accent/40">
          <td className="num whitespace-nowrap px-5 py-2.5 text-xs text-muted-foreground">{i.sku}</td>
          <td className="px-3 py-2.5 text-[13px]">{lang === 'es' ? i.descripcion : i.descripcionEn}</td>
          <td className="num px-3 py-2.5 text-right text-[13px] font-medium">{i.cantidad}</td>
          <td className="px-3 py-2.5 text-xs uppercase text-muted-foreground">{i.unidad}</td>
          <td className="num px-3 py-2.5 text-right text-[13px] text-muted-foreground">{money(i.precioRef)}</td>
          <td className="num px-5 py-2.5 text-right text-[13px] font-medium">
            {money(i.cantidad * i.precioRef)}
          </td>
        </tr>
      ))}
    </>
  )
}

/* ── Confirmación ────────────────────────────────────────────────────────── */

function Exito({ pedido }: { pedido: Pedido }) {
  const { t } = useT()
  const { switchRol } = useSession()
  const nav = useNavigate()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopBar />
      <main className="mx-auto flex w-full max-w-[600px] flex-1 items-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="w-full rounded-2xl border border-border bg-card p-7 text-center"
        >
          <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/12">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </span>
          <h1 className="font-display text-xl font-semibold tracking-tight">{t('order.successTitle')}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t('order.successDesc')}
          </p>

          <dl className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border text-left">
            <Fila k={t('orders.id')} v={pedido.id} />
            <Fila k={t('orders.from')} v={pedido.empresa} />
            <Fila k={t('orders.client')} v={pedido.clienteFinal} />
            <Fila k={t('bom.config')} v={pedido.resumenConfig} />
            <Fila k={t('bom.total')} v={money(pedido.totalRef)} />
          </dl>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                switchRol('admin')
                nav('/admin/pedidos', { replace: true })
              }}
            >
              <ShieldCheck className="h-4 w-4" />
              {t('order.goAdmin')}
            </Button>
            <Button variant="outline" size="lg" className="flex-1" onClick={() => nav('/configurador')}>
              {t('order.newConfig')}
            </Button>
          </div>

          <DevNotice k="dev.db" className="mt-6 text-left" />
        </motion.div>
      </main>
      <footer className="flex justify-center border-t border-border py-5">
        <PoweredBy />
      </footer>
    </div>
  )
}

function Fila({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <dt className="shrink-0 text-xs text-muted-foreground">{k}</dt>
      <dd className="num truncate text-xs font-medium">{v}</dd>
    </div>
  )
}
