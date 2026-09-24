import { Suspense, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Maximize2, RotateCw } from 'lucide-react'
import { GroundShadow } from './GroundShadow'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export interface Encuadre {
  /** Radio de la esfera que contiene al modelo, en metros. */
  radioObjeto: number
  /** Altura del punto al que mira la cámara. */
  centroY: number
  /** Tamaño del piso de sombra. */
  sombra: number
}

interface Props {
  children: React.ReactNode
  encuadre: Encuadre
  background?: string
  tone?: 'light' | 'dark'
  preset?: 'city' | 'sunset' | 'dawn' | 'apartment' | 'studio'
  shadowOpacity?: number
  className?: string
}

/** Dirección desde la que mira la cámara (vista 3/4 arquitectónica). */
const DIRECCION = new THREE.Vector3(0.58, 0.46, 0.82).normalize()

/**
 * Encuadra el modelo dentro del visor según el aspect REAL del canvas.
 * Se recalcula si cambia el tamaño (mobile vs desktop, rotación del teléfono),
 * y deja ese encuadre guardado como el estado al que vuelve "Reiniciar vista".
 */
function AjustarCamara({
  radio,
  centroY,
  controls,
}: {
  radio: number
  centroY: number
  controls: React.MutableRefObject<OrbitControlsImpl | null>
}) {
  const { camera, size } = useThree()

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    if (!cam.isPerspectiveCamera || !size.width || !size.height) return

    const vFov = (cam.fov * Math.PI) / 180
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * cam.aspect)
    const dist = Math.max(radio / Math.tan(vFov / 2), radio / Math.tan(hFov / 2)) * 1.14

    cam.position.copy(DIRECCION).multiplyScalar(dist).add(new THREE.Vector3(0, centroY, 0))
    cam.near = Math.max(0.05, dist / 80)
    cam.far = dist * 10
    cam.updateProjectionMatrix()

    const c = controls.current
    if (c) {
      c.target.set(0, centroY, 0)
      c.minDistance = dist * 0.35
      c.maxDistance = dist * 3
      c.update()
      c.saveState()
    }
  }, [camera, size.width, size.height, radio, centroY, controls])

  return null
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
  const luz = encuadre.radioObjeto * 3

  const reset = useCallback(() => controls.current?.reset(), [])

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
        dpr={[1, typeof window !== 'undefined' && window.innerWidth < 640 ? 1.5 : 1.8]}
        gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
        camera={{ fov: 38, near: 0.1, far: 260 }}
        style={{ background: 'transparent' }}
      >
        <hemisphereLight intensity={tone === 'dark' ? 0.55 : 0.8} groundColor="#b9b3a8" />
        <directionalLight
          position={[luz * 0.45, luz * 1.5, luz * 0.35]}
          intensity={tone === 'dark' ? 1.45 : 1.75}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0006}
          shadow-normalBias={0.02}
          shadow-camera-near={0.5}
          shadow-camera-far={luz * 4}
          shadow-camera-left={-encuadre.sombra}
          shadow-camera-right={encuadre.sombra}
          shadow-camera-top={encuadre.sombra}
          shadow-camera-bottom={-encuadre.sombra}
        />
        <directionalLight position={[-luz * 0.5, luz * 0.6, -luz * 0.4]} intensity={0.4} />

        {children}

        <GroundShadow size={encuadre.sombra} opacity={shadowOpacity} />

        {/* El HDR del Environment se descarga aparte: si tarda o falla, la
            escena ya se ve con las luces analíticas de arriba. */}
        <Suspense fallback={null}>
          <Environment preset={preset} />
        </Suspense>

        <OrbitControls
          ref={controls}
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          autoRotate={auto}
          autoRotateSpeed={0.9}
          minPolarAngle={0.16}
          maxPolarAngle={Math.PI / 2.12}
        />
        <AjustarCamara radio={encuadre.radioObjeto} centroY={encuadre.centroY} controls={controls} />
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
            auto &&
              (tone === 'dark'
                ? 'border-[#1FA2FF]/50 text-[#5CC0FF]'
                : 'border-neutral-900/25 text-neutral-900'),
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
