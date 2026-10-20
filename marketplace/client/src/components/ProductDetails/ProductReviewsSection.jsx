import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ProductReviewsHeader } from './ProductReviewsHeader';
import { ProductReviewCard } from './ProductReviewCard';
import { ProductReviewForm } from './ProductReviewForm';
import { crearResenaProducto, obtenerComentariosPorProducto } from '../../utils/api.js';
import './ProductReviewsSection.css';

export const ProductReviewsSection = ({ productoId }) => {
  const [resenas, setResenas] = useState([]);

  useEffect(() => {
    const cargardor = Boolean(productoId);
    cargardor && obtenerComentariosPorProducto(productoId)
      .then((data) => setResenas(data || []))
      .catch(() => setResenas([]));
  }, [productoId]);

  const handleCreateReview = (reviewData) => {
    crearResenaProducto(productoId, reviewData)
      .then((nuevoComentario) => {
        setResenas([nuevoComentario, ...resenas]);
        toast.success('¡Reseña publicada con éxito!');
      })
      .catch((error) => {
        toast.error(error.message || 'No se pudo publicar la reseña.');
      });
  };

  return (
    <section className="product-reviews-section">
      <ProductReviewsHeader />

      <div className="reviews-list-container">
        {resenas.map((review, index) => (
          <ProductReviewCard key={review.id || `review-${index}`} review={review} />
        ))}
      </div>

      <ProductReviewForm onSubmitReview={handleCreateReview} />
    </section>
  );
};