import './CampoFormulario.css'

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
      {!esSelect && children}
    </div>
  )
}

export default CampoFormulario
