// Datos de la tarjeta que carga el comprador al pagar con tarjeta.
// Se validan en el front y NO se mandan al back: por seguridad, un número de tarjeta nunca se guarda
// en nuestra base (eso lo hace una pasarela de pago). Al back solo va el método de pago elegido.

export const METODO_TARJETA = 'TARJETA'

export const tarjetaVacia = { numero: '', titular: '', vencimiento: '', cvv: '' }

export const soloDigitos = (texto) => texto.replace(/\D/g, '')

// Marca según los primeros números (rangos públicos de cada red)
export const marcaTarjeta = (numero) => {
  const digitos = soloDigitos(numero)
  if (/^3[47]/.test(digitos)) return 'AMEX'
  if (/^4/.test(digitos)) return 'VISA'
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digitos)) return 'MASTERCARD'
  return ''
}

const largoNumero = (marca) => (marca === 'AMEX' ? 15 : 16)
export const largoCvv = (marca) => (marca === 'AMEX' ? 4 : 3)

// "4111111111111111" → "4111 1111 1111 1111" (AMEX: 4-6-5)
export const formatearNumero = (texto) => {
  const marca = marcaTarjeta(texto)
  const digitos = soloDigitos(texto).slice(0, largoNumero(marca))
  const grupos = marca === 'AMEX'
    ? [digitos.slice(0, 4), digitos.slice(4, 10), digitos.slice(10)]
    : digitos.match(/.{1,4}/g) || []
  return grupos.filter(Boolean).join(' ')
}

// "1228" → "12/28"
export const formatearVencimiento = (texto) => {
  const digitos = soloDigitos(texto).slice(0, 4)
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos
}

export const formatearTitular = (texto) => texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ' ]/g, '').toUpperCase().slice(0, 26)

// Algoritmo de Luhn: el dígito verificador que tienen todas las tarjetas
const pasaLuhn = (digitos) => {
  const suma = digitos.split('').reverse().reduce((total, caracter, indice) => {
    const valor = Number(caracter) * (indice % 2 === 1 ? 2 : 1)
    return total + (valor > 9 ? valor - 9 : valor)
  }, 0)
  return suma % 10 === 0
}

const vencimientoValido = (vencimiento) => {
  const [mes, anio] = vencimiento.split('/').map(Number)
  if (!mes || anio === undefined || Number.isNaN(anio) || vencimiento.length !== 5 || mes < 1 || mes > 12) {
    return false
  }
  // Vence el último día de ese mes
  const finDelMes = new Date(2000 + anio, mes, 1)
  return finDelMes > new Date()
}

// Errores por campo ({} si está todo bien)
export const validarTarjeta = (tarjeta) => {
  const errores = {}
  const marca = marcaTarjeta(tarjeta.numero)
  const digitos = soloDigitos(tarjeta.numero)

  if (digitos.length !== largoNumero(marca) || !pasaLuhn(digitos)) {
    errores.numero = 'Revisá el número de la tarjeta.'
  }
  if (tarjeta.titular.trim().length < 3) {
    errores.titular = 'Ingresá el nombre como figura en la tarjeta.'
  }
  if (!vencimientoValido(tarjeta.vencimiento)) {
    errores.vencimiento = 'Ingresá un vencimiento válido (MM/AA).'
  }
  if (soloDigitos(tarjeta.cvv).length !== largoCvv(marca)) {
    errores.cvv = `El código tiene ${largoCvv(marca)} números.`
  }
  return errores
}
