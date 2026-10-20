import './LoginLink.css';
const LoginLink = ({ onClick }) => {
  return (
    <p className="login-link">
      ¿Ya tenés cuenta?{' '}
      <button type="button" onClick={onClick}>
        Iniciá sesión aquí
      </button>
    </p>
  )
}

export default LoginLink