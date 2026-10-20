// Lógica compartida entre Publicar producto y Editar producto.
import { TALLES_SELECCIONABLES, TALLE_UNICO } from './talles'
import { activarProducto, asignarDescuento, crearDescuento, desactivarProducto, quitarDescuento } from './api'

export const MODO_SELECCIONABLES = 'SELECCIONABLES'
export const MODO_UNICO = 'UNICO'

// Límite por defecto de Spring Boot para cada archivo subido (1 MB).
export const TAMANIO_MAXIMO_IMAGEN = 1024 * 1024

// "stocks" guarda solo los talles elegidos: { S: '5', M: '3' }
export const formularioVacio = {
  nombre: '',
  descripcion: '',
  categoryId: '',
  marca: '',
  sku: '',
  estado: '',
  precio: '',
  descuento: '',
  activo: 'ACTIVO',
  modoTalle: MODO_SELECCIONABLES,
  stocks: {},
  stockUnico: '',
}

export const formularioDesdeProducto = (producto) => {
  const talles = producto.talles || []
  const esUnico = talles.some((t) => t.talle === TALLE_UNICO)

  return {
    nombre: producto.nombre || '',
    descripcion: producto.descripcion || '',
    categoryId: producto.categoryId ? String(producto.categoryId) : '',
    marca: producto.marca || '',
    sku: producto.sku || '',
    estado: producto.estado || '',
    precio: producto.precio ?? '',
    descuento: producto.descuentoPorcentaje ? String(producto.descuentoPorcentaje) : '',
    activo: producto.activo ? 'ACTIVO' : 'INACTIVO',
    modoTalle: esUnico ? MODO_UNICO : MODO_SELECCIONABLES,
    stocks: esUnico ? {} : Object.fromEntries(talles.map((t) => [t.talle, String(t.stock)])),
    stockUnico: esUnico ? String(talles[0].stock) : '',
  }
}

const esStockValido = (valor) => valor !== '' && Number.isInteger(Number(valor)) && Number(valor) >= 0

// Stock total que se muestra en "Precio y stock"
export const stockTotalFormulario = (formulario) => (formulario.modoTalle === MODO_UNICO
  ? Number(formulario.stockUnico) || 0
  : Object.values(formulario.stocks).reduce((total, stock) => total + (Number(stock) || 0), 0))

export const validarFormulario = (formulario) => {
  const errores = {}
  const precio = Number(formulario.precio)
  const descuento = Number(formulario.descuento)

  if (!formulario.nombre.trim()) {
    errores.nombre = 'Ingresá el nombre del producto.'
  }
  if (!formulario.categoryId) {
    errores.categoryId = 'Seleccioná una categoría.'
  }
  if (!formulario.descripcion.trim()) {
    errores.descripcion = 'Ingresá una descripción.'
  }
  if (!formulario.sku.trim()) {
    errores.sku = 'Ingresá el SKU (código interno del producto).'
  }
  if (!formulario.estado) {
    errores.estado = 'Seleccioná si el producto es nuevo o usado.'
  }
  if (formulario.precio === '' || Number.isNaN(precio) || precio < 0) {
    errores.precio = 'Ingresá un precio válido mayor o igual a cero.'
  }
  if (formulario.descuento !== '' && (!Number.isInteger(descuento) || descuento < 1 || descuento > 99)) {
    errores.descuento = 'El descuento va de 1 a 99 %.'
  }

  if (formulario.modoTalle === MODO_UNICO) {
    if (!esStockValido(formulario.stockUnico)) {
      errores.talles = 'Ingresá un stock entero mayor o igual a cero.'
    }
  } else {
    const elegidos = Object.entries(formulario.stocks)
    if (elegidos.length === 0) {
      errores.talles = 'Elegí al menos un talle, o usá la opción de talle único.'
    } else if (elegidos.some(([, stock]) => !esStockValido(stock))) {
      errores.talles = 'Cada talle elegido necesita un stock entero mayor o igual a cero.'
    }
  }

  return errores
}

// Arma el cuerpo de POST /productos y PUT /productos/{id}
export const armarProductoRequest = (formulario) => ({
  nombre: formulario.nombre.trim(),
  descripcion: formulario.descripcion.trim(),
  categoryId: Number(formulario.categoryId),
  marca: formulario.marca.trim(),
  sku: formulario.sku.trim(),
  estado: formulario.estado,
  precio: Number(formulario.precio),
  talles: formulario.modoTalle === MODO_UNICO
    ? [{ talle: TALLE_UNICO, stock: Number(formulario.stockUnico) }]
    : TALLES_SELECCIONABLES
      .filter((talle) => talle in formulario.stocks)
      .map((talle) => ({ talle, stock: Number(formulario.stocks[talle]) })),
})

// Descuento y estado de publicación se guardan con sus propios endpoints, después del producto.
// "anterior" es el producto antes de guardar (al publicar: sin descuento y activo).
export const guardarDescuentoYEstado = async (productoId, formulario, anterior, esAdmin = false) => {
  const descuentoNuevo = Number(formulario.descuento) || null
  const descuentoAnterior = anterior.descuentoPorcentaje || null

  // Un descuento que puso un admin no lo puede tocar el vendedor
  const puedeCambiarDescuento = esAdmin || !anterior.descuentoAplicadoPorAdmin
  if (puedeCambiarDescuento && descuentoNuevo !== descuentoAnterior) {
    if (descuentoAnterior) {
      await quitarDescuento(productoId)
    }
    if (descuentoNuevo) {
      const descuento = await crearDescuento(descuentoNuevo)
      await asignarDescuento(descuento.idDescuento, productoId)
    }
  }

  const activoNuevo = formulario.activo === 'ACTIVO'
  if (activoNuevo !== anterior.activo) {
    await (activoNuevo ? activarProducto(productoId) : desactivarProducto(productoId))
  }
}

export const esImagenValida = (archivo) =>
  archivo.type.startsWith('image/') && archivo.size <= TAMANIO_MAXIMO_IMAGEN

export const motivoImagenInvalida = (archivo) =>
  archivo.type.startsWith('image/') ? 'supera el máximo de 1 MB' : 'no es una imagen'
