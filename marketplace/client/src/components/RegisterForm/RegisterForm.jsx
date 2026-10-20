import { useState } from 'react'
import { toast } from 'react-toastify'
import FormField from "../FormField/FormField";
import PasswordStrength from "../PasswordStrength/PasswordStrength";
import Button from "../ButtonRL/Button";

import { registrarUsuario } from "../../utils/api";

const campos = [
  { name: 'nombre', label: 'Nombre *', type: 'text', placeholder: 'Ej: Juan' },
  { name: 'apellido', label: 'Apellido *', type: 'text', placeholder: 'Ej: Perez' },
  { name: 'nombreUsuario', label: 'Nombre de usuario *', type: 'text', placeholder: '@Jperez', full: true },
  {
    name: 'mail',
    label: 'Email (corporativo o personal) *',
    type: 'email',
    placeholder: 'nombre@mail.com.ar',
    ayuda: 'Enviaremos las validaciones de pedido, remitos electrónicos y confirmación de alta a esta casilla.',
    full: true,
  },
  { name: 'contrasena', label: 'Contraseña *', type: 'password', placeholder: 'Mínimo 8 caracteres' },
  { name: 'confirmar', label: 'Confirmar contraseña *', type: 'password', placeholder: 'Repetir contraseña' },
]

const RegisterForm = ({ onRegistroExitoso }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    mail: '',
    contrasena: '',
    confirmar: '',
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const registrar = (rol) => {
    if (Object.values(form).some((valor) => valor.trim() === '')) {
      toast.error('Completá todos los campos.')
      return
    }
    if (form.contrasena.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (form.contrasena !== form.confirmar) {
      toast.error('Las contraseñas no coinciden.')
      return
    }
    
    const userData = {
      nombreUsuario: form.nombreUsuario,
      nombre: form.nombre,
      apellido: form.apellido,
      mail: form.mail,
      contrasena: form.contrasena,
      rol: rol,
    };

    //función importada de api.js
    registrarUsuario(userData)
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token)
          toast.success('¡Cuenta creada con éxito!')
          onRegistroExitoso()
        } else {
          toast.error('No se pudo crear la cuenta. Verificá que el mail y el usuario no estén ya registrados.')
        }
      })
      .catch((error) => {
        toast.error('No se pudo conectar con el servidor.')
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    registrar('COMPRADOR')
  }

  return (
    <>
      <form className="register-form" onSubmit={handleSubmit}>
        {campos.map((campo) => (
          <FormField
            key={campo.name}
            label={campo.label}
            name={campo.name}
            type={campo.type}
            placeholder={campo.placeholder}
            ayuda={campo.ayuda}
            full={campo.full}
            value={form[campo.name]}
            onChange={handleChange} 
          >
            {campo.name === 'contrasena' && <PasswordStrength contrasena={form.contrasena} />}
          </FormField>
        ))}

        <div className="register-actions">
          <Button texto="Registrarse como comprador →" tipo="submit" variante="primary" />
          <Button
            texto="Solicitar aprobación como vendedor"
            variante="secondary"
            type="button"
            onClick={() => registrar('VENDEDOR')}
          />
        </div>
      </form>
    </>
  )
}
export default RegisterForm