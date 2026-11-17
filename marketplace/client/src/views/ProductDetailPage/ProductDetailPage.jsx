import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductoPorId } from '../../redux/slice/ProductSlice.js';
import { ProductDetailSection } from '../../components/ProductDetails/ProductDetailSection.jsx';
import { ProductReviewsSection } from '../../components/ProductDetails/ProductReviewsSection.jsx';
import './ProductDetailPage.css';

export const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Estado global: el producto y el estado de su llamado vienen de Redux
  const product = useSelector((state) => state.productos.detalles[id]);
  const estado = useSelector((state) => state.productos.estadosDetalle[id]);

  // El producto se pide una sola vez: si ya se abrió antes, se usa el que está en el store
  useEffect(() => {
    !estado && dispatch(fetchProductoPorId(id));
  }, [dispatch, id, estado]);

  const loading = !estado || estado === 'loading';

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
          <ProductReviewsSection productoId={product.id} />
        </>
      )}
    </div>
  );
};
