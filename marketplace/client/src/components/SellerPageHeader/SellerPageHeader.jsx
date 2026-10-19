import { Link } from 'react-router-dom'
import './SellerPageHeader.css'

// Título de cada pantalla del panel, con migas de pan opcionales y las acciones principales a la derecha
const SellerPageHeader = ({ titulo, descripcion, migas, children }) => {
  return (
    <div className="seller-page-header">
      <div>
        {migas && (
          <nav className="seller-page-header-migas" aria-label="Ubicación">
            {migas.map((miga) => (
              miga.ruta
                ? <Link key={miga.texto} to={miga.ruta}>{miga.texto}</Link>
                : <span key={miga.texto} aria-current="page">{miga.texto}</span>
            ))}
          </nav>
        )}
        <h1 className="seller-page-header-titulo">{titulo}</h1>
        {descripcion && <p className="seller-page-header-descripcion">{descripcion}</p>}
      </div>
      {children && <div className="seller-page-header-acciones">{children}</div>}
    </div>
  )
}

export default SellerPageHeader
