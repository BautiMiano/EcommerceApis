import { useNavigate } from 'react-router-dom';
import PageTitle from "../components/PageTitle/PageTitle";
import LoginForm from "../components/LoginForm/LoginForm";
import RegisterLink from "../components/RegisterLink/RegisterLink";
import { rutaInicioPorRol } from '../utils/sesion';

const Login = () => {
  const navigate = useNavigate();

  // Guarda el id del usuario para poder buscar su carrito, y lleva a cada rol a su inicio
  const handleLoginExitoso = (data) => {
    localStorage.setItem('usuarioId', data.usuarioId);
    navigate(rutaInicioPorRol(String(data.role).toUpperCase()));
  };

  return (
    <div className="register-page">       
      <main className="register-main">
        <PageTitle
          etiqueta="ACCESO DE USUARIO"
          titulo="Iniciá sesión en Uniforma"
          descripcion="Ingresá con tus credenciales para gestionar tus pedidos y acceder a la plataforma."
        />
  
        <LoginForm onLoginExitoso={handleLoginExitoso} />
        
        <RegisterLink onClick={() => navigate('/registro')} />
      </main>
      
    </div>
  );
}

export default Login;