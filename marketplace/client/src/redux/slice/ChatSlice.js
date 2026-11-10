import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/api";

const URL = `${API_URL}/chat`;

// El backend pide el token en cada pedido
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchConversations = createAsyncThunk("chat/fetchConversations", async () => {
  const { data } = await axios.get(`${URL}/conversaciones`, { headers: headers() });
  return data;
});

export const deleteConversation = createAsyncThunk("chat/deleteConversation", async (id) => {
  await axios.delete(`${URL}/conversaciones/${id}`, { headers: headers() });
  return id;
});

export const fetchConversation = createAsyncThunk("chat/fetchConversation", async (id) => {
  const { data } = await axios.get(`${URL}/conversaciones/${id}`, { headers: headers() });
  return data;
});

export const sendMessage = createAsyncThunk("chat/sendMessage", async ({ conversacionId, mensaje }) => {
  const { data } = await axios.post(URL, { conversacionId, mensaje }, { headers: headers() });
  return data;
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    items: [],
    loading: true,
    error: null,
    deletingId: null,
    messages: [],
    currentId: null,
    messagesLoading: false,
    messagesError: null,
    sendStatus: "idle",
  },
  reducers: {
    openConversation: (state, action) => {
      state.currentId = action.payload;
      state.messages = [];
      state.messagesError = null;
      state.sendStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteConversation.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.deletingId = null;
        state.items = state.items.filter((conversacion) => conversacion.id !== action.payload);
      })
      .addCase(deleteConversation.rejected, (state) => {
        state.deletingId = null;
      })
            .addCase(fetchConversation.pending, (state) => {
        state.messagesLoading = true;
        state.messagesError = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload.mensajes;
      })
      .addCase(fetchConversation.rejected, (state) => {
        state.messagesLoading = false;
        state.messagesError = "No se pudo cargar la conversación";
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.sendStatus = "pending";
        // Tu mensaje aparece enseguida, sin esperar a Uni
        state.messages.push({ autor: "USUARIO", texto: action.meta.arg.mensaje });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendStatus = "succeeded";
        state.currentId = action.payload.conversacionId;
        state.messages.push({
          autor: "ASISTENTE",
          texto: action.payload.respuesta,
          productos: action.payload.productos || [],
          acciones: action.payload.acciones || [],
        });
      })
      .addCase(sendMessage.rejected, (state) => {
        state.sendStatus = "failed";
        state.messages.push({
          autor: "ASISTENTE",
          texto: "No pude responder en este momento. Probá de nuevo en unos segundos.",
        });
      });
  },
});

export const { openConversation } = chatSlice.actions;
export default chatSlice.reducer;