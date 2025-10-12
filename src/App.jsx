import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import PublicacionList from './components/publicaciones/PublicacionList'
import PublicacionForm from './components/publicaciones/PublicacionForm'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PublicacionList />} />
        <Route path="/publicaciones" element={<PublicacionList />} />
        <Route path="/crear-publicacion" element={<PublicacionForm />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
