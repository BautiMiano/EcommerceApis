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

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    items: [],
    loading: true,
    error: null,
    deletingId: null,
  },
  reducers: {},
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
      });
  },
});

export default chatSlice.reducer;