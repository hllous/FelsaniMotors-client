import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

export const fetchMarcas = createAsyncThunk('catalogo/fetchMarcas', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/catalogos/marcas`)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener marcas'
        );
    }
})

export const fetchEstados = createAsyncThunk('catalogo/fetchEstados', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/catalogos/estados`)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener estados'
        );
    }
})

export const fetchCombustibles = createAsyncThunk('catalogo/fetchCombustibles', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/catalogos/combustibles`)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener combustibles'
        );
    }
})

export const fetchTiposCaja = createAsyncThunk('catalogo/fetchTiposCaja', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/catalogos/tipos-caja`)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener tipos de caja'
        );
    }
})

// --------------- SLICE ---------------

const catalogoSlice = createSlice({
    name: 'catalogo',
    initialState: {
        marcas: [],
        estados: [],
        combustibles: [],
        tiposCaja: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
    
    // MARCAS
    builder
        .addCase(fetchMarcas.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchMarcas.fulfilled, (state, action) => {
            state.loading = false;
            state.marcas = action.payload;
        })
        .addCase(fetchMarcas.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // ESTADOS
    builder
        .addCase(fetchEstados.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchEstados.fulfilled, (state, action) => {
            state.loading = false;
            state.estados = action.payload;
        })
        .addCase(fetchEstados.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // COMBUSTIBLES
    builder
        .addCase(fetchCombustibles.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCombustibles.fulfilled, (state, action) => {
            state.loading = false;
            state.combustibles = action.payload;
        })
        .addCase(fetchCombustibles.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // TIPOS DE CAJA
    builder
        .addCase(fetchTiposCaja.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchTiposCaja.fulfilled, (state, action) => {
            state.loading = false;
            state.tiposCaja = action.payload;
        })
        .addCase(fetchTiposCaja.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
    
});

export default catalogoSlice.reducer;
