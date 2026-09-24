export const WHATSAPP_NUMERO = '5491139375146'

const BASE_TXT =
  'Hola, quiero pedir los materiales de una pérgola configurada en el sistema'

/** Link de WhatsApp del proveedor, opcionalmente con el resumen del pedido. */
export function whatsappUrl(resumen?: string) {
  const texto = resumen ? `${BASE_TXT}.\n\n${resumen}` : `${BASE_TXT}.`
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`
}

export function whatsappConsulta() {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
    'Hola, tengo una consulta sobre el configurador 3D de pérgolas.',
  )}`
}
