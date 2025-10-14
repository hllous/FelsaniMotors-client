import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ComentarioList from "../comentarios/ComentarioList";

const Publicacion = () => {
    const { id } = useParams();
    const idPublicacion = parseInt(id);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    
    const [publicacion, setPublicacion] = useState(null);
    const [imagenes, setImagenes] = useState([]);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatearEstado = (estado) => {
        const estadosMap = {
            'A': 'Disponible',
            'V': 'Vendido',
            'P': 'Pausado'
        };
        return estadosMap[estado] || estado || 'Disponible';
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    };

    useEffect(() => {
        if (!idPublicacion) return;

        setLoading(true);

        // Obtener datos de la publicación
        fetch(`http://localhost:4002/api/publicaciones/${idPublicacion}`)
            .then((response) => {
                if (!response.ok) throw new Error('Publicación no encontrada');
                return response.json();
            })
            .then((data) => {
                console.log("🚀 Datos actualizados del backend:", data);
                console.log("📋 Campos del auto disponibles:", {
                    anio: data.anio,
                    kilometraje: data.kilometraje,
                    combustible: data.combustible,
                    motor: data.motor,
                    tipoCaja: data.tipoCaja,
                    capacidadTanque: data.capacidadTanque,
                    tipoCategoria: data.tipoCategoria,
                    estadoAuto: data.estadoAuto
                });
                setPublicacion(data);

                // Obtener imágenes de la publicación
                return fetch(`http://localhost:4002/api/publicaciones/${idPublicacion}/fotos-contenido`);
            })
            .then((fotosResponse) => {
                if (fotosResponse.ok) {
                    return fotosResponse.json();
                }
                return null;
            })
            .then((fotosData) => {
                if (fotosData) {
                    const imagenesFormateadas = fotosData.map(foto => `data:image/jpeg;base64,${foto.file}`);
                    setImagenes(imagenesFormateadas);
                }
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [idPublicacion]);

    // Navegación con teclado en el modal
    useEffect(() => {
        if (!mostrarModal) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMostrarModal(false);
            } else if (e.key === 'ArrowLeft' && imagenes.length > 1) {
                setImagenSeleccionada(imagenSeleccionada > 0 ? imagenSeleccionada - 1 : imagenes.length - 1);
            } else if (e.key === 'ArrowRight' && imagenes.length > 1) {
                setImagenSeleccionada(imagenSeleccionada < imagenes.length - 1 ? imagenSeleccionada + 1 : 0);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mostrarModal, imagenSeleccionada, imagenes.length]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64 bg-paleta1-cream-light">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paleta1-blue"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-lg">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar la publicación</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!publicacion) {
        return (
            <div className="bg-paleta1-cream-light border border-paleta1-cream rounded-lg p-6 text-center shadow-lg">
                <div className="text-paleta1-blue text-4xl mb-4">📄</div>
                <p className="text-paleta1-blue">Publicación no encontrada</p>
            </div>
        );
    }

    // Vista completa de la publicación
    return (
        <div className="pt-8 bg-white min-h-screen">
            <div className="max-w-[95vw] mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                {/* Contenido principal estilo tienda */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 lg:p-12 bg-paleta1-cream-light">
                    {/* Galería de imágenes estilo tienda - Ocupa 2 columnas */}
                    <div className="lg:col-span-2 flex gap-6">
                        {/* Miniaturas verticales */}
                        <div className="flex flex-col gap-4 w-32">
                            {imagenes.length > 0 ? (
                                imagenes.map((imagen, index) => (
                                    <div key={index} className={`relative p-2 rounded-2xl border-2 transition-all duration-300 ${
                                        index === imagenSeleccionada 
                                            ? 'border-paleta1-blue bg-paleta1-blue-light shadow-lg' 
                                            : 'border-gray-200 bg-white hover:border-paleta1-blue-light hover:shadow-md'
                                    }`}>
                                        <img 
                                            src={imagen} 
                                            alt={`${publicacion.titulo} ${index + 1}`}
                                            className="w-28 h-28 object-contain bg-gray-50 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
                                            onClick={() => setImagenSeleccionada(index)}
                                        />
                                        {/* Indicador de imagen activa */}
                                        {index === imagenSeleccionada && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-paleta1-blue rounded-full border-2 border-white flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">No img</span>
                                </div>
                            )}
                        </div>

                        {/* Imagen principal grande */}
                        <div className="flex-1">
                            {imagenes.length > 0 ? (
                                <div className="bg-white p-6 rounded-3xl shadow-2xl border-2 border-gray-200">
                                    <img 
                                        src={imagenes[imagenSeleccionada]} 
                                        alt={publicacion.titulo}
                                        className="w-full h-[450px] lg:h-[550px] object-contain bg-gray-50 rounded-2xl cursor-zoom-in transition-all duration-300 hover:scale-[1.01] shadow-lg"
                                        onClick={() => setMostrarModal(true)}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-[450px] lg:h-[550px] bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-gray-300">
                                    <div className="text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-20 h-20 text-gray-400 mx-auto mb-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                        <span className="text-gray-500 text-xl font-medium">Sin imágenes disponibles</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de información estilo tienda - Ocupa 1 columna */}
                    <div className="space-y-6">
                        {/* Título y precio destacados */}
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{publicacion.titulo}</h1>
                            <div className="text-3xl lg:text-4xl font-bold text-paleta1-blue mb-4">
                                ${publicacion.precio?.toLocaleString()} ARS
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-white text-paleta1-blue px-3 py-1 rounded-full text-sm font-medium border border-paleta1-blue">
                                    {formatearEstado(publicacion.estado)}
                                </span>
                                {publicacion.fechaPublicacion && (
                                    <span className="text-gray-500 text-xs">
                                        Publicado el {formatearFecha(publicacion.fechaPublicacion)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Especificaciones básicas */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <h3 className="text-md font-semibold text-paleta1-blue mb-3 border-b border-gray-200 pb-2">Información Básica</h3>
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Marca</span>
                                    <span className="font-medium text-paleta1-blue text-sm">{publicacion.marcaAuto}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Modelo</span>
                                    <span className="font-medium text-paleta1-blue text-sm">{publicacion.modeloAuto}</span>
                                </div>
                                {publicacion.año && (
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">Año</span>
                                        <span className="font-medium text-paleta1-blue text-sm">{publicacion.año}</span>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Estado</span>
                                    <span className="font-medium text-paleta1-blue text-sm">{formatearEstado(publicacion.estado)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Ubicación</span>
                                    <span className="font-medium text-paleta1-blue text-sm">{publicacion.ubicacion}</span>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        {publicacion.descripcion && (
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <h3 className="text-md font-semibold text-paleta1-blue mb-3 border-b border-gray-200 pb-2">Descripción</h3>
                                <p className="text-gray-700 leading-relaxed text-sm">
                                    {publicacion.descripcion}
                                </p>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="space-y-3">
                            <button 
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        alert("Debes iniciar sesión para comprar");
                                        return;
                                    }
                                    navigate(`/comprar/${idPublicacion}`);
                                }}
                                className="w-full bg-paleta1-blue hover:bg-paleta1-blue-light text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                Comprar Ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Especificaciones Técnicas Detalladas */}
            <div className="max-w-[95vw] mx-auto mt-12 px-6 lg:px-12">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-paleta1-blue mb-8 border-b border-paleta1-cream pb-4 text-left">
                        Especificaciones Técnicas Completas
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Información General del Vehículo */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-paleta1-blue border-b border-paleta1-blue-light pb-2">
                                Información del Vehículo
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-500 block">Marca</span>
                                    <span className="font-medium text-gray-900">{publicacion.marcaAuto || 'No especificado'}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 block">Modelo</span>
                                    <span className="font-medium text-gray-900">{publicacion.modeloAuto || 'No especificado'}</span>
                                </div>
                                {publicacion.anio && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Año</span>
                                        <span className="font-medium text-gray-900">{publicacion.anio}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-sm text-gray-500 block">Estado</span>
                                    <span className="font-medium text-gray-900">{formatearEstado(publicacion.estadoAuto || publicacion.estado)}</span>
                                </div>
                                {publicacion.kilometraje && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Kilometraje</span>
                                        <span className="font-medium text-gray-900">{publicacion.kilometraje?.toLocaleString()} km</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Motor y Combustible */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-paleta1-blue border-b border-paleta1-blue-light pb-2">
                                Motor y Combustible
                            </h4>
                            <div className="space-y-3">
                                {publicacion.motor && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Motor</span>
                                        <span className="font-medium text-gray-900">{publicacion.motor}</span>
                                    </div>
                                )}
                                {publicacion.combustible && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Combustible</span>
                                        <span className="font-medium text-gray-900">{publicacion.combustible}</span>
                                    </div>
                                )}
                                {publicacion.capacidadTanque && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Capacidad del Tanque</span>
                                        <span className="font-medium text-gray-900">{publicacion.capacidadTanque} litros</span>
                                    </div>
                                )}
                                {publicacion.tipoCaja && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Caja de Cambios</span>
                                        <span className="font-medium text-gray-900">{publicacion.tipoCaja}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Información de Venta y Categoría */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-paleta1-blue border-b border-paleta1-blue-light pb-2">
                                Información de Venta
                            </h4>
                            <div className="space-y-3">
                                {publicacion.tipoCategoria && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Tipo de Categoría</span>
                                        <span className="font-medium text-gray-900">{publicacion.tipoCategoria}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-sm text-gray-500 block">Precio</span>
                                    <span className="font-bold text-xl text-paleta1-blue">${publicacion.precio?.toLocaleString()} ARS</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 block">Ubicación</span>
                                    <span className="font-medium text-gray-900">{publicacion.ubicacion}</span>
                                </div>
                                {publicacion.fechaPublicacion && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Fecha de Publicación</span>
                                        <span className="font-medium text-gray-900">{formatearFecha(publicacion.fechaPublicacion)}</span>
                                    </div>
                                )}
                                {publicacion.metodoDePago && (
                                    <div>
                                        <span className="text-sm text-gray-500 block">Método de Pago</span>
                                        <span className="font-medium text-gray-900">{publicacion.metodoDePago}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección de campos faltantes (solo mostrar si hay campos faltantes) */}
                    {(!publicacion.anio || !publicacion.kilometraje || !publicacion.combustible || !publicacion.motor || !publicacion.tipoCaja || !publicacion.capacidadTanque || !publicacion.tipoCategoria) && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h5 className="font-medium text-yellow-800 mb-2">⚠️ Información Adicional Disponible</h5>
                                <p className="text-sm text-yellow-700">
                                    Algunos campos técnicos pueden no estar completos en la base de datos. 
                                    Los campos mostrados arriba contienen toda la información disponible para este vehículo.
                                </p>
                                {(!publicacion.anio || !publicacion.kilometraje || !publicacion.combustible) && (
                                    <div className="mt-2 text-xs text-yellow-600">
                                        <p>Campos que podrían estar disponibles: año, kilometraje, combustible, motor, tipo de caja, capacidad del tanque, categoría.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sección de Comentarios */}
            <div className="max-w-[95vw] mx-auto mt-12 px-6 lg:px-12">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4 text-left">
                        Comentarios y Reseñas
                    </h3>
                    <div className="text-left">
                        <ComentarioList 
                            idPublicacion={idPublicacion}
                            tipoObjeto="publicacion"
                        />
                    </div>
                </div>
            </div>

            {/* Modal de imagen ampliada */}
            {mostrarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={() => setMostrarModal(false)}>
                    <div className="relative w-full h-full flex flex-col">
                        {/* Header del modal */}
                        <div className="flex justify-between items-center p-4 text-white">
                            <h3 className="text-xl font-semibold">{publicacion.titulo} - Imagen {imagenSeleccionada + 1} de {imagenes.length}</h3>
                            <button 
                                onClick={() => setMostrarModal(false)}
                                className="bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-30 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Imagen principal */}
                        <div className="flex-1 flex items-center justify-center relative">
                            <img 
                                src={imagenes[imagenSeleccionada]} 
                                alt={`${publicacion.titulo} - ${imagenSeleccionada + 1}`}
                                className="max-w-full max-h-full object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                            
                            {/* Botones de navegación */}
                            {imagenes.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImagenSeleccionada(imagenSeleccionada > 0 ? imagenSeleccionada - 1 : imagenes.length - 1);
                                        }}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white rounded-full p-3 hover:bg-opacity-30 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImagenSeleccionada(imagenSeleccionada < imagenes.length - 1 ? imagenSeleccionada + 1 : 0);
                                        }}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white rounded-full p-3 hover:bg-opacity-30 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Galería de miniaturas en la parte inferior */}
                        {imagenes.length > 1 && (
                            <div className="p-4">
                                <div className="flex justify-center gap-3 overflow-x-auto max-w-full">
                                    {imagenes.map((imagen, index) => (
                                        <img
                                            key={index}
                                            src={imagen}
                                            alt={`${publicacion.titulo} miniatura ${index + 1}`}
                                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all duration-300 flex-shrink-0 ${
                                                index === imagenSeleccionada 
                                                    ? 'border-3 border-white shadow-lg opacity-100' 
                                                    : 'border border-white border-opacity-30 opacity-70 hover:opacity-100'
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImagenSeleccionada(index);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Publicacion;