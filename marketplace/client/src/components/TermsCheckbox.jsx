
const TermsCheckbox = ({ checked, onChange, onVerTerminos }) => {
  return (
    <label className="terms-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>
        Acepto los{' '}
        <button type="button" className="terms-checkbox-link" onClick={onVerTerminos}>
          Términos de Servicio
        </button>
        , las normativas de protección de datos personales y la política de
        homologación fiscal AFIP de Kinetic Workwear S.A.
      </span>
    </label>
  )
}

export default TermsCheckbox
