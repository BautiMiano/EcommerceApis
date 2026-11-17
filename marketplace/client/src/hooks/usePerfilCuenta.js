import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { actualizarPerfil, cambiarContrasena, limpiarAvisoPerfil } from '../redux/slice/UsuarioSlice'

const LARGO_MINIMO_CONTRASENA = 8
const contrasenasVacias = { actual: '', nueva: '', confirmar: '' }
const FORMATO_MAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const FORMATO_TELEFONO = /^[0-9 +()-]{6,20}$/

const usePerfilCuenta = (perfil) => {
  const dispatch = useDispatch()
  const { statusGuardarPerfil, avisoPerfil } = useSelector((state) => state.usuarios)
  const guardando = statusGuardarPerfil === 'loading'

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

  useEffect(() => {
    avisoPerfil && toast[avisoPerfil.tipo](avisoPerfil.texto)
    avisoPerfil?.accion === 'contrasena' && setContrasenas(contrasenasVacias)
    avisoPerfil && dispatch(limpiarAvisoPerfil())
  }, [dispatch, avisoPerfil])

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
    if (!datos.apellido.trim()) {
      errores.apellido = 'Ingresá tu apellido.'
    }
    if (datos.telefono.trim() && !FORMATO_TELEFONO.test(datos.telefono.trim())) {
      errores.telefono = 'Ingresá un teléfono válido (solo números, espacios, + y -).'
    }
    if (!datos.nombreUsuario.trim()) {
      errores.nombreUsuario = 'Ingresá tu nombre de usuario.'
    }
    return errores
  }

  const guardarDatos = (event) => {
    event.preventDefault()
    const errores = validarDatos()
    setErroresDatos(errores)
    if (Object.keys(errores).length > 0 || guardando) {
      return
    }

    dispatch(actualizarPerfil({
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      mail: datos.mail.trim(),
      telefono: datos.telefono.trim(),
      nombreUsuario: datos.nombreUsuario.trim(),
    }))
  }

  const guardarContrasena = (event) => {
    event.preventDefault()
    const errores = {}
    if (!contrasenas.actual) {
      errores.actual = 'Ingresá tu contraseña actual.'
    }
    if (contrasenas.nueva.length < LARGO_MINIMO_CONTRASENA) {
      errores.nueva = `Tiene que tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres.`
    }
    if (!contrasenas.confirmar) {
      errores.confirmar = 'Repetí la nueva contraseña.'
    } else if (contrasenas.confirmar !== contrasenas.nueva) {
      errores.confirmar = 'Las contraseñas no coinciden.'
    }
    setErroresContrasena(errores)
    if (Object.keys(errores).length > 0 || guardando) {
      return
    }

    dispatch(cambiarContrasena({ contrasenaActual: contrasenas.actual, contrasenaNueva: contrasenas.nueva }))
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
