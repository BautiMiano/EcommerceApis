import React from 'react';

export const ProductReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="reviewer-info">
          <strong className="reviewer-name">{review.nombreAuthor}</strong>
          <span className="reviewer-badge">{review.empresaTag || 'CLIENTE VERIFICADO'}</span>
          <span className="verified-purchase-tag">
            <span className="material-symbols-outlined">check_circle</span> Compra verificada
          </span>
        </div>
        <div className="review-rating-stars">
          {'★'.repeat(review.calificacion || 5)}
          {'☆'.repeat(5 - (review.calificacion || 5))}
        </div>
      </div>

      <div className="review-meta-details">
        <span>Dotación: {review.dotacion || 'N/A'}</span> • <span>Sector: {review.sector || 'General'}</span>
      </div>

      <p className="review-comment-text">"{review.comentario}"</p>

      <div className="review-footer-actions">
        <span className="review-time">{review.haceTiempo || 'Reciente'}</span>
        <span className="review-divider">•</span>
        <button type="button" className="btn-useful">
          <span className="material-symbols-outlined">thumb_up</span> Útil ({review.utilesCount || 0})
        </button>
      </div>
    </div>
  );
};