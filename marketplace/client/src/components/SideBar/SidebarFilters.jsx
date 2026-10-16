import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CategoryFilter } from '../Filtros/CategoryFilter';
import { PriceFilter } from '../Filtros/PriceFilter';
import { SizeFilter } from '../Filtros/SizeFilter';
import {
  getCategories,
  getCategoryProducts,
  getProductosByPrice,
  getProductosByTalle,
  getTalles
} from '../../utils/api.js';
import './SidebarFilters.css';

export const SidebarFilters = ({
  selectedCategory,
  onSelectCategory,
  bounds = { min: 0, max: 400000 },
  priceLimit,
  onFilterPrice,
  onProductsFiltered,
  maxPrice,
  onPriceResults,
  selectedSize,
  onSelectSize,
  onReset,
}) => {
  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [sizes, setSizes] = useState([]);

  const { idCategoria } = useParams();

  // 1. Obtener categorías desde la DB
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // 2. Obtener talles disponibles desde la DB
  useEffect(() => {
    getTalles()
      .then((data) => setSizes(data))
      .catch(() => setSizes([]));
  }, []);

  // 3. Obtener productos por categoría según la URL
  useEffect(() => {
    getCategoryProducts(idCategoria)
      .then((data) => {
        setFilterCategories(data);
        onProductsFiltered && onProductsFiltered(data);
      })
      .catch(() => {
        setFilterCategories([]);
        onProductsFiltered && onProductsFiltered([]);
      });
  }, [idCategoria]);

  // 4. Obtener productos por rango de precio desde la API
  useEffect(() => {
    maxPrice !== null && getProductosByPrice(0, maxPrice)
      .then((data) => {
        setPrecios(data);
        onPriceResults && onPriceResults(data);
      })
      .catch(() => {
        setPrecios([]);
        onPriceResults && onPriceResults([]);
      });

    maxPrice === null && setPrecios([]);
    maxPrice === null && onPriceResults && onPriceResults(null);
  }, [maxPrice]);

  // 5. Obtener productos filtrados por talle desde la API
  useEffect(() => {
    selectedSize.trim() !== '' && getProductosByTalle(selectedSize)
      .then((data) => {
        onProductsFiltered && onProductsFiltered(data);
      })
      .catch(() => {
        onProductsFiltered && onProductsFiltered([]);
      });

    selectedSize.trim() === '' && onProductsFiltered && onProductsFiltered([]);
  }, [selectedSize]);

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
  );
};