/* ──────────────────────────────────────────────────────────────────────────
   Tipos del dominio. Modelados como si vinieran de la API real del proveedor.
   ────────────────────────────────────────────────────────────────────────── */

export type Rol = 'config' | 'admin'

export interface Sesion {
  rol: Rol
  usuario: string
  empresa: string
}

export type ModeloPergola = 'solstice' | 'tuuci'

/* ── Solstice ─────────────────────────────────────────────────────────────── */

export type AcabadoSolstice = 'charcoal' | 'white' | 'bronze' | 'anthracite'
export type EstiloPoste = 'square' | 'slim' | 'round'
export type Anclaje = 'floor' | 'wall'
export type TipoPared = 'glass' | 'louver' | 'solid'
export type Cladding = 'louvered' | 'panel' | 'open'

export interface ConfigSolstice {
  modelo: 'solstice'
  /** pies */
  length: number
  projection: number
  height: number
  sideOH: number
  frontOH: number
  postCount: 2 | 4 | 6
  postStyle: EstiloPoste
  anchor: Anclaje
  wallSides: 0 | 1 | 2 | 3
  wallType: TipoPared
  cladding: Cladding
  louverAngle: number
  led: boolean
  fan: boolean
  heater: boolean
  rainSensor: boolean
  finish: AcabadoSolstice
}

/* ── Tuuci ────────────────────────────────────────────────────────────────── */

export type SubModeloTuuci = 'maxSolanox' | 'pergola' | 'lulu'
export type AcabadoMadera = 'teak' | 'walnut' | 'ipe' | 'ash' | 'mahogany' | 'driftwood'
export type ColorCanopy = 'white' | 'sand' | 'blue' | 'stripe'

export interface ConfigTuuci {
  modelo: 'tuuci'
  sub: SubModeloTuuci
  /** pies (lado) */
  size: number
  wood: AcabadoMadera
  canopy: ColorCanopy
  curtains: boolean
  cushions: boolean
}

export type Config = ConfigSolstice | ConfigTuuci

/* ── Despiece ─────────────────────────────────────────────────────────────── */

export type GrupoDespiece = 'structure' | 'roof' | 'walls' | 'addons' | 'hardware' | 'textile'
export type Unidad = 'u' | 'ml' | 'm2' | 'kit' | 'jgo'

export interface ItemDespiece {
  sku: string
  descripcion: string
  descripcionEn: string
  cantidad: number
  unidad: Unidad
  precioRef: number
  grupo: GrupoDespiece
}

/* ── Pedidos y empresas ───────────────────────────────────────────────────── */

export type EstadoPedido = 'nuevo' | 'preparacion' | 'enviado'

export interface Pedido {
  id: string
  empresa: string
  contacto: string
  email: string
  telefono: string
  clienteFinal: string
  direccion: string
  ciudad: string
  notas: string
  modelo: ModeloPergola
  resumenConfig: string
  items: ItemDespiece[]
  totalRef: number
  fecha: string
  estado: EstadoPedido
  /** true cuando el pedido se generó durante esta demo */
  deSesion?: boolean
}

export type EstadoEmpresa = 'activo' | 'inactivo'
export type PlanEmpresa = 'Starter' | 'Pro' | 'Enterprise'

export interface Empresa {
  id: string
  nombre: string
  contacto: string
  email: string
  telefono: string
  region: string
  estado: EstadoEmpresa
  plan: PlanEmpresa
  ultimoAcceso: string
  cantidadPedidos: number
  desde: string
}

export interface KPI {
  key: string
  valor: string | number
  delta?: number
  sufijo?: string
}

export interface PuntoMes {
  mes: string
  pedidos: number
}

export interface TopMaterial {
  nombre: string
  nombreEn: string
  cantidad: number
}
