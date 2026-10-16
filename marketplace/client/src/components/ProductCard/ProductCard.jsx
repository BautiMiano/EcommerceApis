import React from 'react';
import './ProductCard.css';

export const ProductCard = ({ product, categoryName, onSelectProduct }) => {
  const sinStock = product.stock <= 0;
  const aviso = sinStock ? 'Sin stock' : product.stock <= 10 ? 'Últimas unidades' : null;
  const imagen = product.imagenes && product.imagenes[0];

  // Clase dinamica para aplicar los estilos de deshabilitado
  const cardClassName = `product-card-kinetic ${sinStock ? 'out-of-stock' : ''}`;

  return (
    <article className={cardClassName}>
      <div className="product-image-box">
        {aviso && <span className="badge-certified">{aviso}</span>}
        {imagen ? (
          <img src={`data:image/jpeg;base64,${imagen}`} alt={product.nombre} />
        ) : (
          <span className="material-symbols-outlined product-image-empty">image</span>
        )}
      </div>

      <div className="product-info-box">
        <div>
          {categoryName && <span className="product-category">{categoryName}</span>}
          <h3 className="product-title">{product.nombre}</h3>
          <p className="product-desc">{product.descripcion}</p>
          <div className="product-chips">
            <span className="stock-info">Stock: {product.stock} u.</span>
            {product.talle && <span className="stock-info">Talle {product.talle}</span>}
          </div>
        </div>

        <div className="product-action-box">
          <div className="product-price-tag">
            ${Number(product.precio).toLocaleString('es-AR')} ARS
          </div>
          <button
            onClick={() => !sinStock && onSelectProduct(product.id)}
            className="btn-buy-kinetic"
            disabled={sinStock}
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {sinStock ? 'Sin stock' : 'Ver detalle'}
          </button>
        </div>
      </div>
    </article>
  );
};