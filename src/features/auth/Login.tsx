import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, Lock, MessageCircle, ShieldCheck, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Brand, PoweredBy } from '@/components/shell/Brand'
import { TopControls } from '@/components/shell/Controls'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { useT } from '@/lib/i18n'
import { useSession, verificarCredenciales } from '@/lib/session'
import { ENTRADA } from '@/lib/rutas'
import { whatsappConsulta } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

const PILLS = [
  { user: 'empresa', pass: 'Pergola2026', labelKey: 'login.fillCompany', Icon: Building2 },
  { user: 'admin', pass: 'Admin2026', labelKey: 'login.fillAdmin', Icon: ShieldCheck },
] as const

export default function Login() {
  const { t } = useT()
  const { login } = useSession()
  const nav = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const s = verificarCredenciales(usuario, pass)
    if (!s) {
      setError(true)
      return
    }
    login(s)
    // Los dos roles entran por la propuesta: es la landing de la demo.
    nav(ENTRADA, { replace: true })
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      {/* Fondo sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55] dark:opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(60rem 40rem at 50% -10%, rgba(31,162,255,0.12), transparent 60%), radial-gradient(40rem 30rem at 90% 110%, rgba(31,162,255,0.08), transparent 60%)',
        }}
      />

      <header className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <Brand />
        <TopControls />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-7 text-center">
            <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight">
              {t('login.title')}
            </h1>
            <p className="mx-auto mt-2 max-w-[330px] text-sm leading-relaxed text-muted-foreground">
              {t('login.subtitle')}
            </p>
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] sm:p-6"
          >
            <div className="mb-3.5">
              <Label htmlFor="usuario">{t('login.user')}</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="usuario"
                  value={usuario}
                  autoComplete="username"
                  onChange={(e) => {
                    setUsuario(e.target.value)
                    setError(false)
                  }}
                  className="pl-9"
                  placeholder="empresa"
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="pass">{t('login.pass')}</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pass"
                  type="password"
                  value={pass}
                  autoComplete="current-password"
                  onChange={(e) => {
                    setPass(e.target.value)
                    setError(false)
                  }}
                  className="pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 text-xs font-medium text-destructive"
              >
                {t('login.invalid')}
              </motion.p>
            )}

            <Button type="submit" size="lg" className="w-full">
              {t('login.submit')}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t('login.quickAccess')}
              </p>
              <p className="mb-3 text-[11px] text-muted-foreground/80">{t('login.autofillHint')}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {PILLS.map(({ user, pass: p, labelKey, Icon }) => (
                  <button
                    key={user}
                    type="button"
                    onClick={() => {
                      setUsuario(user)
                      setPass(p)
                      setError(false)
                    }}
                    className={cn(
                      'no-tap-highlight group flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5 text-left transition-all hover:border-[#1FA2FF]/50 hover:bg-[#1FA2FF]/[0.04]',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[#1FA2FF]" />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium">{t(labelKey)}</span>
                      <span className="num block truncate text-[10px] text-muted-foreground">
                        {user} / {p}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>

          <div className="mt-5 flex flex-col items-center gap-2.5">
            <a
              href={whatsappConsulta()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-emerald-600"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {t('login.whatsapp')}
            </a>
            <p className="text-[11px] text-muted-foreground/70">{t('login.footNote')}</p>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 flex justify-center pb-6">
        <PoweredBy />
      </footer>
    </div>
  )
}
