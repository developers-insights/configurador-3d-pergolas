import type {
  AcabadoMadera,
  AcabadoSolstice,
  ColorCanopy,
  Config,
  ConfigSolstice,
  ConfigTuuci,
  ItemDespiece,
} from '@/types'

const FT_TO_M = 0.3048

/** Etiquetas del catálogo del proveedor (ES/EN) para armar la descripción del SKU. */
export const FINISH_LABEL: Record<AcabadoSolstice, [string, string, string]> = {
  charcoal: ['Carbón', 'Charcoal', 'CHR'],
  white: ['Blanco', 'White', 'WHT'],
  bronze: ['Bronce', 'Bronze', 'BRZ'],
  anthracite: ['Gris antracita', 'Anthracite grey', 'ANT'],
}

export const FINISH_HEX: Record<AcabadoSolstice, string> = {
  charcoal: '#32383F',
  white: '#ECEDEF',
  bronze: '#7A5A3A',
  anthracite: '#4A5057',
}

export const WOOD_LABEL: Record<AcabadoMadera, [string, string, string]> = {
  teak: ['Teca natural', 'Natural teak', 'TEK'],
  walnut: ['Nogal', 'Walnut', 'WAL'],
  ipe: ['Ipé oscuro', 'Dark ipe', 'IPE'],
  ash: ['Fresno claro', 'Light ash', 'ASH'],
  mahogany: ['Caoba', 'Mahogany', 'MAH'],
  driftwood: ['Driftwood', 'Driftwood', 'DRF'],
}

export const WOOD_HEX: Record<AcabadoMadera, string> = {
  teak: '#C08B4F',
  walnut: '#6E4426',
  ipe: '#4A3220',
  ash: '#D9BE95',
  mahogany: '#8B3E2F',
  driftwood: '#A99788',
}

export const CANOPY_LABEL: Record<ColorCanopy, [string, string, string]> = {
  white: ['Blanco', 'White', 'WHT'],
  sand: ['Arena', 'Sand', 'SND'],
  blue: ['Azul', 'Blue', 'BLU'],
  stripe: ['Rayado', 'Striped', 'STR'],
}

export const CANOPY_HEX: Record<ColorCanopy, string> = {
  white: '#F4F4F2',
  sand: '#E3D5BE',
  blue: '#2E5C8A',
  stripe: '#EDE7DA',
}

const POST_LABEL = {
  square: ['Poste aluminio 100×100 mm', 'Aluminum post 100×100 mm', 'S100', 215],
  slim: ['Poste aluminio slim 80×80 mm', 'Slim aluminum post 80×80 mm', 'S080', 189],
  round: ['Poste aluminio redondo Ø110 mm', 'Round aluminum post Ø110 mm', 'R110', 248],
} as const

const WALL_LABEL = {
  glass: ['Paño de vidrio templado 10 mm', 'Tempered glass panel 10 mm', 'GLS', 310],
  louver: ['Paño de persiana orientable', 'Adjustable louvered panel', 'LVR', 265],
  solid: ['Panel ciego composite', 'Solid composite panel', 'SLD', 198],
} as const

const r1 = (n: number) => Math.round(n * 10) / 10
const r2 = (n: number) => Math.round(n * 100) / 100

/* ──────────────────────────────────────────────────────────────────────────
   Despiece Solstice
   ────────────────────────────────────────────────────────────────────────── */

function despieceSolstice(c: ConfigSolstice): ItemDespiece[] {
  const items: ItemDespiece[] = []
  const [fEs, fEn, fCode] = FINISH_LABEL[c.finish]

  const largoTotal = c.length + c.frontOH
  const projTotal = c.projection + c.sideOH
  const perimetroM = r1((largoTotal * 2 + projTotal * 2) * FT_TO_M)
  const areaM2 = r1(largoTotal * projTotal * FT_TO_M * FT_TO_M)

  // ── Estructura ───────────────────────────────────────────────────────────
  const [pEs, pEn, pCode, pPrice] = POST_LABEL[c.postStyle]
  items.push({
    sku: `SOL-PST-${pCode}-${fCode}`,
    descripcion: `${pEs} · alt. ${c.height}' · ${fEs}`,
    descripcionEn: `${pEn} · ${c.height}' high · ${fEn}`,
    cantidad: c.postCount,
    unidad: 'u',
    precioRef: pPrice,
    grupo: 'structure',
  })

  items.push({
    sku: `SOL-BEA-160-${fCode}`,
    descripcion: `Viga perimetral aluminio 160×80 mm · ${fEs}`,
    descripcionEn: `Perimeter aluminum beam 160×80 mm · ${fEn}`,
    cantidad: perimetroM,
    unidad: 'ml',
    precioRef: 74,
    grupo: 'structure',
  })

  // Vigas intermedias: una cada ~10 ft de largo
  const intermedias = Math.max(0, Math.ceil(largoTotal / 10) - 1)
  if (intermedias > 0) {
    items.push({
      sku: `SOL-BEA-INT-${fCode}`,
      descripcion: `Viga intermedia de refuerzo · ${projTotal.toFixed(1)}' de luz`,
      descripcionEn: `Intermediate reinforcement beam · ${projTotal.toFixed(1)}' span`,
      cantidad: intermedias,
      unidad: 'u',
      precioRef: 168,
      grupo: 'structure',
    })
  }

  if (c.anchor === 'wall') {
    items.push({
      sku: 'SOL-WMT-PRF',
      descripcion: 'Perfil de anclaje a pared con junta EPDM',
      descripcionEn: 'Wall mounting profile with EPDM gasket',
      cantidad: r1(largoTotal * FT_TO_M),
      unidad: 'ml',
      precioRef: 58,
      grupo: 'structure',
    })
  }

  // ── Techo ────────────────────────────────────────────────────────────────
  if (c.cladding === 'louvered') {
    // Lamas de 200 mm de ancho montadas a lo largo
    const lamas = Math.ceil((largoTotal * FT_TO_M) / 0.2)
    items.push({
      sku: `SOL-LVR-200-${fCode}`,
      descripcion: `Lama orientable aluminio 200 mm · largo ${r2(projTotal * FT_TO_M)} m · ${fEs}`,
      descripcionEn: `Adjustable aluminum louver 200 mm · ${r2(projTotal * FT_TO_M)} m long · ${fEn}`,
      cantidad: lamas,
      unidad: 'u',
      precioRef: 46,
      grupo: 'roof',
    })
    items.push({
      sku: 'SOL-LVR-MOT',
      descripcion: 'Motor lineal 24 V con mando para orientación de lamas',
      descripcionEn: '24 V linear actuator with remote for louver orientation',
      cantidad: Math.max(1, Math.ceil(largoTotal / 20)),
      unidad: 'u',
      precioRef: 520,
      grupo: 'roof',
    })
  } else if (c.cladding === 'panel') {
    items.push({
      sku: `SOL-PNL-ISO-${fCode}`,
      descripcion: `Panel sándwich aislado 40 mm · ${fEs}`,
      descripcionEn: `Insulated sandwich panel 40 mm · ${fEn}`,
      cantidad: areaM2,
      unidad: 'm2',
      precioRef: 132,
      grupo: 'roof',
    })
    items.push({
      sku: 'SOL-GUT-KIT',
      descripcion: 'Kit de desagüe integrado en columna',
      descripcionEn: 'In-post integrated drainage kit',
      cantidad: Math.min(c.postCount, 2),
      unidad: 'kit',
      precioRef: 96,
      grupo: 'roof',
    })
  } else {
    items.push({
      sku: `SOL-OPN-TRV-${fCode}`,
      descripcion: `Travesaño decorativo techo abierto · ${fEs}`,
      descripcionEn: `Open-roof decorative crossbeam · ${fEn}`,
      cantidad: Math.ceil(largoTotal / 1.5),
      unidad: 'u',
      precioRef: 38,
      grupo: 'roof',
    })
  }

  // ── Cerramientos ─────────────────────────────────────────────────────────
  if (c.wallSides > 0) {
    const [wEs, wEn, wCode, wPrice] = WALL_LABEL[c.wallType]
    // Los lados 1 y 3 son laterales (projection), el 2 es el fondo (length)
    const anchoPorLado = [projTotal, largoTotal, projTotal]
    const areaParedes = anchoPorLado
      .slice(0, c.wallSides)
      .reduce((acc, w) => acc + w * c.height * FT_TO_M * FT_TO_M, 0)
    const panos = anchoPorLado
      .slice(0, c.wallSides)
      .reduce((acc, w) => acc + Math.ceil((w * FT_TO_M) / 1.2), 0)

    items.push({
      sku: `SOL-WAL-${wCode}`,
      descripcion: `${wEs} · alt. ${c.height}' · ${c.wallSides} ${c.wallSides === 1 ? 'lado' : 'lados'}`,
      descripcionEn: `${wEn} · ${c.height}' high · ${c.wallSides} side${c.wallSides === 1 ? '' : 's'}`,
      cantidad: panos,
      unidad: 'u',
      precioRef: wPrice,
      grupo: 'walls',
    })
    items.push({
      sku: `SOL-WAL-RAI-${fCode}`,
      descripcion: `Riel guía superior e inferior para cerramiento · ${fEs}`,
      descripcionEn: `Upper and lower guide rail for enclosure · ${fEn}`,
      cantidad: r1(
        anchoPorLado.slice(0, c.wallSides).reduce((a, w) => a + w * FT_TO_M, 0) * 2,
      ),
      unidad: 'ml',
      precioRef: 41,
      grupo: 'walls',
    })
    items.push({
      sku: 'SOL-WAL-SEL',
      descripcion: `Sellado perimetral y burletes · ${r1(areaParedes)} m² de cerramiento`,
      descripcionEn: `Perimeter sealing and gaskets · ${r1(areaParedes)} m² of enclosure`,
      cantidad: c.wallSides,
      unidad: 'kit',
      precioRef: 64,
      grupo: 'walls',
    })
  }

  // ── Extras y eléctrico ───────────────────────────────────────────────────
  if (c.led) {
    items.push({
      sku: 'SOL-LED-PER',
      descripcion: 'Tira LED perimetral RGBW IP65 con fuente y driver',
      descripcionEn: 'Perimeter RGBW LED strip IP65 with power supply and driver',
      cantidad: perimetroM,
      unidad: 'ml',
      precioRef: 34,
      grupo: 'addons',
    })
  }
  if (c.fan) {
    const vent = Math.max(1, Math.round(largoTotal / 16))
    items.push({
      sku: 'SOL-FAN-DC52',
      descripcion: 'Ventilador de techo DC 52" para exterior con control remoto',
      descripcionEn: 'Outdoor 52" DC ceiling fan with remote control',
      cantidad: vent,
      unidad: 'u',
      precioRef: 415,
      grupo: 'addons',
    })
  }
  if (c.heater) {
    const cal = Math.max(1, Math.round(largoTotal / 12))
    items.push({
      sku: 'SOL-HTR-IR20',
      descripcion: 'Calefactor infrarrojo 2000 W IP65 de montaje en viga',
      descripcionEn: 'Beam-mounted 2000 W IP65 infrared heater',
      cantidad: cal,
      unidad: 'u',
      precioRef: 368,
      grupo: 'addons',
    })
  }
  if (c.rainSensor) {
    items.push({
      sku: 'SOL-SNS-RW',
      descripcion: 'Sensor de lluvia y viento con cierre automático de lamas',
      descripcionEn: 'Rain and wind sensor with automatic louver closing',
      cantidad: 1,
      unidad: 'kit',
      precioRef: 289,
      grupo: 'addons',
    })
  }
  if (c.led || c.fan || c.heater || c.rainSensor) {
    items.push({
      sku: 'SOL-ELE-BOX',
      descripcion: 'Tablero eléctrico estanco con protecciones y cableado interno',
      descripcionEn: 'Weatherproof electrical panel with breakers and internal wiring',
      cantidad: 1,
      unidad: 'kit',
      precioRef: 246,
      grupo: 'addons',
    })
  }

  // ── Herrajes y fijación ──────────────────────────────────────────────────
  items.push({
    sku: c.anchor === 'floor' ? 'SOL-FIX-BSE' : 'SOL-FIX-WAL',
    descripcion:
      c.anchor === 'floor'
        ? 'Kit de anclaje a piso: placa base, tacos químicos y tapa embellecedora'
        : 'Kit de anclaje a pared: ménsula reforzada y tacos químicos',
    descripcionEn:
      c.anchor === 'floor'
        ? 'Floor anchor kit: base plate, chemical anchors and cover trim'
        : 'Wall anchor kit: reinforced bracket and chemical anchors',
    cantidad: c.postCount,
    unidad: 'kit',
    precioRef: c.anchor === 'floor' ? 78 : 94,
    grupo: 'hardware',
  })
  items.push({
    sku: 'SOL-FIX-ESQ',
    descripcion: 'Escuadra de unión viga-columna en aluminio fundido',
    descripcionEn: 'Cast aluminum beam-to-post connection bracket',
    cantidad: c.postCount * 2,
    unidad: 'u',
    precioRef: 29,
    grupo: 'hardware',
  })
  items.push({
    sku: 'SOL-FIX-TRN',
    descripcion: 'Juego de tornillería inoxidable A2 y selladores',
    descripcionEn: 'A2 stainless steel fastener set and sealants',
    cantidad: 1,
    unidad: 'jgo',
    precioRef: 132,
    grupo: 'hardware',
  })

  return items
}

/* ──────────────────────────────────────────────────────────────────────────
   Despiece Tuuci
   ────────────────────────────────────────────────────────────────────────── */

function despieceTuuci(c: ConfigTuuci): ItemDespiece[] {
  const items: ItemDespiece[] = []
  const [wEs, wEn, wCode] = WOOD_LABEL[c.wood]
  const [cEs, cEn, cCode] = CANOPY_LABEL[c.canopy]
  const ladoM = r2(c.size * FT_TO_M)
  const areaM2 = r1(c.size * c.size * FT_TO_M * FT_TO_M)
  const esLulu = c.sub === 'lulu'
  const esMax = c.sub === 'maxSolanox'

  // ── Estructura de madera ─────────────────────────────────────────────────
  items.push({
    sku: `TUU-PST-${wCode}-${esMax ? '120' : '100'}`,
    descripcion: `Parante de madera ${esMax ? '120×120' : '100×100'} mm · ${wEs}`,
    descripcionEn: `${esMax ? '120×120' : '100×100'} mm wood post · ${wEn}`,
    cantidad: 4,
    unidad: 'u',
    precioRef: esMax ? 430 : 365,
    grupo: 'structure',
  })
  items.push({
    sku: `TUU-BEA-${wCode}`,
    descripcion: `Viga perimetral de madera maciza · ${wEs} · ${ladoM} m por tramo`,
    descripcionEn: `Solid wood perimeter beam · ${wEn} · ${ladoM} m per run`,
    cantidad: 4,
    unidad: 'u',
    precioRef: 268,
    grupo: 'structure',
  })
  if (esMax) {
    items.push({
      sku: 'TUU-TNS-MAX',
      descripcion: 'Sistema de tensado Solanox con cables y tensores de acero inoxidable',
      descripcionEn: 'Solanox tensioning system with stainless steel cables and turnbuckles',
      cantidad: 1,
      unidad: 'kit',
      precioRef: 690,
      grupo: 'structure',
    })
  }
  if (esLulu) {
    items.push({
      sku: `TUU-PLT-${wCode}`,
      descripcion: `Plataforma y listonado de base para cama de día · ${wEs}`,
      descripcionEn: `Day bed base platform and slatting · ${wEn}`,
      cantidad: 1,
      unidad: 'kit',
      precioRef: 845,
      grupo: 'structure',
    })
  }

  // ── Techo / lona ─────────────────────────────────────────────────────────
  items.push({
    sku: `TUU-CAN-${cCode}-${c.size}`,
    descripcion: `Canopy de lona acrílica solution-dyed · ${cEs} · ${c.size}' (${ladoM} m)`,
    descripcionEn: `Solution-dyed acrylic canopy · ${cEn} · ${c.size}' (${ladoM} m)`,
    cantidad: 1,
    unidad: 'u',
    precioRef: esMax ? 1290 : 980,
    grupo: 'roof',
  })
  items.push({
    sku: 'TUU-CAN-PRF',
    descripcion: `Perfil de fijación de lona con junquillo · ${areaM2} m² de cobertura`,
    descripcionEn: `Canopy fixing profile with keder · ${areaM2} m² coverage`,
    cantidad: r1(ladoM * 4),
    unidad: 'ml',
    precioRef: 44,
    grupo: 'roof',
  })

  // ── Textil y confort ─────────────────────────────────────────────────────
  if (c.curtains) {
    items.push({
      sku: `TUU-CUR-${cCode}`,
      descripcion: `Paño de cortina lateral con riel y ganchos · ${cEs}`,
      descripcionEn: `Side curtain panel with track and hooks · ${cEn}`,
      cantidad: 4,
      unidad: 'u',
      precioRef: 215,
      grupo: 'textile',
    })
    items.push({
      sku: 'TUU-CUR-RAI',
      descripcion: 'Riel perimetral de cortina en acero inoxidable',
      descripcionEn: 'Stainless steel perimeter curtain track',
      cantidad: r1(ladoM * 4),
      unidad: 'ml',
      precioRef: 38,
      grupo: 'textile',
    })
  }
  if (c.cushions) {
    items.push({
      sku: 'TUU-CUS-SET',
      descripcion: esLulu
        ? 'Colchón exterior de alta densidad + respaldo y almohadones'
        : 'Juego de cojines de exterior con funda desmontable',
      descripcionEn: esLulu
        ? 'High-density outdoor mattress + backrest and pillows'
        : 'Outdoor cushion set with removable covers',
      cantidad: 1,
      unidad: 'jgo',
      precioRef: esLulu ? 1150 : 580,
      grupo: 'textile',
    })
  }

  // ── Herrajes ─────────────────────────────────────────────────────────────
  items.push({
    sku: 'TUU-FIX-BSE',
    descripcion: 'Base de anclaje de acero inoxidable 316 con tapa de madera',
    descripcionEn: '316 stainless steel anchor base with wood cover',
    cantidad: 4,
    unidad: 'kit',
    precioRef: 128,
    grupo: 'hardware',
  })
  items.push({
    sku: 'TUU-FIX-ESQ',
    descripcion: 'Escuadra de esquina fundida para unión viga-parante',
    descripcionEn: 'Cast corner bracket for beam-to-post joint',
    cantidad: 8,
    unidad: 'u',
    precioRef: 46,
    grupo: 'hardware',
  })
  items.push({
    sku: 'TUU-FIX-TRN',
    descripcion: 'Juego de tornillería inoxidable 316 y aceite protector para madera',
    descripcionEn: '316 stainless fastener set and protective wood oil',
    cantidad: 1,
    unidad: 'jgo',
    precioRef: 165,
    grupo: 'hardware',
  })

  return items
}

/** Calcula el despiece completo a partir de la configuración elegida. */
export function calcularDespiece(c: Config): ItemDespiece[] {
  return c.modelo === 'solstice' ? despieceSolstice(c) : despieceTuuci(c)
}

export function totalDespiece(items: ItemDespiece[]) {
  return items.reduce((acc, i) => acc + i.cantidad * i.precioRef, 0)
}

export function totalPiezas(items: ItemDespiece[]) {
  return Math.round(items.reduce((acc, i) => acc + i.cantidad, 0))
}

/* ──────────────────────────────────────────────────────────────────────────
   Resumen legible de una configuración (encabezado del despiece y pedidos)
   ────────────────────────────────────────────────────────────────────────── */

const SUB_LABEL: Record<ConfigTuuci['sub'], [string, string]> = {
  maxSolanox: ['MAX Solanox Pergola', 'MAX Solanox Pergola'],
  pergola: ['Pérgola', 'Pergola'],
  lulu: ['Lulu Day Lounge', 'Lulu Day Lounge'],
}

const CLADDING_LABEL: Record<ConfigSolstice['cladding'], [string, string]> = {
  louvered: ['lamas orientables', 'adjustable louvers'],
  panel: ['panel aislado', 'insulated panel'],
  open: ['techo abierto', 'open roof'],
}

/** Ej.: "Solstice 16×12' · lamas orientables · Carbón · 4 columnas" */
export function resumirConfig(c: Config, lang: 'es' | 'en' = 'es'): string {
  const i = lang === 'es' ? 0 : 1
  if (c.modelo === 'solstice') {
    const partes = [
      `Solstice ${c.length}×${c.projection}'`,
      CLADDING_LABEL[c.cladding][i],
      FINISH_LABEL[c.finish][i],
      `${c.postCount} ${lang === 'es' ? 'columnas' : 'posts'}`,
    ]
    if (c.wallSides > 0) {
      partes.push(
        `${c.wallSides} ${lang === 'es' ? (c.wallSides === 1 ? 'lado cerrado' : 'lados cerrados') : c.wallSides === 1 ? 'walled side' : 'walled sides'}`,
      )
    }
    return partes.join(' · ')
  }
  const partes = [
    `Tuuci ${SUB_LABEL[c.sub][i]}`,
    `${c.size}'`,
    WOOD_LABEL[c.wood][i],
    `${lang === 'es' ? 'lona' : 'canopy'} ${CANOPY_LABEL[c.canopy][i].toLowerCase()}`,
  ]
  if (c.curtains) partes.push(lang === 'es' ? 'con cortinas' : 'with curtains')
  return partes.join(' · ')
}

export { SUB_LABEL }
