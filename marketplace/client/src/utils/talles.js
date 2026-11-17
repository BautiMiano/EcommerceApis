export const TALLES_SELECCIONABLES = ['S', 'M', 'L', 'XL', 'XXL']
export const TALLE_UNICO = 'UNICO'

export const etiquetaTalle = (talle) => (talle === TALLE_UNICO ? 'Único' : talle)

export const stockDisponibleDe = (talle) => talle.stock - (talle.stockReservado || 0)

export const textoTalles = (talles = []) => talles.map((t) => etiquetaTalle(t.talle)).join(', ')

export const rangoTalles = (talles = []) => {
  if (talles.length === 0) {
    return '—'
  }
  if (talles[0].talle === TALLE_UNICO) {
    return 'Talle único'
  }
  return talles.length === 1 ? talles[0].talle : `${talles[0].talle} a ${talles[talles.length - 1].talle}`
}

export const talleUnicoDe = (talles = []) => (talles.length === 1 ? talles[0].talle : null)

export const STOCK_BAJO = 5

export const stockDisponibleTotal = (talles = []) =>
  talles.reduce((total, t) => total + stockDisponibleDe(t), 0)

export const nivelStock = (talles = []) => {
  if (stockDisponibleTotal(talles) === 0) {
    return 'agotado'
  }
  return talles.some((t) => stockDisponibleDe(t) <= STOCK_BAJO) ? 'bajo' : 'ok'
}
