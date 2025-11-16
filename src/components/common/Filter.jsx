import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOpcionesFiltro } from '../../redux/slices/publicacionesSlice';

const Filter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { opcionesFiltro } = useSelector((state) => state.publicaciones);
  
  const [filters, setFilters] = useState({
    marca: [],
    modelo: [],
    anio: [],
    estado: [],
    kilometraje: [],
    combustible: [],
    tipoCategoria: [],
    tipoCaja: [],
    motor: [],
    estadoPublicacion: [],
    precioMin: '',
    precioMax: ''
  });

  // Mapeo para mostrar valores
  const kilometrajeDisplay = {
    '0-50000': '0-50.000 km',
    '50000-100000': '50.000-100.000 km',
    '100000-150000': '100.000-150.000 km',
    '150000-200000': '150.000-200.000 km',
    '200000-999999999': '200.000+ km'
  };

  // Mapeo para mostrar estados de publicacion
  const estadoPublicacionDisplay = {
    'A': 'Disponible',
    'V': 'Vendida',
    'I': 'Pausada'
  };

  const filterOptions = useMemo(() => {
    if (!opcionesFiltro || !opcionesFiltro.marcas) {
      return {
        marca: [],
        modelo: [],
        anio: [],
        estado: [],
        kilometraje: ['0-50000', '50000-100000', '100000-150000', '150000-200000', '200000-999999999'],
        combustible: [],
        tipoCategoria: [],
        tipoCaja: [],
        motor: [],
        estadoPublicacion: ['A', 'V', 'I']
      };
    }
    
    return {
      marca: opcionesFiltro.marcas || [],
      modelo: opcionesFiltro.modelos || [],
      anio: opcionesFiltro.anios?.map(String) || [],
      estado: opcionesFiltro.estados || [],
      kilometraje: ['0-50000', '50000-100000', '100000-150000', '150000-200000', '200000-999999999'],
      combustible: opcionesFiltro.combustibles || [],
      tipoCategoria: opcionesFiltro.tipoCategorias || [],
      tipoCaja: opcionesFiltro.tipoCajas || [],
      motor: opcionesFiltro.motores || [],
      estadoPublicacion: ['A', 'V', 'I']
    };
  }, [opcionesFiltro]);

  useEffect(() => {
    dispatch(fetchOpcionesFiltro());
  }, []);

  // Inicializar filtros desde searchParams
  useEffect(() => {
    const newFilters = {
      marca: [],
      modelo: [],
      anio: [],
      estado: [],
      kilometraje: [],
      combustible: [],
      tipoCategoria: [],
      tipoCaja: [],
      motor: [],
      estadoPublicacion: [],
      precioMin: '',
      precioMax: ''
    };

    // Leer cada parámetro de la URL usando getAll para obtener múltiples valores
    for (const key in newFilters) {
      if (key === 'precioMin' || key === 'precioMax') {
        // Precio: leer valor único
        const value = searchParams.get(key);
        if (value) {
          newFilters[key] = value;
        }
      } else {
        // Arrays: leer múltiples valores
        const values = searchParams.getAll(key);
        if (values.length > 0) {
          newFilters[key] = values;
        }
      }
    }

    setFilters(newFilters);
  }, [searchParams]);

  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (filterName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleCheckboxChange = (filterName, value) => {
    setFilters(prev => {
      const currentArray = prev[filterName];
      const isSelected = currentArray.includes(value);
      
      let updatedArray;
      if (isSelected) {

        // Si ya esta, lo sacamos del array
        updatedArray = currentArray.filter(v => v !== value);
      } else {

        // Si no esta, lo agregamos
        updatedArray = [...currentArray, value];
      }
      
      return {
        ...prev,
        [filterName]: updatedArray
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
      motor: [],
      estadoPublicacion: [],
      precioMin: '',
      precioMax: ''
    });
  };

  const applyFilters = () => {

    const params = new URLSearchParams();
    
    const textoBusqueda = searchParams.get('q');
    if (textoBusqueda) {
      params.append('q', textoBusqueda);
    }
    
    // Enviar múltiples parámetros con el mismo nombre para cada valor (arrays)
    for (const key in filters) {
      if (key === 'precioMin' || key === 'precioMax') {
        // Precio: enviar solo si tiene valor
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      } else if (filters[key].length > 0) {
        // Arrays: agregar cada valor como un parámetro separado
        filters[key].forEach(value => {
          params.append(key, value);
        });
      }
    }
    
    navigate(`/publicaciones?${params.toString()}`);
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
      motor: 'Motor',
      estadoPublicacion: 'Estado Publicación'
    };
    return labels[key] || key;
  };

  // Contar filtros activos
  let activeFiltersCount = 0;
  for (const key in filters) {
    if (key === 'precioMin' || key === 'precioMax') {
      activeFiltersCount += filters[key] ? 1 : 0;
    } else {
      activeFiltersCount += filters[key].length;
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
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
        {/* Badge contador de filtros activos */}
        {activeFiltersCount > 0 && (
          <span className="bg-white text-gray-700 rounded-full px-2 py-0.5 text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Dropdown de filtros */}
      {isOpen && (
        <>
          {/* Overlay de fondo */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Contenedor principal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-lg shadow-2xl w-[90%] max-w-4xl h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-paleta1-blue flex items-center gap-2">
                  <svg 
                    className="w-5 h-5" 
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* PRINCIPAl */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Filtro de Precio */}
                <div className="mb-4 p-4 bg-white border border-paleta1-blue-light rounded-lg">
                  <h3 className="text-sm font-semibold text-paleta1-blue mb-3">Rango de Precio</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Precio Mínimo</label>
                      <input
                        type="number"
                        placeholder="$ 0"
                        value={filters.precioMin}
                        onChange={(e) => setFilters(prev => ({ ...prev, precioMin: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-paleta1-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Precio Máximo</label>
                      <input
                        type="number"
                        placeholder="$ 999999"
                        value={filters.precioMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, precioMax: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-paleta1-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Lista expandible de filtros */}
                <div className="space-y-2">
                  {(() => {
                    let filterKeys = [];
                    for (const key in filterOptions) {
                      filterKeys = [...filterKeys, key];
                    }
                    return filterKeys.map((filterKey) => (
                    <div key={filterKey} className="relative">
                      {/* Botón de categoría de filtro */}
                      <div
                        onClick={() => toggleDropdown(filterKey)}
                        className={`flex items-center justify-between px-4 py-3 bg-white border border-paleta1-blue-light ${
                          openDropdowns[filterKey] 
                            ? 'rounded-t-lg border-b-0' 
                            : 'rounded-lg'
                        } hover:bg-blue-50 transition-colors cursor-pointer`}
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-paleta1-blue">
                            {getFilterLabel(filterKey)}
                          </span>
                          {/* Badge de contador para filtros activos en esta categoría */}
                          {filters[filterKey].length > 0 && (
                            <span className="ml-2 text-xs bg-paleta1-blue text-white rounded-full px-2 py-0.5">
                              {filters[filterKey].length}
                            </span>
                          )}
                        </div>
                        {/* Icono de flecha que rota según el estado */}
                        <svg
                          className={`w-4 h-4 text-paleta1-blue transition-transform ${
                            openDropdowns[filterKey] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* DROPDOWN */}
                      {/* Se conecta visualmente con el botón principal sin espacios */}
                      {openDropdowns[filterKey] && (
                        <div className="overflow-hidden">
                          <div className="bg-white border-l border-r border-b border-paleta1-blue-light rounded-b-lg">
                            {/* Header del dropdown */}
                            <div className="p-3 bg-blue-50">
                              <div className="text-xs font-medium text-paleta1-blue mb-2">
                                Seleccionar {getFilterLabel(filterKey)}
                              </div>
                            </div>
                            {/* Lista de opciones con scroll */}
                            <div className="p-2 max-h-60 overflow-y-auto">
                              {filterOptions[filterKey].map((option) => {
                                // Para kilometraje y estadoPublicacion, mostrar valor formateado pero guardar valor real
                                let displayValue = option;
                                if (filterKey === 'kilometraje') {
                                  displayValue = kilometrajeDisplay[option] || option;
                                } else if (filterKey === 'estadoPublicacion') {
                                  displayValue = estadoPublicacionDisplay[option] || option;
                                }
                                
                                return (
                                  <label
                                    key={option}
                                    className="flex items-center px-3 py-2 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={filters[filterKey].includes(option)}
                                      onChange={() => handleCheckboxChange(filterKey, option)}
                                      className="w-4 h-4 text-paleta1-blue border-paleta1-blue-light rounded focus:ring-paleta1-blue focus:ring-2"
                                    />
                                    <span className="ml-3 text-sm text-gray-700">
                                      {displayValue}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ));
                  })()}
                </div>

                {/* Resumen de filtros */}
                {activeFiltersCount > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-paleta1-blue-light rounded-lg">
                    <h3 className="text-sm font-semibold text-paleta1-blue mb-3">
                      Filtros Activos ({activeFiltersCount})
                    </h3>
                    <div className="flex flex-wrap gap-2">

                      {/* Mostrar rango de precio si está activo */}
                      {(filters.precioMin || filters.precioMax) && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 bg-paleta1-blue text-white text-xs rounded-full"
                        >
                          Precio: ${filters.precioMin || '0'} - ${filters.precioMax || '∞'}
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, precioMin: '', precioMax: '' }))}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      )}

                      {/* Mostrar en pantalla filtros activos */}
                      {(() => {
                        let badges = [];
                        for (const key in filterOptions) {
                          filters[key].forEach((value) => {
                            let displayValue = value;
                            if (key === 'kilometraje') {
                              displayValue = kilometrajeDisplay[value] || value;
                            } else if (key === 'estadoPublicacion') {
                              displayValue = estadoPublicacionDisplay[value] || value;
                            }
                            const element = <span
                              key={`${key}-${value}`}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-paleta1-blue text-white text-xs rounded-full"
                            >
                              {getFilterLabel(key)}: {displayValue}
                              <button
                                onClick={() => handleCheckboxChange(key, value)}
                                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </span>;
                            badges = [...badges, element];
                          });
                        }
                        return badges;
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-6 border-t border-paleta1-blue-light bg-gray-50">
                {/* Botón para limpiar todos los filtros */}
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-paleta1-blue hover:text-paleta1-blue/80 font-medium transition-colors text-sm border border-paleta1-blue-light rounded-lg hover:bg-blue-50"
                >
                  Limpiar Filtros
                </button>
                {/* Botones de acciones principales */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 border border-paleta1-blue-light text-paleta1-blue rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-paleta1-blue text-white rounded-lg hover:bg-paleta1-blue/90 transition-colors shadow-md text-sm font-medium"
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