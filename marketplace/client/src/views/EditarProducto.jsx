import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import ProductoForm from '../components/ProductoForm/ProductoForm'
import ImageUploader from '../components/ImageUploader/ImageUploader'
import ProductoPreview from '../components/ProductoPreview/ProductoPreview'
import useProductoFormulario from '../hooks/useProductoFormulario'
import { fetchProductoPorId, guardarPublicacion, reiniciarGuardado } from '../redux/slice/ProductSlice'
import { armarPublicacion, formularioDesdeProducto } from '../utils/productoFormulario'

const EditarProducto = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const form = useProductoFormulario()
  const { setFormulario } = form

  const { rol, usuarioId } = useSelector((state) => state.auth)
  const producto = useSelector((state) => state.productos.detalles[id])
  const estado = useSelector((state) => state.productos.estadosDetalle[id])
  const errorDetalle = useSelector((state) => state.productos.errorDetalle)
  const { statusGuardar } = useSelector((state) => state.productos)
  const categorias = useSelector((state) => state.categorias.items)

  const [imagenesQuitadas, setImagenesQuitadas] = useState([])
  const [precargadoId, setPrecargadoId] = useState(null)
  const precargado = precargadoId === id
  const saliendo = useRef(false)

  const esAdmin = rol === 'ADMIN'
  const rutaListado = esAdmin ? '/admin/productos' : '/vendedor/productos'
  const guardando = statusGuardar === 'loading'

  useEffect(() => {
    !estado && !saliendo.current && dispatch(fetchProductoPorId(id))
  }, [dispatch, id, estado])

  useEffect(() => {
    producto && !precargado && setFormulario(formularioDesdeProducto(producto))
    producto && !precargado && setPrecargadoId(id)
  }, [producto, precargado, id, setFormulario])

  useEffect(() => {
    statusGuardar === 'succeeded' && (saliendo.current = true)
    statusGuardar === 'succeeded' && navigate(rutaListado)
    statusGuardar === 'succeeded' && dispatch(reiniciarGuardado())
  }, [dispatch, navigate, statusGuardar, rutaListado])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.validar()) {
      toast.error('Revisá los campos marcados.')
      return
    }

    !guardando && dispatch(guardarPublicacion({
      productoId: producto.id,
      ...armarPublicacion(form.formulario, producto, esAdmin),
      archivos: form.archivos,
      imagenesQuitadas,
    }))
  }

  if (!estado || estado === 'loading' || (producto && !precargado)) {
    return <PanelEstado tipo="cargando" titulo="Cargando el producto..." />
  }

  const esPropio = producto && String(producto.vendedorId) === String(usuarioId)
  const errorCarga = estado === 'failed'
    ? errorDetalle
    : (!esPropio && !esAdmin && 'Este producto pertenece a otro vendedor.')

  if (errorCarga) {
    return (
      <PanelEstado tipo="error" titulo="No se puede editar este producto" texto={errorCarga}>
        <Link className="panel-boton panel-boton-secundario" to={rutaListado}>
          {esAdmin ? 'Volver a Productos' : 'Volver a Mis productos'}
        </Link>
      </PanelEstado>
    )
  }

  const imagenesActuales = (producto.imagenIds || [])
    .map((imagenId, indice) => ({ id: imagenId, url: producto.imagenes[indice] }))
    .filter((imagen) => !imagenesQuitadas.includes(imagen.id))

  const reservados = Object.fromEntries((producto.talles || []).map((t) => [t.talle, t.stockReservado]))

  return (
    <div className="panel-pagina">
      <SellerPageHeader
        titulo="EDITAR PRODUCTO"
        descripcion="Actualizá la información de tu publicación."
        migas={[{ texto: esAdmin ? 'Productos' : 'Mis productos', ruta: rutaListado }, { texto: 'Editar producto' }]}
      />

      <ProductoForm
        formulario={form.formulario}
        categorias={categorias}
        cargandoCategorias={categorias.length === 0}
        errores={form.errores}
        reservados={reservados}
        descuentoBloqueado={!esAdmin && Boolean(producto.descuentoAplicadoPorAdmin)}
        onChange={form.handleChange}
        onCambios={form.handleCambios}
        onSubmit={handleSubmit}
        onCancelar={() => navigate(rutaListado)}
        guardando={guardando}
        textoGuardar="Guardar cambios"
        imagenes={(
          <ImageUploader
            archivos={form.archivos}
            onAgregarArchivos={form.handleAgregarArchivos}
            onEliminarArchivo={form.handleEliminarArchivo}
            imagenesActuales={imagenesActuales}
            onQuitarActual={(imagenId) => setImagenesQuitadas((anteriores) => [...anteriores, imagenId])}
          />
        )}
        vistaPrevia={(
          <ProductoPreview
            formulario={form.formulario}
            categorias={categorias}
            imagenUrl={imagenesActuales[0]?.url}
            archivo={form.archivos[0]}
          />
        )}
      />
    </div>
  )
}

export default EditarProducto
