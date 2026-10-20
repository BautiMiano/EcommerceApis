import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductoById } from '../../utils/api.js';
import { ProductDetailSection } from '../../components/ProductDetails/ProductDetailSection.jsx';
import { ProductReviewsSection } from '../../components/ProductDetails/ProductReviewsSection.jsx';
import './ProductDetailPage.css';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductoById(id)
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="product-detail-wrapper">
      <nav className="detail-breadcrumb" aria-label="Ubicación">
        <Link to="/">INICIO</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <Link to="/categorias">CATÁLOGO GENERAL</Link>
        <span className="material-symbols-outlined">chevron_right</span>
        <span>{product ? product.nombre : 'DETALLE DEL PRODUCTO'}</span>
      </nav>

      {loading && (
        <div className="loading-container">
          <p>Cargando información del producto...</p>
        </div>
      )}

      {!loading && !product && (
        <div className="error-container">
          <h2>Producto no encontrado</h2>
          <p>El producto solicitado no existe o no se encuentra disponible.</p>
        </div>
      )}

      {!loading && product && (
        <>
            <ProductDetailSection key={product.id} product={product} />         
            <ProductReviewsSection 
            productoId={product.id} 
            reviewsIniciales={product.resenas || []} 
          />
        </>
      )}
    </div>
  );
};