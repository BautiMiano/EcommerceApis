import React from 'react';


export const ProductReviewCard = ({ review }) => {
  const calificacion = Math.min(5, Math.max(0, review.calificacion ?? 0));

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="reviewer-info">
          <strong className="reviewer-name">{review.usuarioNombre}</strong>
          <span className="verified-purchase-tag">
            <span className="material-symbols-outlined">check_circle</span> Compra verificada
          </span>
        </div>
        <div className="review-rating-stars">
          {'★'.repeat(calificacion)}
          {'☆'.repeat(5 - calificacion)}
        </div>
      </div>

      <p className="review-comment-text">"{review.comentarioProducto}"</p>
    </div>
  );
};
