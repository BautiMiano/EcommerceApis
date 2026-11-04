import './CampoFormulario.css'

// Campo controlado (input, textarea o select) con su etiqueta, ayuda y mensaje de error.
// variante 'panel': pantallas del vendedor y del comprador. variante 'formulario': login y registro.
const CampoFormulario = ({
  label,
  name,
  value,
  onChange,
  error,
  ayuda,
  type = 'text',
  variante = 'panel',
  full = false,
  children,
  ...atributos
}) => {
  const idError = `${name}-error`
  const esSelect = type === 'select'

  // Atributos comunes a los tres tipos de control.
  const propsControl = {
    id: name,
    name,
    value,
    onChange,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? idError : undefined,
    ...atributos,
  }

  const renderizarControl = () => {
    if (type === 'textarea') {
      return <textarea {...propsControl} />
    }

    if (esSelect) {
      return <select {...propsControl}>{children}</select>
    }

    return <input type={type} {...propsControl} />
  }

  const clase = variante === 'formulario'
    ? `form-field ${full ? 'form-field-full' : ''}`
    : 'panel-campo'

  return (
    <div className={clase}>
      <label htmlFor={name}>{label}</label>
      {renderizarControl()}
      {ayuda && <small className="form-field-help">{ayuda}</small>}
      {error && <small id={idError} className="panel-campo-error">{error}</small>}
      {/* En un select los hijos son las opciones; en los demás se muestran debajo (por ejemplo, la fuerza de la contraseña) */}
      {!esSelect && children}
    </div>
  )
}

export default CampoFormulario
