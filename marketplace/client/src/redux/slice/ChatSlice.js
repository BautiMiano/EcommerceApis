import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../utils/api";

const URL = `${API_URL}/chat`;

const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchConversaciones = createAsyncThunk("chat/fetchConversaciones", async () => {
    const { data } = await axios.get(`${URL}/conversaciones`, { headers: headers()}); 
    return data;
});

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        conversaciones: [],
        loading: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversaciones.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchConversaciones.fulfilled, (state, action) => {
                state.loading = false;
                state.conversaciones = action.payload;
            })
            .addCase(fetchConversaciones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default chatSlice.reducer;