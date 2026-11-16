// Store: el estado global de la aplicación.
// Se divide por objeto del back: cada slice maneja una parte.
// Los dos slices (productos y categorías) están en ProductSlice.js
import { configureStore } from '@reduxjs/toolkit'
import productosReducer, { categoriasReducer } from './slice/ProductSlice'
import ticketsReducer from './slice/TicketSlice'
import chatReducer from './slice/ChatSlice'
import authReducer from './slice/AuthSlice'
import usuarioReducer from './slice/UsuarioSlice'
import comentariosReducer from './slice/ComentarioSlice'
import favoritosReducer from './slice/FavoritoSlice'
import carritoReducer from './slice/CarritoSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categorias: categoriasReducer,
    productos: productosReducer,
    tickets: ticketsReducer,
    chat: chatReducer,
    usuario: usuarioReducer,
    comentarios: comentariosReducer,
    favoritos: favoritosReducer,
    carrito: carritoReducer,
  },
})
