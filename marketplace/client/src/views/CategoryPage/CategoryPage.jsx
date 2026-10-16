import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SidebarFilters } from '../../components/SideBar/SidebarFilters';
import { ProductGridSection } from '../../components/ProductGridSection/ProductGridSection';
import { searchProductsByName, getCategoryProducts } from '../../utils/api.js';
import './CategoryPage.css';

const PAGE_SIZE = 6;

export const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('relevancia');
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const { idCategoria } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(idCategoria || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [maxPrice, setMaxPrice] = useState(null);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedCategory(idCategoria || '');
  }, [idCategoria]);

  // Paginación puramente visual sobre los productos provistos por la API
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visible = showAll ? products : products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    catId && navigate(`/categorias/${catId}`);
    !catId && navigate('/categorias');
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setMaxPrice(null);
    navigate('/categorias');
  };

  // Carga reactiva de productos vía API
  useEffect(() => {
    query && searchProductsByName(query)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));

    !query && getCategoryProducts(idCategoria)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
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

            <dl className="hero-stats">
              <div><dt>Productos activos</dt><dd>{products.length}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <main className="catalog-main-layout">
        <SidebarFilters
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onProductsFiltered={(data) => setProducts(data)}
          priceLimit={maxPrice}
          maxPrice={maxPrice}
          onFilterPrice={setMaxPrice}
          onPriceResults={(data) => data && setProducts(data)}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onReset={handleReset}
        />

        {products.length === 0 ? (
          <div className="no-products-container" style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
            <h2>No se encontraron productos</h2>
            <p>Intenta con otro término de búsqueda o limpia los filtros.</p>
          </div>
        ) : (
          <ProductGridSection
            products={visible}
            total={filteredProducts.length}
            onSelectProduct={(id) => navigate(`/producto/${id}`)}
          />
        )}
      </main>
    </div>
  );
};