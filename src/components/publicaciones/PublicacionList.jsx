import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PublicacionCard from "./PublicacionCard";
import PublicacionDestacada from "./PublicacionDestacada";

const PublicacionList = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Extraer parametros de URL (despues de busqueda en searchbar)
    const consultaBusqueda = searchParams.get('q') || '';
    const userId = searchParams.get('userId');

    const publicacionDestacada = publicaciones[Math.floor(Math.random() * publicaciones.length)];
    const publicacionesRestantes = publicaciones.filter(p => p.idPublicacion !== publicacionDestacada?.idPublicacion);

    useEffect(() => {

        let url = "http://localhost:4002/api/publicaciones";
        
        if (userId) {

            url = `http://localhost:4002/api/publicaciones/usuario/${userId}`;
        } else if (consultaBusqueda.trim() !== '') {

            url = `http://localhost:4002/api/publicaciones/buscar?busqueda=${encodeURIComponent(consultaBusqueda)}`;
        }

        fetch(url)
        .then((response) => {
            if (response.status === 204) { return []; }
            return response.json() })
        .then((data) => setPublicaciones(data))
        .catch((error) => console.error("Error al obtener datos", error));

    }, [consultaBusqueda, userId]);



    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                
                {/* Publicación Destacada */}
                {publicacionDestacada && (
                    <PublicacionDestacada publicacion={publicacionDestacada} />
                )}

                {/* Título de sección */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {userId ? 'Mis Publicaciones' : 
                         consultaBusqueda ? `Resultados para "${consultaBusqueda}"` : 
                         'Todas las publicaciones'}
                    </h2>
                    <p className="text-gray-600">
                        {publicacionesRestantes.length} vehículos disponibles
                        {userId && ' de tus publicaciones'}
                        {consultaBusqueda && ` que coinciden con "${consultaBusqueda}"`}
                    </p>
                    
                    {/* Botón para limpiar filtros */}
                    {(userId || consultaBusqueda) && (
                        <button 
                            onClick={() => navigate(window.location.pathname)}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            Mostrar todas las publicaciones
                        </button>
                    )}
                </div>

                {/* Grid de publicaciones estilo MercadoLibre */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {publicacionesRestantes.map((publicacion) => (
                        <PublicacionCard 
                            key={publicacion.idPublicacion}
                            idPublicacion={publicacion.idPublicacion}
                            idUsuario={publicacion.idUsuario}
                            idAuto={publicacion.idAuto}
                            titulo={publicacion.titulo}
                            ubicacion={publicacion.ubicacion}
                            precio={publicacion.precio}
                            estado={publicacion.estado}
                            marcaAuto={publicacion.marcaAuto}
                            modeloAuto={publicacion.modeloAuto}
                        />
                    ))}
                </div>

                {/* Mensaje si no hay publicaciones */}
                {publicaciones.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🚗</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {userId ? 'No tienes publicaciones aún' :
                             consultaBusqueda ? 'No se encontraron resultados' :
                             'No hay publicaciones disponibles'}
                        </h3>
                        <p className="text-gray-500">
                            {userId ? 'Crea tu primera publicación para vender tu vehículo' :
                             consultaBusqueda ? 'Intenta con otros términos de búsqueda' :
                             'Sé el primero en publicar tu vehículo'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default PublicacionList;