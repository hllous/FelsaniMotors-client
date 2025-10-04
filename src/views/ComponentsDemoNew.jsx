import React from 'react';
import Footer from '../components/common/Footer';
import Filter from '../components/common/Filter';

const ComponentsDemo = () => {

  return (
    <div className="min-h-screen flex flex-col bg-paleta1-cream-light">
      {/* Header con Filtros */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-paleta1-blue">
                Felsani Motors
              </h1>
              <p className="text-gray-600 mt-2">
                Marketplace de compra y venta de autos
              </p>
            </div>
            {/* Botón de filtros en el header */}
            <Filter />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Aquí irá el listado de autos */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ComponentsDemo;
