import React, { useState } from 'react';
import Footer from '../components/common/Footer';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  AUTH_ERRORS,
  USER_ERRORS,
  COMMENT_ERRORS,
  PHOTO_ERRORS,
  AUTO_ERRORS,
  TRANSACTION_ERRORS,
  SUCCESS_MESSAGES,
  INFO_MESSAGES,
  getErrorMessage
} from '../utils/errorMessages';

const ComponentsDemo = () => {
  const [showError, setShowError] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  
  // Estados para errores específicos
  const [authErrors, setAuthErrors] = useState({
    invalidCredentials: true,
    tokenExpired: true,
  });
  const [commentErrors, setCommentErrors] = useState({
    invalid: true,
    notFound: true,
  });
  const [userErrors, setUserErrors] = useState({
    duplicate: true,
    notFound: true,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header de demo */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Demo de Componentes - Felsani Motors
          </h1>
          <p className="text-gray-600 mt-2">
            Vista previa de Footer y ErrorMessage
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="space-y-8">
          {/* Sección ErrorMessage - Tipos Básicos */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📢 Tipos Básicos de Mensajes
            </h2>
            <p className="text-gray-600 mb-6">
              ErrorMessage soporta 4 tipos: error, warning, success, info
            </p>
            
            <div className="space-y-4">
              {/* Error */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Error:</h3>
                {showError && (
                  <ErrorMessage 
                    message="No se pudo cargar la información del vehículo. Por favor, intenta nuevamente."
                    type="error"
                    onClose={() => setShowError(false)}
                  />
                )}
                {!showError && (
                  <button 
                    onClick={() => setShowError(true)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Mostrar mensaje de error
                  </button>
                )}
              </div>

              {/* Warning */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Warning:</h3>
                {showWarning && (
                  <ErrorMessage 
                    message="Algunos campos están incompletos. Revisa el formulario antes de continuar."
                    type="warning"
                    onClose={() => setShowWarning(false)}
                  />
                )}
                {!showWarning && (
                  <button 
                    onClick={() => setShowWarning(true)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Mostrar advertencia
                  </button>
                )}
              </div>

              {/* Success */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Success:</h3>
                {showSuccess && (
                  <ErrorMessage 
                    message={SUCCESS_MESSAGES.AUTO_CREATED}
                    type="success"
                    onClose={() => setShowSuccess(false)}
                  />
                )}
                {!showSuccess && (
                  <button 
                    onClick={() => setShowSuccess(true)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Mostrar mensaje de éxito
                  </button>
                )}
              </div>

              {/* Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Info:</h3>
                {showInfo && (
                  <ErrorMessage 
                    message={INFO_MESSAGES.VERIFICATION_SENT}
                    type="info"
                    onClose={() => setShowInfo(false)}
                  />
                )}
                {!showInfo && (
                  <button 
                    onClick={() => setShowInfo(true)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Mostrar información
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Sección: Errores de Autenticación y Login */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🔐 Errores de Autenticación y Login
            </h2>
            <p className="text-gray-600 mb-6">
              Mensajes específicos para errores de autenticación, sesión y permisos
            </p>
            
            <div className="space-y-4">
              {authErrors.invalidCredentials && (
                <ErrorMessage 
                  message={AUTH_ERRORS.INVALID_CREDENTIALS}
                  type="error"
                  onClose={() => setAuthErrors({...authErrors, invalidCredentials: false})}
                />
              )}
              
              {authErrors.tokenExpired && (
                <ErrorMessage 
                  message={AUTH_ERRORS.TOKEN_EXPIRED}
                  type="warning"
                  onClose={() => setAuthErrors({...authErrors, tokenExpired: false})}
                />
              )}
              
              <ErrorMessage 
                message={AUTH_ERRORS.UNAUTHORIZED}
                type="error"
              />
              
              <ErrorMessage 
                message={AUTH_ERRORS.AUTHENTICATION_REQUIRED}
                type="warning"
              />
            </div>
          </section>

          {/* Sección: Errores de Comentarios */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💬 Errores de Comentarios
            </h2>
            <p className="text-gray-600 mb-6">
              Mensajes para validación y manejo de comentarios
            </p>
            
            <div className="space-y-4">
              {commentErrors.invalid && (
                <ErrorMessage 
                  message={COMMENT_ERRORS.COMMENT_INVALID}
                  type="error"
                  onClose={() => setCommentErrors({...commentErrors, invalid: false})}
                />
              )}
              
              {commentErrors.notFound && (
                <ErrorMessage 
                  message={COMMENT_ERRORS.COMMENT_NOT_FOUND_EXCEPTION}
                  type="error"
                  onClose={() => setCommentErrors({...commentErrors, notFound: false})}
                />
              )}
              
              <ErrorMessage 
                message={COMMENT_ERRORS.UNAUTHORIZED_COMMENT}
                type="error"
              />
              
              <ErrorMessage 
                message={COMMENT_ERRORS.COMMENT_TOO_LONG}
                type="warning"
              />
              
              <ErrorMessage 
                message={SUCCESS_MESSAGES.COMMENT_ADDED}
                type="success"
              />
            </div>
          </section>

          {/* Sección: Errores de Usuarios */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              👤 Errores de Usuarios
            </h2>
            <p className="text-gray-600 mb-6">
              Mensajes para registro, validación y gestión de usuarios
            </p>
            
            <div className="space-y-4">
              {userErrors.duplicate && (
                <ErrorMessage 
                  message={USER_ERRORS.USER_DUPLICATE}
                  type="warning"
                  onClose={() => setUserErrors({...userErrors, duplicate: false})}
                />
              )}
              
              {userErrors.notFound && (
                <ErrorMessage 
                  message={USER_ERRORS.USER_NOT_FOUND}
                  type="error"
                  onClose={() => setUserErrors({...userErrors, notFound: false})}
                />
              )}
              
              <ErrorMessage 
                message={USER_ERRORS.INVALID_EMAIL}
                type="error"
              />
              
              <ErrorMessage 
                message={USER_ERRORS.WEAK_PASSWORD}
                type="warning"
              />
              
              <ErrorMessage 
                message={SUCCESS_MESSAGES.REGISTER_SUCCESS}
                type="success"
              />
            </div>
          </section>

          {/* Sección: Otros Errores */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🚗 Errores de Autos, Fotos y Transacciones
            </h2>
            <p className="text-gray-600 mb-6">
              Mensajes para publicaciones, fotos y transacciones
            </p>
            
            <div className="space-y-4">
              <ErrorMessage 
                message={AUTO_ERRORS.AUTO_NOT_FOUND}
                type="error"
              />
              
              <ErrorMessage 
                message={AUTO_ERRORS.INVALID_PRICE}
                type="error"
              />
              
              <ErrorMessage 
                message={PHOTO_ERRORS.INVALID_FILE_FORMAT}
                type="error"
              />
              
              <ErrorMessage 
                message={PHOTO_ERRORS.FILE_TOO_LARGE}
                type="warning"
              />
              
              <ErrorMessage 
                message={TRANSACTION_ERRORS.TRANSACTION_NOT_FOUND}
                type="error"
              />
              
              <ErrorMessage 
                message={SUCCESS_MESSAGES.AUTO_CREATED}
                type="success"
              />
            </div>
          </section>

          {/* Código de ejemplo */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💻 Ejemplo de Uso en tu Código
            </h2>
            
            <div className="space-y-4">
              {/* Uso básico */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">1. Uso Básico:</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`import ErrorMessage from './components/common/ErrorMessage';

// Con cierre
<ErrorMessage 
  message="Mensaje de error" 
  type="error"
  onClose={() => setError(null)}
/>

// Tipos: 'error', 'warning', 'success', 'info'
<ErrorMessage message="Todo bien!" type="success" />`}
                  </pre>
                </div>
              </div>

              {/* Uso con constantes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">2. Usando Constantes:</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`import ErrorMessage from './components/common/ErrorMessage';
import { AUTH_ERRORS, SUCCESS_MESSAGES } from './utils/errorMessages';

// Error de login
<ErrorMessage 
  message={AUTH_ERRORS.INVALID_CREDENTIALS}
  type="error"
/>

// Registro exitoso
<ErrorMessage 
  message={SUCCESS_MESSAGES.REGISTER_SUCCESS}
  type="success"
/>`}
                  </pre>
                </div>
              </div>

              {/* Uso con manejo de errores de API */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">3. Manejo de Errores de API:</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`import { getErrorMessage } from './utils/errorMessages';
import { useState } from 'react';

function LoginForm() {
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      await api.login(credentials);
    } catch (err) {
      // Mapea automáticamente el error del backend
      const errorInfo = getErrorMessage(err);
      setError(errorInfo);
    }
  };

  return (
    <>
      {error && (
        <ErrorMessage 
          message={error.message}
          type={error.type}
          onClose={() => setError(null)}
        />
      )}
      {/* Resto del formulario */}
    </>
  );
}`}
                  </pre>
                </div>
              </div>

              {/* Uso con hook personalizado */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">4. Con Hook Personalizado:</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{`import { useErrorHandler } from './utils/errorMessages';

function MyComponent() {
  const { error, setError, clearError } = useErrorHandler();

  const handleAction = async () => {
    try {
      await someApiCall();
    } catch (err) {
      setError(err); // Automáticamente mapea el error
    }
  };

  return (
    <>
      {error && (
        <ErrorMessage 
          message={error.message}
          type={error.type}
          onClose={clearError}
        />
      )}
    </>
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Información del Footer */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🦶 Componente Footer
            </h2>
            <p className="text-gray-600">
              El Footer está renderizado al final de esta página. 
              Desplázate hacia abajo para verlo.
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>✅ Información de la empresa</li>
              <li>✅ Enlaces a redes sociales</li>
              <li>✅ Enlaces rápidos de navegación</li>
              <li>✅ Información de contacto</li>
              <li>✅ Copyright dinámico</li>
              <li>✅ Diseño responsive</li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer - el componente que queremos ver */}
      <Footer />
    </div>
  );
};

export default ComponentsDemo;
