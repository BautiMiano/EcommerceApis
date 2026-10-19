import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import ProductoForm from '../components/ProductoForm/ProductoForm'
import ImageUploader from '../components/ImageUploader/ImageUploader'
import ProductoPreview from '../components/ProductoPreview/ProductoPreview'
import useProductoFormulario from '../hooks/useProductoFormulario'
import { actualizarProducto, desactivarImagen, getCategories, getProductoById, subirImagen } from '../utils/api'
import { armarProductoRequest, formularioDesdeProducto, guardarDescuentoYEstado } from '../utils/productoFormulario'

// Editar producto: mismo formulario que Publicar, precargado. Actualiza el producto existente (PUT).
const EditarProducto = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const form = useProductoFormulario()
  const { setFormulario } = form
  const [producto, setProducto] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [imagenesQuitadas, setImagenesQuitadas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    Promise.all([getProductoById(id), getCategories()])
      .then(([productoObtenido, categoriasObtenidas]) => {
        // El backend también rechaza el PUT si no es el dueño: esto evita mostrar un formulario ajeno
        const esPropio = String(productoObtenido.vendedorId) === localStorage.getItem('usuarioId')
        if (!esPropio) {
          setErrorCarga('Este producto pertenece a otro vendedor.')
          return
        }
        setProducto(productoObtenido)
        setCategorias(categoriasObtenidas)
        setFormulario(formularioDesdeProducto(productoObtenido))
      })
      .catch((error) => {
        setErrorCarga(error.status === 404 ? 'El producto no existe.' : error.message)
      })
      .finally(() => setCargando(false))
  }, [id, setFormulario])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.validar()) {
      toast.error('Revisá los campos marcados.')
      return
    }

    setGuardando(true)
    try {
      await actualizarProducto(producto.id, armarProductoRequest(form.formulario))
    } catch (error) {
      // No se guardó nada: el vendedor puede corregir y reintentar
      toast.error(error.message)
      setGuardando(false)
      return
    }

    try {
      await guardarDescuentoYEstado(producto.id, form.formulario, producto)
      await Promise.all([
        ...imagenesQuitadas.map((imagenId) => desactivarImagen(imagenId)),
        ...form.archivos.map((archivo) => subirImagen(archivo, producto.id)),
      ])
      toast.success('Cambios guardados.')
    } catch (error) {
      toast.warning(`Los datos se guardaron, pero hubo un problema: ${error.message}`)
    }
    navigate('/vendedor/productos')
  }

  if (cargando) {
    return <PanelEstado tipo="cargando" titulo="Cargando el producto..." />
  }

  if (errorCarga) {
    return (
      <PanelEstado tipo="error" titulo="No se puede editar este producto" texto={errorCarga}>
        <Link className="panel-boton panel-boton-secundario" to="/vendedor/productos">Volver a Mis productos</Link>
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
        migas={[{ texto: 'Mis productos', ruta: '/vendedor/productos' }, { texto: 'Editar producto' }]}
      />

      <ProductoForm
        formulario={form.formulario}
        categorias={categorias}
        cargandoCategorias={false}
        errores={form.errores}
        reservados={reservados}
        descuentoBloqueado={Boolean(producto.descuentoAplicadoPorAdmin)}
        onChange={form.handleChange}
        onCambios={form.handleCambios}
        onSubmit={handleSubmit}
        onCancelar={() => navigate('/vendedor/productos')}
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
