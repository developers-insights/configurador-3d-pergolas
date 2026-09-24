import { Suspense, useCallback, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { GroundShadow } from './GroundShadow'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Maximize2, RotateCw } from 'lucide-react'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export interface Encuadre {
  /** Distancia inicial de la cámara al centro del modelo. */
  radio: number
  /** Altura del punto al que mira la cámara. */
  centroY: number
  /** Tamaño del plano de sombra de contacto. */
  sombra: number
}

interface Props {
  children: React.ReactNode
  /** Encuadre inicial, calculado una sola vez desde el tamaño del modelo. */
  encuadre: Encuadre
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
  encuadre,
  background,
  tone = 'light',
  preset = 'city',
  shadowOpacity = 0.72,
  className,
}: Props) {
  const { t } = useT()
  const controls = useRef<OrbitControlsImpl | null>(null)
  const [auto, setAuto] = useState(false)
  // El encuadre se congela al montar: después la cámara es del usuario.
  const inicial = useRef(encuadre).current
  const posCam: [number, number, number] = [
    inicial.radio * 0.62,
    inicial.centroY + inicial.radio * 0.42,
    inicial.radio * 0.86,
  ]

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
        gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
        camera={{ position: posCam, fov: 38, near: 0.1, far: 260 }}
        style={{ background: 'transparent' }}
      >
        <>
          <hemisphereLight intensity={tone === 'dark' ? 0.55 : 0.85} groundColor="#b9b3a8" />
          <directionalLight
            position={[inicial.radio * 0.5, inicial.radio * 1.7, inicial.radio * 0.4]}
            intensity={tone === 'dark' ? 1.45 : 1.75}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0006}
            shadow-normalBias={0.02}
            shadow-camera-near={0.5}
            shadow-camera-far={inicial.radio * 4}
            shadow-camera-left={-inicial.sombra}
            shadow-camera-right={inicial.sombra}
            shadow-camera-top={inicial.sombra}
            shadow-camera-bottom={-inicial.sombra}
          />
          <directionalLight position={[-12, 10, -8]} intensity={0.45} />

          {children}

          <GroundShadow size={inicial.sombra} opacity={shadowOpacity} />
          {/* El HDR del Environment se descarga aparte: si tarda o falla,
              la escena ya se ve con las luces analíticas de arriba. */}
          <Suspense fallback={null}>
            <Environment preset={preset} />
          </Suspense>
          <OrbitControls
            ref={controls}
            makeDefault
            target={[0, inicial.centroY, 0]}
            enablePan={false}
            enableDamping
            dampingFactor={0.06}
            autoRotate={auto}
            autoRotateSpeed={0.9}
            minDistance={inicial.radio * 0.4}
            maxDistance={inicial.radio * 3.2}
            minPolarAngle={0.16}
            maxPolarAngle={Math.PI / 2.12}
          />
        </>
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
