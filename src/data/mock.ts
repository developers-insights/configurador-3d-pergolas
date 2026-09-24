import type {
  ConfigSolstice,
  ConfigTuuci,
  Empresa,
  Pedido,
  PuntoMes,
  TopMaterial,
} from '@/types'
import { calcularDespiece, resumirConfig, totalDespiece } from './catalogo'

/* ──────────────────────────────────────────────────────────────────────────
   Configuraciones por defecto de cada configurador
   ────────────────────────────────────────────────────────────────────────── */

export const DEFAULT_SOLSTICE: ConfigSolstice = {
  modelo: 'solstice',
  length: 16,
  projection: 12,
  height: 9,
  sideOH: 1,
  frontOH: 1,
  postCount: 4,
  postStyle: 'square',
  anchor: 'floor',
  wallSides: 0,
  wallType: 'glass',
  cladding: 'louvered',
  louverAngle: 45,
  led: true,
  fan: false,
  heater: false,
  rainSensor: false,
  finish: 'charcoal',
}

export const DEFAULT_TUUCI: ConfigTuuci = {
  modelo: 'tuuci',
  sub: 'pergola',
  size: 10,
  wood: 'teak',
  canopy: 'white',
  curtains: false,
  cushions: false,
}

/* ──────────────────────────────────────────────────────────────────────────
   Empresas de pérgolas (los usuarios del sistema)
   ────────────────────────────────────────────────────────────────────────── */

export const EMPRESAS_MOCK: Empresa[] = [
  { id: 'emp-01', nombre: 'Aurora Outdoor Living',   contacto: 'Martina Rossi',    email: 'martina@auroraoutdoor.com',   telefono: '+54 11 5478-2210', region: 'Buenos Aires, AR', estado: 'activo',   plan: 'Enterprise', ultimoAcceso: '2026-09-23T14:20:00Z', cantidadPedidos: 34, desde: '2023-04-11' },
  { id: 'emp-02', nombre: 'Patio Norte Pérgolas',    contacto: 'Diego Almada',     email: 'diego@pationorte.com.ar',     telefono: '+54 11 4432-9087', region: 'Zona Norte, AR',   estado: 'activo',   plan: 'Pro',        ultimoAcceso: '2026-09-22T09:05:00Z', cantidadPedidos: 27, desde: '2023-08-02' },
  { id: 'emp-03', nombre: 'Costa Shade Systems',     contacto: 'Laura Benítez',    email: 'laura@costashade.com',        telefono: '+598 99 412-330',  region: 'Punta del Este, UY', estado: 'activo', plan: 'Pro',        ultimoAcceso: '2026-09-21T17:45:00Z', cantidadPedidos: 22, desde: '2024-01-19' },
  { id: 'emp-04', nombre: 'Terraza Viva',            contacto: 'Nicolás Ferrer',   email: 'nico@terrazaviva.cl',         telefono: '+56 9 8823-1140',  region: 'Santiago, CL',     estado: 'activo',   plan: 'Starter',    ultimoAcceso: '2026-09-20T11:30:00Z', cantidadPedidos: 11, desde: '2024-06-05' },
  { id: 'emp-05', nombre: 'Solaris Pergolas',        contacto: 'Valeria Moreno',   email: 'valeria@solarispergolas.es',  telefono: '+34 693 221-884',  region: 'Málaga, ES',       estado: 'activo',   plan: 'Enterprise', ultimoAcceso: '2026-09-23T08:10:00Z', cantidadPedidos: 41, desde: '2022-11-28' },
  { id: 'emp-06', nombre: 'Delta Outdoor Studio',    contacto: 'Franco Lisi',      email: 'franco@deltaoutdoor.com',     telefono: '+54 341 620-7744', region: 'Rosario, AR',      estado: 'activo',   plan: 'Pro',        ultimoAcceso: '2026-09-19T15:55:00Z', cantidadPedidos: 18, desde: '2023-12-14' },
  { id: 'emp-07', nombre: 'Bahía Cabanas',           contacto: 'Julieta Sosa',     email: 'julieta@bahiacabanas.com',    telefono: '+55 48 99612-4410',region: 'Florianópolis, BR',estado: 'activo',   plan: 'Pro',        ultimoAcceso: '2026-09-18T13:25:00Z', cantidadPedidos: 25, desde: '2023-02-21' },
  { id: 'emp-08', nombre: 'Mediterráneo Shade Co.',  contacto: 'Andrés Puig',      email: 'andres@medshade.es',          telefono: '+34 651 908-223',  region: 'Valencia, ES',     estado: 'activo',   plan: 'Starter',    ultimoAcceso: '2026-09-17T10:40:00Z', cantidadPedidos: 9,  desde: '2025-02-09' },
  { id: 'emp-09', nombre: 'Aluminia Proyectos',      contacto: 'Carolina Vidal',   email: 'caro@aluminia.com.ar',        telefono: '+54 351 704-2298', region: 'Córdoba, AR',      estado: 'activo',   plan: 'Pro',        ultimoAcceso: '2026-09-16T16:15:00Z', cantidadPedidos: 16, desde: '2024-03-30' },
  { id: 'emp-10', nombre: 'Lumen Pergolas',          contacto: 'Tomás Iriarte',    email: 'tomas@lumenpergolas.com',     telefono: '+1 305 442-9981',  region: 'Miami, US',        estado: 'activo',   plan: 'Enterprise', ultimoAcceso: '2026-09-23T19:02:00Z', cantidadPedidos: 38, desde: '2022-07-17' },
  { id: 'emp-11', nombre: 'Verano Living',           contacto: 'Sofía Duarte',     email: 'sofia@veranoliving.com',      telefono: '+54 223 551-6620', region: 'Mar del Plata, AR',estado: 'inactivo', plan: 'Starter',    ultimoAcceso: '2026-05-14T12:00:00Z', cantidadPedidos: 4,  desde: '2024-10-08' },
  { id: 'emp-12', nombre: 'Andes Outdoor',           contacto: 'Pablo Quiroga',    email: 'pablo@andesoutdoor.cl',       telefono: '+56 9 7712-3345',  region: 'Viña del Mar, CL', estado: 'inactivo', plan: 'Pro',        ultimoAcceso: '2026-04-02T09:20:00Z', cantidadPedidos: 7,  desde: '2023-09-25' },
  { id: 'emp-13', nombre: 'Rivera Shade Works',      contacto: 'Gonzalo Peralta',  email: 'gonzalo@riverashade.uy',      telefono: '+598 94 220-117',  region: 'Montevideo, UY',   estado: 'inactivo', plan: 'Starter',    ultimoAcceso: '2026-03-11T14:35:00Z', cantidadPedidos: 3,  desde: '2025-01-13' },
  { id: 'emp-14', nombre: 'Casa Sombra',             contacto: 'Renata Molina',    email: 'renata@casasombra.mx',        telefono: '+52 55 3390-7742', region: 'Ciudad de México, MX', estado: 'inactivo', plan: 'Starter', ultimoAcceso: '2026-02-27T08:50:00Z', cantidadPedidos: 2,  desde: '2025-05-06' },
  { id: 'emp-15', nombre: 'Horizonte Pérgolas',      contacto: 'Ignacio Beltrán',  email: 'ignacio@horizontep.com',      telefono: '+54 11 6098-3321', region: 'La Plata, AR',     estado: 'activo',   plan: 'Pro',        ultimoAcceso: '2026-09-15T18:05:00Z', cantidadPedidos: 14, desde: '2024-08-22' },
]

/* ──────────────────────────────────────────────────────────────────────────
   Pedidos históricos
   ────────────────────────────────────────────────────────────────────────── */

type Semilla = {
  id: string
  empresaIdx: number
  cliente: string
  direccion: string
  ciudad: string
  fecha: string
  estado: Pedido['estado']
  cfg: Partial<ConfigSolstice> | (Partial<ConfigTuuci> & { modelo: 'tuuci' })
  notas?: string
}

const SEMILLAS: Semilla[] = [
  { id: 'PED-2609', empresaIdx: 0,  cliente: 'Familia Etchegoyen', direccion: 'Barrio El Golf, lote 212', ciudad: 'Pilar',          fecha: '2026-09-22T13:40:00Z', estado: 'nuevo',        cfg: { length: 20, projection: 14, postCount: 6, cladding: 'louvered', finish: 'anthracite', led: true, fan: true }, notas: 'El cliente quiere la entrega antes del 15/10.' },
  { id: 'PED-2608', empresaIdx: 9,  cliente: 'Brickell Roof Club',  direccion: '1200 Brickell Ave, rooftop', ciudad: 'Miami',        fecha: '2026-09-21T16:10:00Z', estado: 'nuevo',        cfg: { length: 28, projection: 16, postCount: 6, cladding: 'panel', finish: 'white', led: true, heater: true, wallSides: 2, wallType: 'glass' } },
  { id: 'PED-2607', empresaIdx: 4,  cliente: 'Hotel Bahía Serena',  direccion: 'Paseo Marítimo 44',        ciudad: 'Málaga',        fecha: '2026-09-20T10:25:00Z', estado: 'preparacion', cfg: { modelo: 'tuuci', sub: 'maxSolanox', size: 12, wood: 'teak', canopy: 'sand', curtains: true, cushions: true }, notas: 'Seis unidades iguales para el área de piscina (este pedido es la primera).' },
  { id: 'PED-2606', empresaIdx: 2,  cliente: 'Residencia Klein',    direccion: 'La Barra, ruta 10 km 161', ciudad: 'Punta del Este',fecha: '2026-09-18T09:00:00Z', estado: 'preparacion', cfg: { modelo: 'tuuci', sub: 'lulu', size: 8, wood: 'driftwood', canopy: 'white', cushions: true } },
  { id: 'PED-2605', empresaIdx: 1,  cliente: 'Quinta Los Robles',   direccion: 'Ruta 26 km 8, Country',    ciudad: 'Tigre',         fecha: '2026-09-16T15:30:00Z', estado: 'enviado',     cfg: { length: 14, projection: 12, postCount: 4, cladding: 'louvered', finish: 'charcoal', rainSensor: true } },
  { id: 'PED-2604', empresaIdx: 6,  cliente: 'Pousada Praia Mole',  direccion: 'Rod. Jornalista M. Lehmkuhl 900', ciudad: 'Florianópolis', fecha: '2026-09-15T11:45:00Z', estado: 'enviado', cfg: { modelo: 'tuuci', sub: 'pergola', size: 12, wood: 'walnut', canopy: 'stripe', curtains: true } },
  { id: 'PED-2603', empresaIdx: 5,  cliente: 'Casa Marconi',        direccion: 'Bv. Oroño 2280',           ciudad: 'Rosario',       fecha: '2026-09-12T14:05:00Z', estado: 'enviado',     cfg: { length: 12, projection: 10, postCount: 4, cladding: 'panel', finish: 'bronze' } },
  { id: 'PED-2602', empresaIdx: 8,  cliente: 'Club Náutico Sur',    direccion: 'Av. Costanera 1500',       ciudad: 'Córdoba',       fecha: '2026-09-10T08:20:00Z', estado: 'enviado',     cfg: { length: 32, projection: 16, postCount: 6, cladding: 'louvered', finish: 'anthracite', led: true, fan: true, heater: true } },
  { id: 'PED-2601', empresaIdx: 14, cliente: 'Familia Navarro',     direccion: 'Calle 47 nº 1180',         ciudad: 'La Plata',      fecha: '2026-09-08T17:10:00Z', estado: 'enviado',     cfg: { length: 10, projection: 10, postCount: 4, cladding: 'open', finish: 'white' } },
  { id: 'PED-2600', empresaIdx: 3,  cliente: 'Edificio Alto Lomas', direccion: 'Camino El Alba 9500',      ciudad: 'Santiago',      fecha: '2026-09-05T12:35:00Z', estado: 'enviado',     cfg: { length: 24, projection: 14, postCount: 6, cladding: 'panel', finish: 'charcoal', wallSides: 3, wallType: 'louver' } },
  { id: 'PED-2599', empresaIdx: 9,  cliente: 'Key Biscayne Villa',  direccion: '455 Ocean Dr',             ciudad: 'Miami',         fecha: '2026-08-29T10:00:00Z', estado: 'enviado',     cfg: { modelo: 'tuuci', sub: 'maxSolanox', size: 14, wood: 'ipe', canopy: 'blue', curtains: true, cushions: true } },
  { id: 'PED-2598', empresaIdx: 0,  cliente: 'Restaurante La Huerta',direccion: 'Av. del Libertador 15200',ciudad: 'San Isidro',    fecha: '2026-08-24T16:40:00Z', estado: 'enviado',     cfg: { length: 26, projection: 12, postCount: 6, cladding: 'louvered', finish: 'charcoal', heater: true, led: true } },
  { id: 'PED-2597', empresaIdx: 7,  cliente: 'Villa Serrat',        direccion: 'Partida Benimaclet 12',    ciudad: 'Valencia',      fecha: '2026-08-18T09:15:00Z', estado: 'enviado',     cfg: { length: 16, projection: 12, postCount: 4, cladding: 'panel', finish: 'white', wallSides: 1, wallType: 'glass' } },
  { id: 'PED-2596', empresaIdx: 4,  cliente: 'Beach Club Marbella', direccion: 'Ctra. Cádiz km 178',       ciudad: 'Marbella',      fecha: '2026-08-11T13:55:00Z', estado: 'enviado',     cfg: { modelo: 'tuuci', sub: 'lulu', size: 8, wood: 'teak', canopy: 'sand', cushions: true } },
  { id: 'PED-2595', empresaIdx: 2,  cliente: 'Estancia Los Ceibos', direccion: 'Camino de los Horneros',   ciudad: 'Maldonado',     fecha: '2026-07-30T11:20:00Z', estado: 'enviado',     cfg: { length: 18, projection: 14, postCount: 4, cladding: 'louvered', finish: 'bronze', rainSensor: true } },
  { id: 'PED-2594', empresaIdx: 5,  cliente: 'Casa Del Prado',      direccion: 'Roca 340',                 ciudad: 'Rosario',       fecha: '2026-07-21T15:05:00Z', estado: 'enviado',     cfg: { modelo: 'tuuci', sub: 'pergola', size: 10, wood: 'mahogany', canopy: 'white' } },
  { id: 'PED-2593', empresaIdx: 1,  cliente: 'Barrio Santa Bárbara',direccion: 'Lote 88, Santa Bárbara',   ciudad: 'Tigre',         fecha: '2026-07-09T08:45:00Z', estado: 'enviado',     cfg: { length: 14, projection: 10, postCount: 4, cladding: 'panel', finish: 'anthracite' } },
  { id: 'PED-2592', empresaIdx: 10, cliente: 'Hostería Playa Grande',direccion: 'Viamonte 2100',           ciudad: 'Mar del Plata', fecha: '2026-06-25T10:30:00Z', estado: 'enviado',     cfg: { length: 20, projection: 12, postCount: 6, cladding: 'louvered', finish: 'white', led: true } },
  { id: 'PED-2591', empresaIdx: 11, cliente: 'Condominio Reñaca',   direccion: 'Av. Borgoño 15400',        ciudad: 'Viña del Mar',  fecha: '2026-06-12T14:10:00Z', estado: 'enviado',     cfg: { modelo: 'tuuci', sub: 'pergola', size: 12, wood: 'ash', canopy: 'blue', curtains: true } },
  { id: 'PED-2590', empresaIdx: 8,  cliente: 'Casa Ortiz',          direccion: 'Manuel Belgrano 455',      ciudad: 'Córdoba',       fecha: '2026-05-28T09:35:00Z', estado: 'enviado',     cfg: { length: 12, projection: 10, postCount: 4, cladding: 'open', finish: 'charcoal' } },
]

function construirPedido(s: Semilla): Pedido {
  const emp = EMPRESAS_MOCK[s.empresaIdx]
  const cfg =
    (s.cfg as { modelo?: string }).modelo === 'tuuci'
      ? ({ ...DEFAULT_TUUCI, ...(s.cfg as Partial<ConfigTuuci>) } as ConfigTuuci)
      : ({ ...DEFAULT_SOLSTICE, ...(s.cfg as Partial<ConfigSolstice>) } as ConfigSolstice)
  const items = calcularDespiece(cfg)
  return {
    id: s.id,
    empresa: emp.nombre,
    contacto: emp.contacto,
    email: emp.email,
    telefono: emp.telefono,
    clienteFinal: s.cliente,
    direccion: s.direccion,
    ciudad: s.ciudad,
    notas: s.notas ?? '',
    modelo: cfg.modelo,
    resumenConfig: resumirConfig(cfg),
    items,
    totalRef: totalDespiece(items),
    fecha: s.fecha,
    estado: s.estado,
  }
}

export const PEDIDOS_MOCK: Pedido[] = SEMILLAS.map(construirPedido)

/* ──────────────────────────────────────────────────────────────────────────
   Series para los gráficos del dashboard
   ────────────────────────────────────────────────────────────────────────── */

export const PEDIDOS_POR_MES: PuntoMes[] = [
  { mes: '2025-10', pedidos: 14 },
  { mes: '2025-11', pedidos: 17 },
  { mes: '2025-12', pedidos: 11 },
  { mes: '2026-01', pedidos: 9 },
  { mes: '2026-02', pedidos: 13 },
  { mes: '2026-03', pedidos: 19 },
  { mes: '2026-04', pedidos: 22 },
  { mes: '2026-05', pedidos: 26 },
  { mes: '2026-06', pedidos: 24 },
  { mes: '2026-07', pedidos: 29 },
  { mes: '2026-08', pedidos: 33 },
  { mes: '2026-09', pedidos: 38 },
]

export const TOP_MATERIALES: TopMaterial[] = [
  { nombre: 'Lama orientable 200 mm', nombreEn: 'Adjustable louver 200 mm', cantidad: 1840 },
  { nombre: 'Viga perimetral 160×80', nombreEn: 'Perimeter beam 160×80', cantidad: 1270 },
  { nombre: 'Poste aluminio 100×100', nombreEn: 'Aluminum post 100×100', cantidad: 612 },
  { nombre: 'Tira LED perimetral', nombreEn: 'Perimeter LED strip', cantidad: 498 },
  { nombre: 'Kit de anclaje a piso', nombreEn: 'Floor anchor kit', cantidad: 431 },
  { nombre: 'Paño de vidrio templado', nombreEn: 'Tempered glass panel', cantidad: 286 },
]
