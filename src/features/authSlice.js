import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// =======================
// LOGIN
// =======================
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (form, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/user/login", form);

      // 🔥 Adjust if backend is nested
      const data = res.data?.data || res.data;

      return {
        user: data.user,
        token: data.token,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// =======================
// REGISTER
// =======================
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (form, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/user/register", form);

      console.log("REGISTER RESPONSE:", res.data);

      // ✅ DIRECTLY USE res.data (NO nesting)
      const data = res.data;

      return {
        user: data.user,
        token: data.token,
        bonus: 50,
      };
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// =======================
// INITIAL STATE (FIXED)
// =======================
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("user_token") || null,
  bonus: Number(localStorage.getItem("bonus")) || 0, 
};

// =======================
// SLICE
// =======================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.bonus = 0;

      localStorage.removeItem("user_token");
      localStorage.removeItem("user");
      localStorage.removeItem("bonus");
    },

    setBonus: (state, action) => {
      state.bonus = Number(action.payload || 0);
      localStorage.setItem("bonus", state.bonus);
    },
  },

  extraReducers: (builder) => {
    builder
     .addCase(loginUser.fulfilled, (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.token;

  // ✅ restore bonus from storage
  const storedBonus = Number(localStorage.getItem("bonus") || 0);
  state.bonus = storedBonus;

  localStorage.setItem("user_token", action.payload.token);
  localStorage.setItem("user", JSON.stringify(action.payload.user));
})

      .addCase(registerUser.fulfilled, (state, action) => {
        const token = action.payload.token;
        if (!token) {
    console.error("❌ REGISTER TOKEN MISSING");
    return;
  }
        
        state.user = action.payload.user;
        state.token = token;



        // ✅ only set if not already present
        if (!state.bonus) {
          state.bonus = action.payload.bonus;
          localStorage.setItem("bonus", String(action.payload.bonus));
        }

        localStorage.setItem("user_token",token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      });
  },
});

export const { logout,setBonus } = authSlice.actions;
export default authSlice.reducer;
