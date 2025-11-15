import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicaciones, fetchPublicacionesByUsuario, filtrarPublicaciones } from "../../redux/slices/publicacionesSlice";
import PublicacionCard from "./PublicacionCard";
import PublicacionDestacada from "./PublicacionDestacada";

const PublicacionList = () => {
    const dispatch = useDispatch();
    const { items: publicaciones, isFiltered } = useSelector((state) => state.publicaciones);
    const [searchParams] = useSearchParams();
    
    const consultaBusqueda = searchParams.get('q') || '';
    const userId = searchParams.get('userId');
    
    const paramsString = useMemo(() => searchParams.toString(), [searchParams]);
    
    const hasFiltros = useMemo(() => {
        const params = new URLSearchParams(paramsString);
        params.delete('q');
        params.delete('userId');
        return params.toString().length > 0;
    }, [paramsString]);

    // Asegurar que publicaciones sea siempre un array
    const publicacionesArray = Array.isArray(publicaciones) ? publicaciones : [];
    
    // Seleccionar publicación destacada aleatoria
    const publicacionDestacada = useMemo(() => {
        if (publicacionesArray.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * publicacionesArray.length);
        return publicacionesArray[randomIndex];
    }, [publicacionesArray.length]); // Solo recalcula cuando cambia el tamaño del array
    
    const publicacionesRestantes = publicacionesArray.filter(p => p.idPublicacion !== publicacionDestacada?.idPublicacion);

    useEffect(() => {
        if (userId) {
            dispatch(fetchPublicacionesByUsuario(userId));
        } 
        else if (consultaBusqueda.trim() !== '' || hasFiltros) {
            const params = {};
            
            if (consultaBusqueda.trim() !== '') {
                params.busqueda = consultaBusqueda;
            }
            
            // Agregar filtros
            if (hasFiltros) {
                const filtros = new URLSearchParams(paramsString);
                filtros.delete('q');
                filtros.delete('userId');
                filtros.forEach((value, key) => {
                    params[key] = value;
                });
            }
            
            dispatch(filtrarPublicaciones(params));
        }
        else if (isFiltered || publicaciones.length === 0) {
            // Solo fetch si está filtrado O si no hay publicaciones en cache
            dispatch(fetchPublicaciones());
        }
    }, [userId, consultaBusqueda, hasFiltros, paramsString]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                
                {/* Publicación Destacada */}
                {publicacionDestacada && !consultaBusqueda && !userId && !hasFiltros && (
                    <PublicacionDestacada publicacion={publicacionDestacada} />
                )}

                {/* Título de sección */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {userId ? 'Mis Publicaciones' : 
                         consultaBusqueda ? `Resultados para "${consultaBusqueda}"` : 
                         hasFiltros ? 'Resultados filtrados' :
                         'Todas las publicaciones'}
                    </h2>
                    <p className="text-gray-600">
                        {consultaBusqueda || userId || hasFiltros ? publicacionesArray.length : publicacionesRestantes.length} vehículos disponibles
                        {userId && ' de tus publicaciones'}
                        {consultaBusqueda && ` que coinciden con "${consultaBusqueda}"`}
                        {hasFiltros && ' según los filtros aplicados'}
                    </p>
                </div>

                {/* Grid de publicaciones */}
                {publicacionesArray.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {(consultaBusqueda || userId || hasFiltros ? publicacionesArray : publicacionesRestantes).map((publicacion) => (
                            <PublicacionCard 
                                key={publicacion.idPublicacion}
                                idPublicacion={publicacion.idPublicacion}
                                titulo={publicacion.titulo}
                                ubicacion={publicacion.ubicacion}
                                precio={publicacion.precio}
                                estado={publicacion.estado}
                                marcaAuto={publicacion.marcaAuto}
                                modeloAuto={publicacion.modeloAuto}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicacionList;