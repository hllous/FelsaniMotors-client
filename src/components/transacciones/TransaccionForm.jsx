import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../redux/slices/carritoSlice';
import { createTransaccion } from '../../redux/slices/transaccionesSlice';
import MetodoPagoForm from "./MetodoPagoForm";
import Modal from '../common/Modal';

const TransaccionForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const { items: cartItems } = useSelector((state) => state.carrito);
    const { loading } = useSelector((state) => state.transacciones);

    const [transaccionData, setTransaccionData] = useState({
        metodoPago: "Visa",
        numeroTarjeta: "",
        fechaCaducidad: "",
        codigoSeguridad: "",
        comentarios: ""
    });
    
    const [modalConfig, setModalConfig] = useState({ isOpen: false });

    // Calcular total con descuentos - derivado
    let total = 0;
    for (const p of cartItems) {
        const descuento = p.descuentoPorcentaje || 0;
        let precioFinal = p.precio;
        if (descuento > 0) {
            precioFinal = p.precio - (p.precio * descuento / 100);
        }
        total += precioFinal;
    }

    const showModal = (config) => {
        setModalConfig({ ...config, isOpen: true });
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false });
    };

    useEffect(() => {
        // Validar si el usuario esta loggeado
        if (!user) {
            showModal({
                type: 'warning',
                title: 'Iniciar Sesión',
                message: 'Debes iniciar sesión para completar tu compra.\n\nPor favor, inicia sesión y vuelve a intentarlo.',
                showCancel: false,
                onConfirm: () => navigate('/')
            })
            return
        }

        // Validar carrito vacío SOLO al montar el componente
        if (cartItems.length === 0) {
            showModal({
                type: 'info',
                title: 'Carrito Vacío',
                message: 'El carrito está vacío',
                showCancel: false,
                onConfirm: () => navigate('/')
            });
        }
    }, [user]);

    // Verificar publicaciones vendidas cuando se cargan
    useEffect(() => {
        if (cartItems.length > 0) {
            const hasVendidas = cartItems.some(p => p.estado === 'V');
            if (hasVendidas) {
                showModal({
                    type: 'warning',
                    title: 'Publicaciones No Disponibles',
                    message: 'Algunas publicaciones se vendieron. Por favor, actualiza tu carrito.',
                    showCancel: false,
                    onConfirm: () => navigate('/')
                });
            }
        }
    }, [cartItems]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaccionData({
            ...transaccionData,
            [name]: value
        });
    };

    const handleMetodoPagoChange = (metodoPagoData) => {
        setTransaccionData({
            ...transaccionData,
            metodoPago: metodoPagoData.metodoPago,
            numeroTarjeta: metodoPagoData.numeroTarjeta,
            fechaCaducidad: metodoPagoData.fechaCaducidad,
            codigoSeguridad: metodoPagoData.codigoSeguridad
        });
    };

    const generarReferenciaPago = () => {
        const primeraParte = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const segundaParte = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        return `REF-${primeraParte}-${segundaParte}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que se hayan ingresado los datos de pago
        if (!transaccionData.numeroTarjeta || !transaccionData.fechaCaducidad || !transaccionData.codigoSeguridad) {
            showModal({
                type: 'warning',
                title: 'Datos Incompletos',
                message: 'Por favor, completa todos los datos de la tarjeta',
                showCancel: false
            });
            return;
        }

        const transaccionesCreadas = [];
        
        // Crear transacciones
        for (const p of cartItems) {
            // Calcular precio con descuento si existe
            const descuentoPorcentaje = p.descuentoPorcentaje || 0;
            let precioFinal = p.precio;
            if (descuentoPorcentaje > 0) {
                precioFinal = p.precio * (1 - descuentoPorcentaje / 100);
            }
            
            const transaccionRequest = {
                idPublicacion: p.idPublicacion,
                idComprador: user.idUsuario,
                monto: precioFinal, // Precio con descuento aplicado (o precio original si descuento = 0)
                metodoPago: transaccionData.metodoPago.toUpperCase().replace(/\s+/g, '_'), // Ej: "Visa" -> "VISA"
                referenciaPago: generarReferenciaPago(),
                comentarios: transaccionData.comentarios || null
            };

            const transaccionResult = await dispatch(createTransaccion({ 
                transaccionData: transaccionRequest, 
                token 
            }));
            
            if (transaccionResult.payload) {
                transaccionesCreadas.push(transaccionResult.payload);
            } else {
                // Si hay error en alguna transacción, mostrar mensaje
                showModal({
                    type: 'error',
                    title: 'Error en la Transacción',
                    message: transaccionResult.error?.message || 'No se pudo procesar la transacción. Verifica que la publicación esté disponible y el monto sea correcto.',
                    showCancel: false
                });
                return;
            }
        }

        // Las transacciones ya se crean con estado "COMPLETADA", no es necesario actualizarlas

        // Limpiar carrito luego de comprarlo
        dispatch(clearCart());

        // Actualizar publicaciones para reflejar el cambio de estado (las compradas ahora estarán como "Vendida")
        dispatch(fetchPublicaciones());

        let mensaje;
        if (transaccionesCreadas.length === 1) {
            mensaje = "¡Transacción exitosa!";
        } else {
            mensaje = `¡Compra exitosa! Se procesaron ${transaccionesCreadas.length} transacciones.`;
        }
        
        showModal({
            type: 'success',
            title: 'Compra Exitosa',
            message: mensaje,
            showCancel: false,
            onConfirm: () => navigate('/')
        });
    };

    const formatearPrecio = (precio) => {
        return `$${parseFloat(precio).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const cantidadVehiculos = cartItems.length;
    const esMultiple = cantidadVehiculos > 1;

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Transaccion
                </h2>
                <p className="text-lg text-gray-600">
                    {esMultiple 
                        ? `Completa la información para finalizar tu compra de ${cantidadVehiculos} vehículos`
                        : 'Completa la información para finalizar tu compra'
                    }
                </p>
            </div>

            {/* Resumen de compra - Siempre es un listado */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen de compra</h3>
                
                <div className={`space-y-3 ${esMultiple ? 'max-h-96 overflow-y-auto' : ''}`}>
                    {cartItems.map((p, index) => {
                        const descuentoPorcentaje = p.descuentoPorcentaje || 0;
                        const precioOriginal = p.precio;
                        let precioFinal = precioOriginal;
                        if (descuentoPorcentaje > 0) {
                            precioFinal = precioOriginal - (precioOriginal * descuentoPorcentaje / 100);
                        }
                        
                        return (
                            <div key={p.idPublicacion} className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0">
                                <div className="flex-1">
                                    <span className="text-base font-medium text-gray-800">
                                        {esMultiple ? `${index + 1}. ` : ''}{p.titulo}
                                    </span>
                                    <p className="text-sm text-gray-600">{p.marcaAuto} {p.modeloAuto}</p>
                                    {descuentoPorcentaje > 0 && (
                                        <p className="text-xs text-green-600 font-semibold mt-1">
                                            🏷️ {descuentoPorcentaje}% de descuento aplicado
                                        </p>
                                    )}
                                </div>
                                <div className="ml-4 text-right">
                                    {descuentoPorcentaje > 0 ? (
                                        <>
                                            <p className="text-sm text-gray-500 line-through">
                                                {formatearPrecio(precioOriginal)}
                                            </p>
                                            <p className="text-lg font-semibold text-green-600">
                                                {formatearPrecio(precioFinal)}
                                            </p>
                                        </>
                                    ) : (
                                        <span className="text-lg font-semibold text-gray-900">
                                            {formatearPrecio(precioOriginal)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className={`${esMultiple ? 'border-t-2' : 'border-t'} border-blue-300 pt-4 mt-4`}>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">
                            Total {esMultiple ? `(${cantidadVehiculos} vehículos)` : ''}
                        </span>
                        <span className="text-3xl font-bold text-blue-600">{formatearPrecio(total)}</span>
                    </div>
                </div>
            </div>

            <MetodoPagoForm onMetodoPagoChange={handleMetodoPagoChange} />

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <label htmlFor="comentarios" className="block text-base font-semibold text-gray-700 mb-3">
                    Comentarios adicionales (opcional)
                </label>
                <textarea
                    id="comentarios"
                    name="comentarios"
                    value={transaccionData.comentarios}
                    onChange={handleChange}
                    placeholder="Agrega cualquier información adicional sobre tu compra..."
                    rows="4"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <button 
                    onClick={handleSubmit}
                    disabled={loading || cartItems.length === 0}
                    className={`w-full text-white text-lg font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 ${
                        loading || cartItems.length === 0
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    }`}
                >
                    {loading 
                        ? '⏳ Procesando...' 
                        : esMultiple 
                            ? `🛒 Finalizar Compra (${cantidadVehiculos} vehículos)` 
                            : 'Finalizar Compra'
                    }
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                    Al finalizar, aceptas los términos y condiciones de la compra
                </p>
                <button
                    onClick={() => navigate('/')}
                    disabled={loading}
                    className="w-full mt-3 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                    Cancelar
                </button>
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

export default TransaccionForm;