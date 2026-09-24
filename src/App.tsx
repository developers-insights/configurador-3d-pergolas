import { useT } from '@/lib/i18n'

export default function App() {
  const { t } = useT()
  return (
    <div className="grid min-h-screen place-items-center">
      <p className="font-display text-sm text-muted-foreground">{t('app.loading')}</p>
    </div>
  )
}
