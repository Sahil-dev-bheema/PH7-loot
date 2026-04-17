import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { userApi } from "../service/userApi";

import cartReducer from "../features/cartSlice";
import ticketReducer from "../features/ticketSlice";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";

// =======================
// 🔐 Persist configs
// =======================

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"],
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};

// ❌ IMPORTANT CHANGE: REMOVE wallet from persistence
// (wallet will now be RTK Query cache only)

// =======================
// Root Reducer
// =======================
const rootReducer = combineReducers({
  cart: persistReducer(cartPersistConfig, cartReducer),
  auth: persistReducer(authPersistConfig, authReducer),

  user: userReducer, // keep user slice for profile only (NO wallet state)

  ticket: ticketReducer,

  // RTK Query reducer
  [userApi.reducerPath]: userApi.reducer,
});

// =======================
// Store
// =======================
export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(userApi.middleware), // ✅ IMPORTANT
});

// =======================
// Persistor
// =======================
export const persistor = persistStore(store);