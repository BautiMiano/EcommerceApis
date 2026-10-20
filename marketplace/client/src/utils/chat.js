// Textos del chat según el rol. Las sugerencias usan lo que Uni puede hacer para cada rol.
const SALUDOS = {
  COMPRADOR: '¡Hola! Soy Uni. Te ayudo a encontrar uniformes, revisar tu carrito o seguir tus pedidos. ¿Qué necesitás?',
  VENDEDOR: '¡Hola! Soy Uni. Te ayudo con tus publicaciones, tus ventas y tus tickets de soporte. ¿En qué te doy una mano?',
}

const SUGERENCIAS = {
  COMPRADOR: [
    '¿Qué categorías hay?',
    'Busco uniformes escolares',
    '¿Qué tengo en el carrito?',
    '¿Cómo van mis pedidos?',
  ],
  VENDEDOR: [
    '¿Cuáles son mis productos?',
    '¿Cómo vienen mis ventas?',
    '¿Qué productos tienen poco stock?',
    '¿Cómo están mis tickets?',
  ],
}

export const saludoPorRol = (rol) => SALUDOS[rol] || SALUDOS.COMPRADOR

export const sugerenciasPorRol = (rol) => SUGERENCIAS[rol] || []