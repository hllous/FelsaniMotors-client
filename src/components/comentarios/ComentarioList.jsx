import { useState, useEffect, useContext } from 'react';
import ComentarioItem from './ComentarioItem';
import ComentarioForm from './ComentarioForm';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';

const ComentarioList = ({ idPublicacion }) => {

    const [comentarios, setComentarios] = useState([]);
    const [error, setError] = useState(null);
    
    const { isAuthenticated = false, user = null } = useContext(AuthContext);
    const API_URL = `http://localhost:4002/api/publicaciones/${idPublicacion}/comentarios`;

    // Creacion de headers para Bearer token
    const createAuthHeaders = () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${authService.getToken()}`);
        return headers;
    };

    // Cargar comentarios con useEffect - GET es público, no requiere Bearer token
    useEffect(() => {
        fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json();})
        .then((data) => { setComentarios(data) })
        .catch((e) => {
            console.error('Error al obtener los comentarios:', e);
            setError(e.message) })
    }, [API_URL]);

    // Crear comentario - POST requiere Bearer token
    const handleCrearComentario = (texto) => {
        return fetch(API_URL, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify({ 
                idUsuario: user.idUsuario, 
                texto 
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((nuevoComentario) => {
                setComentarios([nuevoComentario, ...comentarios]);
                return nuevoComentario;
            })
            .catch((error) => {
                console.error('Error al crear comentario:', error);
                throw error;
            });
    };

    // Editar comentario - PUT requiere Bearer token
    const handleEditarComentario = (idComentario, nuevoTexto) => {
        return fetch(`${API_URL}/${idComentario}/texto`, {
            method: 'PUT',
            headers: createAuthHeaders(),
            body: JSON.stringify({ texto: nuevoTexto })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then((actualizado) => {
                setComentarios(comentarios.map(c => 
                    c.idComentario === idComentario ? actualizado : c
                ));
                return actualizado;
            })
            .catch((error) => {
                console.error('Error al editar comentario:', error);
                throw error;
            });
    };

    // Eliminar comentario - DELETE requiere Bearer token
    const handleEliminarComentario = (idComentario) => {
        return fetch(`${API_URL}/${idComentario}`, {
            method: 'DELETE',
            headers: createAuthHeaders()
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .then(() => {
                setComentarios(comentarios.filter(c => c.idComentario !== idComentario));
            })
            .catch((error) => {
                console.error('Error al eliminar comentario:', error);
                throw error;
            });
    };

    // Responder comentario - POST requiere Bearer token
    const handleResponder = (idComentarioPadre, textoRespuesta) => {
        return fetch(`${API_URL}/${idComentarioPadre}/respuestas`, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify({ 
                idUsuario: user.idUsuario, 
                texto: textoRespuesta 
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .catch((error) => {
                console.error('Error al responder comentario:', error);
                throw error;
            });
    };

    // Renderizar un comentario con sus respuestas anidadas
    const renderComentarioConRespuestas = (comentario) => {
        const tieneRespuestas = comentario.respuestas?.length > 0;
        
        return (
            <div key={comentario.idComentario} className="space-y-3">
                <ComentarioItem
                    comentario={comentario}
                    currentUserId={user?.idUsuario}
                    currentUserRole={user?.rol}
                    isAuthenticated={isAuthenticated}
                    handleEditarComentario={handleEditarComentario}
                    handleEliminarComentario={handleEliminarComentario}
                    handleResponder={handleResponder}
                />

                {tieneRespuestas && (
                    <div className="ml-8 pl-4 border-l-2 border-gray-300 space-y-3">
                        {comentario.respuestas.map(respuesta => 
                            renderComentarioConRespuestas(respuesta)
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                <p className="font-semibold">Error al cargar comentarios</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header informativo */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    💬 Comentarios de la Publicación #{idPublicacion}
                </h2>
                <div className="text-sm text-gray-600">
                    <p>
                        📡 <strong>Estado de conexión:</strong> {isAuthenticated ? '🟢 Autenticado' : '🔵 Modo público'}
                        {isAuthenticated && user && (
                            <span className="ml-2">
                                | 👤 Usuario: <strong>{user.email}</strong>
                            </span>
                        )}
                    </p>
                    <p className="mt-1">
                        🔓 <strong>Lectura:</strong> Pública (sin autenticación) | 
                        🔒 <strong>Escritura:</strong> Requiere autenticación
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <div>
                <h3 className="text-lg font-semibold mb-3 text-[#6c94c4]">Dejar un comentario</h3>
                {isAuthenticated ? (
                    <ComentarioForm 
                        onSubmit={handleCrearComentario}
                        placeholder="Escribe tu comentario sobre esta publicación..."
                    />
                ) : (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded">
                        <p className="text-sm">
                            📖 <strong>Modo público:</strong> Puedes ver todos los comentarios, pero necesitas <strong>iniciar sesión</strong> para escribir, editar o eliminar comentarios.
                        </p>
                        <p className="text-xs mt-2 text-blue-600">
                            💡 Los comentarios se cargan automáticamente sin necesidad de autenticación según la configuración del servidor.
                        </p>
                    </div>
                )}
            </div>

            {/* Lista de comentarios */}
            <div>
                <h3 className="text-lg font-semibold mb-3 text-[#6c94c4]">
                    Comentarios ({comentarios.length})
                </h3>

                {comentarios.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No hay comentarios aún. ¡Sé el primero en comentar!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {comentarios
                            .filter(c => !c.idComentarioPadre) // Solo mostrar comentarios principales
                            .map(comentario => renderComentarioConRespuestas(comentario))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComentarioList;
