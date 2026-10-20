import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getCategories } from '../../utils/api.js';
import { Search } from '../Search/Search.jsx';
import { obtenerSesion } from '../../utils/sesion.js';
import UsuarioMenu from '../UsuarioMenu/UsuarioMenu.jsx';
import './Navbar.css';

export const Navbar = ({ perfil, onLogout }) => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // El vendedor usa su propio panel: este navbar es para visitantes, compradores y el admin
  const { logueado, rol } = obtenerSesion();
  const esAdmin = rol === 'ADMIN';
  // Si un vendedor entra a la tienda (por ejemplo, al detalle de un producto), su perfil está en el panel
  // El administrador no tiene pantalla de perfil: su menú queda solo con Cerrar sesión
  const rutasPerfil = { COMPRADOR: '/perfil', VENDEDOR: '/vendedor/perfil' };
  const rutaPerfil = rutasPerfil[rol];

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const handleSelectCategory = (cat) => {
    setIsDropdownOpen(false);
    cat === 'all' && navigate('/categorias');
    cat !== 'all' && navigate(`/categorias/${cat.idCategoria}`);
  };

  return (
    <>
      {!logueado && (
        <div className="topbar">
          Navegando como visitante. Registrate como Comprador para cotizaciones o como Vendedor para publicar productos.{' '}
          <Link to="/registro">Acceder ahora</Link>
        </div>
      )}
      <header className="navbar">
        <Link to="/" className="navbar-logo">
          <img src="/icons/Uniforma.jpg" alt="UNIFORMA" className="navbar-logo-img" />        
        </Link>

        <nav className="navbar-links" aria-label="Principal">
          <NavLink to="/" end>Home</NavLink>

          <div
            className="dropdown-container"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <NavLink
              to="/categorias"
              className="dropdown-trigger"
              onClick={() => setIsDropdownOpen(false)}
            >
              Categorías
              <span className={`material-symbols-outlined arrow-icon ${isDropdownOpen ? 'open' : ''}`}>
                expand_more
              </span>
            </NavLink>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button
                  type="button"
                  className="dropdown-item dropdown-item-bold"
                  onClick={() => handleSelectCategory('all')}
                >
                  <span className="material-symbols-outlined">apps</span>
                  Ver todo el catálogo
                </button>

                <div className="dropdown-divider"></div>

                {categories.length === 0 && (
                  <div className="dropdown-loading">Sin categorías disponibles</div>
                )}

                {categories.length > 0 && categories.map((cat) => (
                  <button
                    key={`nav-cat-${cat.idCategoria}`}
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleSelectCategory(cat)}
                  >
                    <span className="material-symbols-outlined">category</span>
                    {cat.nombreCategoria}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!esAdmin && (
            <>
              <NavLink to="/favoritos">Favoritos</NavLink>
              <NavLink to="/carrito">Carrito</NavLink>
            </>
          )}

          {esAdmin && (
            <>
              <NavLink to="/admin/usuarios">Usuarios</NavLink>
              <NavLink to="/admin/productos">Productos</NavLink>
              <NavLink to="/admin/tickets">Tickets</NavLink>
            </>
          )}
        </nav>

        <Search />

        <div className="navbar-actions">
          {/* Con sesión: nombre y menú, como en el panel del vendedor */}
          {logueado && perfil && (
            <UsuarioMenu perfil={perfil} rutaPerfil={rutaPerfil} textoEnlace="Mi perfil" onLogout={onLogout} />
          )}

          {/* Mientras carga el perfil (o si falló), igual se puede cerrar sesión */}
          {logueado && !perfil && (
            <button className="btn-pill btn-pill-outline" onClick={onLogout}>
              Cerrar sesión
            </button>
          )}

          {!logueado && (
            <>
              <Link to="/login" className="btn-pill btn-pill-outline">Iniciar sesión</Link>
              <Link to="/registro" className="btn-pill btn-pill-solid">Registrarse</Link>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;