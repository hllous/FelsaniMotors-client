import React from 'react'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import PublicacionList from './components/publicaciones/PublicacionList'
// import TailwindMockTest from './views/TailwindMockTest'

function App() {
  return (
    <>
      {/* Cambia entre ComponentsDemo y TailwindMockTest según necesites */}
      {/*<ComponentsDemo />*/}
      {/* <TailwindMockTest /> */}
      <Navbar />
      <PublicacionList />
      <Footer />

    </>
  )
}

export default App
