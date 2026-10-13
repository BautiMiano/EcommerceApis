import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductGridSection.css';

export const ProductGridSection = ({
  products = [],
  total,
  categoryNames,
  sort,
  onSort,
  page,
  pageCount,
  onPage,
  showAll,
  onShowAll,
  onSelectProduct
}) => {
  return (
    <section className="grid-section-container">
      <div className="grid-header">
        <h2 className="grid-title">Catálogo Disponibles</h2>
        <span className="product-count-text">
          Mostrando <strong>{products.length}</strong> de <strong>{total}</strong> productos
        </span>
      </div>

      {products.length === 0 ? (
        <div className="empty-catalog-msg">
          <p>No se encontraron productos para los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="products-grid-layout">
          {products.map((product, index) => {
            const prodId = product.id ?? product.productId ?? product.idProducto ?? index;
            return (
              <ProductCard
                key={`product-card-${prodId}`}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};