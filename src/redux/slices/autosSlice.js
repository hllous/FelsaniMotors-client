import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// Obtener todos los autos
export const fetchAutos = createAsyncThunk('autos/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/autos`)
        
        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener autos'
        );
    }
})

// Obtener auto por ID
export const fetchAutoById = createAsyncThunk('autos/fetchById', async (idAuto, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/autos/${idAuto}`)
        
        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener auto'
        );
    }
})

// Crear nuevo auto
export const createAuto = createAsyncThunk('autos/create', async ({ autoData, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(
            `${URL}/api/autos`,
            autoData,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        
        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al crear auto'
        );
    }
})

// Eliminar auto
export const deleteAuto = createAsyncThunk('autos/delete', async ({ idAuto, token }, { rejectWithValue }) => {
    try {
        await axios.delete(
            `${URL}/api/autos/${idAuto}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        
        return idAuto
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al eliminar auto'
        );
    }
})

// --------------- SLICE ---------------

const autosSlice = createSlice({
    name: 'autos',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
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
            state.error = action.payload;
        })
    
    // Fetch auto by ID
    builder
        .addCase(fetchAutoById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAutoById.fulfilled, (state, action) => {
            state.loading = false;
            
            // Agrega a item si no existe, o actualizar si existe
            const index = state.items.findIndex(a => a.idAuto === action.payload.idAuto);
            if (index !== -1) {
                state.items[index] = action.payload;
            } else {
                state.items = [...state.items, action.payload];
            }
        })
        .addCase(fetchAutoById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    

    // Create auto
    builder
        .addCase(createAuto.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createAuto.fulfilled, (state, action) => {
            state.loading = false;
            state.items = [...state.items, action.payload];
        })
        .addCase(createAuto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
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
        })
        .addCase(deleteAuto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
});

export default autosSlice.reducer;
