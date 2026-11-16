import React from 'react';

// Promedio y cantidad de reseñas: los calcula ProductReviewsSection con lo que manda el back
export const ProductReviewsHeader = ({ promedio, totalResenas }) => {
  const estrellas = Math.round(promedio);

  return (
    <div className="reviews-header">
      <div className="reviews-title-box">
        <span className="reviews-tag">EVALUACIONES INDUSTRIALES EN CAMPO</span>
        <h2 className="reviews-title">RESEÑAS DE COMPRADORES VERIFICADOS</h2>
      </div>

      <div className="reviews-score-box">
        {totalResenas > 0 && (
          <>
            <div className="score-number">{promedio.toFixed(1)} / 5</div>
            <div className="score-stars">{'★'.repeat(estrellas)}{'☆'.repeat(5 - estrellas)}</div>
            <span className="score-subtext">
              Basado en {totalResenas} {totalResenas === 1 ? 'reseña' : 'reseñas'}
            </span>
          </>
        )}
        {totalResenas === 0 && <span className="score-subtext">Todavía no hay reseñas</span>}
      </div>
    </div>
  );
};
