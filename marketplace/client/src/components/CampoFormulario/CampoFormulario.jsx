// Muestra un campo controlado (input, textarea o select) con su etiqueta y su mensaje de error.
const CampoFormulario = ({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  children,
  ...atributos
}) => {
  const idError = `${name}-error`

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

    if (type === 'select') {
      return <select {...propsControl}>{children}</select>
    }

    return <input type={type} {...propsControl} />
  }

  return (
    <div className="publicacion-field">
      <label htmlFor={name}>{label}</label>
      {renderizarControl()}
      {error && <small id={idError} className="publicacion-error">{error}</small>}
    </div>
  )
}

export default CampoFormulario
