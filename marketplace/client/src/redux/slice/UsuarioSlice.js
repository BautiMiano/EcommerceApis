import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/api";
import { logout } from "./AuthSlice";

const URL = `${API_URL}/usuarios`;

// El backend pide el token en cada request
const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// validateStatus: () => true hace que axios no rechace la promesa ante un error HTTP.
// Así leemos el texto que manda el backend (por ejemplo, "No se puede desactivar un usuario con rol ADMIN")
// y lo lanzamos con throw: llega intacto a action.error.message.
export const fetchUsuarios = createAsyncThunk("usuarios/fetchUsuarios", async () => {
    const { data, status } = await axios.get(URL, { headers: headers(), validateStatus: () => true });
    if (status !== 200) {
        throw new Error(data || "No se pudieron obtener los usuarios.");
    }
    return data;
});

// Activa o desactiva según el estado actual del usuario.
// El backend solo responde un texto, así que devolvemos el cambio y el reducer actualiza ese usuario
// en la lista: no hace falta volver a pedirla.
export const cambiarActivoUsuario = createAsyncThunk("usuarios/cambiarActivo", async (usuario) => {
    const accion = usuario.activo ? "desactivar" : "activar";
    const { data, status } = await axios.patch(`${URL}/${accion}/${usuario.id}`, null, {
        headers: headers(),
        validateStatus: () => true,
    });
    if (status !== 200) {
        throw new Error(data || "No se pudo actualizar el usuario.");
    }
    return { id: usuario.id, nombreUsuario: usuario.nombreUsuario, activo: !usuario.activo };
});

const initialState = {
    items: [],
    status: "idle", // idle = todavía no se pidió la lista
    error: null,
    accionId: null, // usuario que se está activando o desactivando
    accionStatus: "idle",
    accionError: null,
    ultimaAccion: null, // { nombreUsuario, activo } del último cambio, para el texto del toast
};

const usuariosSlice = createSlice({
    name: "usuarios",
    initialState,
    reducers: {
        resetAccionStatus: (state) => {
            state.accionStatus = "idle";
            state.accionError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsuarios.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchUsuarios.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchUsuarios.rejected, (state, action) => {
                state.status = "failed";
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
                if (usuario) {
                    usuario.activo = action.payload.activo;
                }
            })
            .addCase(cambiarActivoUsuario.rejected, (state, action) => {
                state.accionStatus = "failed";
                state.accionId = null;
                state.accionError = action.error.message;
            })
            // Al cerrar sesión se vacía la lista, para que otra cuenta no vea datos viejos
            .addCase(logout, () => initialState);
    },
});

export const { resetAccionStatus } = usuariosSlice.actions;
export default usuariosSlice.reducer;
