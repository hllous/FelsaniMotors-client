import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsuarios, deleteUsuario, activateUsuario } from '../../redux/slices/usuariosSlice';
import Modal from '../common/Modal';

const UsuariosAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { items: usuarios, error } = useSelector((state) => state.usuarios);
    const [modalConfig, setModalConfig] = useState({ isOpen: false });

    const showModal = (config) => {
        setModalConfig({ ...config, isOpen: true });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false });
    };

    useEffect(() => {
        if (usuarios.length === 0) {
            dispatch(fetchUsuarios(token));
        }
    }, [usuarios.length]);

    const handleDesactivarUsuario = async (idUsuario, nombreCompleto) => {
        showModal({
            type: 'warning',
            title: 'Confirmar Desactivación',
            message: `¿Estás seguro de desactivar al usuario "${nombreCompleto}"?`,
            confirmText: 'Desactivar',
            showCancel: true,
            onConfirm: async () => {

                const result = await dispatch(deleteUsuario({ idUsuario, token }))
                
                if (result.payload) {
                    showModal({
                        type: 'success',
                        title: 'Éxito',
                        message: 'Usuario desactivado exitosamente',
                        showCancel: false
                    })

                } else {
                    showModal({
                        type: 'error',
                        title: 'Error',
                        message: error || 'Error al desactivar el usuario. Intenta nuevamente.',
                        showCancel: false
                    })

                }
            }
        })
    };

    const handleActivarUsuario = async (idUsuario, nombreCompleto) => {
        showModal({
            type: 'info',
            title: 'Confirmar Activación',
            message: `¿Estás seguro de activar al usuario "${nombreCompleto}"?`,
            confirmText: 'Activar',
            showCancel: true,
            onConfirm: async () => {

                const result = await dispatch(activateUsuario({ idUsuario, token }))
                
                if (result.payload) {
                    showModal({
                        type: 'success',
                        title: 'Éxito',
                        message: 'Usuario activado exitosamente',
                        showCancel: false
                    })

                } else {
                    showModal({
                        type: 'error',
                        title: 'Error',
                        message: error || 'Error al activar el usuario. Intenta nuevamente.',
                        showCancel: false
                    })

                }
            }
        })
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h1>
                        <p className="text-gray-600">Total: {usuarios.length} usuario(s)</p>
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

                {/* Lista de usuarios */}
                <div className="space-y-4">
                    {usuarios.map((usuario) => (
                        <div key={usuario.idUsuario} className="bg-white rounded-lg overflow-hidden">
                            
                            {/* Datos principales del usuario */}
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {usuario.nombre} {usuario.apellido}
                                            </h3>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                usuario.rol === 'ADMIN' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {usuario.rol}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                usuario.activo 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-semibold">ID:</span> {usuario.idUsuario}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Email:</span> {usuario.email}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Teléfono:</span> {usuario.telefono || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        {usuario.activo ? (
                                            <button
                                                onClick={() => handleDesactivarUsuario(usuario.idUsuario, `${usuario.nombre} ${usuario.apellido}`)}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                            >
                                                Desactivar Usuario
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleActivarUsuario(usuario.idUsuario, `${usuario.nombre} ${usuario.apellido}`)}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                            >
                                                Activar Usuario
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {usuarios.length === 0 && (
                    <div className="text-center py-8 bg-white rounded-lg mt-4">
                        <p className="text-gray-500">No hay usuarios en el sistema</p>
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

export default UsuariosAdmin;
