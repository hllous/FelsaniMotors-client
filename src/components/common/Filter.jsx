import React, { useState } from 'react';

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    marca: [],
    modelo: [],
    anio: [],
    estado: [],
    kilometraje: [],
    combustible: [],
    tipoCategoria: [],
    tipoCaja: [],
    motor: []
  });

  // Opciones para cada filtro
  const marcas = ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Volkswagen', 'Nissan', 'Hyundai', 'Fiat', 'Renault', 'Peugeot'];
  
  // Modelos por marca
  const modelosPorMarca = {
    'Toyota': ['Corolla', 'Etios', 'Hilux', 'SW4', 'RAV4', 'Yaris', 'Camry'],
    'Ford': ['Focus', 'Fiesta', 'Ranger', 'EcoSport', 'Ka', 'Mondeo', 'Territory'],
    'Chevrolet': ['Cruze', 'Onix', 'Tracker', 'S10', 'Spin', 'Prisma', 'Montana'],
    'Honda': ['Civic', 'City', 'HR-V', 'CR-V', 'Fit', 'Accord'],
    'Volkswagen': ['Gol', 'Polo', 'Vento', 'Amarok', 'T-Cross', 'Tiguan', 'Passat'],
    'Nissan': ['Versa', 'Sentra', 'Kicks', 'Frontier', 'X-Trail', 'March'],
    'Hyundai': ['HB20', 'Creta', 'Tucson', 'Elantra', 'i30', 'Santa Fe'],
    'Fiat': ['Argo', 'Cronos', 'Toro', 'Strada', 'Pulse', 'Mobi', 'Fastback'],
    'Renault': ['Sandero', 'Logan', 'Duster', 'Kangoo', 'Alaskan', 'Captur'],
    'Peugeot': ['208', '2008', '3008', '308', '408', '5008', 'Partner']
  };

  // Obtener modelos disponibles según las marcas seleccionadas
  const getModelosDisponibles = () => {
    if (filters.marca.length === 0) {
      // Si no hay marcas seleccionadas, mostrar todos los modelos
      return Object.values(modelosPorMarca).flat();
    }
    // Mostrar solo modelos de las marcas seleccionadas
    return filters.marca.flatMap(marca => modelosPorMarca[marca] || []);
  };

  const filterOptions = {
    marca: marcas,
    modelo: getModelosDisponibles(),
    anio: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'],
    estado: ['Nuevo', 'Usado', 'Seminuevo'],
    kilometraje: ['0-50000', '50000-100000', '100000-150000', '150000-200000', '200000+'],
    combustible: ['Nafta', 'Diesel', 'GNC', 'Eléctrico', 'Híbrido'],
    tipoCategoria: ['Sedán', 'SUV', 'Hatchback', 'Pickup', 'Coupé', 'Minivan', 'Deportivo'],
    tipoCaja: ['Manual', 'Automática', 'CVT', 'Secuencial'],
    motor: ['1.0', '1.4', '1.6', '1.8', '2.0', '2.4', '3.0', '3.5', '4.0']
  };

  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (filterName) => {
    setOpenDropdowns(prev => {
      const isCurrentlyOpen = prev[filterName];
      // Si está abierto, lo cierra. Si está cerrado, cierra todos los demás y abre este
      if (isCurrentlyOpen) {
        return { ...prev, [filterName]: false };
      } else {
        // Cierra todos y abre solo el seleccionado
        return { [filterName]: true };
      }
    });
  };

  const handleCheckboxChange = (filterName, value) => {
    setFilters(prev => {
      const currentValues = prev[filterName];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterName]: newValues
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      marca: [],
      modelo: [],
      anio: [],
      estado: [],
      kilometraje: [],
      combustible: [],
      tipoCategoria: [],
      tipoCaja: [],
      motor: []
    });
  };

  const applyFilters = () => {
    console.log('Filtros aplicados:', filters);
    // Aquí irá la lógica para filtrar los autos
    setIsOpen(false);
  };

  const getFilterLabel = (key) => {
    const labels = {
      marca: 'Marca',
      modelo: 'Modelo',
      anio: 'Año',
      estado: 'Estado',
      kilometraje: 'Kilometraje',
      combustible: 'Combustible',
      tipoCategoria: 'Categoría',
      tipoCaja: 'Tipo de Caja',
      motor: 'Motor'
    };
    return labels[key] || key;
  };

  const activeFiltersCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="relative">
      {/* Botón de Filtros */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors  hover:cursor-pointer"
      >
        <svg 
          className="w-5 h-5 text-gray-700" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        {activeFiltersCount > 0 && (
          <span className="bg-white text-paleta1-blue rounded-full px-2 py-0.5 text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Popup de Filtros */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
            <div 
              className="bg-white rounded-lg shadow-2xl w-[95%] max-w-7xl h-[98vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-paleta1-blue flex items-center gap-2">
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filtros de Búsqueda
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.keys(filters).map((filterKey) => (
                    <div key={filterKey} className="relative mb-4">
                      <button
                        onClick={() => toggleDropdown(filterKey)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-paleta1-cream rounded-lg hover:bg-paleta1-blue-light/30 transition-colors border border-paleta1-blue-light"
                      >
                        <span className="font-medium text-gray-800">
                          {getFilterLabel(filterKey)}
                          {filters[filterKey].length > 0 && (
                            <span className="ml-2 text-xs bg-paleta1-blue text-white rounded-full px-2 py-0.5">
                              {filters[filterKey].length}
                            </span>
                          )}
                        </span>
                        <svg
                          className={`w-5 h-5 text-paleta1-blue transition-transform ${
                            openDropdowns[filterKey] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      {openDropdowns[filterKey] && (
                        <div className="absolute z-10 mt-2 w-full bg-white border border-paleta1-blue-light rounded-lg shadow-lg max-h-80 overflow-y-auto">
                          <div className="p-4">
                            {filterOptions[filterKey].map((option) => (
                              <label
                                key={option}
                                className="flex items-center px-4 py-4 hover:bg-paleta1-cream rounded cursor-pointer transition-colors mb-1"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters[filterKey].includes(option)}
                                  onChange={() => handleCheckboxChange(filterKey, option)}
                                  className="w-5 h-5 text-paleta1-blue border-gray-300 rounded focus:ring-paleta1-blue focus:ring-2"
                                />
                                <span className="ml-4 text-base text-gray-700">
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Filtros Activos */}
                {activeFiltersCount > 0 && (
                  <div className="mt-8 p-6 bg-paleta1-blue-light/20 rounded-lg">
                    <h3 className="text-base font-semibold text-gray-700 mb-4">
                      Filtros Activos ({activeFiltersCount})
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(filters).map(([key, values]) =>
                        values.map((value) => (
                          <span
                            key={`${key}-${value}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-paleta1-blue text-white text-sm rounded-full"
                          >
                            {getFilterLabel(key)}: {value}
                            <button
                              onClick={() => handleCheckboxChange(key, value)}
                              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-8 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors text-base"
                >
                  Limpiar Filtros
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-8 py-3 bg-paleta1-blue text-white rounded-lg hover:bg-paleta1-blue/90 transition-colors shadow-md text-base font-medium"
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Filter;