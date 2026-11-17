import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ProductGallery } from './ProductGallery';
import { ProductPriceBox } from './ProductPriceBox';
import { ProductSizeSelector } from './ProductSizeSelector';
import { ProductQuantitySelector } from './ProductQuantitySelector';
import { FavoriteCheckbox } from './FavoriteCheckbox';
import { CartButton } from './CartButton';
import {
  agregarFavorito,
  fetchFavoritos,
  quitarFavorito,
  selectEsFavorito,
} from '../../redux/slice/FavoritoSlice.js';
import { agregarAlCarrito } from '../../redux/slice/CarritoSlice.js';
import './ProductDetailSection.css';

Modal.setAppElement('#root');

export const ProductDetailSection = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado local: solo lo usa esta pantalla
  // Si el producto ofrece un solo talle con stock, ya queda elegido
  const [selectedSize, setSelectedSize] = useState(() => {
    const conStock = (product.talles || []).filter((t) => t.stockDisponible > 0);
    return conStock.length === 1 ? conStock[0].talle : null;
  });
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado global: la sesión, los favoritos y el carrito vienen de Redux
  const { token, rol, usuarioId } = useSelector((state) => state.auth);
  const isFavorite = useSelector(selectEsFavorito(product.id));
  const statusFavoritos = useSelector((state) => state.favoritos.status);
  const favoritoEnAccion = useSelector((state) => state.favoritos.idEnAccion);
  const statusAgregar = useSelector((state) => state.carrito.statusAgregar);

  const estaAutenticado = Boolean(token);
  const esVendedor = estaAutenticado && rol.includes('VENDEDOR');
  const esComprador = estaAutenticado && !esVendedor;

  // Los favoritos del comprador se piden una sola vez por sesión
  useEffect(() => {
    esComprador && statusFavoritos === 'idle' && dispatch(fetchFavoritos());
  }, [dispatch, esComprador, statusFavoritos]);



  const handleAddToCart = () => {
    if (!estaAutenticado) {
      setIsModalOpen(true);
      return;
    }

    if (esVendedor) {
      toast.warn('Las cuentas con rol Vendedor no pueden realizar compras.');
      return;
    }

    if (!selectedSize) {
      toast.warn('Elegí un talle antes de agregar al carrito.');
      return;
    }

    if (!usuarioId || usuarioId === 'null') {
      toast.error('No se pudo identificar tu usuario. Por favor, volvé a iniciar sesión.');
      return;
    }

    // Si ya hay un pedido en camino, no se manda otro
    statusAgregar !== 'loading' &&
      dispatch(agregarAlCarrito({ productoId: product.id, talle: selectedSize, cantidad: quantity }));
  };



  const handleToggleFavorite = () => {
    if (!estaAutenticado) {
      setIsModalOpen(true);
      return;
    }

    if (esVendedor) {
      toast.warn('Las cuentas con rol Vendedor no pueden guardar favoritos.');
      return;
    }

    // Si ya hay un pedido en camino para este producto, no se manda otro
    if (favoritoEnAccion === product.id) return;

    isFavorite && dispatch(quitarFavorito(product.id));
    !isFavorite && dispatch(agregarFavorito(product));
  };

  // La cantidad no puede superar el stock disponible del talle elegido
  // (stockDisponible viene calculado desde el backend)
  const talleElegido = (product.talles || []).find((t) => t.talle === selectedSize);
  const stockDelTalle = talleElegido ? talleElegido.stockDisponible : 0;

  const handleSelectSize = (talle) => {
    setSelectedSize(talle);
    setQuantity(1);
  };

  const handleIncreaseQuantity = () => {
    const canIncrease = quantity < stockDelTalle;
    canIncrease && setQuantity(quantity + 1);
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

        <ProductPriceBox precio={product.precio} precioFinal={product.precioFinal} descuento={product.descuentoPorcentaje} />

        <ProductSizeSelector
          talles={product.talles}
          selectedSize={selectedSize}
          onSelectSize={handleSelectSize}
        />

        <ProductQuantitySelector
          quantity={quantity}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
        />

        <div className="actions-container">
          <CartButton
            texto={`AGREGAR AL CARRITO`}
            onClick={handleAddToCart}
            disabled={statusAgregar === 'loading'}
          />


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
          Para agregar productos al carrito, ver tu carrito o guardar favoritos necesitás iniciar sesión en tu cuenta.
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
