import './ProductoAcciones.css'

// Editar y activar/desactivar (baja lógica: la publicación no se borra)
const ProductoAcciones = ({ producto, ocupado, onEditar, onCambiarActivo }) => {
  return (
    <div className="producto-acciones">
      <button type="button" className="panel-boton panel-boton-secundario panel-boton-chico" onClick={onEditar} disabled={ocupado}>
        Editar
      </button>
      <button type="button" className="panel-boton panel-boton-secundario panel-boton-chico" onClick={onCambiarActivo} disabled={ocupado}>
        {producto.activo ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  )
}

export default ProductoAcciones
