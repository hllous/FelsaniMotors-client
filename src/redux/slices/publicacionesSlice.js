import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// Obtener todas las publicaciones
export const fetchPublicaciones = createAsyncThunk('publicaciones/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/publicaciones`)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener publicaciones'
        );
    }
})

// Filtrar publicaciones
export const filtrarPublicaciones = createAsyncThunk('publicaciones/filtrar', async (busqueda, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/publicaciones/filtrar`, { params: busqueda })

        return data
        
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al filtrar publicaciones'
        );
    }
})

// Obtener opciones de filtro disponibles
export const fetchOpcionesFiltro = createAsyncThunk('publicaciones/fetchOpcionesFiltro', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/publicaciones/filtros/opciones`)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener opciones de filtro'
        );
    }
})

// Obtener publicacion por ID
export const fetchPublicacionById = createAsyncThunk('publicaciones/fetchById', async (idPublicacion, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/publicaciones/${idPublicacion}`)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener publicación'
        );
    }
})

// Obtener publicaciones del usuario
export const fetchPublicacionesUsuario = createAsyncThunk('publicaciones/fetchPublicacionesUsuario', async (idUsuario, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/publicaciones/usuario/${idUsuario}`)

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener publicaciones del usuario'
        );
    }
})

// Crear publicacion
export const createPublicacion = createAsyncThunk('publicaciones/create', async ({ publicacionData, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(
            `${URL}/api/publicaciones`,
            publicacionData,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al crear publicación'
        );
    }
})

// Actualizar publicacion
export const updatePublicacion = createAsyncThunk('publicaciones/update', async ({ idPublicacion, publicacionData, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(
            `${URL}/api/publicaciones/${idPublicacion}`,
            publicacionData,
            { headers: {Authorization: `Bearer ${token}`} }
        )

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al actualizar publicación'
        );
    }
})

// Eliminar publicacion
export const deletePublicacion = createAsyncThunk('publicaciones/delete', async ({ idPublicacion, token }, { rejectWithValue }) => {
    try {
        await axios.delete(
            `${URL}/api/publicaciones/${idPublicacion}`,
            { headers: {Authorization: `Bearer ${token}`} }
        )

        return idPublicacion
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al eliminar publicación'
        );
    }
})

// Actualizar estado de publicacion
export const updateEstadoPublicacion = createAsyncThunk('publicaciones/updateEstado', async ({ idPublicacion, estado, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(
            `${URL}/api/publicaciones/${idPublicacion}/estado`,
            { estado },
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al actualizar estado de publicación'
        );
    }
})

// Actualizar foto principal
export const updateFotoPrincipal = createAsyncThunk('publicaciones/updateFotoPrincipal', async ({ idPublicacion, idImg, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(
            `${URL}/api/publicaciones/${idPublicacion}/fotos/${idImg}/principal`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al actualizar foto principal'
        );
    }
})

// --------------- SLICE ---------------

const publicacionesSlice = createSlice({
    name: 'publicaciones',
    initialState: {
        items: [],
        itemsFiltrados: [],
        opcionesFiltro: null, // Opciones para filtros
        loading: false,
        error: null,
        isFiltered: false, // Flag para saber si se aplicaron filtros
    },
    reducers: {},
    extraReducers: (builder) => {

    // Fetch all publicaciones
    builder
        .addCase(fetchPublicaciones.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPublicaciones.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
            state.isFiltered = false;
        })
        .addCase(fetchPublicaciones.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Filtrar publicaciones
    builder
        .addCase(filtrarPublicaciones.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(filtrarPublicaciones.fulfilled, (state, action) => {
            state.loading = false;
            state.itemsFiltrados = action.payload.content || action.payload;
            state.isFiltered = true;
        })
        .addCase(filtrarPublicaciones.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Fetch publicacion by ID
    builder
        .addCase(fetchPublicacionById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPublicacionById.fulfilled, (state, action) => {
            state.loading = false;
            
            const index = state.items.findIndex(p => p.idPublicacion === action.payload.idPublicacion);
            if (index !== -1) {
                state.items[index] = action.payload;
            } else {
                state.items = [...state.items, action.payload];
            }
        })
        .addCase(fetchPublicacionById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Create publicacion
    builder
        .addCase(createPublicacion.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createPublicacion.fulfilled, (state, action) => {
            state.loading = false;
            state.items = [...state.items, action.payload];
        })
        .addCase(createPublicacion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Update publicacion
    builder
        .addCase(updatePublicacion.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePublicacion.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.items.findIndex(p => p.idPublicacion === action.payload.idPublicacion);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        })
        .addCase(updatePublicacion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Delete publicacion
    builder
        .addCase(deletePublicacion.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deletePublicacion.fulfilled, (state, action) => {
            state.loading = false;
            state.items = state.items.filter(p => p.idPublicacion !== action.payload);
        })
        .addCase(deletePublicacion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Update estado
    builder
        .addCase(updateEstadoPublicacion.fulfilled, (state, action) => {
            const index = state.items.findIndex(p => p.idPublicacion === action.payload.idPublicacion);
            if (index !== -1) {
                state.items[index].estado = action.payload.estado;
            }
        })

    // Update foto principal
    builder
        .addCase(updateFotoPrincipal.fulfilled, (state, action) => {
            const index = state.items.findIndex(p => p.idPublicacion === action.payload.idPublicacion);
            if (index !== -1) {
                state.items[index].idFotoPrincipal = action.payload.idFotoPrincipal;
            }
        })

    // Fetch opciones de filtro
    builder
        .addCase(fetchOpcionesFiltro.fulfilled, (state, action) => {
            state.opcionesFiltro = action.payload;
        })
    }
    
});



export default publicacionesSlice.reducer;

