const Modal = ({ isOpen, onClose, title, message, type = 'info', confirmText = 'Aceptar', 
                 cancelText = 'Cerrar', onConfirm, showCancel = true }) => {
  if (!isOpen) return null;

  const typeStyles = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800'
  };

  const icons = {
    success: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <>
      {/* Fondo transparente */}
      <div 
        className="fixed inset-0 bg-gray-600/40 z-[60]"
        onClick={onClose}
      ></div>

      {/* Contenedor del modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
        <div 
          className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icono y título */}
          <div className={`flex flex-col items-center mb-4 ${typeStyles[type]} rounded-lg p-4 border-2`}>
            <div className="mb-2">{icons[type]}</div>
            {title && <h3 className="text-xl font-bold text-center">{title}</h3>}
          </div>

          {/* Mensaje */}
          <div className="mb-6">
            <p className="text-gray-700 text-center whitespace-pre-line">{message}</p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`${showCancel ? 'flex-1' : 'w-full'} px-4 py-2 bg-paleta1-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
