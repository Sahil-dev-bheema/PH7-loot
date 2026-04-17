import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

/* ================= HELPERS ================= */
const getUserId = (auth) =>
  auth.user?.id ||
  auth.user?._id ||
  auth.user?.uid ||
  auth.user?.userId;

/* ================= FETCH PROFILE ================= */
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = getUserId(auth);

      if (!userId) throw new Error("User not found");

      const res = await axiosInstance.get(
        `/user/user-profile/${userId}`
      );

      const root = res?.data?.data || {};

      return {
        user: root?.user || {},

        // ✅ SAFE ARRAY HANDLING
        packages: Array.isArray(root?.package)
          ? root.package.map((p) => ({
              purchaseId: p.user_package_id,
              title: p.package_name,
              price: Number(p.package_price || 0),
              purchasedAt: p.purchased_at,
            }))
          : [],

        tickets: Array.isArray(root?.tickets) ? root.tickets : [],

        // ✅ ADD WALLET BACK (IMPORTANT FIX)
        wallet: Number(root?.wallet || 0),
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= SLICE ================= */
const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: {
      user: {},
      packages: [],
      tickets: [],
      wallet: 0, // ✅ FIX ADDED
    },

    loading: false,
    error: null,
  },

  reducers: {
    resetUserData: (state) => {
      state.profile = {
        user: {},
        packages: [],
        tickets: [],
        wallet: 0,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      /* ===== PROFILE ===== */
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.profile = {
          user: action.payload.user,
          packages: action.payload.packages,
          tickets: action.payload.tickets,
          wallet: action.payload.wallet, // ✅ FIX ADDED
        };
      })

      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserData } = userSlice.actions;

export default userSlice.reducer;