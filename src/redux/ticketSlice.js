import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
  },
});

export const { setTickets } = ticketSlice.actions;
export default ticketSlice.reducer;