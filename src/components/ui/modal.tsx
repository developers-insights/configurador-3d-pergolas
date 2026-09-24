import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

/** Modal simple con backdrop, cierre por Escape y bloqueo de scroll. */
export function Modal({ open, onClose, title, subtitle, children, className }: Props) {
  const { t } = useT()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            role="dialog"
            aria-modal="true"
            className={cn(
              'relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:max-w-2xl sm:rounded-2xl',
              className,
            )}
          >
            {(title || subtitle) && (
              <div className="flex items-start justify-between gap-4 border-b border-border p-5">
                <div className="min-w-0">
                  {title && <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>}
                  {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={t('misc.close')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
