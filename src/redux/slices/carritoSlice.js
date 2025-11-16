import { createSlice } from '@reduxjs/toolkit';

// --------------- SLICE ---------------

const carritoSlice = createSlice({
    name: 'carrito',
    initialState: {
        items: [], // Array de publicaciones en el carrito
        error: null,
    },
    reducers: {
        // Agrega un auto al carrito
        addToCart: (state, action) => {
            const item = action.payload;
            
            // Validaciones
            const existingItem = state.items.find((cartItem) => cartItem.idPublicacion === item.idPublicacion);
            
            if (existingItem) {
                state.error = 'Este auto ya está en tu carrito';
                return;
            }

            if (!item.idPublicacion || !item.titulo || !item.precio) {
                state.error = 'Datos de publicación inválidos';
                return;
            }

            // Agregar al carrito
            state.items = [...state.items, item];
            state.error = null;
        },

        // Elimina un auto del carrito por idPublicacion
        removeFromCart: (state, action) => {
            const idPublicacion = action.payload;
            state.items = state.items.filter((item) => item.idPublicacion !== idPublicacion);
            state.error = null;
        },

        // Limpia todo el carrito
        clearCart: (state) => {
            state.items = [];
            state.error = null;
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = carritoSlice.actions;

export default carritoSlice.reducer;

