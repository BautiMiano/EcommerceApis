// Store: el estado global de la aplicación.
// Se divide por objeto del back: cada slice maneja una parte.
// Los slices de productos y de categorías están en ProductSlice.js
import { configureStore } from '@reduxjs/toolkit'
import productosReducer, { categoriasReducer } from './slice/ProductSlice'
import ticketsReducer from './slice/TicketSlice'
import chatReducer from './slice/ChatSlice'
import authReducer from './slice/AuthSlice'
import usuariosReducer from './slice/UsuarioSlice'
import comentariosReducer from './slice/ComentarioSlice'
import favoritosReducer from './slice/FavoritoSlice'
import carritoReducer from './slice/CarritoSlice'
import ordenesReducer from './slice/OrdenSlice'
import descuentosReducer from './slice/DescuentoSlice'
import imagenesReducer from './slice/ImagenSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    usuarios: usuariosReducer,       // lista del admin y perfil propio
    categorias: categoriasReducer,
    productos: productosReducer,
    descuentos: descuentosReducer,
    imagenes: imagenesReducer,
    favoritos: favoritosReducer,
    carrito: carritoReducer,
    ordenes: ordenesReducer,         // ventas del vendedor
    comentarios: comentariosReducer,
    tickets: ticketsReducer,
    chat: chatReducer,
  },
})
