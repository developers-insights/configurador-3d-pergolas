import { FileText, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Brand } from './Brand'
import { TopControls } from './Controls'
import { RoleSwitcher } from './RoleSwitcher'
import { useSession } from '@/lib/session'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/** Barra superior del shell neutro (selección de modelo, despiece). */
export function TopBar({ className }: { className?: string }) {
  const { logout, sesion } = useSession()
  const { t } = useT()
  const nav = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-border bg-background/85 glass',
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Brand size="sm" />
          {/* Comercial · Propuesta: primer ítem del menú, en los dos roles */}
          <NavLink
            to="/propuesta"
            className={({ isActive }) =>
              cn(
                'no-tap-highlight inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )
            }
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('nav.propuesta')}</span>
          </NavLink>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {sesion && (
            <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground lg:block">
              {sesion.empresa}
            </span>
          )}
          <RoleSwitcher className="w-[150px] sm:w-[168px]" />
          <TopControls />
          <button
            onClick={() => {
              logout()
              nav('/login', { replace: true })
            }}
            title={t('nav.logout')}
            aria-label={t('nav.logout')}
            className="no-tap-highlight inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
