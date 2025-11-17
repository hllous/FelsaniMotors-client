import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// --------------- THUNKS ---------------

// Obtener TODOS los comentarios (admin)
export const fetchAllComentariosAdmin = createAsyncThunk('comentarios/fetchAllAdmin', async (token, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(
            `${URL}/api/comentarios/admin/all`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data // Array de todos los comentarios con estructura plana
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener todos los comentarios'
        );
    }
})

// Obtener comentarios de una publicación (público - con jerarquía)- con jerarquía)
export const fetchComentariosByPublicacion = createAsyncThunk('comentarios/fetchByPublicacion', async (idPublicacion, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/publicaciones/${idPublicacion}/comentarios/jerarquicos`)

        return { idPublicacion, comentarios: data }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener comentarios'
        );
    }
})

// Crear comentario
export const createComentario = createAsyncThunk('comentarios/create', async ({ idPublicacion, idUsuario, texto, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(
            `${URL}/api/publicaciones/${idPublicacion}/comentarios`,
            { idUsuario, texto },
            { headers: {Authorization: `Bearer ${token}`} }
        )

        return { idPublicacion, comentario: data }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al crear comentario'
        );
    }
})

// Actualizar comentario
export const updateComentario = createAsyncThunk('comentarios/update', async ({ idPublicacion, idComentario, texto, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(
            `${URL}/api/publicaciones/${idPublicacion}/comentarios/${idComentario}/texto`,
            { texto },
            { headers: {Authorization: `Bearer ${token}`} }
        )

        return { idPublicacion, comentario: data }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al actualizar comentario'
        );
    }
})

// Eliminar comentario
export const deleteComentario = createAsyncThunk('comentarios/delete', async ({ idPublicacion, idComentario, token }, { rejectWithValue }) => {
    try {
        await axios.delete(
            `${URL}/api/publicaciones/${idPublicacion}/comentarios/${idComentario}`,
            { headers: {Authorization: `Bearer ${token}`} }
        )

        return { idPublicacion, idComentario }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al eliminar comentario'
        );
    }
})

// Crear respuesta a comentario
export const createRespuesta = createAsyncThunk('comentarios/createRespuesta', async ({ idPublicacion, idComentario, idUsuario, texto, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(
            `${URL}/api/publicaciones/${idPublicacion}/comentarios/${idComentario}/respuestas`,
            { idUsuario, texto },
            { headers: {Authorization: `Bearer ${token}`} }
        )

        return { idPublicacion, idComentario, respuesta: data }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al crear respuesta'
        );
    }
})

// --------------- SLICE ---------------

const comentariosSlice = createSlice({
    name: 'comentarios',
    initialState: {
        comentariosByPublicacion: {}, // { idPublicacion: [comentarios] } ARBOL
        allComentarios: [],            // Todos los comentarios (admin) PLANO
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {

    // Fetch ALL comentarios (admin)
    builder
        .addCase(fetchAllComentariosAdmin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllComentariosAdmin.fulfilled, (state, action) => {
            state.loading = false;
            state.allComentarios = action.payload;
        })
        .addCase(fetchAllComentariosAdmin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Fetch comentarios by publicacion
    builder
        .addCase(fetchComentariosByPublicacion.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchComentariosByPublicacion.fulfilled, (state, action) => {
            state.loading = false;
            state.comentariosByPublicacion[action.payload.idPublicacion] = action.payload.comentarios;
        })
        .addCase(fetchComentariosByPublicacion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Create comentario
    builder
        .addCase(createComentario.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createComentario.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(createComentario.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Update comentario
    builder
        .addCase(updateComentario.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateComentario.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(updateComentario.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Delete comentario
    builder
        .addCase(deleteComentario.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteComentario.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteComentario.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

    // Create respuesta
    builder
        .addCase(createRespuesta.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createRespuesta.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(createRespuesta.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
    
});

export default comentariosSlice.reducer;
