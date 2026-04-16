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

      // ✅ Correct root extraction (based on your API)
      const root = res.data?.data || {};

      return {
        // ✅ FIXED wallet (string → number)
        wallet: {
          cash: Number(root?.wallet || root?.user?.wallet || 0),
          bonus: 0,
        },

        // ✅ user stays same
        user: root?.user || {},

        // ✅ FIXED: package → packages + mapping
        packages: (root?.package || []).map((p) => ({
          purchaseId: p.user_package_id,
          title: p.package_name,
          price: Number(p.package_price),
          purchasedAt: p.purchased_at,
        })),

        // ✅ tickets already correct
        tickets: root?.tickets || [],
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchWallet = createAsyncThunk(
  "user/fetchWallet",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const userId =
        auth.user?.id ||
        auth.user?._id ||
        auth.user?.uid ||
        auth.user?.userId;

      if (!userId) throw new Error("User not found");

      const res = await axiosInstance.get(
        `/user/get_wallet/${userId}`
      );

      const root = res.data?.data || {};

      return {
        cash: Number(root.cash || 0),
        bonus: Number(root.bonus || 0),
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


/* ================= UPDATE WALLET ================= */
export const updateWallet = createAsyncThunk(
  "user/updateWallet",
  async (amount, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = getUserId(auth);

      const res = await axiosInstance.post(
        "/user/user-wallet-update",
        {
          userId,
          amount: Number(amount),
        }
      );

      return res.data?.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= SLICE ================= */
const userSlice = createSlice({
  name: "user",
  initialState: {
    wallet: {
      cash: 0,
      bonus: 0,
    },

    profile: {
      user: {},
      packages: [],
      tickets: [],
    },

    loading: false,
    error: null,
  },

  reducers: {
    updateWalletLocal: (state, action) => {
      const amount = Number(action.payload || 0);

      state.wallet.cash += amount;

      localStorage.setItem(
        "wallet",
        JSON.stringify(state.wallet)
      );
    },

    resetUserData: (state) => {
      state.wallet = { cash: 0, bonus: 0 };
      state.profile = { user: {}, packages: [], tickets: [] };

      localStorage.removeItem("wallet");
    },
  },

  extraReducers: (builder) => {
    builder

.addCase(fetchWallet.fulfilled, (state, action) => {
  state.wallet = {
    cash: action.payload.cash,
    bonus: action.payload.bonus,
  };
})

      /* ===== PROFILE ===== */
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ prevents full overwrite corruption
        state.wallet = {
          ...state.wallet,
          ...action.payload.wallet,
        };

        state.profile = {
          user: action.payload.user,
          packages: action.payload.packages,
          tickets: action.payload.tickets,
        };

        localStorage.setItem(
          "wallet",
          JSON.stringify(state.wallet)
        );
      })


      
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== WALLET UPDATE ===== */
      .addCase(updateWallet.fulfilled, (state, action) => {
        const wallet = action.payload || {};

        state.wallet = {
          cash: Number(wallet.cash ?? state.wallet.cash),
          bonus: Number(wallet.bonus ?? state.wallet.bonus),
        };

        localStorage.setItem(
          "wallet",
          JSON.stringify(state.wallet)
        );
      });
  },
});

export const { updateWalletLocal, resetUserData } =
  userSlice.actions;

export default userSlice.reducer;