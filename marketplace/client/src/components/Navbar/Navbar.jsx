import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [busqueda, setBusqueda] = useState('');
  const [logueado, setLogueado] = useState(!!localStorage.getItem('jwt'));
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('http://localhost:4002/categories', { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener categorías');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error('Error cargando menú de categorías:', err));
  }, [logueado]);

  const buscar = (e) => {
    e.preventDefault();
    navigate(busqueda.trim() ? `/categorias?q=${encodeURIComponent(busqueda.trim())}` : '/categorias');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('jwt');
    setLogueado(false);
    navigate('/');
  };

  const handleSelectCategory = (cat) => {
    setIsDropdownOpen(false);
    if (cat === 'all') {
      navigate('/categorias');
      return;
    }

    const catId = typeof cat === 'object' ? (cat.idCategoria || cat.nombreCategoria) : cat;
    if (catId) {
      navigate(`/categorias?cat=${encodeURIComponent(catId)}`);
    }
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
                  categories.map((cat, index) => {
                    const keyVal = cat.idCategoria ?? cat.nombreCategoria ?? index;
                    return (
                      <button
                        key={`nav-cat-${keyVal}`}
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleSelectCategory(cat)}
                      >
                        <span className="material-symbols-outlined">category</span>
                        {cat.nombreCategoria}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <NavLink to="/favoritos">Favoritos</NavLink>
          <NavLink to="/carrito">Carrito</NavLink>
        </nav>

        <form className="navbar-search" onSubmit={buscar} role="search">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar uniformes, calzado, EPP..."
            aria-label="Buscar productos"
          />
        </form>

        <div className="navbar-actions">
          {logueado ? (
            <button className="btn-pill btn-pill-outline" onClick={cerrarSesion}>Cerrar sesión</button>
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