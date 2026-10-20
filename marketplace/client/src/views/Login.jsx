import { useNavigate } from 'react-router-dom';
import PageTitle from "../components/PageTitle/PageTitle";
import LoginForm from "../components/LoginForm/LoginForm";
import RegisterLink from "../components/RegisterLink/RegisterLink";
//import { rutaInicioPorRol } from '../utils/sesion';

const Login = () => {
  const navigate = useNavigate();

const handleLoginExitoso = (data) => {
    data.access_token && localStorage.setItem('token', data.access_token);
    data.role && localStorage.setItem('userRole', data.role);
    data.usuarioId && localStorage.setItem('userId', data.usuarioId);

    setUser && setUser({
      token: data.access_token,
      role: data.role,
      userId: data.usuarioId
    });

    navigate('/');
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