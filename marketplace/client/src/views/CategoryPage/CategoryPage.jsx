import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarFilters } from '../../components/SideBar/SidebarFilters';
import { ProductGridSection } from '../../components/ProductGridSection/ProductGridSection';
import {
  buscarProductos,
  fetchProductosPorCategoria,
  fetchProductosPorPrecio,
  fetchProductosPorTalle,
} from '../../redux/slice/ProductSlice.js';
import './CategoryPage.css';

const PAGE_SIZE = 6;

export const CategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { idCategoria } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');


  // Estado global: los productos, sus 3 estados y los filtros elegidos vienen de Redux
  const products = useSelector((state) => state.productos.items);
  const loading = useSelector((state) => state.productos.loading);
  const error = useSelector((state) => state.productos.error);
  const { talle, precioMax } = useSelector((state) => state.productos.filtros);

  const [page, setPage] = useState(1);

  useEffect(() => {
    const accion = talle
      ? fetchProductosPorTalle(talle)
      : precioMax !== null
        ? fetchProductosPorPrecio(precioMax)
        : query
          ? buscarProductos(query)
          : fetchProductosPorCategoria(idCategoria);

    dispatch(accion);
    setPage(1);
  }, [dispatch, idCategoria, query, talle, precioMax]);


  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visible = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
    catId && navigate(`/categorias/${catId}`);
    !catId && navigate('/categorias');
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setMaxPrice(null);
    setPage(1);
    setLoading(true); 

    navigate('/categorias');
  };

  const handleNextPage = () => {
    const haySiguiente = page < pageCount;
    haySiguiente && setPage(page + 1);
  };

  const handlePrevPage = () => {
    const hayAnterior = page > 1;
    hayAnterior && setPage(page - 1);
  };

  return (
    <div className="category-page-wrapper">
      <section className="catalog-hero-banner">
        <div className="hero-content">
          <nav className="breadcrumb" aria-label="Ubicación">
            <Link to="/">Inicio</Link>
            <span className="material-symbols-outlined">chevron_right</span>
            <span>Catálogo general multirubro</span>
          </nav>

          <p className="hero-pill">
            Precios mayoristas y minoristas oficiales. Registrate gratis para cotizaciones al granel
          </p>

          <h1 className="hero-title">Catálogo oficial de uniformes y equipamiento de trabajo</h1>
          <p className="hero-subtitle">
            La plataforma líder que nuclea a los principales fabricantes e importadores industriales certificados.
          </p>
        </div>
      </section>

      <main className="catalog-main-layout">
        <SidebarFilters/>

        <div className="catalog-content-area">
          {loading && (
            <div className="loading-catalog-container" style={{ padding: '3rem', textAlign: 'center', width: '100%' }}>
              <p style={{ fontWeight: '600', color: '#5e5e60' }}>Cargando catálogo...</p>
            </div>
          )}

          {!loading && error && (
            <div className="no-products-container" style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
              <h2>No pudimos cargar los productos</h2>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="no-products-container" style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
              <h2>No se encontraron productos</h2>
              <p>Intenta con otro término de búsqueda o limpia los filtros.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <ProductGridSection
                products={visible}
                total={products.length}
                onSelectProduct={(id) => navigate(`/producto/${id}`)}
              />

              {pageCount > 1 && (
                <div className="catalog-pagination-container">
                  <button
                    type="button"
                    className="catalog-pagination-btn catalog-pagination-btn-outline"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                    Anterior
                  </button>

                  <span className="catalog-pagination-info">
                    Página {page} de {pageCount}
                  </span>

                  <button
                    type="button"
                    className="catalog-pagination-btn catalog-pagination-btn-solid"
                    onClick={handleNextPage}
                    disabled={page === pageCount}
                  >
                    Siguiente
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};