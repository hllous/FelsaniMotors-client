import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/slices/authSlice';
import Modal from '../common/Modal';

const SignInPopup = ({ close, openLogIn }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
  });
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const dispatch = useDispatch();

  const showModal = (config) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos vacios primero
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password || !formData.telefono) {
      showModal({
        type: 'warning',
        title: 'Campos Incompletos',
        message: 'Por favor, completa todos los campos',
        showCancel: false
      });
      return;
    }

    // Validar formato de email
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidation.test(formData.email)) {
      showModal({
        type: 'warning',
        title: 'Email Inválido',
        message: 'Por favor, ingresa un email válido (ejemplo: usuario@gmail.com)',
        showCancel: false
      });
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      showModal({
        type: 'warning',
        title: 'Contraseña Muy Corta',
        message: 'La contraseña debe tener al menos 6 caracteres',
        showCancel: false
      });
      return;
    }

    // Validar que telefono solo contenga números
    if (!/^\d+$/.test(formData.telefono)) {
      showModal({
        type: 'warning',
        title: 'Teléfono Inválido',
        message: 'El teléfono solo puede contener números',
        showCancel: false
      });
      return;
    }

    const result = await dispatch(register(
      {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: parseInt(formData.telefono),
        rol: 'USER'
      }
    ))
    
    if (result.payload) {

      handleClose()
    } else {

      showModal(
        {
          type: 'error',
          title: 'Error al Registrarse',
          message: result.error?.message || 'No se pudo completar el registro. El email puede estar en uso.',
          showCancel: false
        }
      )  
    }


  }

  return (
    <div>
      <div
        className="fixed inset-0 bg-gray-600/40 z-40"
        onClick={handleClose}
      ></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className="bg-[#e8decb] rounded-md shadow-md w-[380px] p-6 relative border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            onClick={handleClose}
          >
            ×
          </button>

          <h2 className="text-xl font-semibold text-center mb-6 text-[#6c94c4]">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                  placeholder="Nombre"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                  placeholder="Apellido"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                placeholder="ejemplo@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                placeholder="contraseña"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-[#f2f5f6] rounded px-3 py-2 focus:outline-none"
                placeholder="1122334455"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6c94c4] text-white py-2 rounded hover:bg-[#4e78a5]"
            >
              Registrarse
            </button>
          </form>

          <button
            className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
            onClick={() => {
              handleClose();
              openLogIn();
            }}
          >
            Ya tengo una cuenta
          </button>
        </div>
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

export default SignInPopup;
