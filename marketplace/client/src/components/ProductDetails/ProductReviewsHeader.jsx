import React from 'react';

export const ProductReviewsHeader = ({ promedio = 4.9, totalAuditorias = 28 }) => {
  return (
    <div className="reviews-header">
      <div className="reviews-title-box">
        <span className="reviews-tag">EVALUACIONES INDUSTRIALES EN CAMPO</span>
        <h2 className="reviews-title">RESEÑAS DE COMPRADORES VERIFICADOS</h2>
      </div>

      <div className="reviews-score-box">
        <div className="score-number">{promedio} / 5</div>
        <div className="score-stars">★★★★★</div>
        <span className="score-subtext">Basado en {totalAuditorias} auditorías corporativas</span>
      </div>
    </div>
  );
};