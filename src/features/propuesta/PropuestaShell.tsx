import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Brand, PoweredBy } from '@/components/shell/Brand'
import { TopControls } from '@/components/shell/Controls'
import { RoleSwitcher } from '@/components/shell/RoleSwitcher'
import { useSession } from '@/lib/session'
import { useT } from '@/lib/i18n'

/**
 * Marco de la capa comercial. Es una landing: ocupa toda la pantalla y no
 * arrastra el sidebar del admin ni el chrome del configurador.
 */
export function PropuestaShell({ children }: { children: React.ReactNode }) {
  const { t } = useT()
  const { logout } = useSession()
  const nav = useNavigate()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="no-print sticky top-0 z-40 border-b border-border bg-background/85 glass">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-6">
          <Brand size="sm" />
          <div className="flex items-center gap-1.5 sm:gap-2">
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

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 pb-14 pt-7 sm:px-6 sm:pt-10">
        {children}
      </main>

      <footer className="no-print flex justify-center border-t border-border py-5">
        <PoweredBy />
      </footer>
    </div>
  )
}
