import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UsuarioPerfil = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="bg-white flex justify-center items-start py-10">
      <div className="bg-white border border-[#cbdceb] rounded-2xl p-6 max-w-3xl w-full">
        <div className="flex items-center justify-between mb-6 border-b border-[#cbdceb] pb-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            {user?.nombre} {user?.apellido}
          </h3>
          <button
            onClick={() => navigate('/perfil/actualizar')}
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Modificar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">E-mail</p>
            <p>{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p>{user?.telefono}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rol</p>
            <p>{user?.rol}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Activo</p>
            <p>
              {user?.activo ? "Sí" : "No"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => navigate('/perfil/publicaciones')}
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Mis Publicaciones
          </button>
          <button
            onClick={() => navigate('/perfil/transacciones')}
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Mis Transacciones
          </button>
          <button
            onClick={() => navigate('/perfil/cambiar-contraseña')}
            className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioPerfil;