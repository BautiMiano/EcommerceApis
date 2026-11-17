import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { pedir } from "../../utils/http";

const URL = `${API_URL}/auth`;

const guardarSesion = (data) => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("usuarioId", data.usuarioId);
};

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
export const authReducer = authSlice.reducer;

export const fetchUsuarios = createAsyncThunk("usuarios/fetchUsuarios", async () =>
    pedir("get", "/usuarios")
);

export const cambiarActivoUsuario = createAsyncThunk("usuarios/cambiarActivo", async (usuario) => {
    const accion = usuario.activo ? "desactivar" : "activar";
    await pedir("patch", `/usuarios/${accion}/${usuario.id}`);
    return { id: usuario.id, nombreUsuario: usuario.nombreUsuario, activo: !usuario.activo };
});

export const fetchPerfil = createAsyncThunk("usuarios/fetchPerfil", async () =>
    pedir("get", "/usuarios/me")
);

export const actualizarPerfil = createAsyncThunk("usuarios/actualizarPerfil", async (cambios) => {
    const respuesta = await pedir("put", "/usuarios/me", cambios);
    localStorage.setItem("token", respuesta.access_token);
    return cambios;
});

export const cambiarContrasena = createAsyncThunk("usuarios/cambiarContrasena", async ({ contrasenaActual, contrasenaNueva }) =>
    pedir("patch", "/usuarios/me/contrasena", { contrasenaActual, contrasenaNueva })
);

const initialState = {
    items: [],
    loading: false,
    status: "idle",
    error: null,
    accionId: null,
    accionStatus: "idle",
    accionError: null,
    ultimaAccion: null,

    perfil: null,
    loadingPerfil: false,
    statusPerfil: "idle",
    errorPerfil: null,
    statusGuardarPerfil: "idle",
    avisoPerfil: null,
};

const usuariosSlice = createSlice({
    name: "usuarios",
    initialState,
    reducers: {
        resetAccionStatus: (state) => {
            state.accionStatus = "idle";
            state.accionError = null;
        },
        limpiarAvisoPerfil: (state) => {
            state.avisoPerfil = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, () => initialState)
            .addCase(logout, () => initialState)

            .addCase(fetchUsuarios.pending, (state) => {
                state.status = "pending";
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsuarios.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchUsuarios.rejected, (state, action) => {
                state.status = "failed";
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(cambiarActivoUsuario.pending, (state, action) => {
                state.accionStatus = "pending";
                state.accionId = action.meta.arg.id;
            })
            .addCase(cambiarActivoUsuario.fulfilled, (state, action) => {
                state.accionStatus = "succeeded";
                state.accionId = null;
                state.ultimaAccion = { nombreUsuario: action.payload.nombreUsuario, activo: action.payload.activo };
                const usuario = state.items.find((item) => item.id === action.payload.id);
                usuario && (usuario.activo = action.payload.activo);
            })
            .addCase(cambiarActivoUsuario.rejected, (state, action) => {
                state.accionStatus = "failed";
                state.accionId = null;
                state.accionError = action.error.message;
            })

            .addCase(fetchPerfil.pending, (state) => {
                state.statusPerfil = "loading";
                state.loadingPerfil = true;
                state.errorPerfil = null;
            })
            .addCase(fetchPerfil.fulfilled, (state, action) => {
                state.statusPerfil = "succeeded";
                state.loadingPerfil = false;
                state.perfil = action.payload;
            })
            .addCase(fetchPerfil.rejected, (state, action) => {
                state.statusPerfil = "failed";
                state.loadingPerfil = false;
                state.errorPerfil = action.error.message;
            })

            .addCase(actualizarPerfil.pending, (state) => {
                state.statusGuardarPerfil = "loading";
            })
            .addCase(actualizarPerfil.fulfilled, (state, action) => {
                state.statusGuardarPerfil = "idle";
                state.perfil = { ...state.perfil, ...action.payload };
                state.avisoPerfil = { tipo: "success", texto: "Tus datos se guardaron.", accion: "datos" };
            })
            .addCase(actualizarPerfil.rejected, (state, action) => {
                state.statusGuardarPerfil = "idle";
                state.avisoPerfil = { tipo: "error", texto: action.error.message, accion: "datos" };
            })

            .addCase(cambiarContrasena.pending, (state) => {
                state.statusGuardarPerfil = "loading";
            })
            .addCase(cambiarContrasena.fulfilled, (state) => {
                state.statusGuardarPerfil = "idle";
                state.avisoPerfil = { tipo: "success", texto: "Tu contraseña se cambió.", accion: "contrasena" };
            })
            .addCase(cambiarContrasena.rejected, (state, action) => {
                state.statusGuardarPerfil = "idle";
                state.avisoPerfil = { tipo: "error", texto: action.error.message, accion: "contrasena-error" };
            });
    },
});

export const { resetAccionStatus, limpiarAvisoPerfil } = usuariosSlice.actions;
export default usuariosSlice.reducer;
