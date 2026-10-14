import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CategoryFilter } from '../Filtros/CategoryFilter';
import { PriceFilter } from '../Filtros/PriceFilter';
import { SizeFilter } from '../Filtros/SizeFilter';
import { getCategories, getCategoryProducts, getProductosByPrice } from '../../utils/api.js';
import './SidebarFilters.css';







export const SidebarFilters = ({
  selectedCategory, onSelectCategory,
  bounds, priceLimit, onFilterPrice, onProductsFiltered,
  maxPrice, onPriceResults,
  sizes, selectedSize, onSelectSize, onReset,
}) => {

  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [error, setError] = useState(null);

  const { idCategoria } = useParams();


  useEffect(() => {
    getCategories() //fn fetch categories
      .then((data) => setCategories(data))
      .finally(() => setError(null))
      .catch((error) => setError(error));
  }, []);

  useEffect(() => {
    const onSelectedCategory = (categoryId) => {
      getCategoryProducts(categoryId)
        .then((data) => {
          const lista = Array.isArray(data) ? data : [];
          setFilterCategories(lista);
          if (onProductsFiltered) onProductsFiltered(lista);
        })
        .finally(() => setError(null))
        .catch((error) => setError(error));
    };

    onSelectedCategory(idCategoria);
  }, [idCategoria]);

  useEffect(() => {
    const onSelectedPrice = (precioMax) => {
      getProductosByPrice(precioMax)
        .then((data) => {
          const lista = Array.isArray(data) ? data : [];
          setPrecios(lista);
          if (onPriceResults) onPriceResults(new Set(lista.map((p) => p.id)));
        })
        .finally(() => setError(null))
        .catch((error) => setError(error));
    };

    if (maxPrice === null) {
      setPrecios([]);
      if (onPriceResults) onPriceResults(null);
      return;
    }

    onSelectedPrice(maxPrice);
  }, [maxPrice]);



  return (


    <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="material-symbols-outlined">tune</span>
          <h2>Filtros avanzados</h2>
        </div>
        <button onClick={onReset} className="reset-btn">
          Limpiar<br />filtros
        </button>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      <hr className="divider" />
      <PriceFilter bounds={bounds} value={priceLimit} onChange={onFilterPrice} />

      {sizes.length > 0 && (
        <>
          <hr className="divider" />
          <SizeFilter sizes={sizes} selected={selectedSize} onSelect={onSelectSize} />
        </>
      )}
    </aside>
  )
};
