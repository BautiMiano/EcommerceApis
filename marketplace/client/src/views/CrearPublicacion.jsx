import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProductoForm from '../components/ProductoForm/ProductoForm'
import ImageUploader from '../components/ImageUploader/ImageUploader'
import { crearProducto, getCategories, subirImagen } from '../utils/api'
import './CrearPublicacion.css'

const formularioInicial = {
  nombre: '',
  descripcion: '',
  talle: '',
  precio: '',
  stock: '',
  estado: '',
  categoryId: '',
}

// Límite por defecto de Spring Boot para cada archivo subido (1 MB).
const TAMANIO_MAXIMO_IMAGEN = 1024 * 1024
/* Permite que un vendedor cargue los datos de un producto, seleccione la categoría, adjunte fotografías y envíe la publicación al backend. ambién administra los estados, validaciones, solicitudes al backend y mensajes de resultado.*/
const CrearPublicacion = () => {
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState(formularioInicial)
  const [categorias, setCategorias] = useState([])
  const [archivos, setArchivos] = useState([])
  const [errores, setErrores] = useState({})
  const [cargandoCategorias, setCargandoCategorias] = useState(true)
  const [publicando, setPublicando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const categoriasObtenidas = await getCategories()
        setCategorias(categoriasObtenidas)
      } catch (error) {
        setErrorGeneral(error.message)
      } finally {
        setCargandoCategorias(false)
      }
    }

    cargarCategorias()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormulario((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value,
    }))

    setErrores((erroresAnteriores) => ({
      ...erroresAnteriores,
      [name]: '',
    }))
  }

  const esImagenValida = (archivo) =>
    archivo.type.startsWith('image/') && archivo.size <= TAMANIO_MAXIMO_IMAGEN

  const handleAgregarArchivos = (nuevosArchivos) => {
    nuevosArchivos
      .filter((archivo) => !esImagenValida(archivo))
      .forEach((archivo) => {
        const motivo = archivo.type.startsWith('image/')
          ? 'supera el máximo de 1 MB'
          : 'no es una imagen'
        toast.error(`"${archivo.name}" ${motivo}.`)
      })

    const archivosValidos = nuevosArchivos.filter(esImagenValida)
    setArchivos((archivosAnteriores) => [...archivosAnteriores, ...archivosValidos])
  }

  const handleEliminarArchivo = (indice) => {
    setArchivos((archivosAnteriores) =>
      archivosAnteriores.filter((_, indiceActual) => indiceActual !== indice),
    )
  }

  const validarFormulario = () => {
    const nuevosErrores = {}
    const precio = Number(formulario.precio)
    const stock = Number(formulario.stock)

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'Ingresá el nombre del producto.'
    }

    if (!formulario.categoryId) {
      nuevosErrores.categoryId = 'Seleccioná una categoría.'
    }

    if (formulario.precio === '' || Number.isNaN(precio) || precio < 0) {
      nuevosErrores.precio = 'Ingresá un precio válido mayor o igual a cero.'
    }

    if (formulario.stock === '' || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      nuevosErrores.stock = 'Ingresá un stock entero mayor o igual a cero.'
    }

    if (!formulario.estado) {
      nuevosErrores.estado = 'Seleccioná el estado del producto.'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorGeneral('')

    if (!validarFormulario()) {
      return
    }

    setPublicando(true)

    let productoCreado

    try {
      productoCreado = await crearProducto({
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        talle: formulario.talle.trim(),
        precio: Number(formulario.precio),
        stock: Number(formulario.stock),
        estado: formulario.estado,
        categoryId: Number(formulario.categoryId),
      })
    } catch (error) {
      // El producto no se creó: se conservan los datos para que el vendedor corrija y reintente.
      setErrorGeneral(error.message)
      toast.error(error.message)
      setPublicando(false)
      return
    }

    // A partir de acá el producto ya existe: se limpia el formulario para evitar publicarlo dos veces.
    setFormulario(formularioInicial)
    setArchivos([])

    try {
      if (archivos.length > 0) {
        await Promise.all(
          archivos.map((archivo) => subirImagen(archivo, productoCreado.id)),
        )
      }

      toast.success('¡Publicación creada con éxito!')
    } catch {
      const mensaje = 'La publicación se creó, pero no se pudieron subir algunas imágenes. Podés revisarla en Mis Productos.'
      setErrorGeneral(mensaje)
      toast.warning(mensaje)
    } finally {
      setPublicando(false)
    }
  }

  return (
    <div className="crear-publicacion-page">
      <main className="crear-publicacion-main">
        <div className="crear-publicacion-heading">
          <span className="page-title-tag">Nueva publicación</span>
          <h1>Crear nueva publicación</h1>
          <p>Completá la información para ofrecer tu producto en Uniforma.</p>
        </div>

        {errorGeneral && <p className="publicacion-general-error" role="alert">{errorGeneral}</p>}

        <ProductoForm
          formulario={formulario}
          categorias={categorias}
          errores={errores}
          onChange={handleChange}
          onSubmit={handleSubmit}
          cargandoCategorias={cargandoCategorias}
          publicando={publicando}
        >
          <section className="publicacion-section">
            <h2>Fotografías</h2>
            <ImageUploader
              archivos={archivos}
              onAgregarArchivos={handleAgregarArchivos}
              onEliminarArchivo={handleEliminarArchivo}
            />
          </section>
        </ProductoForm>

        <div className="publicacion-actions">
          <button
            className="publicacion-cancel"
            type="button"
            onClick={() => navigate('/home')}
            disabled={publicando}
          >
            Cancelar
          </button>
          <p className="publicacion-status">
            {publicando ? 'Publicando...' : 'Revisá los datos antes de publicar.'}
          </p>
        </div>
      </main>
    </div>
  )
}

export default CrearPublicacion
