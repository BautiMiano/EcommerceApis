import Logo from './Logo'
import SecurityBadge from './SecurityBadge'

const Header = () => {
  return (
    <header className="header">
      <Logo />
      <SecurityBadge texto="Seguridad TLS 1.3 AFIP" />
    </header>
  )
}

export default Header