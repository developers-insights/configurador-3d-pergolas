import { Suspense, useCallback, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Maximize2, RotateCw } from 'lucide-react'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  /** Radio inicial de cámara: se calcula desde el tamaño del modelo. */
  camera?: [number, number, number]
  background?: string
  tone?: 'light' | 'dark'
  /** Intensidad y preset del Environment. */
  preset?: 'city' | 'sunset' | 'dawn' | 'apartment' | 'studio'
  shadowOpacity?: number
  className?: string
}

/**
 * Visor 3D compartido por ambos configuradores.
 *
 * El <Canvas> se monta UNA sola vez por configurador: los cambios de opción
 * llegan como props a `children`, que sólo actualiza geometría y materiales.
 */
export function Viewer({
  children,
  camera = [9, 6, 12],
  background,
  tone = 'light',
  preset = 'city',
  shadowOpacity = 0.42,
  className,
}: Props) {
  const { t } = useT()
  const controls = useRef<OrbitControlsImpl | null>(null)
  const [auto, setAuto] = useState(false)

  const reset = useCallback(() => {
    controls.current?.reset()
  }, [])

  const btn = cn(
    'no-tap-highlight inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium backdrop-blur-md transition-colors',
    tone === 'dark'
      ? 'border-white/12 bg-black/35 text-white/80 hover:bg-black/55 hover:text-white'
      : 'border-black/[0.07] bg-white/75 text-neutral-600 hover:bg-white hover:text-neutral-900',
  )

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)} style={{ background }}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: camera, fov: 38, near: 0.1, far: 220 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <hemisphereLight intensity={tone === 'dark' ? 0.55 : 0.85} groundColor="#b9b3a8" />
          <directionalLight
            position={[14, 20, 10]}
            intensity={tone === 'dark' ? 1.5 : 1.9}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          <directionalLight position={[-12, 10, -8]} intensity={0.45} />

          {children}

          <ContactShadows
            position={[0, 0.001, 0]}
            opacity={shadowOpacity}
            scale={46}
            blur={2.4}
            far={22}
            resolution={512}
            color="#1c1c1c"
          />
          <Environment preset={preset} />
          <OrbitControls
            ref={controls}
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            autoRotate={auto}
            autoRotateSpeed={0.9}
            minDistance={6}
            maxDistance={60}
            minPolarAngle={0.16}
            maxPolarAngle={Math.PI / 2.12}
          />
        </Suspense>
      </Canvas>

      {/* Controles del visor */}
      <div className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
        <button onClick={reset} className={cn(btn, 'pointer-events-auto')} title={t('cfg.resetView')}>
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t('cfg.resetView')}</span>
        </button>
        <button
          onClick={() => setAuto((v) => !v)}
          className={cn(
            btn,
            'pointer-events-auto',
            auto && (tone === 'dark' ? 'border-[#1FA2FF]/50 text-[#5CC0FF]' : 'border-neutral-900/25 text-neutral-900'),
          )}
          title={t('cfg.autoRotate')}
          aria-pressed={auto}
        >
          <RotateCw className={cn('h-3.5 w-3.5', auto && 'animate-spin [animation-duration:2.4s]')} />
          <span className="hidden sm:inline">{t('cfg.rotate')}</span>
        </button>
      </div>

      <p
        className={cn(
          'pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-medium backdrop-blur-md',
          tone === 'dark' ? 'bg-black/35 text-white/55' : 'bg-white/70 text-neutral-500',
        )}
      >
        {t('cfg.dragHint')}
      </p>
    </div>
  )
}
