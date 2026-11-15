import { useNavigate } from 'react-router-dom';
import PageTitle from "../components/PageTitle/PageTitle";
import LoginForm from "../components/LoginForm/LoginForm";
import RegisterLink from "../components/RegisterLink/RegisterLink";

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

        <LoginForm />

        <RegisterLink onClick={() => navigate('/registro')} />
      </main>

    </div>
  );
}

export default Login;