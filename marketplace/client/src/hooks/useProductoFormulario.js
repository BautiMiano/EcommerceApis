import { useState } from 'react'
import { toast } from 'react-toastify'
import { esImagenValida, formularioVacio, motivoImagenInvalida, validarFormulario } from '../utils/productoFormulario'

// Estado del formulario de producto, sus errores y las fotos nuevas, compartido por Publicar y Editar
const useProductoFormulario = () => {
  const [formulario, setFormulario] = useState(formularioVacio)
  const [errores, setErrores] = useState({})
  const [archivos, setArchivos] = useState([])

  // Para inputs comunes (usa name y value del evento)
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormulario((anterior) => ({ ...anterior, [name]: value }))
    setErrores((anteriores) => ({ ...anteriores, [name]: '' }))
  }

  // Para cambios armados a mano, como los del selector de talles
  const handleCambios = (cambios) => {
    setFormulario((anterior) => ({ ...anterior, ...cambios }))
    setErrores((anteriores) => ({ ...anteriores, talles: '' }))
  }

  const handleAgregarArchivos = (nuevos) => {
    nuevos
      .filter((archivo) => !esImagenValida(archivo))
      .forEach((archivo) => toast.error(`"${archivo.name}" ${motivoImagenInvalida(archivo)}.`))

    setArchivos((anteriores) => [...anteriores, ...nuevos.filter(esImagenValida)])
  }

  const handleEliminarArchivo = (indice) => {
    setArchivos((anteriores) => anteriores.filter((_, actual) => actual !== indice))
  }

  const validar = () => {
    const nuevosErrores = validarFormulario(formulario)
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  return {
    formulario,
    setFormulario,
    errores,
    archivos,
    handleChange,
    handleCambios,
    handleAgregarArchivos,
    handleEliminarArchivo,
    validar,
  }
}

export default useProductoFormulario
