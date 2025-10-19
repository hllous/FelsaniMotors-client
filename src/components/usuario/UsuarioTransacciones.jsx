import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MetodoPagoForm from "./MetodoPagoForm";
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import carritoService from '../../services/carritoService';

const TransaccionForm = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [transaccionData, setTransaccionData] = useState({
        metodoPago: "Visa",
        numeroTarjeta: "",
        fechaCaducidad: "",
        codigoSeguridad: "",
        comentarios: ""
    });
    
    const [publicaciones, setPublicaciones] = useState([]);
    const [total, setTotal] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const URLTransaccion = `http://localhost:4002/api/transacciones`;

    useEffect(() => {
        const token = authService.getToken();
        
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }

        // Validar si el usuario está loggeado
        if (!user) {
            alert('Debes iniciar sesión para completar tu compra.\n\nPor favor, inicia sesión y vuelve a intentarlo.');
            navigate('/');
            return;
        }

    const token = authService.getToken();
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    const URL_TRANSACCIONES = `http://localhost:4002/api/transacciones/usuario/${user.idUsuario}`;

    fetch(URL_TRANSACCIONES, { method: "GET", headers: headers })
      .then((response) => {
        if (response.status === 204) {
          setTransacciones([]);
          return null;
        }
        if (!response.ok) throw new Error("Error al buscar transacciones");
        return response.json();
      })
      .then((data) => {
        if (data) {
          setTransacciones(data);
          console.log(`✅ Transacciones del usuario ${user.idUsuario}:`, data);
        }
      })
      .catch((error) => {
        console.error("Error al cargar transacciones: ", error);
      });
  }, [user]);

  return (
    <div className="bg-white min-h-screen py-10 px-6">
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