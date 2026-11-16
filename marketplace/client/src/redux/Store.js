// Store: el estado global de la aplicación.
// Se divide por objeto del back: cada slice maneja una parte.
// Los dos slices (productos y categorías) están en ProductSlice.js
import { configureStore } from '@reduxjs/toolkit'
import productosReducer, { categoriasReducer } from './slice/ProductSlice'
import ticketsReducer from './slice/TicketSlice'
import chatReducer from './slice/ChatSlice'

export const store = configureStore({
  reducer: {
    categorias: categoriasReducer,
    productos: productosReducer,
    tickets: ticketsReducer,
    chat: chatReducer,
  },
})
