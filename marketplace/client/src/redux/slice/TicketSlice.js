import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../utils/api";

const URL = `${API_URL}/tickets`;

//El backend pide el token en cada request
const headers = (token) => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchMisTickets = createAsyncThunk("tickets/fetchMisTickets", async () => {
    const { data } = await axios.get(`${URL}/mis-tickets`, { headers: headers()});
    return data;
});

const ticketsSlice = createSlice({
    name: "tickets",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMisTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMisTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMisTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default ticketsSlice.reducer;