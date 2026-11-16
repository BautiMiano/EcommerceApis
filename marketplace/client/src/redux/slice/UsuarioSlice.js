import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pedir } from "../../utils/http";
import { loginUser, logout } from "./AuthSlice";

// Slice del objeto Usuario del back. Tiene dos partes:
// - La lista de usuarios que gestiona el admin (items, status, error, accion...).
// - El perfil del usuario logueado (perfil, statusPerfil...), que usan la tienda, el panel y Mi perfil.

// ---------- Thunks del admin ----------

// Todos los usuarios (GET /usuarios). Solo el admin.
export const fetchUsuarios = createAsyncThunk("usuarios/fetchUsuarios", async () =>
    pedir("get", "/usuarios")
);

// Activa o desactiva según el estado actual del usuario (PATCH /usuarios/activar|desactivar/{id}).
// El backend solo responde un texto, así que devolvemos el cambio y el reducer actualiza ese usuario
// en la lista: no hace falta volver a pedirla.
export const cambiarActivoUsuario = createAsyncThunk("usuarios/cambiarActivo", async (usuario) => {
    const accion = usuario.activo ? "desactivar" : "activar";
    await pedir("patch", `/usuarios/${accion}/${usuario.id}`);
    return { id: usuario.id, nombreUsuario: usuario.nombreUsuario, activo: !usuario.activo };
});

// ---------- Thunks del perfil propio ----------

// Perfil del usuario logueado (GET /usuarios/me). Se pide una sola vez por sesión.
export const fetchPerfil = createAsyncThunk("usuarios/fetchPerfil", async () =>
    pedir("get", "/usuarios/me")
);

// Guarda los datos de la cuenta (PUT /usuarios/me). El mail es el usuario del login:
// el back devuelve un token nuevo y el viejo deja de servir, por eso se guarda acá (efecto secundario).
// Se devuelven los datos enviados para actualizar el perfil sin volver a pedirlo.
export const actualizarPerfil = createAsyncThunk("usuarios/actualizarPerfil", async (cambios) => {
    const respuesta = await pedir("put", "/usuarios/me", cambios);
    localStorage.setItem("token", respuesta.access_token);
    return cambios;
});

// Cambia la contraseña (PATCH /usuarios/me/contrasena)
export const cambiarContrasena = createAsyncThunk("usuarios/cambiarContrasena", async ({ contrasenaActual, contrasenaNueva }) =>
    pedir("patch", "/usuarios/me/contrasena", { contrasenaActual, contrasenaNueva })
);

// ---------- Estado inicial ----------

const initialState = {
    // Lista del admin
    items: [],
    loading: false,
    status: "idle", // idle = todavía no se pidió la lista
    error: null,
    accionId: null, // usuario que se está activando o desactivando
    accionStatus: "idle",
    accionError: null,
    ultimaAccion: null, // { nombreUsuario, activo } del último cambio, para el texto del toast

    // Perfil propio
    perfil: null,
    loadingPerfil: false,
    statusPerfil: "idle",
    errorPerfil: null,
    statusGuardarPerfil: "idle", // para no guardar dos veces con un doble clic
    avisoPerfil: null, // { tipo, texto, accion } para mostrar con toast
};

// ---------- Slice ----------

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
            // Al iniciar o cerrar sesión se vacía todo, para que otra cuenta no vea datos viejos
            .addCase(loginUser.fulfilled, () => initialState)
            .addCase(logout, () => initialState)

            // Lista del admin
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

            // Perfil propio
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
