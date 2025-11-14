import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// Obtener fotos de una publicacion
export const fetchFotosByPublicacion = createAsyncThunk('fotos/fetchByPublicacion', async (idPublicacion) => {

    const { data } = await axios.get(`${URL}/api/publicaciones/${idPublicacion}/fotos-contenido`)
    
    return data
})

// Subir foto a una publicacion
export const uploadFoto = createAsyncThunk('fotos/upload', async ({ idPublicacion, file, esPrincipal, orden, token }) => {
    
    const formData = new FormData();
    
    formData.append('file', file);
    formData.append('esPrincipal', esPrincipal.toString());
    formData.append('orden', orden.toString());

    const { data } = await axios.post(
        `${URL}/api/publicaciones/${idPublicacion}/fotos`,
        formData,
        { headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        } }
    )
    
    return data
})

// Eliminar foto de una publicacion
export const deleteFoto = createAsyncThunk('fotos/delete', async ({ idPublicacion, idFoto, token }) => {
    
  await axios.delete(
        `${URL}/api/publicaciones/${idPublicacion}/fotos/${idFoto}`,
        { headers: {Authorization: `Bearer ${token}`} }
    )
    
    return idFoto
})

// Marcar foto como principal
export const setFotoPrincipal = createAsyncThunk('fotos/setPrincipal', async ({ idPublicacion, idFoto, token }) => {
    
    const { data } = await axios.put(
        `${URL}/api/publicaciones/${idPublicacion}/fotos/${idFoto}/principal`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    )
    
    return data
})

// --------------- SLICE ---------------

const fotosSlice = createSlice({
    name: 'fotos',
    initialState: {
        fotosByPublicacion: {}, // { idPublicacion: [fotos] }
        loading: false,
        error: null,
    },
    reducers: {
        clearFotos: (state) => {
            state.fotosByPublicacion = {};
            state.error = null;
        },
    },
    extraReducers: (builder) => {
    
    // Fetch fotos
    builder
        .addCase(fetchFotosByPublicacion.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchFotosByPublicacion.fulfilled, (state, action) => {
            state.loading = false;
            const idPublicacion = action.meta.arg;
            state.fotosByPublicacion[idPublicacion] = action.payload;
        })
        .addCase(fetchFotosByPublicacion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    
    // Upload foto
    builder
        .addCase(uploadFoto.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(uploadFoto.fulfilled, (state, action) => {
            state.loading = false;
            const idPublicacion = action.meta.arg.idPublicacion;
            if (state.fotosByPublicacion[idPublicacion]) {
                state.fotosByPublicacion[idPublicacion].push(action.payload);
            }
        })
        .addCase(uploadFoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    
    // Delete foto
    builder
        .addCase(deleteFoto.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteFoto.fulfilled, (state, action) => {
            state.loading = false;
            const idPublicacion = action.meta.arg.idPublicacion;
            const idFoto = action.payload;
            if (state.fotosByPublicacion[idPublicacion]) {
                state.fotosByPublicacion[idPublicacion] = state.fotosByPublicacion[idPublicacion]
                    .filter(foto => foto.id !== idFoto);
            }
        })
        .addCase(deleteFoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    
    // Set principal
    builder
        .addCase(setFotoPrincipal.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(setFotoPrincipal.fulfilled, (state, action) => {
            state.loading = false;
            const idPublicacion = action.meta.arg.idPublicacion;
            const idFoto = action.meta.arg.idFoto;
            if (state.fotosByPublicacion[idPublicacion]) {
                state.fotosByPublicacion[idPublicacion].forEach(foto => {
                    foto.esPrincipal = foto.id === idFoto;
                });
            }
        })
        .addCase(setFotoPrincipal.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
});

export const { clearFotos } = fotosSlice.actions;

export default fotosSlice.reducer;
