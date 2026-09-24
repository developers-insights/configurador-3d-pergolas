export type Escena = 'patio' | 'pileta' | 'terraza'
export type Luz = 'dia' | 'atardecer' | 'noche'

interface Paleta {
  cieloTop: string
  cieloBottom: string
  sol: string
  solOpacity: number
  vegetacion: string
  vegetacionOscura: string
  piso: string
  pisoOscuro: string
  muro: string
  agua: string
  niebla: string
  sombra: number
}

/** Cada franja horaria reencuadra los mismos elementos con otra paleta. */
const PALETAS: Record<Luz, Paleta> = {
  dia: {
    cieloTop: '#5FA8DC',
    cieloBottom: '#CDE7F5',
    sol: '#FFF6DA',
    solOpacity: 0.75,
    vegetacion: '#4E7B42',
    vegetacionOscura: '#2F5430',
    piso: '#D9CFBE',
    pisoOscuro: '#B8AC97',
    muro: '#EFE9DF',
    agua: '#54A8C9',
    niebla: '#FFFFFF',
    sombra: 0.24,
  },
  atardecer: {
    cieloTop: '#48597F',
    cieloBottom: '#F0B27A',
    sol: '#FFD9A0',
    solOpacity: 0.95,
    vegetacion: '#3E5B39',
    vegetacionOscura: '#233A28',
    piso: '#C9AE90',
    pisoOscuro: '#9C8163',
    muro: '#E5CDB2',
    agua: '#4E7FA0',
    niebla: '#FFCF9B',
    sombra: 0.34,
  },
  noche: {
    cieloTop: '#0C1626',
    cieloBottom: '#1E3350',
    sol: '#9FC6F0',
    solOpacity: 0.35,
    vegetacion: '#23402F',
    vegetacionOscura: '#13241C',
    piso: '#4A4639',
    pisoOscuro: '#32302A',
    muro: '#3A3E48',
    agua: '#1C4761',
    niebla: '#6E86A8',
    sombra: 0.5,
  },
}

/**
 * Escena "fotográfica" vectorial sobre la que se compone la pérgola.
 * Se dibuja en SVG para que el render sea nítido en cualquier tamaño y no
 * dependa de descargar imágenes en una demo estática.
 */
export function EscenaRealista({
  escena,
  luz,
  className,
}: {
  escena: Escena
  luz: Luz
  className?: string
}) {
  const p = PALETAS[luz]
  const uid = `${escena}-${luz}`

  return (
    <svg viewBox="0 0 1200 750" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`cielo-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.cieloTop} />
          <stop offset="100%" stopColor={p.cieloBottom} />
        </linearGradient>
        <radialGradient id={`sol-${uid}`} cx="0.72" cy="0.18" r="0.45">
          <stop offset="0%" stopColor={p.sol} stopOpacity={p.solOpacity} />
          <stop offset="100%" stopColor={p.sol} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`piso-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.pisoOscuro} />
          <stop offset="100%" stopColor={p.piso} />
        </linearGradient>
        <linearGradient id={`agua-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.agua} />
          <stop offset="100%" stopColor={p.agua} stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id={`niebla-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.niebla} stopOpacity="0.55" />
          <stop offset="100%" stopColor={p.niebla} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`vineta-${uid}`} cx="0.5" cy="0.45" r="0.78">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
        </radialGradient>
        <filter id={`blur-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={`blurSuave-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        {/* Grano de película: es lo que más acerca la escena a una foto */}
        <filter id={`grano-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <linearGradient id={`horizonte-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.niebla} stopOpacity="0" />
          <stop offset="55%" stopColor={p.niebla} stopOpacity="0.42" />
          <stop offset="100%" stopColor={p.niebla} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Cielo y sol */}
      <rect width="1200" height="750" fill={`url(#cielo-${uid})`} />
      <rect width="1200" height="750" fill={`url(#sol-${uid})`} />
      {luz === 'noche' && (
        <g fill="#FFFFFF" opacity="0.7">
          {[
            [120, 70], [260, 42], [400, 96], [540, 58], [700, 88], [880, 50], [1040, 104], [1140, 62],
            [190, 130], [610, 140], [960, 150],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.2 : 1.4} />
          ))}
        </g>
      )}

      {/* Vegetación de fondo */}
      <g filter={`url(#blur-${uid})`}>
        <ellipse cx="140" cy="430" rx="220" ry="120" fill={p.vegetacionOscura} />
        <ellipse cx="380" cy="448" rx="200" ry="96" fill={p.vegetacion} />
        <ellipse cx="1080" cy="425" rx="230" ry="118" fill={p.vegetacionOscura} />
        <ellipse cx="860" cy="452" rx="190" ry="88" fill={p.vegetacion} />
      </g>
      <rect y="470" width="1200" height="60" fill={`url(#niebla-${uid})`} opacity="0.4" />

      {/* Palmeras de la escena de pileta */}
      {escena === 'pileta' && (
        <g filter={`url(#blurSuave-${uid})`}>
          {[
            [110, 470, 1],
            [1105, 476, -1],
          ].map(([x, y, dir], i) => (
            <g key={i}>
              <path
                d={`M${x} ${y} q${8 * dir} -90 ${26 * dir} -150`}
                stroke={p.vegetacionOscura}
                strokeWidth="11"
                fill="none"
                strokeLinecap="round"
              />
              {[-1, -0.45, 0.2, 0.8].map((k, j) => (
                <path
                  key={j}
                  d={`M${x + 26 * dir} ${y - 150} q${60 * k} ${-26 - j * 6} ${104 * k} ${16 + j * 12}`}
                  stroke={p.vegetacion}
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.94"
                />
              ))}
            </g>
          ))}
        </g>
      )}

      {/* Muro / fachada de la casa */}
      {escena !== 'pileta' && (
        <g>
          <rect x="0" y="212" width="268" height="300" fill={p.muro} />
          <rect x="0" y="212" width="268" height="10" fill="#000" opacity="0.1" />
          <rect x="44" y="270" width="80" height="150" rx="3" fill={luz === 'noche' ? '#F3D9A0' : p.agua} opacity={luz === 'noche' ? 0.85 : 0.3} />
          <rect x="158" y="270" width="80" height="150" rx="3" fill={luz === 'noche' ? '#F3D9A0' : p.agua} opacity={luz === 'noche' ? 0.6 : 0.3} />
          <rect x="0" y="504" width="268" height="12" fill="#000" opacity="0.12" />
        </g>
      )}

      {/* Baranda de la terraza urbana */}
      {escena === 'terraza' && (
        <g opacity="0.75">
          <rect x="300" y="430" width="900" height="6" rx="3" fill="#9AA3AD" />
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x={306 + i * 41} y="436" width="4" height="78" fill="#9AA3AD" />
          ))}
        </g>
      )}

      {/* Piso */}
      <rect y="512" width="1200" height="238" fill={`url(#piso-${uid})`} />
      {/* Junta de las baldosas en perspectiva */}
      <g stroke="#000" strokeOpacity="0.07" strokeWidth="2">
        {[532, 560, 598, 648, 712].map((y) => (
          <line key={y} x1="0" y1={y} x2="1200" y2={y} />
        ))}
        {Array.from({ length: 13 }, (_, i) => {
          const x = 100 * i
          return <line key={i} x1={600 + (x - 600) * 0.35} y1="512" x2={600 + (x - 600) * 2.3} y2="750" />
        })}
      </g>

      {/* Pileta */}
      {escena === 'pileta' && (
        <g>
          <rect x="70" y="652" width="1060" height="98" rx="8" fill={`url(#agua-${uid})`} />
          <rect x="70" y="652" width="1060" height="98" rx="8" fill="none" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="6" />
          <g stroke="#FFFFFF" strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round">
            {[676, 700, 724].map((y, i) => (
              <path key={y} d={`M${180 + i * 26} ${y} q60 -7 120 0 t120 0 t120 0 t120 0`} fill="none" />
            ))}
          </g>
        </g>
      )}

      {/* Reposeras */}
      {escena !== 'terraza' && (
        <g opacity="0.9" filter={`url(#blurSuave-${uid})`}>
          <g transform="translate(58,600)">
            <rect x="0" y="18" width="92" height="12" rx="5" fill="#F0EBE1" />
            <rect x="60" y="-8" width="34" height="30" rx="5" fill="#F0EBE1" />
            <rect x="8" y="30" width="6" height="16" fill="#C6BBA7" />
            <rect x="78" y="30" width="6" height="16" fill="#C6BBA7" />
          </g>
        </g>
      )}

      {/* Plantas en primer plano, desenfocadas */}
      <g filter={`url(#blur-${uid})`} opacity="0.95">
        <ellipse cx="46" cy="726" rx="120" ry="80" fill={p.vegetacionOscura} />
        <ellipse cx="1168" cy="716" rx="128" ry="92" fill={p.vegetacionOscura} />
      </g>

      {/* Bruma sobre el horizonte: separa los planos */}
      <rect y="400" width="1200" height="150" fill={`url(#horizonte-${uid})`} />

      {/* Viñeta y grano fotográfico */}
      <rect width="1200" height="750" fill={`url(#vineta-${uid})`} />
      <rect
        width="1200"
        height="750"
        filter={`url(#grano-${uid})`}
        opacity={luz === 'noche' ? 0.16 : 0.09}
        style={{ mixBlendMode: 'overlay' }}
      />
    </svg>
  )
}

export const PALETA_SOMBRA: Record<Luz, number> = {
  dia: PALETAS.dia.sombra,
  atardecer: PALETAS.atardecer.sombra,
  noche: PALETAS.noche.sombra,
}
