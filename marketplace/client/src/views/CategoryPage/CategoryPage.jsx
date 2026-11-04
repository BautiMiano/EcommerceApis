import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarFilters } from '../../components/SideBar/SidebarFilters';
import { ProductGridSection } from '../../components/ProductGridSection/ProductGridSection';
import {
  aplicarFiltros,
  fetchTalles,
  setBusqueda,
  setCategorias,
} from '../../redux/slice/ProductSlice.js';
import './CategoryPage.css';

const PAGE_SIZE = 6;

export const CategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { idCategoria } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  // Estado global: los productos ya filtrados, sus 3 estados y los filtros vienen de Redux
  const products = useSelector((state) => state.productos.items);
  const loading = useSelector((state) => state.productos.loading);
  const error = useSelector((state) => state.productos.error);
  const filtros = useSelector((state) => state.productos.filtros);
  const statusTalles = useSelector((state) => state.productos.statusTalles);

  useEffect(() => {
    if (!idCategoria) return;
    dispatch(setCategorias([Number(idCategoria)]));
    navigate('/categorias', { replace: true });
  }, [dispatch, navigate, idCategoria]);

  useEffect(() => {
    const texto = query || '';
    texto !== filtros.busqueda && dispatch(setBusqueda(texto));
  }, [dispatch, query, filtros.busqueda]);

  // Talles para el filtro: se piden una sola vez
  useEffect(() => {
    statusTalles === 'idle' && dispatch(fetchTalles());
  }, [dispatch, statusTalles]);

  // Cada vez que cambian los filtros, el thunk decide qué llamados faltan
  useEffect(() => {
    dispatch(aplicarFiltros());
  }, [dispatch, filtros]);

  // Paginación del front: al cambiar un filtro se vuelve a la página 1
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filtros]);

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visible = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleNextPage = () => {
    page < pageCount && setPage(page + 1);
  };

  const handlePrevPage = () => {
    page > 1 && setPage(page - 1);
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

          <div className="hero-row">
            <div>
              <h1 className="hero-title">Catálogo oficial de uniformes y equipamiento de trabajo</h1>
              <p className="hero-subtitle">
                La plataforma líder que nuclea a los principales fabricantes e importadores industriales certificados.
              </p>
            </div>

            <dl className="catalog-hero-stats">
              <div><dt>Productos activos</dt><dd>{products.length}</dd></div>
            </dl>
          </div>
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