// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForget from "../components/userForgot/UserForget";

// ❌ REMOVE axios + context
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";

// ✅ REDUX
import { useDispatch } from "react-redux";
import { loginUser } from "../features/authSlice";
import { fetchUserProfile } from "../features/userSlice"; // 👈 IMPORTANT

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [forgetOpen, setForgetOpen] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "This Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password.trim()) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);

      // ✅ LOGIN (Redux)
      const user = await dispatch(loginUser(form)).unwrap();

      console.log("✅ login success:", user);

      // ✅ FETCH PROFILE + WALLET (VERY IMPORTANT)
      const userId =
        user?._id || user?.id || user?.uid || user?.userId;

      if (userId) {
        dispatch(fetchUserProfile(userId));
      }

      navigate("/", { replace: true });

    } catch (err) {
      console.error("❌ login error:", err);

      const message = err || "Login failed";
      setServerError(message);

      setErrors((prev) => ({
        ...prev,
        password: "Incorrect password",
      }));
    } finally {
      setLoading(false);
    }
  };

  // ---- UI CODE SAME AS YOURS ----

  const baseField =
    "w-full rounded-xl border bg-white/80 px-3 py-2 text-sm outline-none transition " +
    "focus:ring-4 focus:ring-[#50c2b4]/20 focus:border-[#50c2b4]";

  const field = (name) =>
    `${baseField} ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
        : "border-gray-200 hover:border-gray-300"
    }`;

  const label = "text-[11px] font-semibold text-gray-700 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9fbf9] via-white to-[#f6fffe] flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white/70 backdrop-blur-md">
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#50c2b4] to-[#2f8f84] p-8 text-white">
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Welcome Back 🎟 <br /> Login to Play
            </h1>
            <p className="mt-3 text-sm text-white/90">
              Access your tickets, check results, and manage winnings securely.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <p>🏆 Track winning results instantly</p>
              <p>🎫 View and manage your tickets</p>
              <p>💰 Fast & secure wallet access</p>
            </div>
          </div>
          <p className="text-xs text-white/80">© {new Date().getFullYear()} Lottery Platform</p>
        </div>

        <div className="p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="text-sm text-gray-600">Sign in to continue to your dashboard</p>

          {serverError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* ✅ UI UNCHANGED */}
            <div>
              <label className={label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={field("email")}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className={label}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${field("password")} pr-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2f8f84] hover:underline"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">

 {import.meta.env.VITE_FLAG_V === "V1" && (
         <button
                type="button"
                className="text-gray-600 hover:underline"
                onClick={() => setForgetOpen(true)}
              >
                Forgot password?
              </button>
      )}

             

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-[#2f8f84] hover:underline"
              >
                Create account
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white font-semibold bg-[#50c2b4] hover:bg-[#3fa89c] shadow-md disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-[#2f8f84] hover:underline"
              >
                Register now
              </button>
            </p>
          </form>
        </div>
      </div>

{import.meta.env.VITE_FLAG_V === "V1" && (
      <UserForget
        open={forgetOpen}
        onClose={() => setForgetOpen(false)}
        defaultEmail={form.email}
        onSuccess={() => setForgetOpen(false)}
      />   
      )}

      
    </div>
  );
};

export default Login;