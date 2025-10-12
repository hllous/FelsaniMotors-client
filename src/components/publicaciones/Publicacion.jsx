import { useState, useEffect } from "react";

const Publicacion = ({ idPublicacion, mostrarCompleta = false }) => {
    const [publicacion, setPublicacion] = useState(null);
    const [imagenes, setImagenes] = useState([]);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar la publicación</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!publicacion) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-gray-400 text-4xl mb-4">📄</div>
                <p className="text-gray-600">Publicación no encontrada</p>
            </div>
        );
    }

    // Vista completa de la publicación (para página de detalle)
    if (mostrarCompleta) {
        return (
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header de la publicación */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <h1 className="text-3xl font-bold mb-2">{publicacion.titulo}</h1>
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-bold">${publicacion.precio?.toLocaleString()} ARS</span>
                        <span className="bg-white text-blue-700 px-4 py-2 rounded-full font-semibold">
                            {formatearEstado(publicacion.estado)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    {/* Galería de imágenes */}
                    <div>
                        {imagenes.length > 0 ? (
                            <div className="space-y-4">
                                <img 
                                    src={imagenes[0]} 
                                    alt={publicacion.titulo}
                                    className="w-full h-96 object-cover rounded-lg"
                                />
                                {imagenes.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {imagenes.slice(1, 5).map((imagen, index) => (
                                            <img 
                                                key={index}
                                                src={imagen} 
                                                alt={`${publicacion.titulo} ${index + 2}`}
                                                className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">Sin imágenes disponibles</span>
                            </div>
                        )}
                    </div>

                    {/* Información del vehículo */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información del vehículo</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-600">Marca:</span>
                                    <span className="text-gray-800">{publicacion.marcaAuto}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-600">Modelo:</span>
                                    <span className="text-gray-800">{publicacion.modeloAuto}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-600">Ubicación:</span>
                                    <span className="text-gray-800">{publicacion.ubicacion}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-600">Estado:</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                        {formatearEstado(publicacion.estado)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="space-y-3">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300">
                                Contactar Vendedor
                            </button>
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300">
                                Programar Visita
                            </button>
                            <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-lg transition duration-300">
                                Agregar a Favoritos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Vista resumida (para listados)
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {imagenes.length > 0 && (
                <img 
                    src={imagenes[0]} 
                    alt={publicacion.titulo}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{publicacion.titulo}</h3>
                <p className="text-2xl font-bold text-green-600 mb-2">
                    ${publicacion.precio?.toLocaleString()} ARS
                </p>
                <p className="text-gray-600">{publicacion.marcaAuto} {publicacion.modeloAuto}</p>
                <p className="text-sm text-gray-500">{publicacion.ubicacion}</p>
            </div>
        </div>
    );
};

export default Publicacion;