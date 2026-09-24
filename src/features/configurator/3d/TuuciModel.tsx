import { useMemo } from 'react'
import * as THREE from 'three'
import { CANOPY_HEX, WOOD_HEX } from '@/data/catalogo'
import type { ConfigTuuci } from '@/types'

const FT = 0.3048

/** Textura de lona rayada generada en canvas (sólo para el color "rayado"). */
function useStripeTexture(active: boolean) {
  return useMemo(() => {
    if (!active) return null
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 128
    const ctx = c.getContext('2d')
    if (!ctx) return null
    ctx.fillStyle = '#F4F1EA'
    ctx.fillRect(0, 0, 128, 128)
    ctx.fillStyle = '#C8CBBE'
    for (let i = 0; i < 128; i += 32) ctx.fillRect(i, 0, 16, 128)
    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(3, 3)
    return tex
  }, [active])
}

/** Volado ondulado del borde de la lona (el "festón" de la referencia). */
function Valance({ side, y, color, map }: { side: number; y: number; color: string; map: THREE.Texture | null }) {
  const perLado = Math.max(6, Math.round(side / 0.21))
  const step = side / perLado
  const half = side / 2

  const bolas: [number, number, number][] = []
  for (let i = 0; i < perLado; i++) {
    const p = -half + step * (i + 0.5)
    bolas.push([p, y, -half], [p, y, half], [-half, y, p], [half, y, p])
  }

  return (
    <group>
      {bolas.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 0.6, 1]}>
          <sphereGeometry args={[step * 0.62, 12, 10]} />
          <meshStandardMaterial color={color} map={map ?? undefined} roughness={0.92} metalness={0} />
        </mesh>
      ))}
    </group>
  )
}

export function TuuciModel({ cfg }: { cfg: ConfigTuuci }) {
  const wood = WOOD_HEX[cfg.wood]
  const canopy = CANOPY_HEX[cfg.canopy]
  const stripe = useStripeTexture(cfg.canopy === 'stripe')

  const g = useMemo(() => {
    const S = cfg.size * FT
    const esLulu = cfg.sub === 'lulu'
    const esMax = cfg.sub === 'maxSolanox'
    const H = esLulu ? 2.28 : esMax ? 2.75 : 2.55
    const sec = esMax ? 0.12 : 0.1
    const half = S / 2
    const overhang = esMax ? 0.3 : 0.2
    const canopySide = S + overhang * 2
    // El cono de 4 lados se inscribe en un círculo: r = semidiagonal del cuadrado.
    const r = (canopySide / 2) * Math.SQRT2
    const peak = esMax ? 0.34 : 0.5
    return { S, H, sec, half, canopySide, r, peak, esLulu, esMax }
  }, [cfg])

  const postPos: [number, number][] = [
    [-g.half, -g.half],
    [g.half, -g.half],
    [-g.half, g.half],
    [g.half, g.half],
  ]

  return (
    <group>
      {/* ── Parantes de madera ───────────────────────────────────────────── */}
      {postPos.map(([x, z], i) => (
        <group key={`p-${i}`} position={[x, 0, z]}>
          <mesh position={[0, g.H / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[g.sec, g.H, g.sec]} />
            <meshStandardMaterial color={wood} roughness={0.72} metalness={0.02} />
          </mesh>
          <mesh position={[0, 0.015, 0]} receiveShadow>
            <boxGeometry args={[g.sec * 1.8, 0.03, g.sec * 1.8]} />
            <meshStandardMaterial color="#B9BDC2" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ── Vigas perimetrales ───────────────────────────────────────────── */}
      {[-g.half, g.half].map((z, i) => (
        <mesh key={`bx-${i}`} position={[0, g.H - 0.07, z]} castShadow>
          <boxGeometry args={[g.S + g.sec, 0.13, g.sec * 0.85]} />
          <meshStandardMaterial color={wood} roughness={0.72} metalness={0.02} />
        </mesh>
      ))}
      {[-g.half, g.half].map((x, i) => (
        <mesh key={`bz-${i}`} position={[x, g.H - 0.07, 0]} castShadow>
          <boxGeometry args={[g.sec * 0.85, 0.13, g.S + g.sec]} />
          <meshStandardMaterial color={wood} roughness={0.72} metalness={0.02} />
        </mesh>
      ))}

      {/* ── Canopy de lona ───────────────────────────────────────────────── */}
      <group position={[0, g.H, 0]}>
        <mesh position={[0, g.peak / 2 + 0.02, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[g.r, g.peak, 4, 1]} />
          <meshStandardMaterial
            color={canopy}
            map={stripe ?? undefined}
            roughness={0.9}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* faldón perimetral */}
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[g.canopySide, 0.09, g.canopySide]} />
          <meshStandardMaterial color={canopy} map={stripe ?? undefined} roughness={0.92} metalness={0} />
        </mesh>
        <Valance side={g.canopySide} y={-0.09} color={canopy} map={stripe} />
        {/* remate superior */}
        <mesh position={[0, g.peak + 0.06, 0]} castShadow>
          <sphereGeometry args={[0.055, 14, 12]} />
          <meshStandardMaterial color={wood} roughness={0.5} metalness={0.15} />
        </mesh>
        {g.esMax && (
          // Cables tensores del sistema Solanox
          <>
            {postPos.map(([x, z], i) => (
              <mesh
                key={`t-${i}`}
                position={[x * 0.55, -0.32, z * 0.55]}
                rotation={[Math.atan2(z, 0) * 0.15, Math.atan2(z, x), 0.5]}
              >
                <cylinderGeometry args={[0.008, 0.008, g.S * 0.55, 6]} />
                <meshStandardMaterial color="#C9CDD2" metalness={0.9} roughness={0.25} />
              </mesh>
            ))}
          </>
        )}
      </group>

      {/* ── Cama de día (Lulu) ───────────────────────────────────────────── */}
      {g.esLulu && (
        <group>
          {/* base */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[g.S - 0.12, 0.34, g.S - 0.46]} />
            <meshStandardMaterial color={wood} roughness={0.74} metalness={0.02} />
          </mesh>
          {/* listones frontales */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.12 + i * 0.1, (g.S - 0.46) / 2 + 0.005]}>
              <boxGeometry args={[g.S - 0.16, 0.055, 0.02]} />
              <meshStandardMaterial color={wood} roughness={0.62} metalness={0.02} />
            </mesh>
          ))}
          {cfg.cushions && (
            <>
              <mesh position={[0, 0.48, 0.03]} castShadow>
                <boxGeometry args={[g.S - 0.2, 0.2, g.S - 0.6]} />
                <meshStandardMaterial color="#EDEBE4" roughness={0.95} metalness={0} />
              </mesh>
              <mesh position={[0, 0.72, -(g.S - 0.6) / 2 + 0.16]} castShadow>
                <boxGeometry args={[g.S - 0.5, 0.3, 0.26]} />
                <meshStandardMaterial color="#E4E1D8" roughness={0.95} metalness={0} />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* ── Cortinas laterales ───────────────────────────────────────────── */}
      {cfg.curtains && (
        <group>
          {[
            { pos: [-g.half + 0.03, (g.H - 0.2) / 2, 0], rot: [0, Math.PI / 2, 0] },
            { pos: [g.half - 0.03, (g.H - 0.2) / 2, 0], rot: [0, Math.PI / 2, 0] },
            { pos: [0, (g.H - 0.2) / 2, -g.half + 0.03], rot: [0, 0, 0] },
          ].map((c, i) => (
            <group key={i} position={c.pos as [number, number, number]} rotation={c.rot as [number, number, number]}>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * (g.S / 2 - g.S * 0.13), 0, 0]} castShadow>
                  <boxGeometry args={[g.S * 0.26, g.H - 0.22, 0.035]} />
                  <meshStandardMaterial color="#F6F4EF" roughness={0.96} metalness={0} transparent opacity={0.94} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}

      {/* ── Cojines de la pérgola clásica / MAX ──────────────────────────── */}
      {cfg.cushions && !g.esLulu && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.2, -g.half + 0.55]} castShadow>
            <boxGeometry args={[g.S * 0.62, 0.36, 0.72]} />
            <meshStandardMaterial color="#EDEBE4" roughness={0.95} metalness={0} />
          </mesh>
          <mesh position={[0, 0.5, -g.half + 0.28]} castShadow>
            <boxGeometry args={[g.S * 0.62, 0.34, 0.2]} />
            <meshStandardMaterial color="#E4E1D8" roughness={0.95} metalness={0} />
          </mesh>
        </group>
      )}
    </group>
  )
}
