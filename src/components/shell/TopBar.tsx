import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
        <Brand size="sm" />
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
