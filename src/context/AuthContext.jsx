import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import authService from '../services/authService';

// Provider que envuelve la app y provee el estado de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al cargar la app, verificar si hay un token guardado
  useEffect(() => {
    const inicializarAuth = () => {
        const token = authService.getToken();
        const userData = authService.getUserData();
        if (token) {
            setIsAuthenticated(true);
            setUser(userData);
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    inicializarAuth();
  }, []);

  // Función de login
  const login = (email, password) => {
    return authService.login(email, password)
      .then((data) => {
        // Por ahora guardamos solo el email como dato del usuario
        // Puedes ajustar esto según lo que devuelva tu backend
        const userData = {
          email: email,
          firstname: '',
          lastname: '',
          role: 'USER',
        };
        
        authService.setUserData(userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data };
      })
      .catch((error) => {
        setIsAuthenticated(false);
        setUser(null);
        return { success: false, error: error.message };
      });
  };

  // Función de registro
  const register = (email, password, firstname, lastname, telefono, role = 'USER') => {
    return authService.register(email, password, firstname, lastname, telefono, role)
      .then((data) => {
        // Crear objeto de usuario
        const userData = {
          email,
          firstname,
          lastname,
          role,
          telefono,
        };
        
        authService.setUserData(userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data };
      })
      .catch((error) => {
        setIsAuthenticated(false);
        setUser(null);
        return { success: false, error: error.message };
      });
  };

  // Función de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Actualizar datos del usuario
  const updateUser = (userData) => {
    authService.setUserData(userData);
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
