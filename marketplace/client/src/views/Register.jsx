import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm/RegisterForm';
import EnlaceCuenta from '../components/EnlaceCuenta/EnlaceCuenta';
import { obtenerSesion, rutaInicioPorRol } from '../utils/sesion'
import './Register.css';
import PageTitle from '../components/PageTitle/PageTitle';

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
        <RegisterForm
          onRegistroExitoso={() => navigate(rutaInicioPorRol(obtenerSesion().rol))}
          onSolicitudEnviada={() => navigate('/login')}
        />
        <EnlaceCuenta
          pregunta="¿Ya tenés cuenta?"
          textoBoton="Iniciá sesión aquí"
          onClick={() => navigate('/login')}
        />
      </main>
    </div>
  )
}

export default Register