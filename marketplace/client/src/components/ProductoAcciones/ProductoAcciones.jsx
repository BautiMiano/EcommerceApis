const ProductoAcciones = ({
  producto,
  accionEnCurso,
  cantidadStock,
  onCantidadStockChange,
  onEditar,
  onCambiarActivo,
  onAgregarStock,
}) => {
  const ocupado = Boolean(accionEnCurso)

  return (
    <div className="producto-acciones">
      <button type="button" onClick={onEditar} disabled={ocupado}>
        Editar
      </button>
      <button type="button" onClick={onCambiarActivo} disabled={ocupado}>
        {producto.activo ? 'Desactivar' : 'Activar'}
      </button>
      <div className="producto-stock-action">
        <label htmlFor={`stock-${producto.id}`}>Agregar unidades</label>
        <div>
          <input
            id={`stock-${producto.id}`}
            type="number"
            min="1"
            step="1"
            value={cantidadStock}
            onChange={(event) => onCantidadStockChange(event.target.value)}
            disabled={ocupado}
          />
          <button type="button" onClick={onAgregarStock} disabled={ocupado}>
            Sumar
          </button>
        </div>
      </div>
      {accionEnCurso && <small className="mis-productos-ayuda">Procesando...</small>}
    </div>
  )
}

export default ProductoAcciones
