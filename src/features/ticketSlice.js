// src/redux/ticketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

/* ================= FETCH SOLD TICKETS ================= */
export const fetchSoldTickets = createAsyncThunk(
  "ticket/fetchSoldTickets",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/ticket/check_soldTic/${slug}`
      );

      console.log("RAW RESPONSE:", res);
      console.log("RAW DATA:", res.data);

      const soldTickets = res.data?.soldTickets;

      if (!Array.isArray(soldTickets)) {
        console.warn("❌ soldTickets not array:", soldTickets);
        return [];
      }

      const soldNumbers = soldTickets.map((t) =>
        Number(t.ticket_number)
      );

      console.log("✅ SOLD NUMBERS:", soldNumbers);

      return soldNumbers;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= SLICE ================= */
const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    selectedTicket: null,
    soldTickets: [],
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },

    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
      state.soldTickets = [];
    },

    // ✅ SAFE MERGE (backend + frontend simulation)
    mergeSoldTickets: (state, action) => {
      const backend = state.soldTickets;
      const simulated = action.payload;

      const merged = Array.from(
        new Set([...backend, ...simulated])
      );

      state.soldTickets = merged;
    },

    // ⚠️ keep only if you REALLY need full overwrite
    setSoldTickets: (state, action) => {
      state.soldTickets = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSoldTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSoldTickets.fulfilled, (state, action) => {
        state.loading = false;

        // ⚠️ backend always updates base state
        state.soldTickets = action.payload;
      })
      .addCase(fetchSoldTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedTicket,
  clearSelectedTicket,
  setSoldTickets,
  mergeSoldTickets, // ✅ IMPORTANT EXPORT
} = ticketSlice.actions;

export default ticketSlice.reducer;