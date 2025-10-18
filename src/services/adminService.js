import authService from './authService';

const API_URL = 'http://localhost:4002/api';

const adminService = {
    
    //Obtiene el header de autorización con el token
    
    getAuthHeader: () => {
        const token = authService.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    },

    // ============= USUARIOS =============
    
    
    //Obtiene todos los usuarios (solo ADMIN)
    
    getAllUsuarios: async () => {
        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'GET',
                headers: adminService.getAuthHeader()
            });

            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAllUsuarios:', error);
            throw error;
        }
    },

    
    //Cambia el rol de un usuario (solo ADMIN)
    
    cambiarRolUsuario: async (idUsuario, nuevoRol) => {
        try {
            const response = await fetch(`${API_URL}/usuarios/${idUsuario}/rol`, {
                method: 'PUT',
                headers: adminService.getAuthHeader(),
                body: JSON.stringify({ rol: nuevoRol })
            });

            if (!response.ok) {
                throw new Error('Error al cambiar rol del usuario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en cambiarRolUsuario:', error);
            throw error;
        }
    },

    
    //Elimina un usuario (solo ADMIN)
    
    eliminarUsuario: async (idUsuario) => {
        try {
            const response = await fetch(`${API_URL}/usuarios/${idUsuario}`, {
                method: 'DELETE',
                headers: adminService.getAuthHeader()
            });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            return { success: true };
        } catch (error) {
            console.error('Error en eliminarUsuario:', error);
            throw error;
        }
    },

    // ============= PUBLICACIONES =============
    
    
    //Obtiene todas las publicaciones (solo ADMIN)
    
    getAllPublicaciones: async () => {
        try {
            const response = await fetch(`${API_URL}/publicaciones`, {
                method: 'GET',
                headers: adminService.getAuthHeader()
            });

            if (!response.ok) {
                throw new Error('Error al obtener publicaciones');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAllPublicaciones:', error);
            throw error;
        }
    },

    
    //Elimina una publicación (solo ADMIN)
    
    eliminarPublicacion: async (idPublicacion) => {
        try {
            const response = await fetch(`${API_URL}/publicaciones/${idPublicacion}`, {
                method: 'DELETE',
                headers: adminService.getAuthHeader()
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error del servidor:', response.status, errorData);
                throw new Error(`Error al eliminar publicación: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error en eliminarPublicacion:', error);
            throw error;
        }
    },

    
    //Actualiza una publicación (solo ADMIN)
     
    actualizarPublicacion: async (idPublicacion, datos) => {
        try {
            const response = await fetch(`${API_URL}/publicaciones/${idPublicacion}`, {
                method: 'PUT',
                headers: adminService.getAuthHeader(),
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar publicación');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en actualizarPublicacion:', error);
            throw error;
        }
    },

    
    //Obtiene publicaciones de un usuario específico
    
    getPublicacionesByUsuario: async (idUsuario) => {
        try {
            const response = await fetch(`${API_URL}/publicaciones?userId=${idUsuario}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Error al obtener publicaciones del usuario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getPublicacionesByUsuario:', error);
            throw error;
        }
    },

    // ============= TRANSACCIONES =============
    
    
    //Obtiene todas las transacciones (solo ADMIN)
    
    getAllTransacciones: async () => {
        try {
            const response = await fetch(`${API_URL}/transacciones`, {
                method: 'GET',
                headers: adminService.getAuthHeader()
            });

            if (!response.ok) {
                throw new Error('Error al obtener transacciones');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAllTransacciones:', error);
            throw error;
        }
    },

    
    //Elimina una transacción (solo ADMIN)
    
    eliminarTransaccion: async (idTransaccion) => {
        try {
            const response = await fetch(`${API_URL}/transacciones/${idTransaccion}`, {
                method: 'DELETE',
                headers: adminService.getAuthHeader()
            });

            if (!response.ok) {
                throw new Error('Error al eliminar transacción');
            }

            return { success: true };
        } catch (error) {
            console.error('Error en eliminarTransaccion:', error);
            throw error;
        }
    },

    // ============= AUTOS =============
    
    
    //Crea un auto (solo ADMIN)
    
    crearAuto: async (datos) => {
        try {
            const response = await fetch(`${API_URL}/autos`, {
                method: 'POST',
                headers: adminService.getAuthHeader(),
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error('Error al crear auto');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en crearAuto:', error);
            throw error;
        }
    },

    
    //Actualiza un auto (solo ADMIN)
     
    actualizarAuto: async (idAuto, datos) => {
        try {
            const response = await fetch(`${API_URL}/autos/${idAuto}`, {
                method: 'PUT',
                headers: adminService.getAuthHeader(),
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar auto');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en actualizarAuto:', error);
            throw error;
        }
    },

    
    //Elimina un auto (solo ADMIN)
     
    eliminarAuto: async (idAuto) => {
        try {
            const response = await fetch(`${API_URL}/autos/${idAuto}`, {
                method: 'DELETE',
                headers: adminService.getAuthHeader()
            });

            if (!response.ok) {
                throw new Error('Error al eliminar auto');
            }

            return { success: true };
        } catch (error) {
            console.error('Error en eliminarAuto:', error);
            throw error;
        }
    },

    // ============= COMENTARIOS =============
    
    
    //Obtiene todos los comentarios del sistema (solo ADMIN)
     
    getAllComentarios: async () => {
        try {
            const response = await fetch(`${API_URL}/admin/comentarios`, {
                method: 'GET',
                headers: adminService.getAuthHeader()
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error del servidor:', response.status, errorData);
                throw new Error(`Error al obtener comentarios: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getAllComentarios:', error);
            throw error;
        }
    },

    
    //Obtiene comentarios por publicación
     
    getComentariosByPublicacion: async (idPublicacion) => {
        try {
            const response = await fetch(`${API_URL}/publicaciones/${idPublicacion}/comentarios`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Error al obtener comentarios');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getComentariosByPublicacion:', error);
            throw error;
        }
    },

    
    //Elimina un comentario (solo ADMIN)
     
    eliminarComentario: async (idComentario, idPublicacion) => {
        const endpoints = [
            `${API_URL}/admin/comentarios/${idComentario}`,
            `${API_URL}/publicaciones/${idPublicacion}/comentarios/${idComentario}`,
            `${API_URL}/comentarios/${idComentario}`
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Intentando eliminar con endpoint: ${endpoint}`);
                const response = await fetch(endpoint, {
                    method: 'DELETE',
                    headers: adminService.getAuthHeader()
                });

                if (response.ok) {
                    console.log(`✓ Comentario eliminado exitosamente usando: ${endpoint}`);
                    return { success: true };
                }

                if (response.status === 404) {
                    continue;
                }

                const errorData = await response.text();
                console.error('Error del servidor:', response.status, errorData);
                throw new Error(`Error al eliminar comentario: ${response.status}`);

            } catch (error) {
                if (endpoint === endpoints[endpoints.length - 1]) {
                    console.error('Error en eliminarComentario:', error);
                    throw error;
                }
            }
        }

        throw new Error('No se pudo eliminar el comentario. Ningún endpoint disponible.');
    }
};

export default adminService;
