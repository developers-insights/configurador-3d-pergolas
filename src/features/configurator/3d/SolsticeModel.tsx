import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { FINISH_HEX } from '@/data/catalogo'
import type { ConfigSolstice } from '@/types'

const FT = 0.3048
const POST_SECTION = { square: 0.1, slim: 0.08, round: 0.11 } as const
const BEAM_H = 0.16
const BEAM_W = 0.08

/** Ventilador: gira en vivo mientras está activo. */
function Fan({ x, y, z, color }: { x: number; y: number; z: number; color: string }) {
  const ref = useRef<Group>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 2.6
  })
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.24, 12]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.1, 20]} />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.25} />
      </mesh>
      <group ref={ref}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[Math.cos((i * Math.PI * 2) / 5) * 0.42, -0.02, Math.sin((i * Math.PI * 2) / 5) * 0.42]}
            rotation={[0, -((i * Math.PI * 2) / 5), 0.12]}
            castShadow
          >
            <boxGeometry args={[0.72, 0.012, 0.17]} />
            <meshStandardMaterial color={color} metalness={0.45} roughness={0.45} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function SolsticeModel({ cfg }: { cfg: ConfigSolstice }) {
  const color = FINISH_HEX[cfg.finish]

  const g = useMemo(() => {
    const L = cfg.length * FT
    const P = cfg.projection * FT
    const H = cfg.height * FT
    const sOH = cfg.sideOH * FT
    const fOH = cfg.frontOH * FT
    const roofL = L + sOH * 2
    const roofP = P + fOH
    // El techo crece hacia el frente (+Z): su centro se corre medio voladizo.
    const roofZ = fOH / 2
    const halfL = L / 2
    const halfP = P / 2
    const sec = POST_SECTION[cfg.postStyle]

    // ── Posición de las columnas ───────────────────────────────────────────
    const posts: [number, number][] = []
    if (cfg.anchor === 'wall') {
      // Adosada: sólo columnas al frente
      if (cfg.postCount === 2) posts.push([-halfL, halfP], [halfL, halfP])
      else if (cfg.postCount === 4) posts.push([-halfL, halfP], [halfL, halfP], [0, halfP], [-halfL, 0])
      else posts.push([-halfL, halfP], [halfL, halfP], [-halfL / 3, halfP], [halfL / 3, halfP], [-halfL, 0], [halfL, 0])
    } else if (cfg.postCount === 2) {
      posts.push([-halfL, 0], [halfL, 0])
    } else if (cfg.postCount === 4) {
      posts.push([-halfL, -halfP], [halfL, -halfP], [-halfL, halfP], [halfL, halfP])
    } else {
      posts.push(
        [-halfL, -halfP],
        [halfL, -halfP],
        [-halfL, halfP],
        [halfL, halfP],
        [0, -halfP],
        [0, halfP],
      )
    }

    // ── Lamas orientables ──────────────────────────────────────────────────
    const louverW = 0.2
    const louverCount = cfg.cladding === 'louvered' ? Math.max(4, Math.floor(roofL / (louverW + 0.02))) : 0
    const louverStep = louverCount ? roofL / louverCount : 0
    const louvers = Array.from({ length: louverCount }, (_, i) => -roofL / 2 + louverStep * (i + 0.5))

    // ── Travesaños de techo abierto ────────────────────────────────────────
    const openCount = cfg.cladding === 'open' ? Math.max(3, Math.floor(roofL / 0.55)) : 0
    const openStep = openCount ? roofL / openCount : 0
    const opens = Array.from({ length: openCount }, (_, i) => -roofL / 2 + openStep * (i + 0.5))

    // ── Vigas intermedias ──────────────────────────────────────────────────
    const inter = Math.max(0, Math.ceil(cfg.length / 10) - 1)
    const interX = Array.from({ length: inter }, (_, i) => -halfL + (L / (inter + 1)) * (i + 1))

    // ── Extras ─────────────────────────────────────────────────────────────
    const fanCount = cfg.fan ? Math.max(1, Math.round((cfg.length + cfg.sideOH * 2) / 16)) : 0
    const fans = Array.from({ length: fanCount }, (_, i) => -halfL + (L / (fanCount + 1)) * (i + 1))
    const heaterCount = cfg.heater ? Math.max(1, Math.round((cfg.length + cfg.sideOH * 2) / 12)) : 0
    const heaters = Array.from({ length: heaterCount }, (_, i) => -halfL + (L / (heaterCount + 1)) * (i + 1))

    return {
      L, P, H, roofL, roofP, roofZ, halfL, halfP, sec,
      posts, louvers, opens, interX, fans, heaters,
    }
  }, [cfg])

  const beamY = g.H - BEAM_H / 2
  const roofY = g.H - BEAM_H - 0.02
  const louverAngle = (cfg.louverAngle * Math.PI) / 180

  return (
    <group position={[0, 0, 0]}>
      {/* ── Pared de fondo cuando la pérgola es adosada ──────────────────── */}
      {cfg.anchor === 'wall' && (
        <mesh position={[0, g.H / 2 + 0.4, -g.halfP - 0.12]} receiveShadow>
          <boxGeometry args={[g.roofL + 1.4, g.H + 0.8, 0.2]} />
          <meshStandardMaterial color="#E8E6E1" roughness={0.95} metalness={0} />
        </mesh>
      )}

      {/* ── Columnas ─────────────────────────────────────────────────────── */}
      {g.posts.map(([x, z], i) => (
        <group key={`post-${i}`} position={[x, 0, z]}>
          {cfg.postStyle === 'round' ? (
            <mesh position={[0, g.H / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[g.sec / 2, g.sec / 2, g.H, 20]} />
              <meshStandardMaterial color={color} metalness={0.62} roughness={0.33} />
            </mesh>
          ) : (
            <mesh position={[0, g.H / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[g.sec, g.H, g.sec]} />
              <meshStandardMaterial color={color} metalness={0.62} roughness={0.33} />
            </mesh>
          )}
          {/* placa base */}
          <mesh position={[0, 0.012, 0]} receiveShadow>
            <boxGeometry args={[g.sec * 1.9, 0.024, g.sec * 1.9]} />
            <meshStandardMaterial color="#9AA0A6" metalness={0.8} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* ── Vigas perimetrales ───────────────────────────────────────────── */}
      {[-g.roofP / 2 + g.roofZ, g.roofP / 2 + g.roofZ].map((z, i) => (
        <mesh key={`bx-${i}`} position={[0, beamY, z]} castShadow receiveShadow>
          <boxGeometry args={[g.roofL, BEAM_H, BEAM_W]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      {[-g.roofL / 2, g.roofL / 2].map((x, i) => (
        <mesh key={`bz-${i}`} position={[x, beamY, g.roofZ]} castShadow receiveShadow>
          <boxGeometry args={[BEAM_W, BEAM_H, g.roofP]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      {g.interX.map((x, i) => (
        <mesh key={`bi-${i}`} position={[x, beamY - 0.01, g.roofZ]} castShadow>
          <boxGeometry args={[BEAM_W * 0.8, BEAM_H * 0.8, g.roofP]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* ── Techo ────────────────────────────────────────────────────────── */}
      {cfg.cladding === 'louvered' &&
        g.louvers.map((x, i) => (
          <mesh key={`lv-${i}`} position={[x, roofY, g.roofZ]} rotation={[0, 0, louverAngle]} castShadow>
            <boxGeometry args={[0.2, 0.028, g.roofP - 0.1]} />
            <meshStandardMaterial color={color} metalness={0.55} roughness={0.42} />
          </mesh>
        ))}

      {cfg.cladding === 'panel' && (
        <mesh position={[0, roofY, g.roofZ]} castShadow receiveShadow>
          <boxGeometry args={[g.roofL - 0.06, 0.1, g.roofP - 0.06]} />
          <meshStandardMaterial color={color} metalness={0.35} roughness={0.55} />
        </mesh>
      )}

      {cfg.cladding === 'open' &&
        g.opens.map((x, i) => (
          <mesh key={`op-${i}`} position={[x, roofY + 0.02, g.roofZ]} castShadow>
            <boxGeometry args={[0.07, 0.13, g.roofP - 0.08]} />
            <meshStandardMaterial color={color} metalness={0.55} roughness={0.42} />
          </mesh>
        ))}

      {/* ── Cerramientos laterales ───────────────────────────────────────── */}
      {cfg.wallSides > 0 && <Walls cfg={cfg} g={g} color={color} />}

      {/* ── Tira LED perimetral (emisiva) ────────────────────────────────── */}
      {cfg.led && (
        <group position={[0, g.H - BEAM_H - 0.055, g.roofZ]}>
          {[-g.roofP / 2 + 0.05, g.roofP / 2 - 0.05].map((z, i) => (
            <mesh key={`ldx-${i}`} position={[0, 0, z]}>
              <boxGeometry args={[g.roofL - 0.1, 0.03, 0.045]} />
              <meshStandardMaterial
                color="#DFF3FF"
                emissive="#8FD4FF"
                emissiveIntensity={2.4}
                toneMapped={false}
              />
            </mesh>
          ))}
          {[-g.roofL / 2 + 0.05, g.roofL / 2 - 0.05].map((x, i) => (
            <mesh key={`ldz-${i}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.045, 0.03, g.roofP - 0.1]} />
              <meshStandardMaterial
                color="#DFF3FF"
                emissive="#8FD4FF"
                emissiveIntensity={2.4}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* ── Ventiladores ─────────────────────────────────────────────────── */}
      {g.fans.map((x, i) => (
        <Fan key={`fan-${i}`} x={x} y={g.H - BEAM_H - 0.4} z={g.roofZ} color={color} />
      ))}

      {/* ── Calefactores infrarrojos ─────────────────────────────────────── */}
      {g.heaters.map((x, i) => (
        <group key={`ht-${i}`} position={[x, g.H - BEAM_H - 0.12, -g.roofP / 2 + g.roofZ + 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.85, 0.09, 0.14]} />
            <meshStandardMaterial color="#2A2E33" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.78, 0.015, 0.1]} />
            <meshStandardMaterial
              color="#FF7A45"
              emissive="#FF5B1A"
              emissiveIntensity={1.7}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* ── Sensor de lluvia y viento ────────────────────────────────────── */}
      {cfg.rainSensor && (
        <group position={[g.roofL / 2 - 0.25, g.H + 0.06, -g.roofP / 2 + g.roofZ + 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.055, 0.07, 0.1, 14]} />
            <meshStandardMaterial color="#DCDFE3" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <sphereGeometry args={[0.035, 14, 12]} />
            <meshStandardMaterial color="#1FA2FF" emissive="#1FA2FF" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/* ── Paredes laterales ─────────────────────────────────────────────────── */

interface Geo {
  L: number
  P: number
  H: number
  roofL: number
  roofP: number
  roofZ: number
  halfL: number
  halfP: number
  sec: number
  posts: [number, number][]
  louvers: number[]
  opens: number[]
  interX: number[]
  fans: number[]
  heaters: number[]
}

function Walls({ cfg, g, color }: { cfg: ConfigSolstice; g: Geo; color: string }) {
  // lado 1 = izquierda (X-), lado 2 = fondo (Z-), lado 3 = derecha (X+)
  const lados = (['left', 'back', 'right'] as const).slice(0, cfg.wallSides)
  const h = g.H - 0.18

  return (
    <>
      {lados.map((lado) => {
        const esLateral = lado !== 'back'
        const ancho = esLateral ? g.P : g.L
        const pos: [number, number, number] = esLateral
          ? [lado === 'left' ? -g.halfL : g.halfL, h / 2 + 0.04, 0]
          : [0, h / 2 + 0.04, -g.halfP]
        const rot: [number, number, number] = esLateral ? [0, Math.PI / 2, 0] : [0, 0, 0]

        if (cfg.wallType === 'louver') {
          const n = Math.max(6, Math.floor(h / 0.16))
          return (
            <group key={lado} position={pos} rotation={rot}>
              {Array.from({ length: n }, (_, i) => (
                <mesh key={i} position={[0, -h / 2 + (h / n) * (i + 0.5), 0]} rotation={[0.55, 0, 0]} castShadow>
                  <boxGeometry args={[ancho - 0.1, 0.02, 0.15]} />
                  <meshStandardMaterial color={color} metalness={0.55} roughness={0.42} />
                </mesh>
              ))}
            </group>
          )
        }

        return (
          <group key={lado} position={pos} rotation={rot}>
            <mesh castShadow>
              <boxGeometry args={[ancho - 0.08, h, cfg.wallType === 'glass' ? 0.02 : 0.05]} />
              {cfg.wallType === 'glass' ? (
                <meshPhysicalMaterial
                  color="#BFD6E4"
                  transparent
                  opacity={0.26}
                  roughness={0.05}
                  metalness={0}
                  transmission={0.55}
                  thickness={0.02}
                />
              ) : (
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
              )}
            </mesh>
            {/* marco */}
            <mesh position={[0, h / 2, 0]}>
              <boxGeometry args={[ancho - 0.06, 0.05, 0.07]} />
              <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0, -h / 2, 0]}>
              <boxGeometry args={[ancho - 0.06, 0.05, 0.07]} />
              <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
            </mesh>
          </group>
        )
      })}
    </>
  )
}
