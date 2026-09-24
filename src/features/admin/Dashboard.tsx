import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Building2, Package, TrendingUp, UserX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DevNotice } from '@/components/DevNotice'
import { useT } from '@/lib/i18n'
import { useSession } from '@/lib/session'
import { cn } from '@/lib/utils'
import { EMPRESAS_MOCK, PEDIDOS_POR_MES, TOP_MATERIALES } from '@/data/mock'

const AZUL = '#1FA2FF'
const COLORES = ['#1FA2FF', '#34D399', '#F59E0B', '#A78BFA', '#F87171', '#64748B']

export default function Dashboard() {
  const { t, lang } = useT()
  const { pedidos } = useSession()
  const nav = useNavigate()

  const activas = EMPRESAS_MOCK.filter((e) => e.estado === 'activo').length
  const inactivas = EMPRESAS_MOCK.length - activas

  // Pedidos del mes = histórico del último mes + los creados en la demo.
  const delMes = useMemo(() => {
    const ahora = new Date()
    return pedidos.filter((p) => {
      const d = new Date(p.fecha)
      return d.getMonth() === ahora.getMonth() && d.getFullYear() === ahora.getFullYear()
    }).length
  }, [pedidos])

  const serieMeses = useMemo(() => {
    const extras = pedidos.filter((p) => p.deSesion).length
    return PEDIDOS_POR_MES.map((p, i) => ({
      mes: new Date(`${p.mes}-02`).toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
        month: 'short',
      }),
      pedidos: i === PEDIDOS_POR_MES.length - 1 ? p.pedidos + extras : p.pedidos,
    }))
  }, [pedidos, lang])

  const porPlan = useMemo(() => {
    const m = new Map<string, number>()
    EMPRESAS_MOCK.forEach((e) => m.set(e.plan, (m.get(e.plan) ?? 0) + e.cantidadPedidos))
    return [...m.entries()].map(([name, value]) => ({ name, value }))
  }, [])

  const kpis = [
    { key: 'kpi.activeCompanies', valor: activas, Icon: Building2, tone: 'text-emerald-500', to: '/admin/empresas' },
    { key: 'kpi.inactiveCompanies', valor: inactivas, Icon: UserX, tone: 'text-amber-500', to: '/admin/empresas' },
    { key: 'kpi.ordersMonth', valor: delMes, Icon: Package, tone: 'text-[#1FA2FF]', to: '/admin/pedidos' },
    {
      key: 'kpi.topMaterial',
      valor: lang === 'es' ? TOP_MATERIALES[0].nombre : TOP_MATERIALES[0].nombreEn,
      Icon: TrendingUp,
      tone: 'text-violet-500',
      to: '/admin/pedidos',
    },
  ]

  return (
    <div className="mx-auto max-w-[1180px]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Badge variant="muted" className="mb-2">
          {t('admin.panel')}
        </Badge>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('admin.welcome')}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t('admin.welcomeDesc')}</p>
      </motion.div>

      {/* KPIs */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.button
            key={k.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 * i }}
            onClick={() => nav(k.to)}
            className="no-tap-highlight rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {t(k.key)}
              </span>
              <k.Icon className={cn('h-4 w-4', k.tone)} />
            </span>
            <span
              className={cn(
                'mt-2 block font-semibold leading-tight',
                typeof k.valor === 'number' ? 'num text-3xl' : 'text-sm',
              )}
            >
              {k.valor}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Gráficos */}
      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>{t('chart.ordersByMonth')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px] pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serieMeses} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.45} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.45} tickLine={false} axisLine={false} width={34} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--popover))',
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pedidos"
                  stroke={AZUL}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: AZUL }}
                  activeDot={{ r: 5 }}
                  name={t('admin.orders')}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>{t('chart.companiesActivity')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={porPlan}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {porPlan.map((_, i) => (
                    <Cell key={i} fill={COLORES[i % COLORES.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--popover))',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle>{t('chart.topMaterials')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={TOP_MATERIALES.map((m) => ({
                  nombre: lang === 'es' ? m.nombre : m.nombreEn,
                  cantidad: m.cantidad,
                }))}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.45} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  tick={{ fontSize: 11 }}
                  stroke="currentColor"
                  opacity={0.6}
                  tickLine={false}
                  axisLine={false}
                  width={160}
                />
                <Tooltip
                  cursor={{ fill: 'currentColor', opacity: 0.06 }}
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--popover))',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="cantidad" radius={[0, 6, 6, 0]} name={t('chart.units')}>
                  {TOP_MATERIALES.map((_, i) => (
                    <Cell key={i} fill={COLORES[i % COLORES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <DevNotice k="dev.db" className="mt-4" />
    </div>
  )
}
