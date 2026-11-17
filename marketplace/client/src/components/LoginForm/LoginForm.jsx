import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../redux/slice/UsuarioSlice';
import { rutaInicioPorRol } from '../../utils/sesion';
import CampoFormulario from '../CampoFormulario/CampoFormulario';
import Button from '../Button/Button';
import './LoginForm.css';

export default function LoginForm() {
const dispatch = useDispatch();
const navigate = useNavigate();
const [mail, setMail] = useState('');
const [contrasena, setContrasena] = useState('');
const { token, rol, loading, error } = useSelector((state) => state.auth);

useEffect(() => {
    token && navigate(rutaInicioPorRol(rol));
  }, [token, rol, navigate]);

useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

const handleSubmit = (e) => {
    e.preventDefault();
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
