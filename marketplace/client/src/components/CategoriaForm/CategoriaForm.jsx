import { useState } from 'react'
import './CategoriaForm.css'

// Formulario de una sola línea para crear una categoría
const CategoriaForm = ({ ocupado, onCrear }) => {
  const [nombre, setNombre] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const limpio = nombre.trim()
    if (!limpio) {
      return
    }
    const creada = await onCrear(limpio)
    if (creada) {
      setNombre('')
    }
  }

  return (
    <form className="categoria-form" onSubmit={handleSubmit}>
      <label className="panel-campo categoria-form-campo">
        Nueva categoría
        <input
          type="text"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          placeholder="Ej: Deportes"
          maxLength={50}
          disabled={ocupado}
        />
      </label>
      <button type="submit" className="panel-boton panel-boton-primario" disabled={ocupado || !nombre.trim()}>
        <span className="material-symbols-outlined" aria-hidden="true">add</span>
        {ocupado ? 'Creando...' : 'Crear'}
      </button>
    </form>
  )
}

export default CategoriaForm