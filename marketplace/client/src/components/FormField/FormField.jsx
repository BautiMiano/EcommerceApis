import './FormField.css';
const FormField = ({ label, name, type, placeholder, value, onChange, ayuda, full, children }) => {
  return (
    <div className={`form-field ${full ? 'form-field-full' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      {ayuda && <small className="form-field-help">{ayuda}</small>}
      {children}
    </div>
  )
}

export default FormField