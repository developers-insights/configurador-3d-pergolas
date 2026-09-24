import type { SubModeloTuuci } from '@/types'

/** Miniaturas de la colección Tuuci para las tarjetas del panel derecho. */
export function TuuciCollectionArt({ sub, className }: { sub: SubModeloTuuci; className?: string }) {
  if (sub === 'maxSolanox') {
    return (
      <svg viewBox="0 0 160 120" className={className} role="img" aria-label="MAX Solanox Pergola">
        <defs>
          <linearGradient id="mx-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FC6E8" />
            <stop offset="60%" stopColor="#C9E4F0" />
          </linearGradient>
        </defs>
        <rect width="160" height="120" fill="url(#mx-sky)" />
        <rect y="74" width="160" height="46" fill="#3E8BB5" />
        <rect y="74" width="160" height="8" fill="#6FB3D4" opacity="0.7" />
        <rect x="18" y="30" width="118" height="48" fill="#EFE7D8" />
        <rect x="18" y="26" width="118" height="7" fill="#C89A63" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={24 + i * 14} y="34" width="5" height="44" fill="#B5854F" />
        ))}
        <rect x="18" y="76" width="118" height="4" fill="#8C6337" />
        <rect x="0" y="98" width="160" height="22" fill="#D8CDBA" />
      </svg>
    )
  }

  if (sub === 'lulu') {
    return (
      <svg viewBox="0 0 160 120" className={className} role="img" aria-label="Lulu Day Lounge">
        <defs>
          <linearGradient id="lu-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F3DCC4" />
            <stop offset="100%" stopColor="#E7CFB6" />
          </linearGradient>
        </defs>
        <rect width="160" height="120" fill="url(#lu-sky)" />
        <rect y="86" width="160" height="34" fill="#C9AF95" />
        <rect x="40" y="18" width="80" height="8" fill="#EDE5D8" />
        <rect x="42" y="26" width="6" height="62" fill="#B99A78" />
        <rect x="112" y="26" width="6" height="62" fill="#B99A78" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={54 + i * 14} y="26" width="9" height="58" fill="#F6F1E8" opacity={0.92} />
        ))}
        <rect x="46" y="76" width="68" height="10" fill="#D9C7AE" />
        <ellipse cx="80" cy="92" rx="46" ry="5" fill="#A88E72" opacity="0.5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 160 120" className={className} role="img" aria-label="Pérgola">
      <defs>
        <linearGradient id="pg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9FD8E4" />
          <stop offset="100%" stopColor="#D8F0F2" />
        </linearGradient>
      </defs>
      <rect width="160" height="120" fill="url(#pg-sky)" />
      <rect y="88" width="160" height="32" fill="#6FC3C9" />
      <rect x="26" y="30" width="108" height="10" fill="#F2EDE2" />
      <path
        d="M26 40 q9 8 18 0 q9 8 18 0 q9 8 18 0 q9 8 18 0 q9 8 18 0 q9 8 18 0"
        fill="none"
        stroke="#F2EDE2"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="28" y="44" width="5" height="46" fill="#C08B4F" />
      <rect x="127" y="44" width="5" height="46" fill="#C08B4F" />
      {[0, 1].map((i) => (
        <rect key={i} x={52 + i * 42} y="46" width="16" height="44" fill="#FBF8F2" opacity="0.9" />
      ))}
      <rect x="24" y="88" width="112" height="4" fill="#A97B45" />
    </svg>
  )
}
