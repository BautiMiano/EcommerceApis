import { useEffect, useState } from 'react'
import './ImageUploader.css'

// Fotos actuales (al editar) + fotos nuevas todavía sin subir. La primera de la grilla es la principal,
// porque es la primera que muestra la tienda.
const ImageUploader = ({ archivos, onAgregarArchivos, onEliminarArchivo, imagenesActuales = [], onQuitarActual }) => {
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

  const imagenes = [
    ...imagenesActuales.map((imagen) => ({
      clave: 'actual-' + imagen.id,
      url: imagen.url,
      alt: 'Imagen actual del producto',
      quitar: () => onQuitarActual(imagen.id),
    })),
    ...previsualizaciones.map((previsualizacion, indice) => ({
      clave: `nueva-${previsualizacion.nombre}-${indice}`,
      url: previsualizacion.url,
      alt: `Vista previa: ${previsualizacion.nombre}`,
      quitar: () => onEliminarArchivo(indice),
    })),
  ]

  return (
    <div className="image-uploader">
      {imagenes.map((imagen, indice) => (
        <div className="image-uploader-item" key={imagen.clave}>
          <img src={imagen.url} alt={imagen.alt} />
          {indice === 0 && <span className="image-uploader-principal">Imagen principal</span>}
          <button type="button" onClick={imagen.quitar} aria-label="Quitar imagen">
            <span className="material-symbols-outlined" aria-hidden="true">delete</span>
          </button>
        </div>
      ))}

      {/* El input va antes del label para que el foco con teclado se vea en el recuadro */}
      <input
        id="imagenes"
        className="visually-hidden"
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />
      <label className="image-uploader-agregar" htmlFor="imagenes">
        <span className="material-symbols-outlined" aria-hidden="true">add</span>
        <strong>Agregar imagen</strong>
        <small>JPG, PNG (máx. 1 MB)</small>
      </label>
    </div>
  )
}

export default ImageUploader
