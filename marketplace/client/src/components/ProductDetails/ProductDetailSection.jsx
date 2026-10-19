import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ProductGallery } from './ProductGallery';
import { ProductPriceBox } from './ProductPriceBox';
import { ProductSizeSelector } from './ProductSizeSelector';
import { ProductQuantitySelector } from './ProductQuantitySelector';
import { FavoriteCheckbox } from './FavoriteCheckbox';
import { CartButton } from './CartButton';
import { 
  getCarritoByUsuarioId, 
  addProductoToCarrito, 
  agregarFavorito, 
  quitarFavorito,
  obtenerMisFavoritos
} from '../../utils/api.js';
import './ProductDetailSection.css';

Modal.setAppElement('#root');

export const ProductDetailSection = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product?.talle || '');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Lectura de sesión y rol
  const tokenGuardado = localStorage.getItem('token');
  const userIdGuardado = localStorage.getItem('userId');
  const estaAutenticado = Boolean(tokenGuardado);

  const rawRole = String(localStorage.getItem('userRole') || '').toUpperCase();
  const esVendedor = estaAutenticado && rawRole.includes('VENDEDOR');
  const esComprador = estaAutenticado && !esVendedor;

  // 1. Al cargar la pantalla, verificamos si este producto ya es favorito
  useEffect(() => {
    const verificarFavorito = esComprador && Boolean(product?.id);

    verificarFavorito && obtenerMisFavoritos()
      .then((favoritos) => {
        const existe = favoritos.some((fav) => fav.producto.id === product.id);
        setIsFavorite(existe);
      })
      .catch(() => setIsFavorite(false));
  }, [product?.id, esComprador]);

  // Manejo del Carrito
  const handleAddToCart = () => {
    !estaAutenticado && setIsModalOpen(true);

    esVendedor && toast.warn('Las cuentas con rol Vendedor no pueden realizar compras.');

    const puedeComprar = esComprador && Boolean(userIdGuardado) && userIdGuardado !== 'null';

    puedeComprar && getCarritoByUsuarioId(userIdGuardado)
      .then((carrito) => addProductoToCarrito(carrito.id, product.id, quantity))
      .then(() => toast.success('¡Producto agregado al carrito exitosamente!'))
      .catch((error) => toast.error(error.message));
  };

  // 2. Alternar entre agregar y quitar con el mismo botón
  const handleToggleFavorite = () => {
    !estaAutenticado && setIsModalOpen(true);

    // Evaluación por cortocircuito según el estado actual
    const debeQuitar = esComprador && isFavorite;
    const debeAgregar = esComprador && !isFavorite;

    // Si ya era favorito -> Lo quitamos
    debeQuitar && quitarFavorito(product.id)
    .then(() => {
      setIsFavorite(false);
      toast.info('Producto eliminado de tus favoritos');
    })
    .catch((error) => toast.error(error.message));

  debeAgregar && agregarFavorito(product.id)
    .then(() => {
      setIsFavorite(true);
      toast.success('¡Producto guardado en tus favoritos!');
    })
    .catch((error) => {
      // Si el servidor responde 400 indicando que ya existía, corregimos el estado local
      const yaEsFavorito = error.status === 400 || (error.message && error.message.includes('ya está'));
      
      yaEsFavorito && setIsFavorite(true);
      yaEsFavorito && toast.info('El producto ya estaba guardado en tus favoritos.');
      
      !yaEsFavorito && toast.error(error.message);
    });
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    const canDecrease = quantity > 1;
    canDecrease && setQuantity(quantity - 1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="product-detail-main">
      <ProductGallery product={product} />

      <div className="product-info-section">
        <span className="product-sku">LÍNEA OFICIAL • CÓDIGO PRODUCCIÓN #{product.id}</span>
        <h1 className="product-title">{product.nombre}</h1>

        <ProductPriceBox precio={product.precio} />

        <ProductSizeSelector 
          product={product}
          selectedSize={selectedSize} 
          onSelectSize={setSelectedSize} 
        />

        <ProductQuantitySelector 
          quantity={quantity} 
          onIncrease={handleIncreaseQuantity} 
          onDecrease={handleDecreaseQuantity} 
        />

        <div className="actions-container">
          <CartButton 
            texto={`AGREGAR AL CARRITO ($${product.precio * quantity})`}
            onClick={handleAddToCart}
          />

          <button 
            type="button" 
            className="btn-go-to-cart"
            onClick={() => navigate('/carrito')}
          >
            <span className="material-symbols-outlined">shopping_cart_checkout</span>
            VER MI CARRITO
          </button>

          <FavoriteCheckbox 
            isFavorite={isFavorite} 
            onToggle={handleToggleFavorite} 
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="auth-react-modal"
        overlayClassName="auth-react-modal-overlay"
        contentLabel="Inicio de sesión requerido"
      >
        <button type="button" className="auth-modal-close" onClick={closeModal}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="auth-modal-icon-container">
          <span className="material-symbols-outlined">lock</span>
        </div>

        <h3 className="auth-modal-title">Iniciar sesión requerido</h3>
        <p className="auth-modal-text">
          Para agregar productos al carrito o guardarlos en favoritos necesitás iniciar sesión en tu cuenta.
        </p>

        <div className="auth-modal-actions">
          <Link to="/login" className="auth-modal-btn auth-modal-btn-primary">
            Iniciar sesión
          </Link>
          <Link to="/registro" className="auth-modal-btn auth-modal-btn-secondary">
            Registrarse
          </Link>
        </div>
      </Modal>
    </div>
  );
};