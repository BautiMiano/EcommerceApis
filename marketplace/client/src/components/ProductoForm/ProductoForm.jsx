import CampoFormulario from '../CampoFormulario/CampoFormulario'
import CategoriaSelect from '../CategoriaSelect/CategoriaSelect'
import SizeSelector from '../SizeSelector/SizeSelector'
import { MODO_UNICO, stockTotalFormulario } from '../../utils/productoFormulario'
import './ProductoForm.css'

const RECOMENDACIONES = [
  'Usá imágenes de buena calidad y con fondo neutro.',
  'Incluí una descripción clara y completa.',
  'Verificá que el precio y el stock sean correctos.',
  'Indicá todos los talles disponibles.',
  'Evitá datos de contacto en la descripción.',
]

// Formulario de producto que comparten Publicar y Editar. "imagenes" es la sección de fotos
// y "vistaPrevia" la tarjeta de la derecha; la vista decide qué hace al guardar.
const ProductoForm = ({
  formulario,
  categorias,
  cargandoCategorias,
  errores,
  reservados,
  descuentoBloqueado,
  onChange,
  onCambios,
  onSubmit,
  onCancelar,
  guardando,
  textoGuardar,
  imagenes,
  vistaPrevia,
}) => {
  const esUnico = formulario.modoTalle === MODO_UNICO

  return (
    <form className="producto-form" onSubmit={onSubmit} noValidate>
      <div className="producto-form-principal">
        <section className="panel-tarjeta producto-form-seccion">
          <h2 className="panel-tarjeta-titulo">INFORMACIÓN BÁSICA</h2>

          <div className="producto-form-basica">
            <CampoFormulario
              label={<>Nombre del producto <span className="producto-form-requerido">*</span></>}
              name="nombre"
              value={formulario.nombre}
              onChange={onChange}
              error={errores.nombre}
            />
            {cargandoCategorias
              ? <p className="panel-texto-suave">Cargando categorías...</p>
              : (
                <CategoriaSelect
                  categorias={categorias}
                  value={formulario.categoryId}
                  onChange={onChange}
                  error={errores.categoryId}
                />
              )}

            <div className="producto-form-descripcion">
              <CampoFormulario
                label={<>Descripción <span className="producto-form-requerido">*</span></>}
                name="descripcion"
                type="textarea"
                rows="6"
                value={formulario.descripcion}
                onChange={onChange}
                error={errores.descripcion}
              />
            </div>

            <div className="producto-form-columna">
              <CampoFormulario
                label={<>Marca <span className="panel-campo-opcional">(opcional)</span></>}
                name="marca"
                value={formulario.marca}
                onChange={onChange}
              />
              <CampoFormulario
                label={<>SKU <span className="producto-form-requerido">*</span></>}
                name="sku"
                value={formulario.sku}
                onChange={onChange}
                error={errores.sku}
              />
              <CampoFormulario
                label={<>Condición <span className="producto-form-requerido">*</span></>}
                name="estado"
                type="select"
                value={formulario.estado}
                onChange={onChange}
                error={errores.estado}
              >
                <option value="">Seleccioná</option>
                <option value="NUEVO">Nuevo</option>
                <option value="USADO">Usado</option>
              </CampoFormulario>
            </div>
          </div>
        </section>

        <section className="panel-tarjeta producto-form-seccion">
          <div>
            <h2 className="panel-tarjeta-titulo">IMÁGENES DEL PRODUCTO</h2>
            <p className="panel-tarjeta-subtitulo">Agregá fotos de buena calidad. La primera imagen será la principal.</p>
          </div>
          {imagenes}
        </section>

        <section className="panel-tarjeta producto-form-seccion">
          <h2 className="panel-tarjeta-titulo">PRECIO Y STOCK</h2>
          <div className="producto-form-precio">
            <CampoFormulario
              label={<>Precio <span className="producto-form-requerido">*</span></>}
              name="precio"
              type="number"
              min="0"
              step="0.01"
              value={formulario.precio}
              onChange={onChange}
              error={errores.precio}
            />
            <CampoFormulario
              label={<>Descuento % <span className="panel-campo-opcional">(opcional)</span></>}
              name="descuento"
              type="number"
              min="1"
              max="99"
              step="1"
              value={formulario.descuento}
              onChange={onChange}
              error={errores.descuento || (descuentoBloqueado ? 'Lo aplicó un administrador.' : '')}
              disabled={descuentoBloqueado}
            />
            {/* Con talle único el stock se carga acá; con rango es la suma de los talles */}
            <CampoFormulario
              label={<>Stock <span className="producto-form-requerido">*</span></>}
              name="stockUnico"
              type="number"
              min={reservados?.UNICO || 0}
              step="1"
              value={esUnico ? formulario.stockUnico : stockTotalFormulario(formulario)}
              onChange={onChange}
              disabled={!esUnico}
              title={esUnico ? undefined : 'Es la suma del stock de cada talle'}
            />
            <CampoFormulario
              label={<>Estado <span className="producto-form-requerido">*</span></>}
              name="activo"
              type="select"
              value={formulario.activo}
              onChange={onChange}
            >
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </CampoFormulario>
          </div>
        </section>

        <section className="panel-tarjeta producto-form-seccion">
          <div className="producto-form-talles-cabecera">
            <h2 className="panel-tarjeta-titulo">TALLES DISPONIBLES</h2>
            <p className="panel-texto-suave">Seleccioná si este producto tiene un rango de talles o es de talle único.</p>
          </div>
          <SizeSelector
            formulario={formulario}
            reservados={reservados}
            error={errores.talles}
            onChange={onCambios}
          />
        </section>
      </div>

      <aside className="producto-form-lateral">
        {vistaPrevia}

        <section className="panel-tarjeta">
          <h2 className="panel-tarjeta-titulo producto-form-recomendaciones-titulo">
            <span className="material-symbols-outlined" aria-hidden="true">lightbulb</span>
            RECOMENDACIONES
          </h2>
          <ul className="producto-form-recomendaciones">
            {RECOMENDACIONES.map((recomendacion) => <li key={recomendacion}>{recomendacion}</li>)}
          </ul>
        </section>

        <div className="producto-form-acciones">
          <button type="button" className="panel-boton panel-boton-secundario" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
          <button type="submit" className="panel-boton panel-boton-primario" disabled={guardando}>
            {guardando ? 'Guardando...' : textoGuardar}
          </button>
        </div>
      </aside>
    </form>
  )
}

export default ProductoForm
