import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getCategories } from '../../utils/api.js';
import { Search } from '../Search/Search.jsx';
import './Navbar.css';

export const Navbar = () => {
  const [logueado, setLogueado] = useState(!!localStorage.getItem('jwt'));
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('jwt');
    setLogueado(false);
    navigate('/');
  };

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
          <span className="navbar-logo-mark">U</span>UNIFORMA
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

                {categories.length === 0 ? (
                  <div className="dropdown-loading">Sin categorías disponibles</div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={`nav-cat-${cat.idCategoria}`}
                      type="button"
                      className="dropdown-item"
                      onClick={() => handleSelectCategory(cat)}
                    >
                      <span className="material-symbols-outlined">category</span>
                      {cat.nombreCategoria}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <NavLink to="/favoritos">Favoritos</NavLink>
          <NavLink to="/carrito">Carrito</NavLink>
        </nav>

        <Search />

        <div className="navbar-actions">
          {logueado ? (
            <button className="btn-pill btn-pill-outline" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          ) : (
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