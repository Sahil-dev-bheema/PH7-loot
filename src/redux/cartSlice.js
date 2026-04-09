// src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// ✅ ADD TO CART
export const addToCartAPI = createAsyncThunk(
  "cart/addToCartAPI",
  async ({ pool_id, ticket_price, ticket_quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/cart/add_to_cart", {
        pool_id,
        ticket_price,
        ticket_quantity,
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
        data: { pool_id }, // ✅ correct for DELETE
      });

      return { pool_id };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// ✅ GET CART (🔥 FIXED)
export const getCartAPI = createAsyncThunk(
  "cart/getCartAPI",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/cart/get_cartItems");

      console.log("CART API RESPONSE:", res.data);

      // ✅ ALWAYS RETURN ARRAY
      return (
        res.data?.items ||
      
        []
      );
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

        // ✅ FORCE ARRAY SAFETY
        state.items = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.items || [];
      })
      .addCase(getCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ ADD TO CART (FIXED)
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.loading = false;

        const newItem =
          action.payload?.data || // if backend sends item
          action.meta.arg;        // fallback

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