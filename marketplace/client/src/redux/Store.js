// Store: el estado global de la aplicación.
// Se divide por objeto del back: cada slice maneja una parte.
// Los objetos que se relacionan mucho comparten archivo (cada uno con su reducer):
// ProductSlice.js: productos, categorías, descuentos e imágenes
// CarritoSlice.js: carrito y órdenes · UsuarioSlice.js: auth y usuarios
import { configureStore } from '@reduxjs/toolkit'
import productosReducer, { categoriasReducer, descuentosReducer, imagenesReducer } from './slice/ProductSlice'
import ticketsReducer from './slice/TicketSlice'
import chatReducer from './slice/ChatSlice'
import usuariosReducer, { authReducer } from './slice/UsuarioSlice'
import comentariosReducer from './slice/ComentarioSlice'
import favoritosReducer from './slice/FavoritoSlice'
import carritoReducer, { ordenesReducer } from './slice/CarritoSlice'

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
