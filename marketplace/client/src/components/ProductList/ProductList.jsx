import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductList.css';

export const ProductList = ({ products, onSelectProduct }) => {
  if (products.length === 0) {
    return <p className="no-products">No se encontraron productos para los filtros seleccionados.</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
};