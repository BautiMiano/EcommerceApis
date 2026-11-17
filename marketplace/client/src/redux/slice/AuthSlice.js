import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/api";

const URL = `${API_URL}/auth`;

// Guarda la sesión en localStorage para no perderla al recargar la página.
const guardarSesion = (data) => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("usuarioId", data.usuarioId);
};

// validateStatus: () => true hace que axios no rechace la promesa ante un error HTTP.
export const loginUser = createAsyncThunk("auth/loginUser", async (credenciales) => {
    const { data, status } = await axios.post(`${URL}/authenticate`, credenciales, {
        validateStatus: () => true,
    });
    if (status !== 200) {
        throw new Error(data || "Correo o contraseña incorrectos");
    }
    guardarSesion(data);
    return data;
});

// El comprador recibe su token al registrarse. El vendedor no: queda pendiente de aprobación.
export const registerUser = createAsyncThunk("auth/registerUser", async (usuario) => {
    const { data, status } = await axios.post(`${URL}/register`, usuario, {
        validateStatus: () => true,
    });
    if (status !== 200) {
        throw new Error(data || "No se pudo crear la cuenta");
    }
    data.access_token && guardarSesion(data);
    return data;
});

// Pasa la respuesta del backend al estado global
const cargarSesion = (state, data) => {
    state.token = data.access_token;
    state.rol = String(data.role || "").toUpperCase();
    state.usuarioId = data.usuarioId;
};

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token"),
        rol: String(localStorage.getItem("userRole") || "").toUpperCase(),
        usuarioId: localStorage.getItem("usuarioId"),
        loading: false,
        error: null,
        registerStatus: "idle",
        registerRol: null,
        registerError: null,
    },
    reducers: {
        // El localStorage lo limpia cerrarSesion() (utils/sesion.js) antes de despachar esta acción
        logout: (state) => {
            state.token = null;
            state.rol = "";
            state.usuarioId = null;
        },
        resetRegisterStatus: (state) => {
            state.registerStatus = "idle";
            state.registerRol = null;
            state.registerError = null;
        },
        // Borra el error del login (se usa al salir de la pantalla de login)
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                cargarSesion(state, action.payload);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(registerUser.pending, (state) => {
                state.registerStatus = "pending";
                state.registerError = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.registerStatus = "succeeded";
                state.registerRol = action.payload.role;
                action.payload.access_token && cargarSesion(state, action.payload);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.registerStatus = "failed";
                state.registerError = action.error.message;
            });
    },
});

export const { logout, resetRegisterStatus, clearError } = authSlice.actions;
export default authSlice.reducer;
