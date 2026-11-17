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
    usuarios: usuariosReducer,
    categorias: categoriasReducer,
    productos: productosReducer,
    descuentos: descuentosReducer,
    imagenes: imagenesReducer,
    favoritos: favoritosReducer,
    carrito: carritoReducer,
    ordenes: ordenesReducer,
    comentarios: comentariosReducer,
    tickets: ticketsReducer,
    chat: chatReducer,
  },
})
