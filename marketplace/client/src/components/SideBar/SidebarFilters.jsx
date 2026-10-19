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
  // 4. Obtener productos por rango de precio desde la API sin 'if' ni '?'
useEffect(() => {
  const tienePrecio = maxPrice !== null && maxPrice !== undefined;

  // Caso 1: Si hay precio máximo seleccionado, consulta la API y filtra por la propiedad 'precio'
  tienePrecio &&
    getProductosByPrice(0, maxPrice)
      .then((data) => {
        const filtrados = data.filter((prod) => Number(prod.precio) <= maxPrice);
        setPrecios(filtrados);
        onPriceResults && onPriceResults(filtrados);
      })
      .catch(() => {
        setPrecios([]);
        onPriceResults && onPriceResults([]);
      });

  // Caso 2: Si no hay precio (limpieza de filtro), resetea los estados
  !tienePrecio && setPrecios([]);
  !tienePrecio && onPriceResults && onPriceResults(null);
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
      <PriceFilter bounds={bounds} value={priceLimit !== undefined ? priceLimit : maxPrice} onChange={onFilterPrice} />

      {sizes.length > 0 && (
        <>
          <hr className="divider" />
          <SizeFilter sizes={sizes} selected={selectedSize} onSelect={onSelectSize} />
        </>
      )}
    </aside>
  );
};