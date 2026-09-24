import { useState } from 'react'
import { LayoutDashboard, LogOut, Menu, Package, Users, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Brand, PoweredBy } from '@/components/shell/Brand'
import { TopControls } from '@/components/shell/Controls'
import { RoleSwitcher } from '@/components/shell/RoleSwitcher'
import { useSession } from '@/lib/session'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/admin', end: true, key: 'admin.dashboard', Icon: LayoutDashboard },
  { to: '/admin/empresas', end: false, key: 'admin.users', Icon: Users },
  { to: '/admin/pedidos', end: false, key: 'admin.orders', Icon: Package },
] as const

export default function AdminLayout() {
  const { t } = useT()
  const { logout, sesion, pedidos } = useSession()
  const nav = useNavigate()
  const [abierto, setAbierto] = useState(false)

  const nuevos = pedidos.filter((p) => p.estado === 'nuevo').length

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Brand size="sm" />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map(({ to, end, key, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setAbierto(false)}
            className={({ isActive }) =>
              cn(
                'no-tap-highlight flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{t(key)}</span>
            {key === 'admin.orders' && nuevos > 0 && (
              <span className="num rounded-full bg-[#1FA2FF] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {nuevos}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-border p-3">
        <div className="rounded-lg bg-muted/60 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t('admin.panel')}
          </p>
          <p className="mt-0.5 truncate text-xs font-medium">{sesion?.empresa}</p>
        </div>
        <RoleSwitcher />
        <button
          onClick={() => {
            logout()
            nav('/login', { replace: true })
          }}
          className="no-tap-highlight flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          {t('nav.logout')}
        </button>
        <div className="flex items-center justify-between px-3 pb-1">
          <PoweredBy />
          <span className="rounded border border-border px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">
            {t('app.demoPreview')}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-[100dvh] bg-background">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-[100dvh] w-[248px] shrink-0 border-r border-border bg-card lg:block">
        {sidebar}
      </aside>

      {/* Sidebar mobile */}
      {abierto && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-black/45" onClick={() => setAbierto(false)} />
          <aside className="absolute left-0 top-0 h-full w-[260px] border-r border-border bg-card shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/85 px-4 glass lg:hidden">
          <button
            onClick={() => setAbierto((v) => !v)}
            className="no-tap-highlight grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={t('cfg.options')}
          >
            {abierto ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <Brand size="sm" showDemo={false} />
          <TopControls />
        </header>

        {/* Topbar desktop */}
        <header className="sticky top-0 z-30 hidden h-14 items-center justify-end gap-2 border-b border-border bg-background/85 px-6 glass lg:flex">
          <TopControls />
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
