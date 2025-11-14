import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicacionesUsuario } from '../../redux/slices/publicacionesSlice';

const UsuarioPublicaciones = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { misPublicaciones: publicaciones } = useSelector((state) => state.publicaciones);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.idUsuario) {
      dispatch(fetchPublicacionesUsuario(user.idUsuario));
    }
  }, [user?.idUsuario, dispatch]);

  const handleClick = (idPublicacion) => {
    navigate(`/publicacion/${idPublicacion}`);
  };

  return (
    <div className="bg-white min-h-screen py-10 px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Mis Publicaciones</h2>
        <button
          onClick={() => navigate('/perfil')}
          className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
        >
          Volver al Perfil
        </button>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicaciones.map((publicacion) => (
          <div
            key={publicacion.idPublicacion}
            className="bg-white border border-[#cbdceb] rounded-2xl p-4 flex flex-col cursor-pointer"
            onClick={() => handleClick(publicacion.idPublicacion)}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {publicacion.titulo}
            </h3>
            <p className="text-[#6c94c4] font-medium mb-4">
              ${publicacion.precio}
            </p>
            <p className="text-sm text-gray-600">
              {publicacion.descripcion || "Sin descripción"}
            </p>
            <div className="mt-3 text-sm text-gray-400">
              {new Date(publicacion.fechaPublicacion).toISOString().split('T')[0]}
            </div>
          </div>
        ))}
      </div>
      
      {publicaciones.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No tienes publicaciones aún</p>
          <button
            onClick={() => navigate('/crear-publicacion')}
            className="px-6 py-3 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
          >
            Crear Primera Publicación
          </button>
        </div>
      )}
    </div>
  );
};

export default UsuarioPublicaciones;