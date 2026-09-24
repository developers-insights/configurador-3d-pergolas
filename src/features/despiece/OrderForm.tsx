import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, FileText, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DevNotice } from '@/components/DevNotice'
import { useT } from '@/lib/i18n'
import { money } from '@/lib/utils'
import { EMPRESA_DEMO } from '@/lib/session'
import type { ItemDespiece } from '@/types'

export interface DatosPedido {
  empresa: string
  contacto: string
  email: string
  telefono: string
  clienteFinal: string
  direccion: string
  ciudad: string
  notas: string
}

const INICIAL: DatosPedido = {
  empresa: EMPRESA_DEMO,
  contacto: 'Martina Rossi',
  email: 'martina@auroraoutdoor.com',
  telefono: '+54 11 5478-2210',
  clienteFinal: '',
  direccion: '',
  ciudad: '',
  notas: '',
}

export function OrderForm({
  items,
  total,
  onSubmit,
  onCancel,
}: {
  items: ItemDespiece[]
  total: number
  onSubmit: (d: DatosPedido) => void
  onCancel: () => void
}) {
  const { t, lang } = useT()
  const [d, setD] = useState<DatosPedido>(INICIAL)
  const [error, setError] = useState(false)

  const campo = (k: keyof DatosPedido) => ({
    value: d[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setD((p) => ({ ...p, [k]: e.target.value }))
      setError(false)
    },
  })

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!d.empresa.trim() || !d.contacto.trim() || !d.clienteFinal.trim() || !d.direccion.trim()) {
      setError(true)
      return
    }
    onSubmit(d)
  }

  return (
    <form onSubmit={enviar} className="p-5">
      <DevNotice k="dev.db" className="mb-5" />

      {/* Empresa */}
      <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Building2 className="h-3.5 w-3.5" />
        {t('order.company')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="o-emp">{t('order.companyName')} *</Label>
          <Input id="o-emp" {...campo('empresa')} />
        </div>
        <div>
          <Label htmlFor="o-con">{t('order.contact')} *</Label>
          <Input id="o-con" {...campo('contacto')} />
        </div>
        <div>
          <Label htmlFor="o-mail">{t('order.email')}</Label>
          <Input id="o-mail" type="email" {...campo('email')} />
        </div>
        <div>
          <Label htmlFor="o-tel">{t('order.phone')}</Label>
          <Input id="o-tel" {...campo('telefono')} />
        </div>
      </div>

      {/* Cliente final */}
      <p className="mb-3 mt-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <User className="h-3.5 w-3.5" />
        {t('order.client')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="o-cli">{t('order.clientName')} *</Label>
          <Input id="o-cli" placeholder="Familia Etchegoyen" {...campo('clienteFinal')} />
        </div>
        <div>
          <Label htmlFor="o-dir">{t('order.address')} *</Label>
          <Input id="o-dir" placeholder="Barrio El Golf, lote 212" {...campo('direccion')} />
        </div>
        <div>
          <Label htmlFor="o-ciu">{t('order.city')}</Label>
          <Input id="o-ciu" placeholder="Pilar" {...campo('ciudad')} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="o-not">
            {t('order.notes')} <span className="opacity-60">({t('misc.optional')})</span>
          </Label>
          <Textarea id="o-not" placeholder={t('order.notesPh')} {...campo('notas')} />
        </div>
      </div>

      {/* Materiales adjuntos (read-only) */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/50 px-3.5 py-2.5">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            {t('order.attached')}
          </p>
          <Badge variant="muted">{t('order.readonly')}</Badge>
        </div>
        <div className="scrollbar-thin max-h-44 overflow-y-auto">
          <table className="w-full text-[11px]">
            <tbody>
              {items.map((i) => (
                <tr key={i.sku} className="border-b border-border/60 last:border-0">
                  <td className="num w-24 px-3.5 py-1.5 text-muted-foreground">{i.sku}</td>
                  <td className="px-2 py-1.5">{lang === 'es' ? i.descripcion : i.descripcionEn}</td>
                  <td className="num w-16 px-3.5 py-1.5 text-right">
                    {i.cantidad} {i.unidad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/50 px-3.5 py-2.5">
          <span className="text-[11px] text-muted-foreground">
            {items.length} {t('bom.items')}
          </span>
          <span className="num text-sm font-semibold">{money(total)}</span>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xs font-medium text-destructive"
        >
          {t('order.required')}
        </motion.p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('order.cancel')}
        </Button>
        <Button type="submit" size="lg">
          <Send className="h-4 w-4" />
          {t('order.submit')}
        </Button>
      </div>
    </form>
  )
}
