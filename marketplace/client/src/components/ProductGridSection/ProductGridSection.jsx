import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductGridSection.css';

export const ProductGridSection = ({
  products = [],
  total,
  categoryNames,
  onSelectProduct
}) => {
  const sinProductos = products.length === 0;

  return (
    <section className="grid-section-container">
      <div className="grid-header">
        <h2 className="grid-title">Catálogo Disponibles</h2>
        <span className="product-count-text">
          Mostrando <strong>{products.length}</strong> de <strong>{total || products.length}</strong> productos
        </span>
      </div>

      {sinProductos && (
        <div className="empty-catalog-msg">
          <p>No se encontraron productos para los filtros seleccionados.</p>
        </div>
      )}

      {!sinProductos && (
        <div className="products-grid-layout">
          {products.map((product) => (
            <ProductCard
              key={`product-card-${product.id}`}
              product={product}
              categoryName={categoryNames && categoryNames[product.categoryId]}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGridSection;