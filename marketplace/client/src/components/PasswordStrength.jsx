
const etiquetas = ['BAJO', 'BAJO', 'MEDIO', 'ALTO', 'MUY ALTO']

const calcularNivel = (contrasena) => {
  if (!contrasena) return 0
  let puntos = 0
  if (contrasena.length >= 8) puntos++
  if (/[A-Z]/.test(contrasena) && /[a-z]/.test(contrasena)) puntos++
  if (/\d/.test(contrasena)) puntos++
  if (/[^A-Za-z0-9]/.test(contrasena)) puntos++
  return puntos
}

const PasswordStrength = ({ contrasena }) => {
  const nivel = calcularNivel(contrasena)

  return (
    <div className="password-strength">
      <div className="password-strength-bar">
        <span style={{ width: `${(nivel / 4) * 100}%` }} />
      </div>
      <small className="password-strength-label">
        NIVEL DE SEGURIDAD: {contrasena ? etiquetas[nivel] : '—'}
      </small>
    </div>
  )
}

export default PasswordStrength
