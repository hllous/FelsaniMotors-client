import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import { AuthContext } from './context/AuthContext'
import PublicacionList from './components/publicaciones/PublicacionList'
import PublicacionForm from './components/publicaciones/PublicacionForm'
import Publicacion from './components/publicaciones/Publicacion'
import PublicacionEditar from './components/publicaciones/PublicacionEditar'
import TransaccionForm from './components/transacciones/TransaccionForm'
import TransaccionList from './components/transacciones/TransaccionList'
import UsuarioPerfil from './components/usuario/UsuarioPerfil'
import UsuarioActualizacion from './components/usuario/UsuarioActualizacion'
import CambioContraseña from './components/usuario/CambioContraseña'
import UsuarioPublicaciones from './components/usuario/UsuarioPublicaciones'
import UsuarioTransacciones from './components/usuario/UsuarioTransacciones'
import AdminDashboard from './components/admin/AdminDashboard'
import UsuariosAdmin from './components/admin/UsuariosAdmin'
import PublicacionesAdmin from './components/admin/PublicacionesAdmin'
import TransaccionesAdmin from './components/admin/TransaccionesAdmin'
import AutosAdmin from './components/admin/AutosAdmin'
import ComentariosAdmin from './components/admin/ComentariosAdmin'
import FAQ from './components/common/FAQ'

function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  const protectedElement = (element) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return element;
  };

  const adminElement = (element) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    if (user?.rol !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
    return element;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <Routes>
          {/* Rutas publicas */}
          <Route path="/" element={<PublicacionList />} />
          <Route path="/publicaciones" element={<PublicacionList />} />
          <Route path="/publicacion/:id" element={<Publicacion />} />
          <Route path="/crear-publicacion" element={<PublicacionForm />} />
          <Route 
            path="/editar-publicacion/:id" 
            element={
              <ProtectedRoute>
                <PublicacionEditar />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/comprar-carrito" 
            element={
              <ProtectedRoute>
                <TransaccionForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mis-transacciones" 
            element={
              <ProtectedRoute>
                <TransaccionList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <UsuarioPerfil />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil/actualizar" 
            element={
              <ProtectedRoute>
                <UsuarioActualizacion />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil/cambiar-contraseña" 
            element={
              <ProtectedRoute>
                <CambioContraseña />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil/publicaciones" 
            element={
              <ProtectedRoute>
                <UsuarioPublicaciones />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil/transacciones" 
            element={
              <ProtectedRoute>
                <UsuarioTransacciones />
              </ProtectedRoute>
            } 
          />

          {/* Rutas de administración */}
          <Route path="/admin" element={adminElement(<AdminDashboard />)} />
          <Route path="/admin/usuarios" element={adminElement(<UsuariosAdmin />)} />
          <Route path="/admin/publicaciones" element={adminElement(<PublicacionesAdmin />)} />
          <Route path="/admin/transacciones" element={adminElement(<TransaccionesAdmin />)} />
          <Route path="/admin/autos" element={adminElement(<AutosAdmin />)} />
          <Route path="/admin/comentarios" element={adminElement(<ComentariosAdmin />)} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
