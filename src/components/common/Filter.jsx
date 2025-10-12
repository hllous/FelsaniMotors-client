import React, { useState } from 'react';

/**
 * Componente Filter - Sistema de filtros avanzado para búsqueda de vehículos
 * Utiliza la paleta de colores: paleta1-blue, paleta1-blue-light, paleta1-cream
 * Funcionalidades: filtros múltiples, dropdown expandible, contador de filtros activos
 */
const Filter = () => {
  // Estado para controlar la visibilidad del modal de filtros
  const [isOpen, setIsOpen] = useState(false);
  
  // Estado principal de filtros - contiene todas las categorías de filtrado
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

  // === CONFIGURACIÓN DE DATOS DE FILTROS ===
  
  // Marcas de vehículos disponibles en el sistema
  const marcas = ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Volkswagen', 'Nissan', 'Hyundai', 'Fiat', 'Renault', 'Peugeot'];
  
  // Mapeo de modelos por marca - permite filtrado dependiente entre marca y modelo
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

  /**
   * Función para obtener modelos disponibles según las marcas seleccionadas
   * Implementa filtrado dependiente: solo muestra modelos de marcas activas
   * @returns {Array} Array de modelos disponibles
   */
  const getModelosDisponibles = () => {
    if (filters.marca.length === 0) {
      // Si no hay marcas seleccionadas, mostrar todos los modelos disponibles
      return Object.values(modelosPorMarca).flat();
    }
    // Filtrar modelos solo de las marcas seleccionadas
    return filters.marca.flatMap(marca => modelosPorMarca[marca] || []);
  };

  // Configuración completa de opciones para cada tipo de filtro
  const filterOptions = {
    marca: marcas,
    modelo: getModelosDisponibles(), // Dinámico basado en marcas seleccionadas
    anio: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'],
    estado: ['Nuevo', 'Usado', 'Seminuevo'],
    kilometraje: ['0-50000', '50000-100000', '100000-150000', '150000-200000', '200000+'],
    combustible: ['Nafta', 'Diesel', 'GNC', 'Eléctrico', 'Híbrido'],
    tipoCategoria: ['Sedán', 'SUV', 'Hatchback', 'Pickup', 'Coupé', 'Minivan', 'Deportivo'],
    tipoCaja: ['Manual', 'Automática', 'CVT', 'Secuencial'],
    motor: ['1.0', '1.4', '1.6', '1.8', '2.0', '2.4', '3.0', '3.5', '4.0']
  };

  // Estado para controlar qué dropdown está abierto (solo uno a la vez)
  const [openDropdowns, setOpenDropdowns] = useState({});

  // === FUNCIONES DE MANEJO DE ESTADO ===

  /**
   * Controla la apertura/cierre de dropdowns de filtros
   * Permite múltiples dropdowns abiertos simultáneamente
   * @param {string} filterName - Nombre del filtro a toggle
   */
  const toggleDropdown = (filterName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  /**
   * Maneja la selección/deselección de opciones en los filtros
   * Permite múltiples selecciones por categoría
   * @param {string} filterName - Nombre de la categoría de filtro
   * @param {string} value - Valor a agregar/quitar del filtro
   */
  const handleCheckboxChange = (filterName, value) => {
    setFilters(prev => {
      const currentValues = prev[filterName];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value) // Quitar si ya está seleccionado
        : [...currentValues, value]; // Agregar si no está seleccionado
      
      return {
        ...prev,
        [filterName]: newValues
      };
    });
  };

  /**
   * Limpia todos los filtros activos
   * Resetea el estado a valores iniciales
   */
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

  /**
   * Aplica los filtros seleccionados
   * En el futuro se conectará con la lógica de filtrado de vehículos
   */
  const applyFilters = () => {
    console.log('Filtros aplicados:', filters);
    // TODO: Implementar lógica de filtrado de vehículos
    setIsOpen(false);
  };

  /**
   * Convierte las claves de filtros en etiquetas amigables para el usuario
   * @param {string} key - Clave del filtro
   * @returns {string} Etiqueta formateada
   */
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

  // Calcula el número total de filtros activos para mostrar en el badge
  const activeFiltersCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="relative">
      {/* === BOTÓN PRINCIPAL DE FILTROS === */}
      {/* Usa paleta1-blue para elementos interactivos y gray para estados neutros */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
      >
        {/* Icono de filtro SVG */}
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

      {/* === MODAL DE FILTROS === */}
      {/* Utiliza paleta1-blue como color principal y paleta1-cream para fondos suaves */}
      {isOpen && (
        <>
          {/* Overlay de fondo - oscurece el contenido detrás del modal */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Contenedor principal del modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-lg shadow-2xl w-[90%] max-w-4xl h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* === HEADER DEL MODAL === */}
              {/* Usa paleta1-blue para títulos y elementos importantes */}
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

              {/* === CONTENIDO PRINCIPAL === */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Lista expandible de filtros */}
                {/* Implementa design pattern de acordeón con paleta de colores consistente */}
                <div className="space-y-2">
                  {Object.keys(filters).map((filterKey) => (
                    <div key={filterKey} className="relative">
                      {/* Botón de categoría de filtro */}
                      {/* Usa fondos limpios sin beige */}
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

                      {/* === DROPDOWN EXPANDIBLE === */}
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
                              {filterOptions[filterKey].map((option) => (
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
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Resumen de filtros activos sin beige */}
                {activeFiltersCount > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-paleta1-blue-light rounded-lg">
                    <h3 className="text-sm font-semibold text-paleta1-blue mb-3">
                      Filtros Activos ({activeFiltersCount})
                    </h3>
                    {/* Tags de filtros activos con botón de eliminación */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, values]) =>
                        values.map((value) => (
                          <span
                            key={`${key}-${value}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-paleta1-blue text-white text-xs rounded-full"
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

              {/* === FOOTER CON ACCIONES === */}
              {/* Usa fondos limpios sin beige */}
              <div className="flex items-center justify-between p-6 border-t border-paleta1-blue-light bg-gray-50">
                {/* Botón para limpiar todos los filtros */}
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-paleta1-blue hover:text-paleta1-blue/80 font-medium transition-colors text-sm border border-paleta1-blue-light rounded-lg hover:bg-blue-50"
                >
                  Limpiar Filtros
                </button>
                {/* Botones de acción principales */}
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