import React, { useState, useEffect } from 'react';
import './ProductGallery.css';

export const ProductGallery = ({ product }) => {
  // Extraemos las imágenes provenientes del backend (si vienen como lista de objetos o lista de URLs)
  const listaImagenes = (product && product.imagenes) || (product && product.imagenesUrl) || [];
  
  // La primera imagen de la lista devuelta por el backend o el valor por defecto
  const imagenInicial = (listaImagenes.length > 0 && (listaImagenes[0].url || listaImagenes[0])) || product?.imagenUrl || '';

  const [selectedImage, setSelectedImage] = useState(imagenInicial);

  // Actualizamos la imagen cuando el producto cambia o termina de cargar la API
  useEffect(() => {
    const hayImagenes = listaImagenes.length > 0;
    hayImagenes && setSelectedImage(listaImagenes[0].url || listaImagenes[0]);
    !hayImagenes && setSelectedImage(product?.imagenUrl || '');
  }, [product]);

  return (
    <div className="product-gallery-container">
      {/* Visor Principal de Imagen */}
      <div className="main-image-wrapper">


        <button type="button" className="zoom-btn" title="Ampliar imagen">
          <span className="material-symbols-outlined">zoom_in</span>
        </button>

        {selectedImage && (
          <img 
            src={selectedImage} 
            alt={product?.nombre || 'Producto'} 
            className="main-product-image" 
          />
        )}

        <span className="production-code">
          SERIE CERTIFICADA #{product?.id || 'SS-400-ARG'}
        </span>
      </div>

      {/* Miniaturas Dinámicas cargadas desde la API */}
      <div className="thumbnails-grid">
        {listaImagenes.length > 0 && listaImagenes.map((img, index) => {
          const urlImg = img.url || img;
          const esSeleccionada = selectedImage === urlImg;

          return (
            <button
              key={`thumb-${index}`}
              type="button"
              className={`thumbnail-card ${esSeleccionada ? 'selected' : ''}`}
              onClick={() => setSelectedImage(urlImg)}
            >
              <img src={urlImg} alt={`Vista ${index + 1}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};