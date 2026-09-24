import type { Rol } from '@/types'

export interface ModuloPropuesta {
  /** Número que se muestra y con el que se indexa el resaltado al volver. */
  n: number
  nombreKey: string
  descKey: string
  bulletKeys: string[]
  /** Rol necesario para ver este módulo en la app. */
  rol: Rol
  /** Ruta real del módulo dentro del demo. */
  ruta: string
}

export const MODULOS: ModuloPropuesta[] = [
  {
    n: 1,
    nombreKey: 'prop.m1.name',
    descKey: 'prop.m1.desc',
    bulletKeys: ['prop.m1.b1', 'prop.m1.b2', 'prop.m1.b3', 'prop.m1.b4'],
    rol: 'config',
    ruta: '/configurador/solstice',
  },
  {
    n: 2,
    nombreKey: 'prop.m2.name',
    descKey: 'prop.m2.desc',
    bulletKeys: ['prop.m2.b1', 'prop.m2.b2', 'prop.m2.b3', 'prop.m2.b4'],
    rol: 'config',
    ruta: '/configurador/tuuci',
  },
  {
    n: 3,
    nombreKey: 'prop.m3.name',
    descKey: 'prop.m3.desc',
    bulletKeys: ['prop.m3.b1', 'prop.m3.b2', 'prop.m3.b3', 'prop.m3.b4'],
    rol: 'config',
    ruta: '/despiece?m=solstice',
  },
  {
    n: 4,
    nombreKey: 'prop.m4.name',
    descKey: 'prop.m4.desc',
    bulletKeys: ['prop.m4.b1', 'prop.m4.b2', 'prop.m4.b3', 'prop.m4.b4'],
    rol: 'config',
    ruta: '/configurador/imagen-realista?m=solstice',
  },
  {
    n: 5,
    nombreKey: 'prop.m5.name',
    descKey: 'prop.m5.desc',
    bulletKeys: ['prop.m5.b1', 'prop.m5.b2', 'prop.m5.b3', 'prop.m5.b4'],
    rol: 'config',
    ruta: '/despiece?m=solstice&pedido=1',
  },
  {
    n: 6,
    nombreKey: 'prop.m6.name',
    descKey: 'prop.m6.desc',
    bulletKeys: ['prop.m6.b1', 'prop.m6.b2', 'prop.m6.b3', 'prop.m6.b4'],
    rol: 'admin',
    ruta: '/admin/pedidos',
  },
  {
    n: 7,
    nombreKey: 'prop.m7.name',
    descKey: 'prop.m7.desc',
    bulletKeys: ['prop.m7.b1', 'prop.m7.b2', 'prop.m7.b3', 'prop.m7.b4'],
    rol: 'admin',
    ruta: '/admin/empresas',
  },
]

/** Los cinco pasos del circuito comercial. */
export const PASOS = ['prop.step1', 'prop.step2', 'prop.step3', 'prop.step4', 'prop.step5'] as const

/** El paso del despiece es el que se resalta con el acento. */
export const PASO_DESTACADO = 4

export const INVERSION = {
  total: 14500,
  descuentoPct: 15,
  get totalConDescuento() {
    return Math.round(this.total * (1 - this.descuentoPct / 100))
  },
}

export const WHATSAPP_PROPUESTA =
  'https://wa.me/5491139375146?text=Vi%20el%20demo%20del%20configurador%20de%20p%C3%A9rgolas%2C%20quiero%20avanzar!'
