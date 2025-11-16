import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { updateUsuario } from './usuariosSlice';

const URL = 'http://localhost:4002'

// --------------- THUNKS ---------------

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        // Me traigo el bearer token
        const { data: authData } = await axios.post(`${URL}/api/v1/auth/authenticate`, {
            email,
            password,
        })
        
        const { access_token } = authData;
        
        // Obtengo datos de user para el idUsuario
        const { data: userData } = await axios.get(
            `${URL}/api/usuarios/me`,
            { headers: {Authorization: `Bearer ${access_token}`} }
        )

        return {
            token: access_token,
            user: {
                idUsuario: userData.idUsuario,
                email: userData.email,
                nombre: userData.nombre,
                apellido: userData.apellido,
                telefono: userData.telefono,
                rol: userData.rol,
                activo: userData.activo,
            }
        }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al iniciar sesión'
        );
    }
})

export const register = createAsyncThunk('auth/register', async ({ email, password, nombre, apellido, telefono, rol = 'USER' }, { rejectWithValue }) => {
    try {
        // Registro y obtengo el bearer token + datos del usuario
        const { data: authData } = await axios.post(`${URL}/api/v1/auth/register`, {
            email,
            password,
            firstname: nombre,
            lastname: apellido,
            telefono,
            role: rol,
        })
        
        // Guardo el token que devuelve al registrar
        const { access_token } = authData;

        return {
            token: access_token,
            user: {
                idUsuario: authData.idUsuario,
                email,
                nombre,
                apellido,
                telefono,
                rol,
                activo: 1,
            }
        }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al registrarse'
        );
    }
})

export const getUserData = createAsyncThunk('auth/getUserData', async (token, { rejectWithValue }) => {
    try {
        const { data: userData } = await axios.get(`${URL}/api/usuarios/me`, {
            headers: { Authorization: `Bearer ${token}`}
        })
        
        return {
            idUsuario: userData.idUsuario,
            email: userData.email,
            nombre: userData.nombre,
            apellido: userData.apellido,
            telefono: userData.telefono,
            rol: userData.rol,
            activo: userData.activo,
        }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Error al obtener datos del usuario'
        );
    }
})

// --------------- SLICE ---------------

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null 
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {

    // login
    builder
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.error = null;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.error = action.payload;
        })

    // register
    builder
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.error = null;
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.error = action.payload;
        })

    // user data
    builder
        .addCase(getUserData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getUserData.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(getUserData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    
    builder
        .addCase(updateUsuario.fulfilled, (state, action) => {
        
        // Solo actualizar si es el usuario loggeado
        if (state.user && state.user.idUsuario === action.payload.idUsuario) {
            state.user = action.payload;
        }
    });
    }
    
})


export const { logout } = authSlice.actions;

export default authSlice.reducer;
