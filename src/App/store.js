import { configureStore, combineReducers } from "@reduxjs/toolkit";

import cartReducer from "../features/cartSlice";
import ticketReducer from "../features/ticketSlice";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice"; // ✅ ADD THIS

import {
  persistStore,
  persistReducer,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

// =======================
// 🔐 Persist configs
// =======================

// Cart persists only items
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"],
};

// ✅ Auth: ONLY user + token
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"], // ❌ removed wallet
};

// ✅ User: persist wallet only (optional but recommended)
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["wallet"], // persist wallet balance
};

// =======================
// Root Reducer
// =======================
const rootReducer = combineReducers({
  cart: persistReducer(cartPersistConfig, cartReducer),

  auth: persistReducer(authPersistConfig, authReducer),

  user: persistReducer(userPersistConfig, userReducer), // ✅ ADD THIS

  ticket: ticketReducer,
});

// =======================
// Store
// =======================
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// =======================
// Persistor
// =======================
export const persistor = persistStore(store);