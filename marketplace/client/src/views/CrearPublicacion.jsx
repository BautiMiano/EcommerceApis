import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import ProductoForm from '../components/ProductoForm/ProductoForm'
import ImageUploader from '../components/ImageUploader/ImageUploader'
import ProductoPreview from '../components/ProductoPreview/ProductoPreview'
import useProductoFormulario from '../hooks/useProductoFormulario'
import { guardarPublicacion, reiniciarGuardado } from '../redux/slice/ProductSlice'
import { armarPublicacion } from '../utils/productoFormulario'

// Un producto recién creado no tiene descuento y está activo
const PRODUCTO_NUEVO = { descuentoPorcentaje: null, descuentoAplicadoPorAdmin: false, activo: true }

// Publicar producto: crea la publicación y después guarda descuento, estado y fotos (todo con Redux)
const CrearPublicacion = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const form = useProductoFormulario()
  // Las categorías las pide SellerLayout una sola vez
  const { items: categorias, status: statusCategorias, error: errorCategorias } = useSelector((state) => state.categorias)
  const { statusGuardar, publicacionGuardada } = useSelector((state) => state.productos)
  const publicando = statusGuardar === 'loading'

  // Cuando termina de guardar: si todo salió bien va a la lista; si el producto se creó pero falló
  // algo de lo demás (descuento, estado o fotos), lo lleva a editarlo para corregirlo
  useEffect(() => {
    statusGuardar === 'succeeded' && navigate(publicacionGuardada.advertencia
      ? `/vendedor/productos/${publicacionGuardada.id}/editar`
      : '/vendedor/productos')
    statusGuardar === 'succeeded' && dispatch(reiniciarGuardado())
  }, [dispatch, navigate, statusGuardar, publicacionGuardada])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.validar()) {
      toast.error('Revisá los campos marcados.')
      return
    }

    // Si ya se está publicando, no se manda otra vez
    !publicando && dispatch(guardarPublicacion({
      productoId: null,
      ...armarPublicacion(form.formulario, PRODUCTO_NUEVO),
      archivos: form.archivos,
      imagenesQuitadas: [],
    }))
  }

  return (
    <div className="panel-pagina">
      <SellerPageHeader
        titulo="PUBLICAR PRODUCTO"
        descripcion="Completá la información para crear una nueva publicación."
      />

      {errorCategorias && <p className="panel-campo-error" role="alert">{errorCategorias}</p>}

      <ProductoForm
        formulario={form.formulario}
        categorias={categorias}
        cargandoCategorias={statusCategorias === 'idle' || statusCategorias === 'loading'}
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
