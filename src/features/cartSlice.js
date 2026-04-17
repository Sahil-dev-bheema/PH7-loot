import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// ✅ ADD TO CART (UPDATED)
export const addToCartAPI = createAsyncThunk(
  "cart/addToCartAPI",
  async ({ pool_id, tickets }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/cart/add_to_cart", {
        pool_id,
        tickets, // ✅ FULL ARRAY SENT
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// ✅ REMOVE ITEM
export const removeCartItemAPI = createAsyncThunk(
  "cart/removeCartItemAPI",
  async ({ pool_id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/cart/remove_cartItems", {
        data: { pool_id },
      });

      return { pool_id };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// ✅ GET CART
export const getCartAPI = createAsyncThunk(
  "cart/getCartAPI",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/cart/get_cartItems/${userId}`);

      return res.data?.items || [];
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // ✅ GET CART
      .addCase(getCartAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ ADD TO CART
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.loading = false;

        const newItem =
          action.payload?.data || action.meta.arg;

        const exists = state.items.find(
          (i) => i.pool_id === newItem.pool_id
        );

        if (!exists) {
          state.items.push(newItem);
        }
      })

      // ✅ REMOVE
      .addCase(removeCartItemAPI.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (i) => i.pool_id !== action.payload.pool_id
        );
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;