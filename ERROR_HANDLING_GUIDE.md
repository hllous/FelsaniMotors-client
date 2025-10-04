# Sistema de Manejo de Errores - FelsaniMotors

Este documento explica cómo utilizar el sistema de manejo de errores en el frontend de FelsaniMotors.

## 📁 Archivos

- **`src/components/common/ErrorMessage.jsx`** - Componente visual para mostrar mensajes
- **`src/utils/errorMessages.js`** - Constantes de mensajes y utilidades para mapear errores

## 🎯 Componente ErrorMessage

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `message` | string | - | El mensaje a mostrar (requerido) |
| `type` | string | 'error' | Tipo de mensaje: 'error', 'warning', 'success', 'info' |
| `onClose` | function | null | Función para cerrar el mensaje (opcional) |
| `className` | string | '' | Clases CSS adicionales |

### Uso Básico

```jsx
import ErrorMessage from './components/common/ErrorMessage';

// Error
<ErrorMessage 
  message="Ocurrió un error"
  type="error"
/>

// Warning
<ErrorMessage 
  message="Revisa los campos"
  type="warning"
/>

// Success
<ErrorMessage 
  message="¡Operación exitosa!"
  type="success"
/>

// Info
<ErrorMessage 
  message="Información importante"
  type="info"
/>

// Con botón de cierre
<ErrorMessage 
  message="Mensaje con cierre"
  type="error"
  onClose={() => setError(null)}
/>
```

## 📝 Constantes de Mensajes

### Categorías Disponibles

#### 🔐 AUTH_ERRORS - Autenticación y Login
```javascript
import { AUTH_ERRORS } from './utils/errorMessages';

AUTH_ERRORS.INVALID_CREDENTIALS      // Credenciales incorrectas
AUTH_ERRORS.USER_NOT_FOUND          // Usuario no encontrado
AUTH_ERRORS.INVALID_TOKEN           // Token inválido
AUTH_ERRORS.UNAUTHORIZED            // Sin permisos
AUTH_ERRORS.TOKEN_EXPIRED           // Sesión expirada
AUTH_ERRORS.AUTHENTICATION_REQUIRED // Login requerido
```

#### 👤 USER_ERRORS - Usuarios
```javascript
import { USER_ERRORS } from './utils/errorMessages';

USER_ERRORS.USER_NOT_FOUND    // Usuario no encontrado
USER_ERRORS.USER_DUPLICATE    // Email ya registrado
USER_ERRORS.INVALID_EMAIL     // Email inválido
USER_ERRORS.WEAK_PASSWORD     // Contraseña débil
```

#### 💬 COMMENT_ERRORS - Comentarios
```javascript
import { COMMENT_ERRORS } from './utils/errorMessages';

COMMENT_ERRORS.COMMENT_INVALID              // Comentario vacío
COMMENT_ERRORS.COMMENT_NOT_FOUND           // Comentario no encontrado
COMMENT_ERRORS.COMMENT_NOT_FOUND_EXCEPTION // Comentario no existe
COMMENT_ERRORS.UNAUTHORIZED_COMMENT        // No puede modificar
COMMENT_ERRORS.COMMENT_TOO_LONG           // Muy largo
```

#### 📸 PHOTO_ERRORS - Fotos
```javascript
import { PHOTO_ERRORS } from './utils/errorMessages';

PHOTO_ERRORS.PHOTO_NOT_FOUND       // Foto no encontrada
PHOTO_ERRORS.INVALID_FILE_FORMAT   // Formato inválido
PHOTO_ERRORS.FILE_TOO_LARGE        // Archivo muy grande
PHOTO_ERRORS.UPLOAD_FAILED         // Error al subir
```

#### 🚗 AUTO_ERRORS - Vehículos
```javascript
import { AUTO_ERRORS } from './utils/errorMessages';

AUTO_ERRORS.AUTO_NOT_FOUND    // Auto no encontrado
AUTO_ERRORS.AUTO_DUPLICATE    // Auto duplicado
AUTO_ERRORS.INVALID_PRICE     // Precio inválido
AUTO_ERRORS.INVALID_YEAR      // Año inválido
AUTO_ERRORS.REQUIRED_FIELDS   // Campos requeridos
```

#### 💳 TRANSACTION_ERRORS - Transacciones
```javascript
import { TRANSACTION_ERRORS } from './utils/errorMessages';

TRANSACTION_ERRORS.TRANSACTION_INVALID        // Transacción inválida
TRANSACTION_ERRORS.TRANSACTION_NOT_FOUND     // No encontrada
TRANSACTION_ERRORS.INSUFFICIENT_FUNDS        // Fondos insuficientes
TRANSACTION_ERRORS.TRANSACTION_NOT_ENCONTRADA // No encontrada
```

#### ✅ SUCCESS_MESSAGES - Mensajes de Éxito
```javascript
import { SUCCESS_MESSAGES } from './utils/errorMessages';

SUCCESS_MESSAGES.LOGIN_SUCCESS      // Login exitoso
SUCCESS_MESSAGES.REGISTER_SUCCESS   // Registro exitoso
SUCCESS_MESSAGES.COMMENT_ADDED      // Comentario agregado
SUCCESS_MESSAGES.COMMENT_UPDATED    // Comentario actualizado
SUCCESS_MESSAGES.COMMENT_DELETED    // Comentario eliminado
SUCCESS_MESSAGES.AUTO_CREATED       // Auto creado
SUCCESS_MESSAGES.AUTO_UPDATED       // Auto actualizado
SUCCESS_MESSAGES.AUTO_DELETED       // Auto eliminado
SUCCESS_MESSAGES.PHOTO_UPLOADED     // Foto subida
SUCCESS_MESSAGES.PROFILE_UPDATED    // Perfil actualizado
SUCCESS_MESSAGES.PASSWORD_CHANGED   // Contraseña cambiada
```

#### ℹ️ INFO_MESSAGES - Mensajes Informativos
```javascript
import { INFO_MESSAGES } from './utils/errorMessages';

INFO_MESSAGES.LOADING           // Cargando...
INFO_MESSAGES.PROCESSING        // Procesando...
INFO_MESSAGES.VERIFICATION_SENT // Email enviado
INFO_MESSAGES.CHECK_EMAIL       // Revisa tu email
```

## 🔧 Función getErrorMessage()

Mapea automáticamente errores del backend a mensajes amigables.

```javascript
import { getErrorMessage } from './utils/errorMessages';

try {
  await api.login(credentials);
} catch (error) {
  const errorInfo = getErrorMessage(error);
  // errorInfo = { message: "...", type: "error" | "warning" | "success" | "info" }
  
  setError(errorInfo);
}
```

### Mapeo Automático

La función `getErrorMessage()` mapea automáticamente:

- **Códigos HTTP**:
  - `400` → Error de validación
  - `401` → Autenticación requerida
  - `403` → Sin permisos
  - `404` → Recurso no encontrado (detecta el tipo: usuario, comentario, auto, etc.)
  - `409` → Conflicto/duplicado
  - `500` → Error del servidor

- **Palabras clave en mensajes**:
  - "credencial", "contraseña" → Error de login
  - "token", "sesión" → Token expirado
  - "comentario vacío" → Comentario inválido
  - "formato", "archivo" → Formato inválido
  - "tamaño", "grande" → Archivo muy grande
  - "email", "correo" → Email inválido

## 🎣 Hook useErrorHandler()

Hook personalizado para simplificar el manejo de errores.

```javascript
import { useErrorHandler } from './utils/errorMessages';

function MyComponent() {
  const { error, setError, clearError, hasError } = useErrorHandler();

  const handleSubmit = async () => {
    try {
      await api.createAuto(data);
    } catch (err) {
      setError(err); // Mapea automáticamente
    }
  };

  return (
    <>
      {hasError && (
        <ErrorMessage 
          message={error.message}
          type={error.type}
          onClose={clearError}
        />
      )}
      {/* Tu formulario */}
    </>
  );
}
```

### Propiedades del Hook

- `error`: Objeto con `{ message, type }` o `null`
- `setError(err)`: Función para establecer un error (mapea automáticamente)
- `clearError()`: Función para limpiar el error
- `hasError`: Boolean que indica si hay un error

## 📋 Ejemplos Completos

### Ejemplo 1: Formulario de Login

```jsx
import React, { useState } from 'react';
import ErrorMessage from './components/common/ErrorMessage';
import { AUTH_ERRORS, getErrorMessage } from './utils/errorMessages';

function LoginForm() {
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/auth/login', credentials);
      // Redirigir o hacer algo con la respuesta
    } catch (err) {
      const errorInfo = getErrorMessage(err);
      setError(errorInfo);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && (
        <ErrorMessage 
          message={error.message}
          type={error.type}
          onClose={() => setError(null)}
        />
      )}
      
      <input 
        type="email" 
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
      />
      <input 
        type="password" 
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

### Ejemplo 2: Agregar Comentario

```jsx
import React, { useState } from 'react';
import ErrorMessage from './components/common/ErrorMessage';
import { COMMENT_ERRORS, SUCCESS_MESSAGES } from './utils/errorMessages';
import { useErrorHandler } from './utils/errorMessages';

function CommentForm({ autoId }) {
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const { error, setError, clearError } = useErrorHandler();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    // Validación local
    if (!comment.trim()) {
      setError({ 
        customMessage: COMMENT_ERRORS.COMMENT_INVALID, 
        type: 'error' 
      });
      return;
    }

    if (comment.length > 500) {
      setError({ 
        customMessage: COMMENT_ERRORS.COMMENT_TOO_LONG, 
        type: 'warning' 
      });
      return;
    }

    try {
      await api.post(`/autos/${autoId}/comentarios`, { texto: comment });
      setSuccess(true);
      setComment('');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <ErrorMessage 
          message={error.message}
          type={error.type}
          onClose={clearError}
        />
      )}
      
      {success && (
        <ErrorMessage 
          message={SUCCESS_MESSAGES.COMMENT_ADDED}
          type="success"
          onClose={() => setSuccess(false)}
        />
      )}
      
      <textarea 
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escribe tu comentario..."
        maxLength={500}
      />
      
      <button type="submit">Agregar Comentario</button>
    </form>
  );
}
```

### Ejemplo 3: Publicar Auto

```jsx
import React, { useState } from 'react';
import ErrorMessage from './components/common/ErrorMessage';
import { AUTO_ERRORS, SUCCESS_MESSAGES } from './utils/errorMessages';
import { useErrorHandler } from './utils/errorMessages';

function CreateAutoForm() {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: '',
    precio: '',
    descripcion: ''
  });
  
  const { error, setError, clearError } = useErrorHandler();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validaciones locales
    if (!formData.marca || !formData.modelo || !formData.año || !formData.precio) {
      setError({ 
        customMessage: AUTO_ERRORS.REQUIRED_FIELDS, 
        type: 'warning' 
      });
      return;
    }

    if (formData.precio <= 0) {
      setError({ 
        customMessage: AUTO_ERRORS.INVALID_PRICE, 
        type: 'error' 
      });
      return;
    }

    try {
      await api.post('/autos', formData);
      setSuccess(true);
      // Reset form
      setFormData({ marca: '', modelo: '', año: '', precio: '', descripcion: '' });
    } catch (err) {
      setError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <ErrorMessage 
          message={error.message}
          type={error.type}
          onClose={clearError}
        />
      )}
      
      {success && (
        <ErrorMessage 
          message={SUCCESS_MESSAGES.AUTO_CREATED}
          type="success"
          onClose={() => setSuccess(false)}
        />
      )}
      
      {/* Campos del formulario */}
      <button type="submit">Publicar Auto</button>
    </form>
  );
}
```

## 🎨 Personalización

### Colores por Tipo

- **Error** (rojo): `bg-red-50 border-red-400 text-red-800`
- **Warning** (amarillo): `bg-yellow-50 border-yellow-400 text-yellow-800`
- **Success** (verde): `bg-green-50 border-green-400 text-green-800`
- **Info** (azul): `bg-blue-50 border-blue-400 text-blue-800`

### Agregar Clases Personalizadas

```jsx
<ErrorMessage 
  message="Mensaje personalizado"
  type="error"
  className="mb-4 mx-2"
/>
```

## 📚 Mejores Prácticas

1. **Usa constantes**: Siempre importa y usa las constantes en lugar de strings hardcodeados
2. **Validación local primero**: Valida datos antes de enviar al backend
3. **Mapeo automático**: Usa `getErrorMessage()` para errores del backend
4. **Limpieza de mensajes**: Limpia los mensajes de éxito después de unos segundos
5. **Usuario primero**: Los mensajes deben ser claros y accionables

## 🔄 Actualización de Mensajes

Para agregar nuevos mensajes, edita `src/utils/errorMessages.js`:

```javascript
export const NUEVA_CATEGORIA = {
  NUEVO_ERROR: 'Mensaje del nuevo error',
  // ... más mensajes
};
```

---

**Documentación creada para FelsaniMotors** 🚗
