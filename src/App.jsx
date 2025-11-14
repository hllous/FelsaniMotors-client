import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import HomeView from './views/HomeView'
import PerfilView from './views/PerfilView'
import AdminView from './views/AdminView'
import TransaccionView from './views/TransaccionView'

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <Routes>
          {/* Vistas de perfil de usuario */}
          <Route path="/perfil/*" element={<PerfilView />} />
          
          {/* Vistas de administracion */}
          <Route path="/admin/*" element={<AdminView />} />
          
          {/* Vistas de transacciones */}
          <Route path="/comprar-carrito/*" element={<TransaccionView />} />
          <Route path="/mis-transacciones/*" element={<TransaccionView />} />
          
          {/* Vistas publicas y de publicaciones */}
          <Route path="/*" element={<HomeView />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
