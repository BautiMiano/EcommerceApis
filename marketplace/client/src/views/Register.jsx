import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import PageTitle from '../components/PageTitle'
import RegisterForm from '../components/RegisterForm'
import LoginLink from '../components/LoginLink'
import Footer from '../components/Footer'

const Register = () => {
  const navigate = useNavigate()

  return (
    <div className="register-page">
      <Header />
      <main className="register-main">
        <PageTitle
          etiqueta="ALTA DE CUENTA OFICIAL"
          titulo="Creá tu cuenta en Uniforma"
          descripcion="Accedé a la plataforma líder de uniformes técnicos, calzado y ropa de trabajo con estándar industrial."
        />
        <RegisterForm onRegistroExitoso={() => navigate('/home')} />
        <LoginLink onClick={() => navigate('/login')} />
      </main>
      <Footer />
    </div>
  )
}

export default Register
