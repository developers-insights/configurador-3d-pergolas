import { useT } from '@/lib/i18n'

export function PageLoader() {
  const { t } = useT()
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <span className="relative flex h-8 w-8">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#1FA2FF]/30" />
          <span className="relative m-auto h-3 w-3 rounded-full bg-[#1FA2FF]" />
        </span>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {t('app.loading')}
        </p>
      </div>
    </div>
  )
}
