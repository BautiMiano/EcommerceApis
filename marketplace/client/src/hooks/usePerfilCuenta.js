import { useState } from 'react'
import { toast } from 'react-toastify'
import { actualizarMiPerfil, cambiarMiContrasena } from '../utils/api'

const LARGO_MINIMO_CONTRASENA = 8
const contrasenasVacias = { actual: '', nueva: '', confirmar: '' }
const FORMATO_MAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
// Mismo criterio que el backend: números, espacios, +, - y paréntesis
const FORMATO_TELEFONO = /^[0-9 +()-]{6,20}$/

// Datos de la cuenta y cambio de contraseña, compartidos por el perfil del vendedor y el del comprador.
// "completo" (comprador) suma teléfono y nombre de usuario, y pide el apellido como obligatorio.
const usePerfilCuenta = (perfil, recargarPerfil, { completo = false } = {}) => {
  const [datos, setDatos] = useState({
    nombre: perfil.nombre,
    apellido: perfil.apellido || '',
    mail: perfil.mail,
    telefono: perfil.telefono || '',
    nombreUsuario: perfil.nombreUsuario,
  })
  const [contrasenas, setContrasenas] = useState(contrasenasVacias)
  const [erroresDatos, setErroresDatos] = useState({})
  const [erroresContrasena, setErroresContrasena] = useState({})
  const [guardando, setGuardando] = useState(false)

  const handleDatos = (event) => setDatos({ ...datos, [event.target.name]: event.target.value })
  const handleContrasenas = (event) => setContrasenas({ ...contrasenas, [event.target.name]: event.target.value })

  const limpiarErrores = () => {
    setErroresDatos({})
    setErroresContrasena({})
  }

  const validarDatos = () => {
    const errores = {}
    if (!datos.nombre.trim()) {
      errores.nombre = 'Ingresá tu nombre.'
    }
    if (!FORMATO_MAIL.test(datos.mail.trim())) {
      errores.mail = 'Ingresá un email válido.'
    }
    if (completo && !datos.apellido.trim()) {
      errores.apellido = 'Ingresá tu apellido.'
    }
    if (completo && !FORMATO_TELEFONO.test(datos.telefono.trim())) {
      errores.telefono = 'Ingresá un teléfono válido (solo números, espacios, + y -).'
    }
    if (completo && !datos.nombreUsuario.trim()) {
      errores.nombreUsuario = 'Ingresá tu nombre de usuario.'
    }
    return errores
  }

  const guardarDatos = async (event) => {
    event.preventDefault()
    const errores = validarDatos()
    setErroresDatos(errores)
    if (Object.keys(errores).length > 0) {
      return
    }

    // Teléfono y nombre de usuario solo se mandan desde el perfil completo: si no van, el backend no los toca
    const cambios = { nombre: datos.nombre.trim(), apellido: datos.apellido.trim(), mail: datos.mail.trim() }
    if (completo) {
      cambios.telefono = datos.telefono.trim()
      cambios.nombreUsuario = datos.nombreUsuario.trim()
    }

    setGuardando(true)
    try {
      const respuesta = await actualizarMiPerfil(cambios)
      // El email es el usuario del login: el backend devuelve un token nuevo y el viejo deja de servir
      localStorage.setItem('token', respuesta.access_token)
      toast.success('Tus datos se guardaron.')
      await recargarPerfil()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setGuardando(false)
    }
  }

  const guardarContrasena = async (event) => {
    event.preventDefault()
    const errores = {}
    if (!contrasenas.actual) {
      errores.actual = 'Ingresá tu contraseña actual.'
    }
    if (contrasenas.nueva.length < LARGO_MINIMO_CONTRASENA) {
      errores.nueva = `Tiene que tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres.`
    }
    if (contrasenas.confirmar !== contrasenas.nueva) {
      errores.confirmar = 'Las contraseñas no coinciden.'
    }
    setErroresContrasena(errores)
    if (Object.keys(errores).length > 0) {
      return
    }

    setGuardando(true)
    try {
      await cambiarMiContrasena(contrasenas.actual, contrasenas.nueva)
      setContrasenas(contrasenasVacias)
      toast.success('Tu contraseña se cambió.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setGuardando(false)
    }
  }

  return {
    datos,
    contrasenas,
    erroresDatos,
    erroresContrasena,
    guardando,
    handleDatos,
    handleContrasenas,
    limpiarErrores,
    guardarDatos,
    guardarContrasena,
  }
}

export default usePerfilCuenta
