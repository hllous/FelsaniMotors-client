import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002';

// --------------- THUNKS ---------------

// Obtener todos los usuarios (ADMIN)
export const fetchUsuarios = createAsyncThunk('usuarios/fetchAll', async (token, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(
            `${URL}/api/usuarios`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener usuarios'
        );
    }
})

// Obtener un usuario por ID
export const fetchUsuarioById = createAsyncThunk('usuarios/fetchById', async ({ idUsuario, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(
            `${URL}/api/usuarios/${idUsuario}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener usuario'
        );
    }
})

// Actualizar usuario
export const updateUsuario = createAsyncThunk('usuarios/update', async ({ idUsuario, usuarioData, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(
            `${URL}/api/usuarios/${idUsuario}`,
            usuarioData,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al actualizar usuario'
        );
    }
})

// Desactivar usuario
export const deleteUsuario = createAsyncThunk('usuarios/delete', async ({ idUsuario, token }, { rejectWithValue }) => {
    try {
        await axios.delete(
            `${URL}/api/usuarios/${idUsuario}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return idUsuario
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al desactivar usuario'
        );
    }
})

// Activar usuario
export const activateUsuario = createAsyncThunk('usuarios/activate', async ({ idUsuario, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.patch(
            `${URL}/api/usuarios/${idUsuario}/activar`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al activar usuario'
        );
    }
})

// Cambiar contraseña
export const cambiarContrasena = createAsyncThunk('usuarios/cambiarContrasena', async ({ idUsuario, contrasenaActual, contrasenaNueva, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(
            `${URL}/api/usuarios/${idUsuario}/cambiar-contrasena`,
            { contrasenaActual, contrasenaNueva },
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al cambiar contraseña'
        );
    }
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
            state.error = action.payload;
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
            state.error = action.payload;
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
            state.error = action.payload;
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
            state.error = action.payload;
        })

    // Activate usuario
    builder
        .addCase(activateUsuario.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(activateUsuario.fulfilled, (state, action) => {
            state.loading = false;
            // Update usuario in items array
            const index = state.items.findIndex(u => u.idUsuario === action.payload.idUsuario);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        })
        .addCase(activateUsuario.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
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
            state.error = action.payload;
        })
    }
    
})


export const { clearCurrentItem } = usuariosSlice.actions;

export default usuariosSlice.reducer;