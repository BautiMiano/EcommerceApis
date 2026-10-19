import { useState } from 'react'
import { toast } from 'react-toastify'
import FormField from './FormField'
import PasswordStrength from './PasswordStrength'
import TermsCheckbox from './TermsCheckbox'
import TermsModal from './TermsModal'
import Button from './Button'
import { registrarUsuario } from '../utils/api'

const campos = [
  { name: 'nombre', label: 'Nombre *', type: 'text', placeholder: 'Ej: Marcelo' },
  { name: 'apellido', label: 'Apellido *', type: 'text', placeholder: 'Ej: Benítez' },
  { name: 'nombreUsuario', label: 'Nombre de usuario *', type: 'text', placeholder: '@usuario_operativo', full: true },
  {
    name: 'mail',
    label: 'Email (corporativo o personal) *',
    type: 'email',
    placeholder: 'nombre@empresa.com.ar',
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
  const [terminos, setTerminos] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleTerminos = (e) => {
    setTerminos(e.target.checked)
  }

  const registrar = async (rol) => {
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
    if (!terminos) {
      toast.error('Tenés que aceptar los Términos de Servicio.')
      return
    }

    try {
      const data = await registrarUsuario({
        nombreUsuario: form.nombreUsuario,
        nombre: form.nombre,
        apellido: form.apellido,
        mail: form.mail,
        contrasena: form.contrasena,
        rol: rol,
      })

      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('userRole', data.role)
        localStorage.setItem('usuarioId', data.usuarioId)
        toast.success('¡Cuenta creada con éxito!')
        onRegistroExitoso()
      } else {
        toast.error('No se pudo crear la cuenta. Verificá que el mail y el usuario no estén ya registrados.')
      }
    } catch (error) {
      console.error('Error al registrar', error)
      // Si hay status, el backend respondió con error; si no, no hubo conexión.
      if (error.status) {
        toast.error('No se pudo crear la cuenta. Verificá que el mail y el usuario no estén ya registrados.')
      } else {
        toast.error('No se pudo conectar con el servidor.')
      }
    }
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

        <TermsCheckbox
          checked={terminos}
          onChange={handleTerminos}
          onVerTerminos={() => setModalAbierto(true)}
        />

        <div className="register-actions">
          <Button texto="Registrarse como comprador →" tipo="submit" variante="primary" />
          <Button
            texto="Solicitar aprobación como vendedor"
            variante="secondary"
            onClick={() => registrar('VENDEDOR')}
          />
        </div>
      </form>

      <TermsModal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} />
    </>
  )
}

export default RegisterForm
