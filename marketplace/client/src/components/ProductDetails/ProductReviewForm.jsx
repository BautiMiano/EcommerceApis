import React, { useState } from 'react';
import { inicialesDe } from '../../utils/formato';

const ETIQUETAS = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];

export const ProductReviewForm = ({ perfil, enviando, onSubmitReview }) => {
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const texto = comentario.trim();
    setError(texto.length < 10 ? 'Contanos un poco más (mínimo 10 caracteres).' : '');
    texto.length >= 10 && onSubmitReview({ calificacion, comentario: texto });
  };

  return (
    <div className="review-form-box">
      <div className="form-header-info">
        <div className="user-avatar-placeholder">{perfil ? inicialesDe(perfil) : ''}</div>
        <div>
          <h3 className="form-title">Dejá tu reseña</h3>
          <p className="form-subtitle">Compraste este producto: contale a otros compradores qué te pareció.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="review-form-body" noValidate>
        <div className="star-rating-selector">
          <span className="rating-label">CALIFICACIÓN</span>
          <div className="stars-interactive" role="radiogroup" aria-label="Calificación">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`star-${star}`}
                type="button"
                role="radio"
                aria-checked={star === calificacion}
                aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                className={`star-btn ${star <= calificacion ? 'active' : ''}`}
                onClick={() => setCalificacion(star)}
              >
                ★
              </button>
            ))}
            <span className="rating-texto">{ETIQUETAS[calificacion]}</span>
          </div>
        </div>

        <textarea
          className="review-textarea"
          value={comentario}
          onChange={(e) => { setComentario(e.target.value); error && setError(''); }}
          placeholder="¿Qué tal la calidad, el talle y la terminación?"
          rows={4}
          maxLength={500}
          aria-invalid={Boolean(error)}
        />
        <div className="review-form-ayuda">
          <span className="review-form-error">{error}</span>
          <span>{comentario.length}/500</span>
        </div>

        <div className="form-footer-action">
          <span className="fiscal-notice">
            <span className="material-symbols-outlined">verified</span> Se publica como compra verificada
          </span>
          <button type="submit" className="btn-publish-review" disabled={enviando}>
            {enviando ? 'PUBLICANDO…' : 'PUBLICAR RESEÑA'}
          </button>
        </div>
      </form>
    </div>
  );
};
