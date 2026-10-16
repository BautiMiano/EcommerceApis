import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import LoginForm from '../components/LoginForm'; 
import RegisterLink from '../components/RegisterLink';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="register-page">       
      <main className="register-main">
        <PageTitle
          etiqueta="ACCESO DE USUARIO"
          titulo="Iniciá sesión en Uniforma"
          descripcion="Ingresá con tus credenciales para gestionar tus pedidos y acceder a la plataforma."
        />
  
        <LoginForm onLoginExitoso={() => navigate('/home')} />
        
        <RegisterLink onClick={() => navigate('/register')} />
      </main>
      
    </div>
  );
}

export default Login;