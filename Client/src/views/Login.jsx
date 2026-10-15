import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import LoginForm from '../components/LoginForm'; 
import Footer from '../components/Footer';
import RegisterLink from '../components/RegisterLink';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="register-page"> 
      <Header />
      
      <main className="register-main">
        <PageTitle
          etiqueta="ACCESO DE USUARIO"
          titulo="Iniciá sesión en Uniforma"
          descripcion="Ingresá con tus credenciales para gestionar tus pedidos y acceder a la plataforma."
        />
  
        <LoginForm onLoginExitoso={() => navigate('/home')} />
        
        <RegisterLink onClick={() => navigate('/register')} />
      </main>
      
      <Footer />
    </div>
  );
}

export default Login;