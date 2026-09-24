import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Sombra del piso: combina la sombra proyectada real de la luz direccional
 * con un "blob" de contacto suave debajo del modelo, para que la pérgola
 * se apoye en el piso en vez de flotar.
 */
export function GroundShadow({ size, opacity = 0.7 }: { size: number; opacity?: number }) {
  const blob = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')
    if (!ctx) return null
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 126)
    grad.addColorStop(0, 'rgba(0,0,0,0.5)')
    grad.addColorStop(0.45, 'rgba(0,0,0,0.26)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(c)
  }, [])

  return (
    <group>
      {/* Sombra proyectada real */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[size * 2.4, size * 2.4]} />
        <shadowMaterial transparent opacity={opacity * 0.34} color="#0E1218" />
      </mesh>
      {/* Blob de contacto */}
      {blob && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
          <planeGeometry args={[size * 1.15, size * 1.15]} />
          <meshBasicMaterial map={blob} transparent opacity={opacity * 0.85} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}
