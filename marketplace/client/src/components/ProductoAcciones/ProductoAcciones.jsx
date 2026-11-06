import { obtenerSesion } from '../../utils/sesion'
import './ProductoAcciones.css'

// Editar y activar/desactivar (baja lógica: la publicación no se borra)
const ProductoAcciones = ({ producto, ocupado, onEditar, onCambiarActivo }) => {
  const { rol } = obtenerSesion()
  // Si lo desactivó el admin, solo el admin lo puede reactivar
  const bloqueado = producto.desactivadoPorAdmin && rol !== 'ADMIN'

  return (
    <div className="producto-acciones">
      <button type="button" className="panel-boton panel-boton-secundario panel-boton-chico" onClick={onEditar} disabled={ocupado}>
        Editar
      </button>
      <button
        type="button"
        className="panel-boton panel-boton-secundario panel-boton-chico"
        onClick={onCambiarActivo}
        disabled={ocupado || bloqueado}
        title={bloqueado ? 'Lo desactivó el administrador. Si creés que es un error, abrí un ticket de soporte.' : undefined}
      >
        {producto.activo ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  )
}

export default ProductoAcciones
