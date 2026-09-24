import { Building2, ChevronDown, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@/lib/session'
import { useT } from '@/lib/i18n'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { Rol } from '@/types'

const HOME: Record<Rol, string> = { config: '/configurador', admin: '/admin' }

/**
 * Cambia de rol en vivo, sin logout: resetea a la vista default del rol
 * y avisa con un toast. Presente en desktop y mobile.
 */
export function RoleSwitcher({ tone = 'auto', className }: { tone?: 'auto' | 'dark'; className?: string }) {
  const { sesion, switchRol } = useSession()
  const { t } = useT()
  const { toast } = useToast()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  if (!sesion) return null

  const pick = (rol: Rol) => {
    setOpen(false)
    if (rol === sesion.rol) return
    switchRol(rol)
    nav(HOME[rol], { replace: true })
    toast({
      title: `${t('role.changed')} ${rol === 'admin' ? t('role.admin') : t('role.config')}`,
      desc: rol === 'admin' ? t('role.adminDesc') : t('role.configDesc'),
      kind: 'info',
    })
  }

  const dark = tone === 'dark'
  const Icon = sesion.rol === 'admin' ? ShieldCheck : Building2

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'no-tap-highlight flex h-9 w-full items-center gap-2 rounded-lg border px-2.5 text-xs font-medium transition-colors',
          dark
            ? 'border-white/12 bg-white/5 text-white/85 hover:bg-white/10'
            : 'border-border bg-card text-foreground hover:bg-accent',
        )}
      >
        <Icon className={cn('h-3.5 w-3.5 shrink-0', dark ? 'text-[#1FA2FF]' : 'text-muted-foreground')} />
        <span className="truncate">{sesion.rol === 'admin' ? t('role.admin') : t('role.config')}</span>
        <ChevronDown className={cn('ml-auto h-3.5 w-3.5 shrink-0 opacity-50 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            role="menu"
            className="absolute right-0 z-50 mt-1.5 w-60 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl"
          >
            <p className="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('role.switch')}
            </p>
            {(['config', 'admin'] as Rol[]).map((r) => {
              const RIcon = r === 'admin' ? ShieldCheck : Building2
              const active = sesion.rol === r
              return (
                <button
                  key={r}
                  role="menuitem"
                  onClick={() => pick(r)}
                  className={cn(
                    'flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                    active ? 'bg-accent' : 'hover:bg-accent/60',
                  )}
                >
                  <RIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-popover-foreground">
                      {r === 'admin' ? t('role.admin') : t('role.config')}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {r === 'admin' ? t('role.adminDesc') : t('role.configDesc')}
                    </span>
                  </span>
                  {active && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1FA2FF]" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
