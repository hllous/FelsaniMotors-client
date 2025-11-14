import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// Obtener todos los autos
export const fetchAutos = createAsyncThunk('autos/fetchAll', async () => {
    const { data } = await axios.get(`${URL}/api/autos`)
    
    return data
})

// Obtener auto por ID
export const fetchAutoById = createAsyncThunk('autos/fetchById', async (idAuto) => {
    const { data } = await axios.get(`${URL}/api/autos/${idAuto}`)
    
    return data
})

// Crear nuevo auto
export const createAuto = createAsyncThunk('autos/create', async ({ autoData, token }) => {
    const { data } = await axios.post(
        `${URL}/api/autos`,
        autoData,
        { headers: { Authorization: `Bearer ${token}` } }
    )
    
    return data
})

// Eliminar auto
export const deleteAuto = createAsyncThunk('autos/delete', async ({ idAuto, token }) => {
    await axios.delete(
        `${URL}/api/autos/${idAuto}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
    
    return idAuto
})

// --------------- SLICE ---------------

const autosSlice = createSlice({
    name: 'autos',
    initialState: {
        items: [],
        currentItem: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentAuto: (state) => {
            state.currentItem = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
    
    // Fetch all autos
    builder
        .addCase(fetchAutos.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAutos.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchAutos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    
    // Fetch auto by ID
    builder
        .addCase(fetchAutoById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAutoById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentItem = action.payload;
        })
        .addCase(fetchAutoById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    
    // Create auto
    builder
        .addCase(createAuto.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createAuto.fulfilled, (state, action) => {
            state.loading = false;
            state.items.push(action.payload);
            state.currentItem = action.payload;
        })
        .addCase(createAuto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    
    // Delete auto
    builder
        .addCase(deleteAuto.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteAuto.fulfilled, (state, action) => {
            state.loading = false;
            state.items = state.items.filter(auto => auto.idAuto !== action.payload);
            if (state.currentItem?.idAuto === action.payload) {
                state.currentItem = null;
            }
        })
        .addCase(deleteAuto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
});

export const { clearCurrentAuto, clearError } = autosSlice.actions;

export default autosSlice.reducer;
