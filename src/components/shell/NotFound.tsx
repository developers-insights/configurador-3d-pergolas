import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { Brand } from '@/components/shell/Brand'
import { useT } from '@/lib/i18n'
import { useSession } from '@/lib/session'

export function NotFound() {
  const { t } = useT()
  const { sesion } = useSession()
  const home = !sesion ? '/login' : sesion.rol === 'admin' ? '/admin' : '/configurador'

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-background px-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <Brand size="lg" className="mb-6" />
        <p className="font-display text-5xl font-semibold tracking-tight">404</p>
        <p className="mt-2 text-sm text-muted-foreground">{t('misc.notFound')}</p>
        <Link to={home} className={buttonVariants({ className: 'mt-6' })}>
          {t('misc.goHome')}
        </Link>
      </div>
    </div>
  )
}
