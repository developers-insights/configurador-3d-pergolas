import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastKind = 'success' | 'info' | 'warn'
export interface ToastItem {
  id: number
  title: string
  desc?: string
  kind: ToastKind
}

type Ctx = { toast: (t: { title: string; desc?: string; kind?: ToastKind }) => void }
const ToastCtx = createContext<Ctx | null>(null)

let seq = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setItems((p) => p.filter((i) => i.id !== id))
  }, [])

  const toast = useCallback<Ctx['toast']>(
    ({ title, desc, kind = 'success' }) => {
      const id = ++seq
      setItems((p) => [...p.slice(-3), { id, title, desc, kind }])
      window.setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6">
        <AnimatePresence initial={false}>
          {items.map((i) => (
            <motion.div
              key={i.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-lg glass',
              )}
              role="status"
            >
              <span
                className={cn(
                  'mt-0.5 shrink-0',
                  i.kind === 'success' && 'text-emerald-500',
                  i.kind === 'info' && 'text-[#1FA2FF]',
                  i.kind === 'warn' && 'text-amber-500',
                )}
              >
                {i.kind === 'success' && <CheckCircle2 className="h-5 w-5" />}
                {i.kind === 'info' && <Info className="h-5 w-5" />}
                {i.kind === 'warn' && <TriangleAlert className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight">{i.title}</p>
                {i.desc && <p className="mt-0.5 text-xs text-muted-foreground">{i.desc}</p>}
              </div>
              <button
                onClick={() => dismiss(i.id)}
                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
