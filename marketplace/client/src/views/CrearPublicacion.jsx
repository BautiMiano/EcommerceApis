import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import ProductoForm from '../components/ProductoForm/ProductoForm'
import ImageUploader from '../components/ImageUploader/ImageUploader'
import ProductoPreview from '../components/ProductoPreview/ProductoPreview'
import useProductoFormulario from '../hooks/useProductoFormulario'
import { crearProducto, getCategories, subirImagen } from '../utils/api'
import { armarProductoRequest, guardarDescuentoYEstado } from '../utils/productoFormulario'

// Un producto recién creado no tiene descuento y está activo
const PRODUCTO_NUEVO = { descuentoPorcentaje: null, descuentoAplicadoPorAdmin: false, activo: true }

// Publicar producto: crea la publicación y después guarda descuento, estado y fotos
const CrearPublicacion = () => {
  const navigate = useNavigate()
  const form = useProductoFormulario()
  const [categorias, setCategorias] = useState([])
  const [cargandoCategorias, setCargandoCategorias] = useState(true)
  const [publicando, setPublicando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  useEffect(() => {
    getCategories()
      .then(setCategorias)
      .catch((error) => setErrorGeneral(error.message))
      .finally(() => setCargandoCategorias(false))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorGeneral('')

    if (!form.validar()) {
      toast.error('Revisá los campos marcados.')
      return
    }

    setPublicando(true)

    let productoCreado
    try {
      productoCreado = await crearProducto(armarProductoRequest(form.formulario))
    } catch (error) {
      // El producto no se creó: se conservan los datos para que el vendedor corrija y reintente
      setErrorGeneral(error.message)
      toast.error(error.message)
      setPublicando(false)
      return
    }

    // A partir de acá el producto ya existe: si algo falla no se vuelve a crear,
    // se avisa y se lleva al vendedor a editarlo
    try {
      await guardarDescuentoYEstado(productoCreado.id, form.formulario, PRODUCTO_NUEVO)
      await Promise.all(form.archivos.map((archivo) => subirImagen(archivo, productoCreado.id)))
      toast.success('¡Publicación creada con éxito!')
      navigate('/vendedor/productos')
    } catch (error) {
      toast.warning(`La publicación se creó, pero hubo un problema: ${error.message} Podés corregirlo acá.`)
      navigate(`/vendedor/productos/${productoCreado.id}/editar`)
    }
  }

  return (
    <div className="panel-pagina">
      <SellerPageHeader
        titulo="PUBLICAR PRODUCTO"
        descripcion="Completá la información para crear una nueva publicación."
      />

      {errorGeneral && <p className="panel-campo-error" role="alert">{errorGeneral}</p>}

      <ProductoForm
        formulario={form.formulario}
        categorias={categorias}
        cargandoCategorias={cargandoCategorias}
        errores={form.errores}
        onChange={form.handleChange}
        onCambios={form.handleCambios}
        onSubmit={handleSubmit}
        onCancelar={() => navigate('/vendedor/productos')}
        guardando={publicando}
        textoGuardar="Publicar producto"
        imagenes={(
          <ImageUploader
            archivos={form.archivos}
            onAgregarArchivos={form.handleAgregarArchivos}
            onEliminarArchivo={form.handleEliminarArchivo}
          />
        )}
        vistaPrevia={<ProductoPreview formulario={form.formulario} categorias={categorias} archivo={form.archivos[0]} />}
      />
    </div>
  )
}

export default CrearPublicacion
