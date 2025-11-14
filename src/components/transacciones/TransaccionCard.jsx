import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicacionById, fetchFotosPublicacion } from '../../redux/slices/publicacionesSlice';
import { fetchUsuarioById } from '../../redux/slices/usuariosSlice';
import TransaccionEstado from "./TransaccionEstado";

const TransaccionCard = ({ transaccion }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  
  const { currentItem: publicacion, fotosMap } = useSelector((state) => state.publicaciones);
  const { items: usuarios } = useSelector((state) => state.usuarios);
  
  // Buscar comprador y vendedor en el estado de Redux
  const comprador = usuarios.find(u => u.idUsuario === transaccion?.idComprador) || {};
  const vendedor = usuarios.find(u => u.idUsuario === transaccion?.idVendedor) || {};

  useEffect(() => {
    const idPublicacion = transaccion?.idPublicacion;
    const idComprador = transaccion?.idComprador;
    const idVendedor = transaccion?.idVendedor;
    
    if (!idPublicacion || !idComprador || !idVendedor) return;

    // Solo fetch si no existe en cache
    if (!publicacion || publicacion.idPublicacion !== idPublicacion) {
      dispatch(fetchPublicacionById(idPublicacion));
    }
    
    if (!fotosMap?.[idPublicacion]) {
      dispatch(fetchFotosPublicacion(idPublicacion));
    }
    
    if (!comprador?.idUsuario) {
      dispatch(fetchUsuarioById({ idUsuario: idComprador, token }));
    }
    
    if (!vendedor?.idUsuario) {
      dispatch(fetchUsuarioById({ idUsuario: idVendedor, token }));
    }

  }, [transaccion?.idPublicacion, transaccion?.idComprador, transaccion?.idVendedor, token, dispatch, publicacion?.idPublicacion, fotosMap, comprador?.idUsuario, vendedor?.idUsuario])

  const fotos = fotosMap?.[transaccion?.idPublicacion];
  const image = (fotos && fotos.length > 0) 
    ? `data:image/jpeg;base64,${fotos[0].file}` 
    : "https://via.placeholder.com/300x200?text=Sin+imagen";

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearMonto = (monto) => {
    if (!monto) return "$0.00";
    return `$${parseFloat(monto).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="bg-white border border-gray-200 mb-6 max-w-5xl mx-auto">
      <div className="bg-blue-50 border-b border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">
              Transacción #{transaccion.idTransaccion || "Cargando..."}
            </h3>
            <p className="text-sm text-gray-600">
              {formatearFecha(transaccion.fechaTransaccion)}
            </p>
          </div>
          <TransaccionEstado estado={transaccion.estado} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Estado</p>
            <p className="text-base font-medium text-gray-900">
              {transaccion.estado || "Cargando..."}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Monto Total</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatearMonto(transaccion.monto)}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 p-6">
        <h4 className="text-base font-semibold text-gray-800 mb-4">Productos</h4>
        <div className="flex gap-4">
          <div className="w-32 h-24 flex-shrink-0">
            {image ? (
              <img
                src={image}
                alt={publicacion.titulo}
                className="w-full h-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <p className="text-xs text-gray-400">Sin imagen</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              {publicacion.titulo || "Cargando..."}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Vendedor</p>
            <p className="text-sm text-gray-600">
              {vendedor.nombre && vendedor.apellido
                ? `${vendedor.nombre} ${vendedor.apellido}`
                : "Cargando..."}
            </p>
            <p className="text-xs text-gray-500">{vendedor.email}</p>
            <p className="text-xs text-gray-500">{vendedor.telefono}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 mb-1">Comprador</p>
            <p className="text-sm text-gray-600">
              {comprador.nombre && comprador.apellido
                ? `${comprador.nombre} ${comprador.apellido}`
                : "Cargando..."}
            </p>
            <p className="text-xs text-gray-500">{comprador.email}</p>
            <p className="text-xs text-gray-500">{comprador.telefono}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Método de Pago</p>
            <p className="text-sm font-medium text-gray-900">
              {transaccion.metodoPago || "No especificado"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Referencia</p>
            <p className="text-sm font-medium text-gray-900 font-mono">
              {transaccion.referenciaPago || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransaccionCard;