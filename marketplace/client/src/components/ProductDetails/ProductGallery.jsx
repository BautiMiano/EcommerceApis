import React, { useState, useEffect } from 'react';
import './ProductGallery.css';

export const ProductGallery = ({ product }) => {
  const listaImagenes = (product && product.imagenes) || (product && product.imagenesUrl) || [];
  
  const imagenInicial = (listaImagenes.length > 0 && (listaImagenes[0].url || listaImagenes[0])) || product?.imagenUrl || '';

  const [selectedImage, setSelectedImage] = useState(imagenInicial);

  useEffect(() => {
    const hayImagenes = listaImagenes.length > 0;
    hayImagenes && setSelectedImage(listaImagenes[0].url || listaImagenes[0]);
    !hayImagenes && setSelectedImage(product?.imagenUrl || '');
  }, [product]);

  return (
    <div className="product-gallery-container">
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
          SERIE CERTIFICADA #{product?.id}
        </span>
      </div>

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
