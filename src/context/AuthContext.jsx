// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);

  // 🔥 RESTORE USER ON LOAD
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedWallet = localStorage.getItem("wallet");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }

    if (savedWallet) {
      const parsedWallet = JSON.parse(savedWallet);
      setWallet(parsedWallet);
    }
  }, []);

  // ✅ LOGIN
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    const next = {
      cash: Number(
        typeof userData?.wallet === "string"
          ? userData.wallet
          : userData?.wallet?.cash ?? 0
      ),
      bonus: 0,
    };

    setWallet(next);
    localStorage.setItem("wallet", JSON.stringify(next));
  };

  const logout = () => {
    setUser(null);
    setWallet(null);
    localStorage.removeItem("user");
    localStorage.removeItem("wallet");
    localStorage.removeItem("user_token");
  };

  const value = useMemo(
    () => ({ user, wallet, login, logout }),
    [user, wallet]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};