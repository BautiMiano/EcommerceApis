import './Footer.css'
import Logo from '../Logo'
const enlaces = [
  'Términos de Servicio',
  'Privacidad y Seguridad',
  'Cumplimiento AFIP',
  'Centro de Soporte B2B',
  'Garantía Técnica',
]

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-info">
          <img src="./icons/Uniforma.jpg" alt="UNIFORMA" className="navbar-logo-img" />        
        <p>
          © 2026 Uniforma S.A. Todos los derechos reservados. Conexión segura
          TLS 1.3 | Homologación AFIP Data Fiscal
        </p>
      </div>
      <ul className="footer-links">
        {enlaces.map((enlace) => (
          <li key={enlace}>{enlace}</li>
        ))}
      </ul>
    </footer>
  )
}

export default Footer