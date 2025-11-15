import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchFotosByPublicacion } from '../../redux/slices/fotosSlice';
import TransaccionEstado from "./TransaccionEstado";

const TransaccionCard = ({ transaccion }) => {
  const dispatch = useDispatch();
  
  const { fotosByPublicacion } = useSelector((state) => state.fotos);

  useEffect(() => {
    const idPublicacion = transaccion?.idPublicacion;
    
    if (!idPublicacion) return;
    
    // Solo fetch fotos si no están en caché
    if (!fotosByPublicacion?.[idPublicacion]) {
      dispatch(fetchFotosByPublicacion(idPublicacion));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaccion?.idPublicacion]);

  const fotos = fotosByPublicacion?.[transaccion?.idPublicacion];
  const image = (fotos && fotos.length > 0 && fotos[0]?.file) 
    ? `data:image/jpeg;base64,${fotos[0].file}` 
    : null;

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
                alt={transaccion?.tituloPublicacion || "Producto"}
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
              {transaccion?.tituloPublicacion || "Cargando..."}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Vendedor</p>
            <p className="text-sm text-gray-600">
              {transaccion?.nombreVendedor || "Cargando..."}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 mb-1">Comprador</p>
            <p className="text-sm text-gray-600">
              {transaccion?.nombreComprador || "Cargando..."}
            </p>
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