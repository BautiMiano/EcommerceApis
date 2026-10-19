import { useState } from 'react'
import './CampoContrasena.css'

// Campo de contraseña con el botón del ojo para mostrarla u ocultarla
const CampoContrasena = ({ label, name, value, placeholder, onChange, error }) => {
  const [visible, setVisible] = useState(false)
  const idError = `${name}-error`

  return (
    <div className="panel-campo">
      <label htmlFor={name}>{label}</label>
      <div className="campo-contrasena">
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={name === 'actual' ? 'current-password' : 'new-password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? idError : undefined}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <span className="material-symbols-outlined" aria-hidden="true">{visible ? 'visibility_off' : 'visibility'}</span>
        </button>
      </div>
      {error && <small id={idError} className="panel-campo-error">{error}</small>}
    </div>
  )
}

export default CampoContrasena
