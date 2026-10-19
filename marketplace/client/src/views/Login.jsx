import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import LoginForm from '../components/LoginForm'; 
import RegisterLink from '../components/RegisterLink';

const Login = ({ setUser }) => {
  const navigate = useNavigate();

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