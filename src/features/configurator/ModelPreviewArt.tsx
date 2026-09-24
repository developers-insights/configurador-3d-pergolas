/**
 * Ilustraciones vectoriales de cada modelo para las tarjetas de selección.
 * Se usan en lugar de un canvas 3D para no montar tres escenas en la misma
 * pantalla; el 3D real arranca al entrar al configurador.
 */

export function SolsticeArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="Solstice">
      <defs>
        <linearGradient id="sol-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101720" />
          <stop offset="100%" stopColor="#1B2530" />
        </linearGradient>
        <linearGradient id="sol-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A525C" />
          <stop offset="100%" stopColor="#2C333B" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#sol-sky)" />
      <ellipse cx="160" cy="176" rx="118" ry="13" fill="#000" opacity="0.35" />
      {/* techo */}
      <path d="M46 62 L160 34 L274 62 L160 92 Z" fill="url(#sol-top)" />
      <path d="M46 62 L160 92 L160 100 L46 70 Z" fill="#20262E" />
      <path d="M274 62 L160 92 L160 100 L274 70 Z" fill="#171C22" />
      {/* lamas */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M${66 + i * 32} ${57 + i * 0} L${160 + i * 0} ${34 + i * 0}`}
          stroke="#5B6672"
          strokeWidth="0"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`l${i}`}
          x1={74 + i * 34}
          y1={69 - i * 0}
          x2={188 + i * 34}
          y2={40}
          stroke="#606B78"
          strokeWidth="2"
          opacity={0.55}
        />
      ))}
      {/* LED perimetral */}
      <path d="M46 70 L160 100 L274 70" fill="none" stroke="#1FA2FF" strokeWidth="2.5" opacity="0.95" />
      {/* columnas */}
      <rect x="48" y="66" width="8" height="98" fill="#39414A" />
      <rect x="264" y="66" width="8" height="98" fill="#2A3138" />
      <rect x="156" y="96" width="8" height="72" fill="#333B43" />
      {/* piso */}
      <line x1="34" y1="166" x2="286" y2="166" stroke="#2A323B" strokeWidth="2" />
    </svg>
  )
}

export function TuuciArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label="Tuuci">
      <defs>
        <linearGradient id="tu-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F3EC" />
          <stop offset="100%" stopColor="#E9E0D2" />
        </linearGradient>
        <linearGradient id="tu-can" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E7E0D4" />
        </linearGradient>
        <linearGradient id="tu-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9934F" />
          <stop offset="100%" stopColor="#9C6C39" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#tu-sky)" />
      <ellipse cx="160" cy="176" rx="112" ry="12" fill="#8C7B63" opacity="0.28" />
      {/* canopy */}
      <path d="M52 66 L160 30 L268 66 L160 88 Z" fill="url(#tu-can)" />
      <path
        d="M52 66 q13 12 27 0 q13 12 27 0 q13 12 27 0 q13 12 27 0 q13 12 27 0 q13 12 27 0 q13 12 27 0 q13 12 27 0"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        transform="translate(0,16)"
        opacity="0.95"
      />
      <path d="M160 30 v-8" stroke="#8B6438" strokeWidth="3" strokeLinecap="round" />
      <circle cx="160" cy="20" r="3.5" fill="#8B6438" />
      {/* parantes */}
      <rect x="56" y="72" width="9" height="92" rx="1.5" fill="url(#tu-wood)" />
      <rect x="255" y="72" width="9" height="92" rx="1.5" fill="url(#tu-wood)" opacity="0.82" />
      <rect x="112" y="82" width="8" height="82" rx="1.5" fill="url(#tu-wood)" opacity="0.9" />
      <rect x="200" y="82" width="8" height="82" rx="1.5" fill="url(#tu-wood)" opacity="0.72" />
      {/* base / cama */}
      <rect x="96" y="136" width="128" height="20" rx="3" fill="#B98A52" />
      <rect x="100" y="126" width="120" height="13" rx="6" fill="#F2EFE8" />
      <rect x="104" y="118" width="42" height="14" rx="6" fill="#E8E3D8" />
      <line x1="40" y1="164" x2="280" y2="164" stroke="#CFC2AC" strokeWidth="2" />
    </svg>
  )
}
