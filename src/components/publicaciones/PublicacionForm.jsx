import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { createPublicacion } from '../../redux/slices/publicacionesSlice';
import { fetchMarcas, fetchEstados, fetchCombustibles, fetchTiposCaja } from '../../redux/slices/catalogoSlice';
import Modal from '../common/Modal';

const PublicacionForm = () => {

    const { user, token } = useSelector((state) => state.auth);
    const { marcas, estados, combustibles, tiposCaja } = useSelector((state) => state.catalogo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [modalConfig, setModalConfig] = useState({ isOpen: false });

    const showModal = (config) => {
        setModalConfig({ ...config, isOpen: true });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false });
    };

    // Cargar catalogo
    useEffect(() => {
        // Solo fetch si no existe en cache
        if (!marcas || marcas.length === 0) {
            dispatch(fetchMarcas());
        }
        if (!estados || estados.length === 0) {
            dispatch(fetchEstados());
        }
        if (!combustibles || combustibles.length === 0) {
            dispatch(fetchCombustibles());
        }
        if (!tiposCaja || tiposCaja.length === 0) {
            dispatch(fetchTiposCaja());
        }
    }, [dispatch, marcas?.length, estados?.length, combustibles?.length, tiposCaja?.length]);

    // Estructura JSON de endpoints
    const [autoData, setAutoData] = useState({
        marca: "",
        modelo: "",
        anio: "",
        estado: "",
        kilometraje: "",
        combustible: "",
        tipoCategoria: "",
        capacidadTanque: "",
        tipoCaja: "",
        motor: ""
    });

    const [publicacionData, setPublicacionData] = useState({
        titulo: "",
        descripcion: "",
        ubicacion: "",
        precio: "",
        metodoDePago: ""
    });

    // States

    const [fotos, setFotos] = useState([]);
    const [fotoPrincipalIndex, setFotoPrincipalIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validar si el usuario esta loggeado
    useEffect(() => {
        if (!user) {
            showModal({
                type: 'warning',
                title: 'Iniciar Sesión',
                message: 'Debes iniciar sesión para crear una publicación.\n\nPor favor, inicia sesión y vuelve a intentarlo.',
                showCancel: false,
                onConfirm: () => navigate('/')
            });
            return;
        }

        // Validar si el usuario esta activo
        if (user.activo === 0) {
            showModal({
                type: 'error',
                title: 'Cuenta Inactiva',
                message: 'Tu cuenta está inactiva. No puedes crear publicaciones.\n\nContacta al administrador para activar tu cuenta.',
                showCancel: false,
                onConfirm: () => navigate('/')
            });
        }
    }, [user, navigate]);

    // Conexion a Back, con Bearer Token

    const AUTO_URL = "http://localhost:4002/api/autos";
    const PUBLICACION_URL = "http://localhost:4002/api/publicaciones";
    
    const USUARIO_ID = user?.idUsuario;

    const handleAutoChange = (e) => {
        const { name, value } = e.target;
        setAutoData({
            ...autoData,
            [name]: value
        });
    };

    const handlePublicacionChange = (e) => {
        const { name, value } = e.target;
        setPublicacionData({
            ...publicacionData,
            [name]: value
        });
    };

    const handleFotosChange = (e) => {
        const files = Array.from(e.target.files);
        setFotos(files);
        if (fotoPrincipalIndex >= files.length) {
            setFotoPrincipalIndex(0);
        }
    };

    const handleFotoPrincipalChange = (e) => {
        setFotoPrincipalIndex(parseInt(e.target.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!autoData.marca || !autoData.modelo || !publicacionData.titulo || !publicacionData.precio) {
            showModal({
                type: 'warning',
                title: 'Campos Incompletos',
                message: 'Por favor completa todos los campos obligatorios',
                showCancel: false
            });
            setIsSubmitting(false);
            return;
        }

        if (publicacionData.descripcion && publicacionData.descripcion.length > 255) {
            showModal({
                type: 'warning',
                title: 'Descripción Muy Larga',
                message: 'La descripción no puede superar los 255 caracteres',
                showCancel: false
            });
            setIsSubmitting(false);
            return;
        }
        
        // Preparar datos del auto
        const autoDataRequest = {
            marca: autoData.marca,
            modelo: autoData.modelo,
            anio: autoData.anio ? parseInt(autoData.anio) : null,
            estado: autoData.estado || null,
            kilometraje: autoData.kilometraje ? parseInt(autoData.kilometraje) : null,
            combustible: autoData.combustible || null,
            tipoCategoria: autoData.tipoCategoria || null,
            capacidadTanque: autoData.capacidadTanque ? parseFloat(autoData.capacidadTanque) : null,
            tipoCaja: autoData.tipoCaja || null,
            motor: autoData.motor || null
        };
        
        // Preparar datos de la publicacion
        const publicacionDataRequest = {
            titulo: publicacionData.titulo,
            descripcion: publicacionData.descripcion || null,
            ubicacion: publicacionData.ubicacion || null,
            precio: parseFloat(publicacionData.precio),
            metodoDePago: publicacionData.metodoDePago || null,
            idUsuario: USUARIO_ID,
            estado: 'A'
        };
        
        // Preparar fotos
        const fotosConMetadata = fotos.map((foto, index) => ({
            file: foto,
            esPrincipal: index === fotoPrincipalIndex,
            orden: index
        }));
        
        // Dispatch de Redux
        const result = await dispatch(createPublicacion({
            autoData: autoDataRequest,
            publicacionData: publicacionDataRequest,
            fotos: fotosConMetadata,
            token
        }));
        
        if (!result.payload) {

            showModal({
                type: 'error',
                title: 'Error al Crear Publicación',
                message: 'No se pudo crear la publicación. Verifica los datos e intenta nuevamente.',
                showCancel: false
            });
            
            setIsSubmitting(false);
            return;
        }
        
        // Limpiar formulario
        setAutoData({
            marca: "",
            modelo: "",
            anio: "",
            estado: "",
            kilometraje: "",
            combustible: "",
            tipoCategoria: "",
            capacidadTanque: "",
            tipoCaja: "",
            motor: ""
        });
        
        setPublicacionData({
            titulo: "",
            descripcion: "",
            ubicacion: "",
            precio: "",
            metodoDePago: ""
        });
        
        setFotos([]);
        setFotoPrincipalIndex(0);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        
        showModal({
            type: 'success',
            title: 'Éxito',
            message: '¡Publicación creada exitosamente!',
            showCancel: false,
            onConfirm: () => navigate('/')
        });
        
        setIsSubmitting(false);
    };

    return (
        <div className="px-10 border-gray-300">
            <h2 className="justify-center text-center text-4xl font-bold text-paleta1-blue my-6">Crear Nueva Publicación</h2>
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl ">Datos del Auto</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Marca:</label>
                    <select
                        name="marca"
                        value={autoData.marca}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    >
                        <option value="">Seleccionar marca</option>
                        {marcas.map((marca) => (
                            <option key={marca} value={marca}>{marca}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Modelo:</label>
                    <input
                        type="text"
                        name="modelo"
                        value={autoData.modelo}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Año:</label>
                    <input
                        type="number"
                        name="anio"
                        value={autoData.anio}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Estado:</label>
                    <select
                        name="estado"
                        value={autoData.estado}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    >
                        <option value="">Seleccionar estado</option>
                        {estados.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Kilometraje:</label>
                    <input
                        type="number"
                        name="kilometraje"
                        value={autoData.kilometraje}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Combustible:</label>
                    <select
                        name="combustible"
                        value={autoData.combustible}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    >
                        <option value="">Seleccionar combustible</option>
                        {combustibles.map((combustible) => (
                            <option key={combustible} value={combustible}>{combustible}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Tipo Categoría:</label>
                    <input
                        type="text"
                        name="tipoCategoria"
                        value={autoData.tipoCategoria}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Capacidad Tanque:</label>
                    <input
                        type="number"
                        name="capacidadTanque"
                        value={autoData.capacidadTanque}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Tipo Caja:</label>
                    <select
                        name="tipoCaja"
                        value={autoData.tipoCaja}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    >
                        <option value="">Seleccionar tipo de caja</option>
                        {tiposCaja.map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Motor:</label>
                    <input
                        type="text"
                        name="motor"
                        value={autoData.motor}
                        onChange={handleAutoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>

                <h3 className="text-xl font-semibold mb-4 mt-6 text-paleta1-blue">Datos de la Publicación</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Título:</label>
                    <input
                        type="text"
                        name="titulo"
                        value={publicacionData.titulo}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Descripción: 
                        <span className={`ml-2 text-sm ${publicacionData.descripcion.length > 255 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                            ({publicacionData.descripcion.length}/255 caracteres)
                        </span>
                    </label>
                    <textarea
                        name="descripcion"
                        value={publicacionData.descripcion}
                        onChange={handlePublicacionChange}
                        maxLength={255}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        rows="4"
                        placeholder="Describe el vehículo (máximo 255 caracteres)"
                    />
                    {publicacionData.descripcion.length > 255 && (
                        <p className="text-red-600 text-sm mt-1">La descripción no puede superar los 255 caracteres</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Ubicación:</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={publicacionData.ubicacion}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        placeholder="Ej: Buenos Aires, CABA"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        value={publicacionData.precio}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Método de Pago:</label>
                    <input
                        type="text"
                        name="metodoDePago"
                        value={publicacionData.metodoDePago}
                        onChange={handlePublicacionChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        placeholder="Ej: Efectivo, transferencia, financiación"
                    />
                </div>

                <h3 className="text-xl font-semibold mb-4 mt-6 text-paleta1-blue">Fotos del Vehículo</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Seleccionar Fotos:</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFotosChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                    />
                </div>

                {fotos.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Foto Principal:</label>
                        <select
                            value={fotoPrincipalIndex}
                            onChange={handleFotoPrincipalChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-paleta1-blue"
                        >
                            {fotos.map((foto, index) => (
                                <option key={index} value={index}>
                                    Foto {index + 1} - {foto.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            {fotos.length} foto{fotos.length > 1 ? 's' : ''} seleccionada{fotos.length > 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full text-white py-3 px-6 rounded-md transition-colors font-semibold ${
                        isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-paleta1-blue hover:bg-paleta1-blue/90'
                    }`}
                >
                    {isSubmitting ? 'Creando Publicación...' : 'Crear Publicación'}
                </button>
            </form>

            {/* Modal */}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                showCancel={modalConfig.showCancel}
            />
        </div>
    );
};

export default PublicacionForm;