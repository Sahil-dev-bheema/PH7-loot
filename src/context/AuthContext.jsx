import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [wallet, setWallet] = useState({
    cash: 0,
    bonus: 0,
  });

  /* ================= LOAD FROM LOCAL STORAGE ================= */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedWallet = localStorage.getItem("wallet");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }

    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet));
      } catch {
        setWallet({ cash: 0, bonus: 0 });
      }
    }
  }, []);

  /* ================= LOGIN ================= */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    const nextWallet = {
      cash: Number(userData?.wallet?.cash ?? userData?.wallet ?? 0),
      bonus: Number(userData?.wallet?.bonus ?? 0),
    };

    setWallet(nextWallet);
    localStorage.setItem("wallet", JSON.stringify(nextWallet));
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    setUser(null);
    setWallet({ cash: 0, bonus: 0 });

    localStorage.removeItem("user");
    localStorage.removeItem("wallet");
  };

  /* ================= UPDATE WALLET ================= */
  const updateWallet = (updater) => {
    setWallet((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : updater;

      const safe = {
        cash: Number(next?.cash ?? 0),
        bonus: Number(next?.bonus ?? 0),
      };

      localStorage.setItem("wallet", JSON.stringify(safe));
      return safe;
    });
  };

  /* ================= REFRESH WALLET (API) ================= */
  const refreshWallet = useCallback(async () => {
    try {
      console.log("🔥 refreshWallet CALLED");

      const userId =
        user?.id || user?._id || user?.uid || user?.userId;

      console.log("➡️ userId:", userId);

      if (!userId) return;

      const res = await axiosInstance.get(
        `/user/user-profile/${userId}`
      );

      console.log("✅ API RESPONSE:", res.data);

      const u = res.data?.data?.user;

      if (u) {
        updateWallet({
          cash: Number(u.wallet ?? 0),
          bonus: 0,
        });
      }
    } catch (err) {
      console.error("❌ wallet refresh failed", err);
    }
  }, [user]);

  /* ================= AUTO CALL API WHEN USER READY ================= */
  useEffect(() => {
    if (user) {
      refreshWallet();
    }
  }, [user, refreshWallet]);

  /* ================= DEDUCT WALLET ================= */
  const deductWallet = async (amount) => {
    try {
      const userId =
        user?.id || user?._id || user?.uid || user?.userId;

      if (!userId) {
        console.log("User object:", user);
        throw new Error("User not found");
      }

      const res = await axiosInstance.post(
        "/user/user-wallet-update",
        {
          userId,
          amount,
        }
      );

      const updated = res.data?.data;

      if (!updated) {
        throw new Error("Invalid wallet response");
      }

      updateWallet({
        cash: Number(updated.cash ?? wallet.cash ?? 0),
        bonus: Number(updated.bonus ?? wallet.bonus ?? 0),
      });

      return true;
    } catch (err) {
      console.error("❌ deductWallet failed:", err);
      return false;
    }
  };

  /* ================= CONTEXT VALUE ================= */
  const value = useMemo(
    () => ({
      user,
      wallet,
      login,
      logout,
      updateWallet,
      refreshWallet,
      deductWallet,
    }),
    [user, wallet]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);