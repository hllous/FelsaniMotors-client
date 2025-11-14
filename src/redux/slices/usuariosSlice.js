import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// Obtener todos los usuarios (ADMIN)
export const fetchUsuarios = createAsyncThunk('usuarios/fetchAll', async (token) => {
    const { data } = await axios.get(
        `${URL}/api/usuarios`,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// Obtener un usuario por ID
export const fetchUsuarioById = createAsyncThunk('usuarios/fetchById', async ({ idUsuario, token }) => {
    const { data } = await axios.get(
        `${URL}/api/usuarios/${idUsuario}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// Actualizar usuario
export const updateUsuario = createAsyncThunk('usuarios/update', async ({ idUsuario, usuarioData, token }) => {
    const { data } = await axios.put(
        `${URL}/api/usuarios/${idUsuario}`,
        usuarioData,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// Desactivar usuario
export const deleteUsuario = createAsyncThunk('usuarios/delete', async ({ idUsuario, token }) => {

    await axios.delete(
        `${URL}/api/usuarios/${idUsuario}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return idUsuario
})

// Cambiar contraseña
export const cambiarContrasena = createAsyncThunk('usuarios/cambiarContrasena', async ({ idUsuario, contrasenaActual, contrasenaNueva, token }) => {
    
    const { data } = await axios.put(
        `${URL}/api/usuarios/${idUsuario}/cambiar-contrasena`,
        { contrasenaActual, contrasenaNueva },
        { headers: { Authorization: `Bearer ${token}` } }
    )

    return data
})

// --------------- SLICE ---------------

const usuariosSlice = createSlice({
    name: 'usuarios',
    initialState: {
        items: [],
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

    // Fetch all usuarios
    builder
        .addCase(fetchUsuarios.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsuarios.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchUsuarios.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Fetch usuario by ID
    builder
        .addCase(fetchUsuarioById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsuarioById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentItem = action.payload;
        })
        .addCase(fetchUsuarioById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Update usuario
    builder
        .addCase(updateUsuario.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUsuario.fulfilled, (state, action) => {
            state.loading = false;
            state.currentItem = action.payload;
            // Update in items array if exists
            const index = state.items.findIndex(u => u.idUsuario === action.payload.idUsuario);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        })
        .addCase(updateUsuario.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Delete usuario
    builder
        .addCase(deleteUsuario.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteUsuario.fulfilled, (state, action) => {
            state.loading = false;
            // Mark as inactive in items array
            const usuario = state.items.find(u => u.idUsuario === action.payload);
            if (usuario) {
                usuario.activo = false;
            }
        })
        .addCase(deleteUsuario.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

    // Cambiar contraseña
    builder
        .addCase(cambiarContrasena.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(cambiarContrasena.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(cambiarContrasena.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
    
})


export const { clearError, clearCurrentItem } = usuariosSlice.actions;

export default usuariosSlice.reducer;