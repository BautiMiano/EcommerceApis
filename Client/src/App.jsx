import './App.css'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Register from './views/Register'
import Login from './views/Login'
import Home from './views/Home'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      <ToastContainer position="top-right" />
    </>
  )
}

export default App
