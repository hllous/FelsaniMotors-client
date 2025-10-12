import { useState } from 'react';
import ComentarioForm from './ComentarioForm';

const ComentarioItem = ({ 
    comentario, 
    currentUserId = null,
    currentUserRole = null,
    isAuthenticated = false,
    handleEditarComentario, 
    handleEliminarComentario, 
    handleResponder
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isOwner = currentUserId && comentario.usuario?.idUsuario === currentUserId;
    const isAdmin = currentUserRole === 'ADMIN';
    const canEdit = isAuthenticated && isOwner;
    const canDelete = isAuthenticated && (isOwner || isAdmin);
    const canReply = isAuthenticated;

    const handleEdit = (nuevoTexto) => {
        return handleEditarComentario(comentario.idComentario, nuevoTexto)
            .then(() => setIsEditing(false))
            .catch((error) => {
                setErrorMessage('Error al editar: ' + error.message);
                setShowErrorModal(true);
            });
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);
        handleEliminarComentario(comentario.idComentario)
            .catch((error) => {
                setErrorMessage('Error al eliminar: ' + error.message);
                setShowErrorModal(true);
            });
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleReply = (textoRespuesta) => {
        return handleResponder(comentario.idComentario, textoRespuesta)
            .then(() => setIsReplying(false))
            .catch((error) => {
                setErrorMessage('Error al responder: ' + error.message);
                setShowErrorModal(true);
            });
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-[#e8decb] p-4 rounded shadow-sm border border-gray-200">
            {/* Header del comentario */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-[#6c94c4] rounded-full flex items-center justify-center text-white font-semibold">
                        {comentario.usuario?.nombre?.[0]?.toUpperCase() || '?'}
                    </div>
                    
                    {/* Info del usuario */}
                    <div>
                        <p className="font-semibold text-gray-800">
                            {comentario.usuario?.nombre} {comentario.usuario?.apellido}
                        </p>
                        <p className="text-sm text-gray-500">
                            {formatearFecha(comentario.fecha)}
                        </p>
                    </div>
                </div>

                {/* Botones de acción */}
                {!isEditing && (canEdit || canDelete) && (
                    <div className="flex gap-2">
                        {canEdit && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-[#6c94c4] hover:text-[#5a7da8] text-sm font-medium"
                            >
                                Editar
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={handleDeleteClick}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Contenido */}
            {isEditing ? (
                <ComentarioForm
                    initialValue={comentario.texto}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                    submitLabel="Guardar"
                    placeholder="Edita tu comentario..."
                />
            ) : (
                <>
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                        {comentario.texto}
                    </p>

                    {canReply && handleResponder && (
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-[#6c94c4] hover:text-[#5a7da8] text-sm font-medium"
                        >
                            {isReplying ? 'Cancelar' : 'Responder'}
                        </button>
                    )}

                    {isReplying && (
                        <div className="mt-3 pl-4 border-l-2 border-[#6c94c4]">
                            <ComentarioForm
                                onSubmit={handleReply}
                                onCancel={() => setIsReplying(false)}
                                submitLabel="Responder"
                                placeholder="Escribe tu respuesta..."
                            />
                        </div>
                    )}
                </>
            )}

            {/* Confirmación de eliminación */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            ¿Eliminar comentario?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas eliminar este comentario?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Error */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <div className="text-center">
                            <div className="text-red-500 text-5xl mb-4">✕</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
                            <p className="text-gray-600 mb-4">{errorMessage}</p>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComentarioItem;
