import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import LoginForm from '../components/LoginForm'; 
import RegisterLink from '../components/RegisterLink';
import { rutaInicioPorRol } from '../utils/sesion';

const Login = ({ setUser }) => {
  const navigate = useNavigate();

<<<<<<< HEAD
  // Guarda el id del usuario para poder buscar su carrito, y lleva a cada rol a su inicio
  const handleLoginExitoso = (data) => {
    localStorage.setItem('usuarioId', data.usuarioId);
    navigate(rutaInicioPorRol(String(data.role).toUpperCase()));
=======
  // Guardamos los datos de sesión de manera consistente
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
>>>>>>> b8a5059268befbe3941db0438a2eaf043c256771
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
};

export default Login;