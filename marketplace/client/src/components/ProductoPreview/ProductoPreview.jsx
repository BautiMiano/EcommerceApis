import { useEffect, useMemo } from 'react'
import { formatoPrecio, precioConDescuento } from '../../utils/formato'
import { MODO_UNICO, stockTotalFormulario } from '../../utils/productoFormulario'
import { TALLES_SELECCIONABLES } from '../../utils/talles'
import './ProductoPreview.css'

// Cómo se va a ver la publicación, armada con lo que el vendedor va cargando en el formulario.
// "imagenUrl" es la primera foto ya subida; si no hay, se usa la primera foto nueva ("archivo").
const ProductoPreview = ({ formulario, categorias, imagenUrl, archivo }) => {
  const urlArchivo = useMemo(() => (archivo ? URL.createObjectURL(archivo) : null), [archivo])

  useEffect(() => () => {
    if (urlArchivo) {
      URL.revokeObjectURL(urlArchivo)
    }
  }, [urlArchivo])

  const imagen = imagenUrl || urlArchivo
  const categoria = categorias.find((c) => String(c.idCategoria) === formulario.categoryId)
  const descuento = Number(formulario.descuento) || 0
  const stock = stockTotalFormulario(formulario)
  const talles = formulario.modoTalle === MODO_UNICO
    ? 'Único'
    : TALLES_SELECCIONABLES.filter((talle) => talle in formulario.stocks).join(', ')

  return (
    <section className="panel-tarjeta producto-preview">
      <h2 className="panel-tarjeta-titulo">VISTA PREVIA DE LA PUBLICACIÓN</h2>
      <p className="panel-tarjeta-subtitulo">Así se verá tu producto en UNIFORMA.</p>

      <div className="producto-preview-card">
        <div className="producto-preview-imagen">
          {imagen
            ? <img src={imagen} alt="" />
            : <span className="material-symbols-outlined" aria-hidden="true">image</span>}
          <span className="producto-preview-favorito" aria-hidden="true">
            <span className="material-symbols-outlined">favorite</span>
          </span>
        </div>

        <div className="producto-preview-datos">
          <p className="producto-preview-nombre">{formulario.nombre || 'Nombre del producto'}</p>
          {categoria && <p className="producto-preview-suave">{categoria.nombreCategoria}</p>}
          {formulario.marca && <p className="producto-preview-suave">Marca: {formulario.marca}</p>}
          {talles && <p className="producto-preview-suave">Talles: {talles}</p>}

          <div className="producto-preview-precio">
            <strong>{formatoPrecio(precioConDescuento(formulario.precio || 0, descuento))}</strong>
            {descuento > 0 && (
              <>
                <s>{formatoPrecio(formulario.precio || 0)}</s>
                <span className="producto-preview-off">{descuento}% OFF</span>
              </>
            )}
          </div>

          <p className={'producto-preview-stock ' + (stock > 0 ? '' : 'producto-preview-sin-stock')}>
            {stock > 0 ? `Stock: ${stock} unidades` : 'Sin stock'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProductoPreview
