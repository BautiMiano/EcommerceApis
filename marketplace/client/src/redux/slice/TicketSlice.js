import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../utils/api";

const URL = `${API_URL}/tickets`;

//El backend pide el token en cada request
const headers = (token) => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchMyTickets = createAsyncThunk("tickets/fetchMyTickets", async () => {
    const { data } = await axios.get(`${URL}/mis-tickets`, { headers: headers()});
    return data;
});

export const fetchAllTickets = createAsyncThunk("tickets/fetchAllTickets", async () => {
    const { data } = await axios.get(URL, { headers: headers()});
    return data;
});

export const createTicket = createAsyncThunk("tickets/createTicket", async (newTicket) => {
    const { data } = await axios.post(URL, newTicket, { headers: headers() });
    return data;
});

export const fetchTicketById = createAsyncThunk("tickets/fetchTicketById", async (ticketId) => {
    const { data } = await axios.get(`${URL}/${ticketId}`, { headers: headers() });
    return data;
});

export const answerTicket = createAsyncThunk("tickets/answerTicket", async ({ id, respuesta }) => {
    await axios.patch(`${URL}/${id}/responder`, { respuesta }, { headers: headers() });
    const { data } = await axios.get(`${URL}/${id}`, { headers: headers() });
    return data;
});

const ticketsSlice = createSlice({
    name: "tickets",
    initialState: {
        items: [],
        loading: false,
        error: null,
        createStatus: "idle",
        selected: null,
        answerStatus: "idle",
    },
    reducers: {
        resetCreateStatus: (state) => {
            state.createStatus = "idle";
        },
        resetAnswerStatus: (state) => {
            state.answerStatus = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selected = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                state.loading = false;
                state.selected = action.payload;
            })
            .addCase(answerTicket.pending, (state) => {
                state.answerStatus = "pending";
            })
            .addCase(answerTicket.fulfilled, (state, action) => {
                state.answerStatus = "succeeded";
                state.selected = action.payload;
                const index = state.items.findIndex((ticket) => ticket.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(answerTicket.rejected, (state) => {
                state.answerStatus = "failed";
            })
            .addCase(createTicket.pending, (state) => {
                state.createStatus = "pending";
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.createStatus = "succeeded";
                state.items = [...state.items, action.payload];
            })
            .addCase(createTicket.rejected, (state) => {
                state.createStatus = "failed";
            })
            .addMatcher(isAnyOf(fetchMyTickets.pending, fetchAllTickets.pending), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher(isAnyOf(fetchMyTickets.fulfilled,fetchAllTickets.fulfilled), (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addMatcher(isAnyOf(fetchMyTickets.rejected, fetchAllTickets.rejected, fetchTicketById.rejected), (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { resetCreateStatus, resetAnswerStatus } = ticketsSlice.actions;
export default ticketsSlice.reducer;