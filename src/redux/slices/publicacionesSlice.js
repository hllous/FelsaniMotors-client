import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// Obtener todas las publicaciones
export const fetchPublicaciones = createAsyncThunk('publicaciones/fetchAll', async () => {
    
    const { data } = await axios.get(`${URL}/api/publicaciones`)

    return data
})

// Obtener publicaciones por usuario
export const fetchPublicacionesByUsuario = createAsyncThunk('publicaciones/fetchByUsuario', async (idUsuario) => {
    
    const { data } = await axios.get(`${URL}/api/publicaciones/usuario/${idUsuario}`)

    return data
})

// Filtrar publicaciones
export const filtrarPublicaciones = createAsyncThunk('publicaciones/filtrar', async (params) => {
    
    const queryString = new URLSearchParams(params).toString()
    const { data } = await axios.get(`${URL}/api/publicaciones/filtrar?${queryString}`)

    return data
})

// Obtener opciones de filtro disponibles
export const fetchOpcionesFiltro = createAsyncThunk('publicaciones/fetchOpcionesFiltro', async () => {
    
    const { data } = await axios.get(`${URL}/api/publicaciones/filtros/opciones`)

    return data
})

// Obtener publicacion por ID
export const fetchPublicacionById = createAsyncThunk('publicaciones/fetchById', async (idPublicacion) => {
    
    const { data } = await axios.get(`${URL}/api/publicaciones/${idPublicacion}`)

    return data
})

// Obtener publicaciones del usuario
export const fetchPublicacionesUsuario = createAsyncThunk('publicaciones/fetchPublicacionesUsuario', async (idUsuario) => {
    
    const { data } = await axios.get(`${URL}/api/publicaciones/usuario/${idUsuario}`)

    return data
})

// Crear publicacion
export const createPublicacion = createAsyncThunk('publicaciones/create', async ({ autoData, publicacionData, fotos, token }) => {
    // ORDEN ES IMPORTANTE

    // 1. Crear el auto
    const autoResponse = await axios.post(
        `${URL}/api/autos`,
        autoData,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    const idAuto = autoResponse.data.idAuto

    // 2. Crear la publicacion
    const publicacionResponse = await axios.post(
        `${URL}/api/publicaciones`,
        { ...publicacionData, idAuto },
        { headers: { Authorization: `Bearer ${token}` } }
    )

    const idPublicacion = publicacionResponse.data.idPublicacion

    // 3. Subir fotos si existen
    if (fotos && fotos.length > 0) {

        const upload = fotos.map(({ file, esPrincipal, orden }) => {

            const formFotoData = new FormData()
            formFotoData.append('file', file)
            formFotoData.append('esPrincipal', esPrincipal ? 'true' : 'false')
            formFotoData.append('orden', orden.toString())
            return axios.post(
                `${URL}/api/publicaciones/${idPublicacion}/fotos`,
                formFotoData,
                { headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'} }
                )
            }
        )

        await Promise.all(upload)
    }

    return publicacionResponse.data
})

// Actualizar publicacion
export const updatePublicacion = createAsyncThunk('publicaciones/update', async ({ idPublicacion, publicacionData, token }) => {

    const { data } = await axios.put(
        `${URL}/api/publicaciones/${idPublicacion}`,
        publicacionData,
        { headers: {Authorization: `Bearer ${token}`} }
    )

    return data
})

// Eliminar publicacion
export const deletePublicacion = createAsyncThunk('publicaciones/delete', async ({ idPublicacion, token }) => {

    await axios.delete(
        `${URL}/api/publicaciones/${idPublicacion}`,
        { headers: {Authorization: `Bearer ${token}`} }
    )

    return idPublicacion
})

// Obtener fotos de una publicacion
export const fetchFotosPublicacion = createAsyncThunk('publicaciones/fetchFotos', async (idPublicacion) => {

    const { data } = await axios.get(`${URL}/api/publicaciones/${idPublicacion}/fotos`)

    return { idPublicacion, fotos: data }
})

// Eliminar foto de publicacion
export const deleteFoto = createAsyncThunk('publicaciones/deleteFoto', async ({ idPublicacion, idImg, token }) => {

    await axios.delete(
        `${URL}/api/publicaciones/${idPublicacion}/fotos/${idImg}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return { idPublicacion, idImg }
})

// Agregar foto a publicacion
export const addFoto = createAsyncThunk('publicaciones/addFoto', async ({ idPublicacion, file, esPrincipal, orden, token }) => {

    const formData = new FormData()
    formData.append('file', file)
    formData.append('esPrincipal', esPrincipal ? 'true' : 'false')
    formData.append('orden', orden.toString())

    const { data } = await axios.post(
        `${URL}/api/publicaciones/${idPublicacion}/fotos`,
        formData,
        { headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        } }
    )

    return { idPublicacion, foto: data }
})

// Actualizar estado de publicacion
export const updateEstadoPublicacion = createAsyncThunk('publicaciones/updateEstado', async ({ idPublicacion, estado, token }) => {

    const { data } = await axios.put(
        `${URL}/api/publicaciones/${idPublicacion}/estado`,
        { estado },
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// Actualizar foto principal
export const updateFotoPrincipal = createAsyncThunk('publicaciones/updateFotoPrincipal', async ({ idPublicacion, idImg, token }) => {

    const { data } = await axios.put(
        `${URL}/api/publicaciones/${idPublicacion}/fotos/${idImg}/principal`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// --------------- SLICE ---------------

const publicacionesSlice = createSlice({
    name: 'publicaciones',
    initialState: {
        items: [],
        currentItem: null,
        misPublicaciones: [],
        fotosMap: {}, // { idPublicacion: [fotos] }
        opcionesFiltro: null, // Opciones para filtros
        loading: false,
        error: null,
        isFiltered: false, // Flag para saber si items está filtrado o es todo
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

    // Fetch all publicaciones
    builder
        .addCase(fetchPublicaciones.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPublicaciones.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
            state.isFiltered = false; // Tenemos TODAS las publicaciones
        })
        .addCase(fetchPublicaciones.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Fetch publicaciones by usuario
    builder
        .addCase(fetchPublicacionesByUsuario.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPublicacionesByUsuario.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchPublicacionesByUsuario.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Filtrar publicaciones
    builder
        .addCase(filtrarPublicaciones.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(filtrarPublicaciones.fulfilled, (state, action) => {
            state.loading = false;
            // Si viene paginado con .content
            state.items = action.payload.content || action.payload;
            state.isFiltered = true; // Tenemos resultado FILTRADO
        })
        .addCase(filtrarPublicaciones.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Fetch publicacion by ID
    builder
        .addCase(fetchPublicacionById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPublicacionById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentItem = action.payload;
        })
        .addCase(fetchPublicacionById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Fetch publicaciones del usuario
    builder
        .addCase(fetchPublicacionesUsuario.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPublicacionesUsuario.fulfilled, (state, action) => {
            state.loading = false;
            state.misPublicaciones = action.payload;
        })
        .addCase(fetchPublicacionesUsuario.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Create publicacion
    builder
        .addCase(createPublicacion.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createPublicacion.fulfilled, (state, action) => {
            state.loading = false;
            state.items.push(action.payload);
            state.misPublicaciones.push(action.payload);
        })
        .addCase(createPublicacion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Update publicacion
    builder
        .addCase(updatePublicacion.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePublicacion.fulfilled, (state, action) => {
            state.loading = false;
            state.currentItem = action.payload;

            // Update in items array
            const index = state.items.findIndex(p => p.idPublicacion === action.payload.idPublicacion);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            // Update in misPublicaciones
            const indexPublicacionUsuario = state.misPublicaciones.findIndex(p => p.idPublicacion === action.payload.idPublicacion);
            if (indexPublicacionUsuario !== -1) {
                state.misPublicaciones[indexPublicacionUsuario] = action.payload;
            }
        })
        .addCase(updatePublicacion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
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
            state.misPublicaciones = state.misPublicaciones.filter(p => p.idPublicacion !== action.payload);
        })
        .addCase(deletePublicacion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Fetch fotos
    builder
        .addCase(fetchFotosPublicacion.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchFotosPublicacion.fulfilled, (state, action) => {
            state.loading = false;
            state.fotosMap[action.payload.idPublicacion] = action.payload.fotos;
        })
        .addCase(fetchFotosPublicacion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Delete foto
    builder
        .addCase(deleteFoto.fulfilled, (state, action) => {
            const { idPublicacion, idImg } = action.payload;
            if (state.fotosMap[idPublicacion]) {
                state.fotosMap[idPublicacion] = state.fotosMap[idPublicacion].filter(f => f.idImg !== idImg);
            }
        })

    // Add foto
    builder
        .addCase(addFoto.fulfilled, (state, action) => {
            const { idPublicacion, foto } = action.payload;
            if (!state.fotosMap[idPublicacion]) {
                state.fotosMap[idPublicacion] = [];
            }
            state.fotosMap[idPublicacion].push(foto);
        })

    // Update estado
    builder
        .addCase(updateEstadoPublicacion.fulfilled, (state, action) => {
            if (state.currentItem) {
                state.currentItem.estado = action.payload.estado;
            }
            const index = state.items.findIndex(p => p.idPublicacion === action.payload.idPublicacion);
            if (index !== -1) {
                state.items[index].estado = action.payload.estado;
            }
        })

    // Update foto principal
    builder
        .addCase(updateFotoPrincipal.fulfilled, (state, action) => {
            if (state.currentItem) {
                state.currentItem.idFotoPrincipal = action.payload.idFotoPrincipal;
            }
        })

    // Fetch opciones de filtro
    builder
        .addCase(fetchOpcionesFiltro.fulfilled, (state, action) => {
            state.opcionesFiltro = action.payload;
        })
    }
    
});

export const { clearError, clearCurrentItem } = publicacionesSlice.actions;

export default publicacionesSlice.reducer;

