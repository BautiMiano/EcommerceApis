
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Home from './views/Home'
import Register from './views/Register'
import Login from './views/Login'
import CrearPublicacion from './views/CrearPublicacion'
import MisProductos from './views/MisProductos'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crear-publicacion" element={<CrearPublicacion />} />
        <Route path="/mis-productos" element={<MisProductos />} />
      </Routes>

      <ToastContainer position="top-right" />
    </>
  )
}

export default App
