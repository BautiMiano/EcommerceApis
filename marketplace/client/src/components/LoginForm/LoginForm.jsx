import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../redux/slice/AuthSlice';
import { rutaInicioPorRol } from '../../utils/sesion';
import CampoFormulario from '../CampoFormulario/CampoFormulario';
import Button from '../Button/Button';
import './LoginForm.css';

export default function LoginForm() {
const dispatch = useDispatch();
const navigate = useNavigate();
// Lo que se escribe en los inputs es estado local: solo lo usa este formulario
const [mail, setMail] = useState('');
const [contrasena, setContrasena] = useState('');
// La sesión es estado global
const { token, rol, loading, error } = useSelector((state) => state.auth);

// Cuando el login sale bien aparece el token: cada rol va a su inicio
useEffect(() => {
    token && navigate(rutaInicioPorRol(rol));
  }, [token, rol, navigate]);

// Al salir de la pantalla se borra el error, así el formulario arranca limpio cuando el usuario vuelve
useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

const handleSubmit = (e) => {
    e.preventDefault();
    // Evita mandar dos logins si el usuario hace doble clic mientras se procesa el primero
    if (loading) return;
    dispatch(loginUser({ mail, contrasena }));
  };

return (
    <form onSubmit={handleSubmit} className="register-form">

    <CampoFormulario
        variante="formulario"
        required
        label="Correo electrónico:"
        name="mail"
        type="email"
        placeholder="ejemplo@correo.com"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        full={true}
    />

    <CampoFormulario
        variante="formulario"
        required
        label="Contraseña:"
        name="contrasena"
        type="password"
        placeholder="Ingresa tu contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        full={true}
    />

    {/* El botón ocupa todo el ancho y el error aparece debajo */}
    <div className="login-acciones">
        <Button
            texto={loading ? "Ingresando..." : "Ingresar"}
            tipo="submit"
            variante="primary"
        />
        {error && <p className="login-error" role="alert">{error}</p>}
    </div>

    </form>
);
}
