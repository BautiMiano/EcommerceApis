import { useEffect, useState } from 'react'

const ImageUploader = ({ archivos, onAgregarArchivos, onEliminarArchivo }) => {
  const [previsualizaciones, setPrevisualizaciones] = useState([])

  useEffect(() => {
    let activo = true

    const cargarPrevisualizaciones = async () => {
      const nuevasPrevisualizaciones = await Promise.all(
        archivos.map((archivo) => new Promise((resolve, reject) => {
          const lector = new FileReader()

          lector.onload = () => resolve({
            nombre: archivo.name,
            url: lector.result,
          })
          lector.onerror = reject
          lector.readAsDataURL(archivo)
        })),
      )

      if (activo) {
        setPrevisualizaciones(nuevasPrevisualizaciones)
      }
    }

    cargarPrevisualizaciones().catch(() => {
      if (activo) {
        setPrevisualizaciones([])
      }
    })

    return () => {
      activo = false
    }
  }, [archivos])

  const handleChange = (event) => {
    onAgregarArchivos(Array.from(event.target.files))
    event.target.value = ''
  }

  return (
    <div className="publicacion-field">
      <label htmlFor="imagenes">Agregar imágenes</label>
      <input
        id="imagenes"
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />
      <small className="publicacion-ayuda">
        Podés seleccionar una o varias imágenes de hasta 1 MB cada una.
      </small>

      {previsualizaciones.length > 0 && (
        <div className="image-preview-grid">
          {previsualizaciones.map((previsualizacion, index) => (
            <div className="image-preview" key={`${previsualizacion.nombre}-${index}`}>
              <img src={previsualizacion.url} alt={`Vista previa: ${previsualizacion.nombre}`} />
              <button
                type="button"
                onClick={() => onEliminarArchivo(index)}
                aria-label={`Eliminar ${previsualizacion.nombre}`}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
