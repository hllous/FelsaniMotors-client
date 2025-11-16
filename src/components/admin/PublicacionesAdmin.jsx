import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicaciones, deletePublicacion } from '../../redux/slices/publicacionesSlice';
import Modal from '../common/Modal';

const PublicacionesAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { items: publicaciones, error } = useSelector((state) => state.publicaciones);
    const [modalConfig, setModalConfig] = useState({ isOpen: false });

    const showModal = (config) => {
        setModalConfig({ ...config, isOpen: true });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false });
    };

    useEffect(() => {
        if (publicaciones.length === 0) {
            dispatch(fetchPublicaciones());
        }
    }, [publicaciones.length]);

    const handleEliminarPublicacion = async (id, titulo) => {
        showModal({
            type: 'warning',
            title: 'Confirmar Eliminación',
            message: `¿Estás seguro de eliminar la publicación "${titulo}"?`,
            confirmText: 'Eliminar',
            showCancel: true,
            onConfirm: async () => {
                
                const result = await dispatch(deletePublicacion({ idPublicacion: id, token }))

                if (result.payload) {

                    showModal({
                        type: 'success',
                        title: 'Éxito',
                        message: 'Publicación eliminada exitosamente',
                        showCancel: false
                    })
                } else {

                    showModal({
                        type: 'error',
                        title: 'Error',
                        message: result.error?.message || 'Error al eliminar la publicación. Intenta nuevamente.',
                        showCancel: false
                    })
                }
            }
        })
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Todas las Publicaciones</h1>
                        <p className="text-gray-600">Total: {publicaciones.length} publicación(es)</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>
                </div>

                {/* Tabla de publicaciones */}
                <div className="bg-white rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Título
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Propietario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {publicaciones.map((p) => (
                                    <tr key={p.idPublicacion}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {p.idPublicacion}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                            <div className="font-semibold">{p.titulo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <div className="font-medium">{p.nombreUsuario || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                                            <div className="line-clamp-2 break-words">{p.descripcion}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                p.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-800' : 
                                                p.estado === 'VENDIDO' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {p.precio ? `$${p.precio.toLocaleString('es-AR')}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => navigate(`/publicacion/${p.idPublicacion}`)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                                                >
                                                    Ver
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarPublicacion(p.idPublicacion, p.titulo)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {publicaciones.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-lg mt-4">
                        <p className="text-gray-500">No hay publicaciones disponibles</p>
                    </div>
                )}
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

export default PublicacionesAdmin;
