import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { updateUsuario } from '../../redux/slices/usuariosSlice';
import Modal from '../common/Modal';

const UsuarioActualizacion = () => {
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
        message: 'Tu cuenta está inactiva. No puedes modificar tu perfil.',
        type: 'warning',
        onConfirm: () => navigate('/perfil')
      });
    }
  }, [user?.activo]);

  const [newUsuarioData, setNewUsuarioData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUsuarioData({ ...newUsuarioData, [name]: value });
  };

  const handleActualizacion = async (e) => {
    e.preventDefault();
    
    const datosActualizados = {}
    if (newUsuarioData.nombre.trim() !== "") {
      datosActualizados.nombre = newUsuarioData.nombre;
    }
    if (newUsuarioData.apellido.trim() !== "") {
      datosActualizados.apellido = newUsuarioData.apellido;
    }
    if (newUsuarioData.telefono.trim() !== "") {
      datosActualizados.telefono = newUsuarioData.telefono;
    }

    // Verificar si hay datos para actualizar
    const hayDatosParaActualizar = datosActualizados.nombre || datosActualizados.apellido || datosActualizados.telefono
    if (!hayDatosParaActualizar) {
      showModal({
        title: 'Campos Vacíos',
        message: 'No has ingresado ningún campo para actualizar',
        type: 'warning'
      })
      return;
    }
    
    const updateResult = await dispatch(updateUsuario({
      idUsuario: user.idUsuario,
      usuarioData: datosActualizados,
      token
    }));
    
    if (!updateResult.payload) {
      showModal({
        title: 'Error',
        message: 'No se pudo actualizar el perfil. Intenta nuevamente.',
        type: 'error'
      });
      return;
    }
    
    showModal({
      title: 'Éxito',
      message: 'Perfil actualizado correctamente',
      type: 'success',
      onConfirm: () => navigate('/perfil')
    })
  }

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
        onSubmit={handleActualizacion}
        className="bg-white border border-[#cbdceb] rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-1">
          Actualiza tu información
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Deja en blanco lo que no quieras cambiar
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Nombre</label>
            <input
              name="nombre"
              type="text"
              placeholder="Nombre"
              value={newUsuarioData.nombre}
              onChange={handleChange}
              className="w-full border border-[#cbdceb] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cbdceb]"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Apellido</label>
            <input
              name="apellido"
              type="text"
              placeholder="Apellido"
              value={newUsuarioData.apellido}
              onChange={handleChange}
              className="w-full border border-[#cbdceb] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cbdceb]"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Teléfono</label>
            <input
              name="telefono"
              type="tel"
              placeholder="1122334455"
              value={newUsuarioData.telefono}
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
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioActualizacion;