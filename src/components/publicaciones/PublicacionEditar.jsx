import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicacionById, updatePublicacion, deletePublicacion, updateEstadoPublicacion } from '../../redux/slices/publicacionesSlice';
import { fetchFotosByPublicacion, uploadFoto, deleteFoto, setFotoPrincipal } from '../../redux/slices/fotosSlice';
import Modal from '../common/Modal';

const PublicacionEditar = () => {
  
  // Parametros
  const { id } = useParams();
  const idPublicacion = parseInt(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { currentItem: publicacion } = useSelector((state) => state.publicaciones);
  const { fotosByPublicacion } = useSelector((state) => state.fotos);

  const [imagenes, setImagenes] = useState([]) 
  const [imagenActual, setImagenActual] = useState(0);
  const [publicacionesSeleccionadas, setPublicacionesSeleccionadas] = useState([]);
  const [principalId, setPrincipalId] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState('Disponible')
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const showModal = (config) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false });
  };

  // Plantilla de los cambios
  const [cambios, setCambios] = useState({
    imgBorrar: [],
    imgAgregar: [],
    titulo: '',
    precio: '',
    ubicacion: '',
    descripcion: '',
    metodoDePago: '',
    estado: 'A',
    descuentoPorcentaje: 0
  });

  // Cargar publicación y fotos
  useEffect(() => {
    if (!publicacion || publicacion.idPublicacion !== idPublicacion) {
      dispatch(fetchPublicacionById(idPublicacion));
    }
    if (!fotosByPublicacion[idPublicacion]) {
      dispatch(fetchFotosByPublicacion(idPublicacion));
    }
  }, [idPublicacion, dispatch, publicacion?.idPublicacion, fotosByPublicacion]);

  // Inicializar cambios
  useEffect(() => {
    if (publicacion) {
      setPrincipalId(publicacion.idFotoPrincipal);
      
      setCambios({
        imgBorrar: [],
        imgAgregar: [],
        titulo: publicacion.titulo || '',
        precio: publicacion.precio || '',
        ubicacion: publicacion.ubicacion || '',
        descripcion: publicacion.descripcion || '',
        metodoDePago: publicacion.metodoDePago || '',
        estado: publicacion.estado || 'A',
        descuentoPorcentaje: publicacion.descuentoPorcentaje || 0
      });

      // Establecer estado
      if(publicacion.estado === 'A') setNuevoEstado('Disponible');
      else if(publicacion.estado === 'V') setNuevoEstado('Vendido');
      else if(publicacion.estado === 'P') setNuevoEstado('Pausado');
    }
  }, [idPublicacion]);

  // Convertir fotos
  useEffect(() => {
    const fotos = fotosByPublicacion[idPublicacion];
    if (fotos && fotos.length > 0) {
      const imagenesFormateadas = fotos.map(foto => ({
        idImg: foto.id,
        file: foto.file,
        esPrincipal: foto.esPrincipal,
        orden: foto.orden,
        img: `data:image/jpeg;base64,${foto.file}`
      }));
      setImagenes(imagenesFormateadas);
    }
  }, [idPublicacion, Object.keys(fotosByPublicacion).length]);

  const cantidad = imagenes.length;

  const siguienteImagen = () => {
    if (imagenActual < cantidad - 1) setImagenActual(imagenActual + 1);
  };

  const anteriorImagen = () => {
    if (imagenActual > 0) setImagenActual(imagenActual - 1);
  };

  // handles

  const onFotoClick = (url) => {
    if (publicacionesSeleccionadas.some((pub) => url.img === pub.img)) {
      setPublicacionesSeleccionadas(publicacionesSeleccionadas.filter((pub) => pub.img !== url.img));
    } else {
      setPublicacionesSeleccionadas([...publicacionesSeleccionadas, url]);
    }
  };

  const handleEliminarClick = () => {
    if(publicacionesSeleccionadas.length === 0) {
      showModal({
        type: 'warning',
        title: 'Selección Vacía',
        message: 'Selecciona al menos una imagen para eliminar',
        showCancel: false
      });
      return;
    }
    
    if(imagenes.length === publicacionesSeleccionadas.length) {
      showModal({
        type: 'warning',
        title: 'Acción No Permitida',
        message: 'No puedes eliminar todas las imágenes. Debe quedar al menos una.',
        showCancel: false
      });
      return;
    }

    setCambios({ ...cambios, imgBorrar: [...cambios.imgBorrar, ...publicacionesSeleccionadas] });
    const resto = imagenes.filter((img) => !publicacionesSeleccionadas.some((pub) => pub.img === img.img));
    setImagenes(resto);
    setPublicacionesSeleccionadas([]);
    
    // Ajustar imagen actual si es necesario
    if(imagenActual >= resto.length) {
      setImagenActual(resto.length > 0 ? resto.length - 1 : 0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCambios({ ...cambios, [name]: value });
  };

  const handleAñadirImagen = (e) => {
    const archivos = Array.from(e.target.files)
    const nuevasImagenes = archivos.map((file) => ({
      idImg: null,
      img: URL.createObjectURL(file),
      file: file
    }));
    setImagenes((prev) => [...prev, ...nuevasImagenes]);
    setCambios({
      ...cambios,
      imgAgregar: [...cambios.imgAgregar, ...archivos]
    });
  };

  const handleEstadoChange = (value) => {
    setNuevoEstado(value)
    let currentEstado = 'A'
    if(value === "Disponible") {
        currentEstado = "A"
      } else if(value === "Vendido") {
        currentEstado = "V"
      } else if(value === "Pausado") {
        currentEstado = "P"
      }
    setCambios({
      ...cambios,
      estado: currentEstado
    })
  }

  const handlePrincipalClick = () => {
    if(publicacionesSeleccionadas.length !== 1) {
      showModal({
        type: 'warning',
        title: 'Selección Incorrecta',
        message: 'Selecciona exactamente una imagen para marcar como principal',
        showCancel: false
      });
      return;
    }
    if(!publicacionesSeleccionadas[0].idImg) {
      showModal({
        type: 'info',
        title: 'Acción No Disponible',
        message: 'Primero guarda los cambios para poder seleccionar una imagen nueva como principal',
        showCancel: false
      });
      return;
    }
    setPrincipalId(publicacionesSeleccionadas[0].idImg);
    showModal({
      type: 'info',
      title: 'Imagen Principal',
      message: 'Imagen seleccionada como principal. Recuerda guardar los cambios.',
      showCancel: false
    });
  };

  const handleCancelarClick = () => {
    navigate(`/publicacion/${idPublicacion}`)
  }

  const handleEliminarPublicacion = () => {
    showModal({
      type: 'warning',
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      showCancel: true,
      onConfirm: async () => {
        const result = await dispatch(deletePublicacion({ idPublicacion, token }));
        
        if (result.payload) {
          showModal({
            type: 'success',
            title: 'Éxito',
            message: 'Publicación eliminada exitosamente',
            showCancel: false,
            onConfirm: () => navigate('/')
          });
        } else {
          showModal({
            type: 'error',
            title: 'Error',
            message: 'Error al eliminar la publicación',
            showCancel: false
          });
        }
      }
    });
  }

  const handleCambioClick = () => {
    // Validaciones
    if(!cambios.titulo || !cambios.titulo.trim()) {
      showModal({
        type: 'warning',
        title: 'Campo Requerido',
        message: 'El título no puede estar vacío',
        showCancel: false
      });
      return;
    }
    if(!cambios.precio || isNaN(parseFloat(cambios.precio)) || parseFloat(cambios.precio) <= 0) {
      showModal({
        type: 'warning',
        title: 'Precio Inválido',
        message: 'El precio debe ser un número válido mayor a 0',
        showCancel: false
      });
      return;
    }
    if(!cambios.ubicacion || !cambios.ubicacion.trim()) {
      showModal({
        type: 'warning',
        title: 'Campo Requerido',
        message: 'La ubicación no puede estar vacía',
        showCancel: false
      });
      return;
    }


    const procesarCambios = async () => {
      let hayError = false;

      // PASO 1: Eliminar fotos
      if (cambios.imgBorrar.length > 0) {
        const promesasEliminar = cambios.imgBorrar
          .filter(img => img.idImg)
          .map(img => dispatch(deleteFoto({ idPublicacion, idFoto: img.idImg, token })));
        
        const resultados = await Promise.all(promesasEliminar);
        if (resultados.some(r => !r.payload)) {
          hayError = true;
        }
      }

      // PASO 2: Agregar fotos nuevas
      if (cambios.imgAgregar.length > 0) {
        const promesasAgregar = cambios.imgAgregar.map((file, index) => 
          dispatch(uploadFoto({ 
            idPublicacion, 
            file, 
            esPrincipal: false, 
            orden: index, 
            token 
          }))
        );
        
        const resultados = await Promise.all(promesasAgregar);
        if (resultados.some(r => !r.payload)) {
          hayError = true;
        }
      }

      // PASO 3: Actualizar datos de la publicacion
      const publicacionResult = await dispatch(
        updatePublicacion({
            idPublicacion,
            publicacionData: {
                titulo: cambios.titulo,
                descripcion: cambios.descripcion,
                ubicacion: cambios.ubicacion,
                precio: parseFloat(cambios.precio),
                metodoDePago: cambios.metodoDePago,
                descuentoPorcentaje: parseInt(cambios.descuentoPorcentaje) || 0
            },
            token
      }));

      if (!publicacionResult.payload) {
        hayError = true;
      }

      // PASO 4: Actualizar estado si se modifico
      if (cambios.estado !== publicacion.estado) {
        const estadoResult = await dispatch(updateEstadoPublicacion({ 
          idPublicacion, 
          estado: cambios.estado, 
          token 
        }));
        
        if (!estadoResult.payload) {
          hayError = true;
        }
      }

      // PASO 5: Actualizar imagen principal si se cambio
      if (principalId && principalId !== publicacion.idFotoPrincipal) {
        const principalResult = await dispatch(setFotoPrincipal({ 
          idPublicacion, 
          idFoto: principalId, 
          token 
        }));
        
        if (!principalResult.payload) {
          hayError = true;
        }
      }

      // Finalizar
      if (hayError) {

        showModal({
          type: 'warning',
          title: 'Guardado con Errores',
          message: 'Cambios guardados con algunos errores. Por favor, verifica la publicación.',
          showCancel: false,
          onConfirm: () => navigate(`/publicacion/${idPublicacion}`)
        })

      } else {

        showModal({
          type: 'success',
          title: 'Éxito',
          message: 'Cambios guardados exitosamente',
          showCancel: false,
          onConfirm: () => navigate(`/publicacion/${idPublicacion}`)
        })
      }
    }

    procesarCambios();
  }

  if(!publicacion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F5EFE6] py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-8 space-y-8 border border-[#CBDCEB]">
        <h1 className="text-2xl font-semibold text-center text-gray-700">Editar Publicación</h1>

        {/* "Formulario" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Título</label>
            <input
              type="text"
              name="titulo"
              value={cambios.titulo}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Precio</label>
            <input
              type="text"
              name="precio"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cambios.precio}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Descuento (%)
              <span className="text-xs text-gray-500 ml-2">
                {cambios.descuentoPorcentaje > 0 && (
                  <span className="text-green-600 font-semibold">
                    Precio con descuento: ${(cambios.precio - (cambios.precio * cambios.descuentoPorcentaje / 100)).toLocaleString()}
                  </span>
                )}
              </span>
            </label>
            <input
              type="number"
              min="0"
              max="99"
              value={cambios.descuentoPorcentaje}
              onChange={(e) => {
                const valor = parseInt(e.target.value) || 0;
                if(valor >= 0 && valor <= 99) {
                  setCambios({ ...cambios, descuentoPorcentaje: valor });
                }
              }}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
              placeholder="0-99"
            />
            {cambios.descuentoPorcentaje > 0 && (
              <p className="text-xs text-green-600 mt-1">
                🏷️ Descuento del {cambios.descuentoPorcentaje}% aplicado
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={cambios.ubicacion}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">Descripción</label>
            <textarea
              name="descripcion"
              value={cambios.descripcion}
              onChange={handleInputChange}
              rows="3"
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            />
          </div>

          {/* Selector de estado */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">Estado de la publicación</label>
            <select
              value={nuevoEstado}
              onChange={(e) => handleEstadoChange(e.target.value)}
              className="w-full mt-1 p-2 rounded-md border border-[#CBDCEB] bg-[#F5EFE6] focus:outline-none focus:ring-2 focus:ring-[#CBDCEB]"
            >
              <option value="Disponible">Disponible</option>
              <option value="Vendido">Vendido</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>
        </div>

        {/* Carrusel */}
        {imagenes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Imágenes</h2>

            <div className="max-w-xl mx-auto overflow-hidden relative rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${imagenActual * 100}%)` }}
              >
                {imagenes.map((url, index) => {
                  const seleccionada = publicacionesSeleccionadas.some((pub) => pub.img === url.img);
                  return (
                    <div
                      key={index}
                      className="w-full h-64 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer relative"
                      onClick={() => onFotoClick(url)}
                    >
                      <img
                        src={url.img}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      {seleccionada && (
                        <div className="absolute top-3 right-3 bg-[#CBDCEB] rounded-full p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botones de navegación de imagenes*/}
              {imagenActual > 0 && (
                <button
                  onClick={anteriorImagen}
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#CBDCEB] text-white p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {imagenActual < cantidad - 1 && (
                <button
                  onClick={siguienteImagen}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-[#CBDCEB] text-white p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Botones acción */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleEliminarClick}
                disabled={publicacionesSeleccionadas.length === 0}
                className={`font-medium px-4 py-2 rounded-md transition ${
                  publicacionesSeleccionadas.length > 0
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Eliminar seleccionadas
              </button>

              <label className="bg-[#F5EFE6] border border-[#CBDCEB] text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-[#faf8f2] transition cursor-pointer">
                Añadir imagen
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAñadirImagen}
                  className="hidden"
                />
              </label>

              {/* Boton seleccion imagen principal */}
              <button
                onClick={handlePrincipalClick}
                disabled={publicacionesSeleccionadas.length !== 1}
                className={`font-medium px-4 py-2 rounded-md transition ${
                  publicacionesSeleccionadas.length === 1
                    ? "bg-[#CBDCEB] text-gray-700 hover:bg-[#b4cde2]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Seleccionar Principal
              </button>
            </div>
          </div>
        )}

        {/* Botones generales */}
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={handleCambioClick}
            className="bg-[#CBDCEB] text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-[#b4cde2] transition">
            Guardar Cambios
          </button>
          <button 
            onClick={handleCancelarClick}
            className="bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-400 transition">
            Cancelar
          </button>
        </div>

        {/* Boton eliminar publicacion */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleEliminarPublicacion}
            className="bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition"
          >
            Eliminar Publicación
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showCancel={modalConfig.showCancel}
      />
    </div>
  );
};

export default PublicacionEditar;
