import CampoFormulario from '../CampoFormulario/CampoFormulario'
import CategoriaSelect from '../CategoriaSelect/CategoriaSelect'

const ProductoForm = ({
  formulario,
  categorias,
  errores,
  onChange,
  onSubmit,
  cargandoCategorias,
  publicando,
  children,
}) => {
  return (
    <form className="publicacion-form" onSubmit={onSubmit} noValidate>
      <section className="publicacion-section">
        <h2>Información del producto</h2>

        <CampoFormulario
          label="Nombre *"
          name="nombre"
          value={formulario.nombre}
          onChange={onChange}
          error={errores.nombre}
        />

        <CampoFormulario
          label="Descripción"
          name="descripcion"
          type="textarea"
          rows="4"
          value={formulario.descripcion}
          onChange={onChange}
        />

        <CampoFormulario
          label="Talle"
          name="talle"
          value={formulario.talle}
          onChange={onChange}
        />
      </section>

      <section className="publicacion-section">
        <h2>Categoría</h2>
        {cargandoCategorias ? (
          <p className="publicacion-ayuda">Cargando categorías...</p>
        ) : (
          <CategoriaSelect
            categorias={categorias}
            value={formulario.categoryId}
            onChange={onChange}
            error={errores.categoryId}
          />
        )}
      </section>

      <section className="publicacion-section publicacion-grid">
        <h2>Precio y disponibilidad</h2>

        <CampoFormulario
          label="Precio *"
          name="precio"
          type="number"
          min="0"
          step="0.01"
          value={formulario.precio}
          onChange={onChange}
          error={errores.precio}
        />

        <CampoFormulario
          label="Stock *"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={formulario.stock}
          onChange={onChange}
          error={errores.stock}
        />

        <CampoFormulario
          label="Estado *"
          name="estado"
          type="select"
          value={formulario.estado}
          onChange={onChange}
          error={errores.estado}
        >
          <option value="">Seleccioná un estado</option>
          <option value="NUEVO">Nuevo</option>
          <option value="USADO">Usado</option>
        </CampoFormulario>
      </section>

      {/* Secciones extra que agrega la vista (por ejemplo, las fotografías) antes del botón de envío */}
      {children}

      <button className="publicacion-submit" type="submit" disabled={publicando}>
        {publicando ? 'Publicando...' : 'Publicar producto'}
      </button>
    </form>
  )
}

export default ProductoForm
