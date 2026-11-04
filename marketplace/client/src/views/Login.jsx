import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PageTitle from "../components/PageTitle/PageTitle";
import LoginForm from "../components/LoginForm/LoginForm";
import EnlaceCuenta from "../components/EnlaceCuenta/EnlaceCuenta";
import { iniciarSesion } from '../redux/slice/UsuarioSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginExitoso = (data) => {
    data.access_token && localStorage.setItem('token', data.access_token);
    data.role && localStorage.setItem('userRole', data.role);
    data.usuarioId && localStorage.setItem('usuarioId', data.usuarioId);

    // Avisa a Redux que hay sesión: el layout cambia solo y se pide el perfil
    dispatch(iniciarSesion({ token: data.access_token, rol: data.role, usuarioId: data.usuarioId }));

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

        <EnlaceCuenta
          pregunta="¿No tenés cuenta?"
          textoBoton="Creá tu cuenta acá"
          onClick={() => navigate('/registro')}
        />
      </main>
    </div>
  );
}

export default Login;
