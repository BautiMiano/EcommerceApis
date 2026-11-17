import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CampoFormulario from "../CampoFormulario/CampoFormulario";
import PasswordStrength from "../PasswordStrength/PasswordStrength";
import Button from "../Button/Button";

import { registerUser, resetRegisterStatus } from "../../redux/slice/UsuarioSlice";
import { rutaInicioPorRol } from "../../utils/sesion";

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

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, rol, registerStatus, registerRol, registerError } = useSelector((state) => state.auth)
  const enviando = registerStatus === 'pending'

  useEffect(() => {
    if (registerStatus === 'succeeded') {
      if (registerRol === 'VENDEDOR') {
        toast.success('¡Solicitud enviada! Vas a poder ingresar cuando un administrador apruebe tu cuenta.')
        navigate('/login')
      } else if (token) {
        toast.success('¡Cuenta creada con éxito!')
        navigate(rutaInicioPorRol(rol))
      }
      dispatch(resetRegisterStatus())
    }
    if (registerStatus === 'failed') {
      toast.error(registerError || 'No se pudo crear la cuenta.')
      dispatch(resetRegisterStatus())
    }
  }, [registerStatus, registerRol, registerError, token, rol, navigate, dispatch])

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
    if (enviando) return
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

    dispatch(registerUser(userData))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    registrar('COMPRADOR')
  }

  return (
    <>
      <form className="register-form" onSubmit={handleSubmit}>
        {campos.map((campo) => (
          <CampoFormulario
            variante="formulario"
            required
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
          </CampoFormulario>
        ))}

        <div className="register-actions">
          <Button
            texto={enviando ? 'Registrando...' : 'Registrarse como comprador →'}
            tipo="submit"
            variante="primary"
          />
          <Button
            texto={enviando ? 'Registrando...' : 'Solicitar aprobación como vendedor'}
            variante="secondary"
            tipo="button"
            onClick={() => registrar('VENDEDOR')}
          />
        </div>
      </form>
    </>
  )
}
export default RegisterForm
