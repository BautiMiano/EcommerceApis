import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SidebarFilters } from '../../components/SideBar/SidebarFilters';
import { ProductGridSection } from '../../components/ProductGridSection/ProductGridSection';
import './CategoryPage.css';

const PAGE_SIZE = 6;
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const CategoryPage = () => {
  const [products, setProducts] = useState([]);

  const { idCategoria } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(idCategoria || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [maxPrice, setMaxPrice] = useState(null);
  const [priceIds, setPriceIds] = useState(null);
  const [sort, setSort] = useState('relevancia');
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false); 

  const navigate = useNavigate();

  // Sincronizar el estado con el idCategoria de la URL cuando cambia la ruta
  useEffect(() => {
    setSelectedCategory(idCategoria || '');
  }, [idCategoria]);

  const bounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const precios = products.map((p) => Number(p.precio));
    return { min: Math.floor(Math.min(...precios)), max: Math.ceil(Math.max(...precios)) };
  }, [products]);

  const sizes = useMemo(() => {
    const set = [...new Set(products.map((p) => p.talle).filter(Boolean))];
    return set.sort((a, b) => {
      const ia = SIZE_ORDER.indexOf(a);
      const ib = SIZE_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
    });
  }, [products]);

  const priceLimit = maxPrice ?? bounds.max;

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesSize = selectedSize === '' || p.talle === selectedSize;
      const matchesPrice = Number(p.precio) <= priceLimit;

      return matchesSize && matchesPrice;
    });

    if (sort === 'precio-asc') result = [...result].sort((a, b) => a.precio - b.precio);
    if (sort === 'precio-desc') result = [...result].sort((a, b) => b.precio - a.precio);
    if (sort === 'nombre') result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));

    return result;
  }, [products, selectedSize, priceLimit, sort]);

  useEffect(() => {
    setPage(1);
    setShowAll(false);
  }, [selectedCategory, selectedSize, maxPrice, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = showAll ? filtered : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Navegación cambiando la ruta /categorias/:idCategoria
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId && catId !== '') {
      navigate(`/categorias/${catId}`);
    } else {
      navigate('/categorias');
    }
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setMaxPrice(null);
    navigate('/categorias');
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

            <dl className="hero-stats">
              <div><dt>Productos activos</dt><dd>{products.length}</dd></div>
              <div><dt>Talles</dt><dd>{sizes.length}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <main className="catalog-main-layout">
        <SidebarFilters
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onProductsFiltered={(data) => setProducts(data || [])}
          bounds={bounds}
          priceLimit={priceLimit}
          onFilterPrice={setMaxPrice}
          maxPrice={maxPrice}
          onPriceResults={setPriceIds}
          sizes={sizes}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onReset={handleReset}
        />

        <ProductGridSection
          products={visible}
          total={filtered.length}
          sort={sort}
          onSort={setSort}
          page={page}
          pageCount={pageCount}
          onPage={setPage}
          showAll={showAll}
          onShowAll={() => setShowAll(true)}
          onSelectProduct={(id) => navigate(`/producto/${id}`)}
        />
      </main>
    </div>
  );
};