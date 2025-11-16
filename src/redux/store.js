import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import carritoReducer from "./slices/carritoSlice";
import catalogoReducer from "./slices/catalogoSlice";
import usuariosReducer from "./slices/usuariosSlice";
import publicacionesReducer from "./slices/publicacionesSlice";
import transaccionesReducer from "./slices/transaccionesSlice";
import comentariosReducer from "./slices/comentariosSlice";
import fotosReducer from "./slices/fotosSlice";
import autosReducer from "./slices/autosSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        carrito: carritoReducer,
        catalogo: catalogoReducer,
        usuarios: usuariosReducer,
        publicaciones: publicacionesReducer,
        transacciones: transaccionesReducer,
        comentarios: comentariosReducer,
        fotos: fotosReducer,
        autos: autosReducer,
    },
    devTools: {
        // Configuración para evitar problemas de rendimiento con imágenes base64
        maxAge: 50, // Solo guarda las últimas 50 acciones
        actionSanitizer: (action) => {
            // No serializar payloads grandes (fotos base64)
            if (action.type?.includes('fotos') || action.type?.includes('Fotos')) {
                return { ...action, payload: '<<BINARY_DATA>>' };
            }
            return action;
        },
        stateSanitizer: (state) => {
            // No mostrar fotos en base64 en DevTools
            return {
                ...state,
                fotos: state.fotos ? {
                    ...state.fotos,
                    fotosByPublicacion: '<<LARGE_OBJECT>>',
                } : state.fotos,
            };
        },
    },
});