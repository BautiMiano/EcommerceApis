import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ProductReviewsHeader } from './ProductReviewsHeader';
import { ProductReviewCard } from './ProductReviewCard';
import { ProductReviewForm } from './ProductReviewForm';
import {
  crearComentario,
  fetchComentariosPorProducto,
  fetchPermisoComentario,
  limpiarAvisoComentarios,
} from '../../redux/slice/ComentarioSlice.js';
import './ProductReviewsSection.css';

const SIN_RESENAS = [];

export const ProductReviewsSection = ({ productoId }) => {
  const dispatch = useDispatch();

  // Estado global: las reseñas de este producto vienen de Redux
  const resenas = useSelector((state) => state.comentarios.porProducto[productoId]) || SIN_RESENAS;
  const estado = useSelector((state) => state.comentarios.estados[productoId]);
  const permiso = useSelector((state) => state.comentarios.permisos[productoId]);
  const estadoPermiso = useSelector((state) => state.comentarios.estadosPermiso[productoId]);
  const statusCrear = useSelector((state) => state.comentarios.statusCrear);
  const aviso = useSelector((state) => state.comentarios.aviso);
  const { token, rol } = useSelector((state) => state.auth);
  const perfil = useSelector((state) => state.usuarios.perfil);
  const esComprador = Boolean(token) && rol === 'COMPRADOR';

  // Las reseñas se piden una sola vez por producto
  useEffect(() => {
    !estado && dispatch(fetchComentariosPorProducto(productoId));
  }, [dispatch, productoId, estado]);

  // Solo el comprador puede reseñar: el back dice si este producto lo compró (una vez por producto)
  useEffect(() => {
    esComprador && !estadoPermiso && dispatch(fetchPermisoComentario(productoId));
  }, [dispatch, productoId, esComprador, estadoPermiso]);

  // Cuando se publica una reseña, el slice deja un aviso: se muestra y se limpia
  useEffect(() => {
    aviso && toast[aviso.tipo](aviso.texto);
    aviso && dispatch(limpiarAvisoComentarios());
  }, [dispatch, aviso]);

  const handleCreateReview = ({ calificacion, comentario }) => {
    // Si ya hay una reseña en camino, no se manda otra
    statusCrear !== 'loading' && dispatch(crearComentario({ productoId, calificacion, comentario }));
  };

  // Promedio y cantidad calculados con las reseñas que mandó el back
  const total = resenas.length;
  const promedio = total > 0
    ? resenas.reduce((suma, resena) => suma + (resena.calificacion || 0), 0) / total
    : 0;

  const renderizarPublicar = () => {
    if (!token) {
      return (
        <p className="review-aviso">
          <span className="material-symbols-outlined" aria-hidden="true">rate_review</span>
          <span><Link to="/login">Iniciá sesión</Link> con tu cuenta de comprador para dejar tu reseña.</span>
        </p>
      );
    }
    if (!esComprador) {
      return null;
    }
    if (!permiso) {
      return <span className="review-aviso-esqueleto" aria-label="Cargando" />;
    }
    if (!permiso.puedeComentar) {
      return (
        <p className="review-aviso">
          <span className="material-symbols-outlined" aria-hidden="true">info</span>
          <span>{permiso.motivo}</span>
        </p>
      );
    }
    return (
      <ProductReviewForm
        perfil={perfil}
        enviando={statusCrear === 'loading'}
        onSubmitReview={handleCreateReview}
      />
    );
  };

  return (
    <section className="product-reviews-section">
      <ProductReviewsHeader promedio={promedio} totalResenas={total} />

      <div className="reviews-list-container">
        {resenas.map((review, index) => (
          <ProductReviewCard key={review.id || `review-${index}`} review={review} />
        ))}
      </div>

      {renderizarPublicar()}
    </section>
  );
};
