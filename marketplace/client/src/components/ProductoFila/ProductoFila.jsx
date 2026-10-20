import ProductoAcciones from '../ProductoAcciones/ProductoAcciones'
import EstadoBadge from '../EstadoBadge/EstadoBadge'
import { estadoPublicacion, formatoPrecio } from '../../utils/formato'
import { rangoTalles, stockDisponibleTotal } from '../../utils/talles'
import './ProductoFila.css'

// Una publicación en la tabla de Mis productos
const ProductoFila = ({ producto, ocupado, onEditar, onCambiarActivo }) => {
  const imagen = producto.imagenes && producto.imagenes[0]

  return (
    <tr>
      <td>
        <div className="producto-fila-producto">
          <div className="panel-miniatura">
            {imagen
              ? <img src={imagen} alt="" />
              : <span className="material-symbols-outlined" aria-hidden="true">image</span>}
          </div>
          <div>
            <p className="producto-fila-nombre">{producto.nombre}</p>
            {producto.descripcion && <p className="producto-fila-descripcion">{producto.descripcion}</p>}
          </div>
        </div>
      </td>
      <td>{producto.sku || '—'}</td>
      <td>{producto.categoria || 'Sin categoría'}</td>
      <td>{rangoTalles(producto.talles)}</td>
      <td>{formatoPrecio(producto.precio)}</td>
      <td>{stockDisponibleTotal(producto.talles)}</td>
      <td><EstadoBadge estado={estadoPublicacion(producto)} /></td>
      <td>
        <ProductoAcciones producto={producto} ocupado={ocupado} onEditar={onEditar} onCambiarActivo={onCambiarActivo} />
      </td>
    </tr>
  )
}

export default ProductoFila