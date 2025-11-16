import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../../redux/slices/carritoSlice';
import Modal from './Modal';

const Carrito = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.carrito);
  
  const [modalConfig, setModalConfig] = useState({ isOpen: false });
  
  // Calcular total
  let total = 0;
  for (const item of cartItems) {
    total += item.precio;
  }

  const showModal = (config) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false });
  };

  // Handle de eliminar una publicacion en el carrito
  const handleRemove = (idPublicacion) => {
    dispatch(removeFromCart(idPublicacion));
  };

  // Handle de eliminar todas las publicaciones del carrito
  const handleClear = () => {
    showModal({
      type: 'warning',
      title: 'Vaciar Carrito',
      message: '¿Estás seguro de que deseas vaciar todo el carrito?',
      confirmText: 'Sí, vaciar',
      onConfirm: () => {
        dispatch(clearCart());
      }
    });
  };

  // Handle checkout
  const handleCheckout = (idPublicacion = null) => {

    // Validar si el usuario esta loggeado
    if (!user) {
      showModal({
        type: 'warning',
        title: 'Iniciar Sesión',
        message: 'Debes iniciar sesión para completar tu compra.\n\nPor favor, inicia sesión y vuelve a intentarlo.',
        showCancel: false
      });
      return;
    }

    // Validar si el usuario esta activ
    if (user.activo === 0) {
      showModal({
        type: 'error',
        title: 'Cuenta Inactiva',
        message: 'Tu cuenta esta inactiva. No puedes realizar compras. Contacta al administrador.',
        showCancel: false
      });
      return;
    }

    // Validar que no esté comprando su propia publicacion
    if (idPublicacion) {

      const item = cartItems.find(i => i.idPublicacion === idPublicacion)

      if (item && item.idVendedor === user.idUsuario) {

        showModal({
          type: 'warning',
          title: 'No Disponible',
          message: 'No puedes comprar tu propia publicación.',
          showCancel: false
        })
        return
      }
    } else {
      
      // Validar que ningun item sea una publicacion del usuario
      const ownItems = cartItems.filter(item => item.idVendedor === user.idUsuario);
      if (ownItems.length > 0) {

        showModal({
          type: 'warning',
          title: 'No Disponible',
          message: 'No puedes comprar tus propias publicaciones. Por favor, elimínalas del carrito.',
          showCancel: false
        })
        return;
      }
    }

    // Creacion de carrito (sea 1 publi o +)
    if (idPublicacion) {
      const item = cartItems.find(i => i.idPublicacion === idPublicacion);
      if (item) {
        dispatch(clearCart());
        dispatch(addToCart(item));
      }
    }

    navigate('/comprar-carrito');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-600/40 z-40" 
        onClick={onClose}
      ></div>
      
      {/* Contenedor del carrito */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-paleta1-blue">Carrito de Compras</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg">El carrito está vacío</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-paleta1-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Seguir explorando
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div 
                  key={item.idPublicacion} 
                  className="flex gap-4 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Imagen del auto */}
                  <div className="w-32 h-24 flex-shrink-0">
                    <img
                      src={item.imagen || 'https://via.placeholder.com/150x100?text=Auto'}
                      alt={item.titulo}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Informacion */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-paleta1-blue mb-1">

                      {item.titulo}

                    </h3>
                    <p className="text-sm text-gray-600 mb-2">

                      {item.marcaAuto} {item.modeloAuto}

                    </p>
                    <p className="text-xl font-bold text-gray-900">

                      ${item.precio?.toLocaleString()} <span className="text-sm font-normal text-gray-500">ARS</span>

                    </p>
                  </div>

                  {/* Botones por publi individual*/}
                  <div className="flex flex-col justify-between">
                    <button
                      onClick={() => handleRemove(item.idPublicacion)}
                      className="text-red-500 hover:cursor-pointer hover:scale-110 transition-all 
                      duration-150 text-sm font-medium">

                      Eliminar

                    </button>
                    <button
                      onClick={() => handleCheckout(item.idPublicacion)}
                      className="px-4 py-2 text-green-600 hover:cursor-pointer hover:scale-110 transition-all 
                      duration-150 rounded-lg text-sm font-medium">

                      Comprar

                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con total y acciones */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total estimado:</span>
                <span className="text-2xl font-bold text-paleta1-blue">

                  ${total.toLocaleString()} <span className="text-sm font-normal text-gray-500">ARS</span>

                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600
                  transition-colors font-medium cursor-pointer">

                  Vaciar Carrito

                </button>
                <button
                  onClick={() => handleCheckout()}
                  className="flex-1 py-3 bg-paleta1-blue hover:bg-paleta1-blue-light text-white rounded-lg
                  transition-all duration-300 font-medium cursor-pointer">

                  Comprar Todo

                </button>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300
                transition-colors font-medium cursor-pointer">

                Seguir Explorando

              </button>
            </div>
          </>
        )}
        </div>
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
    </>
  );
};

export default Carrito;