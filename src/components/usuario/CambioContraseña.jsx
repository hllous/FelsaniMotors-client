import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { cambiarContrasena } from '../../redux/slices/usuariosSlice';
import Modal from '../common/Modal';

const CambioContrasena = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const showModal = (config) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false });
  };

  useEffect(() => {
    if (user?.activo === 0) {
      showModal({
        title: 'Cuenta Inactiva',
        message: 'Tu cuenta está inactiva. No puedes cambiar tu contraseña.',
        type: 'warning',
        onConfirm: () => navigate('/perfil')
      });
    }
  }, [user?.activo, navigate]);

  const [contrasenaUpdate, setContrasenaUpdate] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContrasenaUpdate({ ...contrasenaUpdate, [name]: value });
  };

  const handleCambio = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(cambiarContrasena({
      idUsuario: user.idUsuario,
      oldPassword: contrasenaUpdate.contrasenaActual,
      newPassword: contrasenaUpdate.nuevaContrasena,
      token
    }));
    
    if (!result.payload) {
      showModal({
        title: 'Error',
        message: 'No se pudo cambiar la contraseña. Verifica que la contraseña actual sea correcta.',
        type: 'error'
      });
      return;
    }
    
    showModal({
      title: 'Éxito',
      message: 'Contraseña actualizada correctamente',
      type: 'success',
      onConfirm: () => navigate('/perfil')
    });
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-start py-10">
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showCancel={modalConfig.showCancel}
        onConfirm={modalConfig.onConfirm}
      />
      
      <form
        onSubmit={handleCambio}
        className="bg-white border border-[#cbdceb] rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Cambiar Contraseña
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">
              Escribe tu contraseña actual
            </label>
            <input
              name="contrasenaActual"
              type="password"
              placeholder="Contraseña"
              value={contrasenaUpdate.contrasenaActual}
              onChange={handleChange}
              className="w-full border border-[#cbdceb] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cbdceb]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Escribe tu nueva contraseña
            </label>
            <input
              name="nuevaContrasena"
              type="password"
              placeholder="Nueva contraseña"
              value={contrasenaUpdate.nuevaContrasena}
              onChange={handleChange}
              className="w-full border border-[#cbdceb] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cbdceb]"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => navigate('/perfil')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Volver
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Cambiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CambioContrasena;