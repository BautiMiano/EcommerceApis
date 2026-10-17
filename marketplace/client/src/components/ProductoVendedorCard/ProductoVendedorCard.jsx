import ProductoAcciones from '../ProductoAcciones/ProductoAcciones'

const ProductoVendedorCard = ({
  producto,
  categoria,
  accionEnCurso,
  cantidadStock,
  onCantidadStockChange,
  onEditar,
  onCambiarActivo,
  onAgregarStock,
}) => {
  const imagen = producto.imagenes?.find((imagenActual) => imagenActual)

  return (
    <article className="producto-vendedor-card">
      <div className="producto-vendedor-imagen">
        {imagen ? (
          <img src={imagen} alt={producto.nombre} />
        ) : (
          <span>Sin fotografía</span>
        )}
      </div>

      <div className="producto-vendedor-contenido">
        <div className="producto-vendedor-cabecera">
          <div>
            <p className="producto-vendedor-categoria">{categoria || 'Categoría no disponible'}</p>
            <h2>{producto.nombre}</h2>
          </div>
          <span className={`producto-estado ${producto.activo ? 'producto-estado-activo' : 'producto-estado-inactivo'}`}>
            {producto.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <p className="producto-vendedor-descripcion">
          {producto.descripcion || 'Sin descripción'}
        </p>

        <div className="producto-vendedor-datos">
          <span>Precio <strong>${producto.precio}</strong></span>
          <span>Talle <strong>{producto.talle || 'No informado'}</strong></span>
          <span>Stock <strong>{producto.stock}</strong></span>
        </div>

        <ProductoAcciones
          producto={producto}
          accionEnCurso={accionEnCurso}
          cantidadStock={cantidadStock}
          onCantidadStockChange={onCantidadStockChange}
          onEditar={onEditar}
          onCambiarActivo={onCambiarActivo}
          onAgregarStock={onAgregarStock}
        />
      </div>
    </article>
  )
}

export default ProductoVendedorCard
