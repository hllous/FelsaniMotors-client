import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// Obtener comentarios de una publicación (público)
export const fetchComentariosByPublicacion = createAsyncThunk('comentarios/fetchByPublicacion', async (idPublicacion, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${URL}/api/publicaciones/${idPublicacion}/comentarios`)

        return { idPublicacion, comentarios: data }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener comentarios'
        );
    }
})

// Crear comentario
export const createComentario = createAsyncThunk('comentarios/create', async ({ idPublicacion, contenido, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(
            `${URL}/api/publicaciones/${idPublicacion}/comentarios`,
            { contenido },
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
export const updateComentario = createAsyncThunk('comentarios/update', async ({ idPublicacion, idComentario, contenido, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(
            `${URL}/api/publicaciones/${idPublicacion}/comentarios/${idComentario}`,
            { contenido },
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
export const createRespuesta = createAsyncThunk('comentarios/createRespuesta', async ({ idPublicacion, idComentario, contenido, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(
            `${URL}/api/publicaciones/${idPublicacion}/comentarios/${idComentario}/respuestas`,
            { contenido },
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
        comentariosByPublicacion: {}, // { idPublicacion: [comentarios] }
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {

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
    .addCase(createComentario.fulfilled, (state, action) => {

        state.loading = false;

        const { idPublicacion, comentario } = action.payload;
        if (!state.comentariosByPublicacion[idPublicacion]) {
            state.comentariosByPublicacion[idPublicacion] = [];
        }
        state.comentariosByPublicacion[idPublicacion] = [...state.comentariosByPublicacion[idPublicacion], comentario];        })
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
        .addCase(updateComentario.fulfilled, (state, action) => {

            state.loading = false;
            const { idPublicacion, comentario } = action.payload;

            const comentarios = state.comentariosByPublicacion[idPublicacion];
            if (comentarios) {

                const index = comentarios.findIndex(c => c.idComentario === comentario.idComentario);

                if (index !== -1) {

                    comentarios[index] = comentario;
                }
            }

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
        .addCase(deleteComentario.fulfilled, (state, action) => {

            state.loading = false;
            const { idPublicacion, idComentario } = action.payload;

            const comentarios = state.comentariosByPublicacion[idPublicacion];
            if (comentarios) {

                state.comentariosByPublicacion[idPublicacion] = comentarios.filter(
                    c => c.idComentario !== idComentario
                )
            }
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
        .addCase(createRespuesta.fulfilled, (state, action) => {

            state.loading = false;
            const { idPublicacion, idComentario, respuesta } = action.payload;

            const comentarios = state.comentariosByPublicacion[idPublicacion];
            if (comentarios) {

                const comentario = comentarios.find(c => c.idComentario === idComentario);

                if (comentario) {
                    
                    if (!comentario.respuestas) {
                        comentario.respuestas = [];
                    }
                    comentario.respuestas = [...comentario.respuestas, respuesta];
                }
            }
        })
        .addCase(createRespuesta.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
    
});

export default comentariosSlice.reducer;
