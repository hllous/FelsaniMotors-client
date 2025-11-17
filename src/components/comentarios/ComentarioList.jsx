import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComentariosByPublicacion, createComentario, updateComentario, deleteComentario, createRespuesta } from '../../redux/slices/comentariosSlice';
import ComentarioItem from './ComentarioItem';
import ComentarioForm from './ComentarioForm';
import Modal from '../common/Modal';

const ComentarioList = ({ idPublicacion }) => {

    const [error, setError] = useState(null);
    const [modalConfig, setModalConfig] = useState({ isOpen: false });
    
    const dispatch = useDispatch();
    const { isAuthenticated = false, user = null, token } = useSelector((state) => state.auth);
    const { comentariosByPublicacion } = useSelector((state) => state.comentarios);
    
    const comentarios = comentariosByPublicacion[idPublicacion] || [];

    const showModal = (config) => {
        setModalConfig({ ...config, isOpen: true });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false });
    };

    // GET comentarios
    useEffect(() => {
        if (!comentariosByPublicacion[idPublicacion]) {
            dispatch(fetchComentariosByPublicacion(idPublicacion));
        }
        setError(null);
    }, [idPublicacion]);

    // POST comentario
    const handleCrearComentario = async (texto) => {

        // Validaciones
        if (user?.activo === 0) {
            showModal({
                type: 'warning',
                title: 'Cuenta Inactiva',
                message: 'Tu cuenta está inactiva. No puedes comentar.',
                showCancel: false
            });
            return null;
        }
        
        const result = await dispatch(createComentario({ 
            idPublicacion,
            idUsuario: user.idUsuario,
            texto: texto,
            token 
        }));
        
        if (result.payload?.comentario) {
            dispatch(fetchComentariosByPublicacion(idPublicacion));
            return result.payload.comentario;
        }
        
        showModal({
            type: 'error',
            title: 'Error al Comentar',
            message: result.error?.message || 'No se pudo crear el comentario. Intenta nuevamente.',
            showCancel: false
        });
        return null;
    }

    // PUT comentario
    const handleEditarComentario = async (idComentario, nuevoTexto) => {

        if (user?.activo === 0) {
            showModal({
                type: 'warning',
                title: 'Cuenta Inactiva',
                message: 'Tu cuenta está inactiva. No puedes editar comentarios.',
                showCancel: false
            });
            return null;
        }
        
        const result = await dispatch(updateComentario({
            idPublicacion,
            idComentario,
            texto: nuevoTexto,
            token
        }));
        
        if (result.payload?.comentario) {
            dispatch(fetchComentariosByPublicacion(idPublicacion));
            return result.payload.comentario;
        }
        
        showModal({
            type: 'error',
            title: 'Error al Editar',
            message: result.error?.message || 'No se pudo editar el comentario. Intenta nuevamente.',
            showCancel: false
        })

        return null;
    };

    // DELETE comentario
    const handleEliminarComentario = async (idComentario) => {

        if (user?.activo === 0) {
            showModal({
                type: 'warning',
                title: 'Cuenta Inactiva',
                message: 'Tu cuenta está inactiva. No puedes eliminar comentarios.',
                showCancel: false
            })
            return false
        }
        
        const result = await dispatch(deleteComentario({ idPublicacion, idComentario, token }));
        
        if (result.payload) {
            // Refetch para obtener comentarios actualizados
            dispatch(fetchComentariosByPublicacion(idPublicacion));
            return true;
        }
        
        showModal({
            type: 'error',
            title: 'Error al Eliminar',
            message: result.error?.message || 'No se pudo eliminar el comentario. Intenta nuevamente.',
            showCancel: false
        });
        return false
    };

    // Responder comentario
    const handleResponder = async (idComentarioPadre, textoRespuesta) => {
        if (user?.activo === 0) {
            showModal({
                type: 'warning',
                title: 'Cuenta Inactiva',
                message: 'Tu cuenta está inactiva. No puedes responder comentarios.',
                showCancel: false
            });
            return null;
        }
        
        const result = await dispatch(createRespuesta({
            idPublicacion,
            idComentario: idComentarioPadre,
            idUsuario: user.idUsuario,
            texto: textoRespuesta,
            token
        }))
        
        if (result.payload?.respuesta) {
            dispatch(fetchComentariosByPublicacion(idPublicacion));
            return result.payload.respuesta;
        }
        
        showModal({
            type: 'error',
            title: 'Error al Responder',
            message: result.error?.message || 'No se pudo crear la respuesta. Intenta nuevamente.',
            showCancel: false
        })

        return null;
    };

    // Renderizar un comentario con respuestas anteriores
    const renderComentarioConRespuestas = (comentario) => {
        const tieneRespuestas = comentario.respuestas?.length > 0;
        
        return (
            <div key={comentario.idComentario} className="space-y-3">
                <ComentarioItem
                    comentario={comentario}
                    handleEditarComentario={handleEditarComentario}
                    handleEliminarComentario={handleEliminarComentario}
                    handleResponder={handleResponder}
                />
                
                {/** GET de comentarios modo arbol */}
                {tieneRespuestas && (
                    <div className="ml-8 pl-6 border-l-4 border-paleta1-blue-light space-y-2 mt-6">
                        {comentario.respuestas.map(respuesta => 
                            renderComentarioConRespuestas(respuesta)
                        )}
                    </div>
                )}
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-red-800">Error al cargar comentarios</p>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 bg-paleta1-cream-light p-6 rounded-xl">

            {/* Form comentario */}
            <div className="bg-white border border-paleta1-cream rounded-xl p-8">
                <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-2xl font-bold text-paleta1-blue">Crear un comentario</h3>
                </div>
                
                {/** Chequea si esta loggeado o no. Si no lo esta, no le permite escribir un commentario */}
                {isAuthenticated ? (
                    <ComentarioForm 
                        onSubmit={handleCrearComentario}
                    />
                ) : (
                    <div className="bg-white border border-paleta1-cream p-6 rounded-xl">
                        <div className="flex items-start gap-4">

                            <div className="w-12 h-12 bg-paleta1-cream rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-paleta1-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <div className='self-center-safe'>
                                <p className="text-gray-700 leading-relaxed">
                                    Inicia sesión para escribir comentarios en la publicación.
                                </p>
                            </div>

                        </div>
                    </div>
                )}

            </div>

            {/* Lista de comentarios */}
            <div className="bg-white border border-paleta1-cream rounded-xl p-8">
                <div className="flex items-center justify-between mb-8">

                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-paleta1-blue">
                            Todos los comentarios
                        </h3>

                    </div>

                    <div className="bg-gradient-to-r from-paleta1-blue to-paleta1-blue/90 text-white px-4 py-2 rounded-xl text-sm font-bold">
                        {comentarios.length} comentarios
                    </div>

                </div>

                {/** chequea si hay comentarios en la publicacion. Muestra un mensaje si no hay nada*/}
                {comentarios.length === 0 ? (

                    <div className="text-center py-16">

                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-paleta1-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-bold text-paleta1-blue mb-3">
                            No existen comentarios para esta publicacion.
                        </h4>

                    </div>

                    ) : (

                    <div className="space-y-6">
                        {comentarios
                            .filter(c => !c.idComentarioPadre)
                            .map(comentario => renderComentarioConRespuestas(comentario))}
                    </div>)
                }
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                showCancel={modalConfig.showCancel}
            />
        </div>
    );
};

export default ComentarioList;
