import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SidebarFilters } from '../../components/SideBar/SidebarFilters';
import { ProductGridSection } from '../../components/ProductGridSection/ProductGridSection';
import { searchProductsByName, getCategoryProducts } from '../../utils/api.js';
import './CategoryPage.css';

const PAGE_SIZE = 6;

export const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [sort, setSort] = useState('relevancia');
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const { idCategoria } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(idCategoria || '');
  const [onSelectCategory, setOnSelectCategory] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [maxPrice, setMaxPrice] = useState(null);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedCategory(idCategoria || '');
    setPage(1);
  }, [idCategoria]);

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visible = showAll ? products : products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  useEffect(() => {
    setPage(1);
    setLoading(true);

    query && searchProductsByName(query)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));

    !query && getCategoryProducts(idCategoria)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query, idCategoria]);

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
        <SidebarFilters
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}

          priceLimit={maxPrice}
          maxPrice={maxPrice}
          onFilterPrice={setMaxPrice}
          onPriceResults={(data) => {
            data && setProducts(data);
            setPage(1);
          }}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onReset={handleReset}
        />

        <div className="catalog-content-area">
          {loading && (
            <div className="loading-catalog-container" style={{ padding: '3rem', textAlign: 'center', width: '100%' }}>
              <p style={{ fontWeight: '600', color: '#5e5e60' }}>Cargando catálogo...</p>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="no-products-container" style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
              <h2>No se encontraron productos</h2>
              <p>Intenta con otro término de búsqueda o limpia los filtros.</p>
            </div>
          )}

          {!loading && products.length > 0 && (
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