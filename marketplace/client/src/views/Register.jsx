import { useNavigate } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import RegisterForm from '../components/RegisterForm'
import LoginLink from '../components/LoginLink'
import { obtenerSesion, rutaInicioPorRol } from '../utils/sesion'

const Register = () => {
  const navigate = useNavigate()

  return (
    <div className="register-page">
      <main className="register-main">
        <PageTitle
          etiqueta="ALTA DE CUENTA OFICIAL"
          titulo="Creá tu cuenta en Uniforma"
          descripcion="Accedé a la plataforma líder de uniformes técnicos, calzado y ropa de trabajo con estándar industrial."
        />
        <RegisterForm onRegistroExitoso={() => navigate(rutaInicioPorRol(obtenerSesion().rol))} />
        <LoginLink onClick={() => navigate('/login')} />
      </main>
    </div>
  )
}

export default Register
