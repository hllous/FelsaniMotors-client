import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransaccionesUsuario } from '../../redux/slices/transaccionesSlice';
import TransaccionCard from "../transacciones/TransaccionCard";

const UsuarioTransacciones = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { misTransacciones: transacciones } = useSelector((state) => state.transacciones);

  useEffect(() => {
    if (user?.idUsuario) {
      // Siempre fetch las transacciones del usuario actual
      dispatch(fetchTransaccionesUsuario({ idUsuario: user.idUsuario, token }));
    }
  }, [user?.idUsuario]);

  return (
    <div className="bg-[#f5efe6] min-h-screen py-10 px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Mis Transacciones</h2>
        <button
          onClick={() => navigate('/perfil')}
          className="px-4 py-2 bg-[#cbdceb] text-gray-800 rounded-lg hover:bg-[#b3cadb] transition-colors"
        >
          Volver al Perfil
        </button>
      </div>

      {transacciones.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tienes transacciones aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transacciones.map((transaccion) => (
            <TransaccionCard 
              key={transaccion.idTransaccion}
              transaccion={transaccion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsuarioTransacciones;    