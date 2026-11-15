import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/api";

const URL = `${API_URL}/auth`;

// Guarda la sesión en localStorage para no perderla al recargar la página.
// Va en los thunks (no en los reducers) porque es un efecto secundario y los reducers son funciones puras.
const guardarSesion = (data) => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("usuarioId", data.usuarioId);
};

// validateStatus: () => true hace que axios no rechace la promesa ante un error HTTP.
// Así leemos el texto que manda el backend (por ejemplo, "Tu cuenta de vendedor todavía no está habilitada")
// y lo lanzamos con throw: llega intacto a action.error.message.
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
    const { data } = await axios.post(`${URL}/register`, usuario);
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
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.registerStatus = "succeeded";
                state.registerRol = action.payload.role;
                action.payload.access_token && cargarSesion(state, action.payload);
            })
            .addCase(registerUser.rejected, (state) => {
                state.registerStatus = "failed";
            });
    },
});

export const { logout, resetRegisterStatus } = authSlice.actions;
export default authSlice.reducer;
