import React, { useState } from 'react';

export const ProductReviewForm = ({ onSubmitReview }) => {
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview({ calificacion, comentario });
    setComentario('');
  };

  return (
    <div className="review-form-box">
      <div className="form-header-info">
        <div className="user-avatar-placeholder">UN</div>
        <div>
          <h3 className="form-title">Publicar reseña técnica verificada</h3>
          <p className="form-subtitle">Tu reseña se validará con CUIT corporativo o número de factura</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="review-form-body">
        <div className="star-rating-selector">
          <span className="rating-label">CALIFICACIÓN GENERAL DE SEGURIDAD</span>
          <div className="stars-interactive">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`star-${star}`}
                type="button"
                className={`star-btn ${star <= calificacion && 'active'}`}
                onClick={() => setCalificacion(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="review-textarea"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Describe el desempeño en planta, durabilidad de puntera, respuesta térmica o ergonomía..."
          rows={4}
          required
        />

        <div className="form-footer-action">
          <span className="fiscal-notice">
            <span className="material-symbols-outlined">lock</span> Reseña con verificación fiscal
          </span>
          <button type="submit" className="btn-publish-review">
            PUBLICAR AUDITORÍA
          </button>
        </div>
      </form>
    </div>
  );
};