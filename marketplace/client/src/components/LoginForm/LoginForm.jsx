import { useState } from 'react';
import FormField from "../FormField/FormField";
import Button from "../ButtonRL/Button";
import { loginUser } from '../../utils/api';


export default function LoginForm({ onLoginExitoso }) {
const [mail, setMail] = useState('');
const [contrasena, setContrasena] = useState('');
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser({ mail, contrasena });

      const token = data.access_token;
      const userRole = data.role;

      token && localStorage.setItem('token', token);
      userRole && localStorage.setItem('userRole', userRole);

      onLoginExitoso && onLoginExitoso(data);

    } catch (err) {
      setError(err.message);
    }
  };

return (
    <form onSubmit={handleSubmit} className="register-form"> 
    
    <FormField 
        label="Correo electrónico:"
        name="mail"
        type="email"
        placeholder="ejemplo@correo.com"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        full={true} 
    />

    <FormField 
        label="Contraseña:"
        name="contrasena"
        type="password"
        placeholder="Ingresa tu contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        full={true} 
    />
    
    {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
    
    <Button
        texto="Ingresar"
        tipo="submit"
        variante="primary"
    />
    
    </form>
);
}