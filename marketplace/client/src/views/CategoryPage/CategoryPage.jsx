import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SidebarFilters } from '../../components/SideBar/SidebarFilters';
import { ProductGridSection } from '../../components/ProductGridSection/ProductGridSection';
import './CategoryPage.css';

const API = 'http://localhost:4002';
const PAGE_SIZE = 6;
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const getJson = (path) => {
  const token = localStorage.getItem('jwt');
  return fetch(`${API}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((res) => {
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`Error al cargar ${path}`);
    return res.json();
  });
};

export const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [maxPrice, setMaxPrice] = useState(null);
  const [sort, setSort] = useState('relevancia');
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim().toLowerCase();
  const catParam = params.get('cat') || '';
  const navigate = useNavigate();

  // Sincronizar selectedCategory con la URL ?cat=
  useEffect(() => {
    setSelectedCategory(catParam);
  }, [catParam]);

  // Carga asíncrona de datos con .then()/.catch()
  useEffect(() => {
    Promise.all([getJson('/categories'), getJson('/productos')])
      .then(([cats, prods]) => {
        setCategories(
          cats.map((c) => ({
            id: c.idCategoria ?? c.nombreCategoria,
            nombre: c.nombreCategoria
          }))
        );
        setProducts(prods);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  // Función interna para determinar si un producto pertenece a una categoría
  const esProductoDeCategoria = (p, catObjOrId) => {
    if (!catObjOrId) return true;

    // Buscar el objeto categoría dentro del estado
    const targetCat = categories.find(
      (c) => String(c.id) === String(catObjOrId) || String(c.nombre).toLowerCase() === String(catObjOrId).toLowerCase()
    );

    const targetId = targetCat ? String(targetCat.id) : String(catObjOrId);
    const targetNombre = targetCat ? String(targetCat.nombre).toLowerCase() : String(catObjOrId).toLowerCase();

    // 1. Si el producto incluye la propiedad de ID de categoría en el JSON
    if (p.categoryId != null && String(p.categoryId) === targetId) return true;
    if (p.idCategoria != null && String(p.idCategoria) === targetId) return true;

    // 2. Si coincide directamente por texto del nombre en las propiedades o contenido del producto
    const textoProducto = `${p.nombre || ''} ${p.descripcion || ''}`.toLowerCase();

    if (targetNombre.includes('salud') || targetNombre.includes('sanidad')) {
      return textoProducto.includes('medico') || textoProducto.includes('ambo') || textoProducto.includes('salud');
    }
    if (targetNombre.includes('deporte')) {
      return textoProducto.includes('arbitro') || textoProducto.includes('deporte');
    }

    return textoProducto.includes(targetNombre);
  };

  // Conteo dinámico de productos por categoría
  const counts = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      const total = products.filter((p) => esProductoDeCategoria(p, cat.id)).length;
      map[cat.id] = total;
    });
    return map;
  }, [categories, products]);

  const categoryNames = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.nombre])),
    [categories]
  );

  const priceLimit = maxPrice ?? bounds.max;

  // Filtrado de productos para la grilla principal
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCat = selectedCategory === '' || esProductoDeCategoria(p, selectedCategory);
      const matchesSize = selectedSize === '' || p.talle === selectedSize;
      const matchesPrice = Number(p.precio) <= priceLimit;
      const matchesQuery = query === '' || `${p.nombre} ${p.descripcion || ''}`.toLowerCase().includes(query);

      return matchesCat && matchesSize && matchesPrice && matchesQuery;
    });

    if (sort === 'precio-asc') result = [...result].sort((a, b) => a.precio - b.precio);
    if (sort === 'precio-desc') result = [...result].sort((a, b) => b.precio - a.precio);
    if (sort === 'nombre') result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre));

    return result;
  }, [products, selectedCategory, categories, selectedSize, priceLimit, query, sort]);

  useEffect(() => { setPage(1); setShowAll(false); }, [selectedCategory, selectedSize, maxPrice, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = showAll ? filtered : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId !== '') {
      navigate(`/categorias?cat=${encodeURIComponent(catId)}`);
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

  if (loading) return <div className="status-screen">Cargando catálogo...</div>;
  if (error) return <div className="status-screen error-msg">Error: {error}</div>;

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
                La plataforma líder que nuclea a los principales fabricantes e importadores industriales
                certificados. Homologaciones IRAM/ISO, facturación electrónica A y B directa y despacho
                federal centralizado.
              </p>
            </div>

            <dl className="hero-stats">
              <div><dt>Productos activos</dt><dd>{products.length}</dd></div>
              <div><dt>Rubros</dt><dd>{categories.length}</dd></div>
              <div><dt>Talles</dt><dd>{sizes.length}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <main className="catalog-main-layout">
        <SidebarFilters
          categories={categories}
          counts={counts}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          bounds={bounds}
          priceLimit={priceLimit}
          onFilterPrice={setMaxPrice}
          sizes={sizes}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onReset={handleReset}
        />

        <ProductGridSection
          products={visible}
          total={filtered.length}
          categoryNames={categoryNames}
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