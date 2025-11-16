import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// GET todas las transacciones
export const fetchAllTransacciones = createAsyncThunk('transacciones/fetchAllTransacciones', async (token) => {
    const { data } = await axios.get(
        `${URL}/api/transacciones`,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// GET transacciones del usuario
export const fetchTransaccionesUsuario = createAsyncThunk('transacciones/fetchTransaccionesUsuario', async ({ idUsuario, token }) => {

    const { data } = await axios.get(
        `${URL}/api/transacciones/usuario/${idUsuario}`,
        { headers: {Authorization: `Bearer ${token}`} }
    )

    return data
})

// GET transaccion por ID
export const fetchTransaccionById = createAsyncThunk('transacciones/fetchById', async ({ idTransaccion, token }) => {
    const { data } = await axios.get(
        `${URL}/api/transacciones/${idTransaccion}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// POST transaccion
export const createTransaccion = createAsyncThunk('transacciones/create', async ({ transaccionData, token }) => {
    const { data } = await axios.post(
        `${URL}/api/transacciones`,
        transaccionData,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// PUT estado de transaccion
export const updateTransaccionEstado = createAsyncThunk('transacciones/updateEstado', async ({ idTransaccion, estado, token }) => {
    const { data } = await axios.put(
        `${URL}/api/transacciones/${idTransaccion}/estado`,
        { estado },
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// --------------- SLICE ---------------

const transaccionesSlice = createSlice({
    name: 'transacciones',
    initialState: {
        items: [],              // TODAS las transacciones
        misTransacciones: [],   // Transacciones del usuario actual
        currentItem: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentItem: (state) => {
            state.currentItem = null;
        }
    },
    extraReducers: (builder) => {

    // GET todas las transacciones
    builder
        .addCase(fetchAllTransacciones.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllTransacciones.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchAllTransacciones.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // GET mis transacciones
    builder
        .addCase(fetchTransaccionesUsuario.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchTransaccionesUsuario.fulfilled, (state, action) => {
            state.loading = false;
            state.misTransacciones = action.payload;
        })
        .addCase(fetchTransaccionesUsuario.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // GET transaccion by ID
    builder
        .addCase(fetchTransaccionById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchTransaccionById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentItem = action.payload;
        })
        .addCase(fetchTransaccionById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // POST transaccion
    builder
        .addCase(createTransaccion.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createTransaccion.fulfilled, (state, action) => {
            state.loading = false;
            // Agregar a misTransacciones (el que crea es comprador)
            state.misTransacciones = [...state.misTransacciones, action.payload];
            
            // Si items tiene datos (admin viendo), también agregar
            if (state.items.length > 0) {
                state.items = [...state.items, action.payload];
            }
            state.currentItem = action.payload;
        })
        .addCase(createTransaccion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // PUT estado transaccion
    builder
        .addCase(updateTransaccionEstado.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateTransaccionEstado.fulfilled, (state, action) => {
            state.loading = false;
            state.currentItem = action.payload;
            
            // Update in items array
            const indexItems = state.items.findIndex(t => t.idTransaccion === action.payload.idTransaccion);
            if (indexItems !== -1) {
                state.items[indexItems] = action.payload;
            }
            
            // Update in misTransacciones array
            const indexMis = state.misTransacciones.findIndex(t => t.idTransaccion === action.payload.idTransaccion);
            if (indexMis !== -1) {
                state.misTransacciones[indexMis] = action.payload;
            }
        })
        .addCase(updateTransaccionEstado.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
    
});

export const { clearError, clearCurrentItem } = transaccionesSlice.actions;

export default transaccionesSlice.reducer;
