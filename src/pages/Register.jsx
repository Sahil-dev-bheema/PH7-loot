// src/pages/Register.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ❌ REMOVE
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";

// ✅ ADD
import { useDispatch } from "react-redux";
import { registerUser } from "../features/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Redux

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  /* ---------------- FIELD VALIDATION ---------------- */
  const validateField = (name, value) => {
    const v = String(value ?? "").trim();

    switch (name) {
      case "title":
        return v ? "" : "Please select your title.";

      case "first_name":
        if (!v) return "First name cannot be empty.";
        if (v.length < 3) return "First name must be at least 3 characters.";
        return "";

      case "last_name":
        if (!v) return "Last name cannot be empty.";
        if (v.length < 3) return "Last name must be at least 3 characters.";
        return "";

      case "email":
        if (!v) return "Email is required.";
        if (!/^\S+@\S+\.\S+$/.test(v))
          return "Please enter a valid email address (example: name@gmail.com).";
        return "";

      case "password":
        if (!v) return "Password is required.";
        if (v.length < 6) return "Password must be at least 6 characters.";
        return "";

      default:
        return "";
    }
  };

  /* ---------------- VALIDATE ALL ---------------- */
  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((p) => ({ ...p, [name]: value }));

    const err = validateField(name, value);
    setErrors((p) => ({ ...p, [name]: err }));

    setServerError("");
  };

  /* ---------------- BLUR ---------------- */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors((p) => ({ ...p, [name]: err }));
  };

  /* ---------------- PASSWORD STRENGTH ---------------- */
  const strength = useMemo(() => {
    const p = form.password || "";
    let score = 0;
    if (p.length >= 6) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [form.password]);

  const strengthLabel = ["Weak", "Fair", "Good", "Strong", "Very strong"][strength];

  /* ---------------- SUBMIT (REDUX) ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

 try {
  setLoading(true);

  const payload = {
    ...form,
    title: form.title.trim(),
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    email: form.email.trim(),
    password: form.password,
    platform: "Lottery",
  };

  await dispatch(registerUser(payload)).unwrap();

  navigate("/");

} catch (err) {
  console.log(err);

  const message =
    err?.data?.message ||
    err?.message ||
    "Registration failed. Please try again.";

  setServerError(message);
}
  };

  /* ---------------- UI HELPERS ---------------- */
  const baseField =
    "w-full rounded-xl border bg-white/80 px-3 py-2 text-sm outline-none " +
    "transition focus:ring-4 focus:ring-[#50c2b4]/20 focus:border-[#50c2b4]";

  const field = (name) =>
    `${baseField} ${
      errors[name]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
        : "border-gray-200 hover:border-gray-300"
    }`;

  const label =
    "text-[11px] font-semibold text-gray-700 uppercase tracking-wider";

  const nameSectionHasError =
    !!(errors.title || errors.first_name || errors.last_name);

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9fbf9] via-white to-[#f6fffe] flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white/70 backdrop-blur-md">
        
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#50c2b4] to-[#2f8f84] p-8 text-white">
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Join the Lottery <br /> Create your account
            </h1>

            <p className="mt-3 text-sm text-white/90">
              Sign up to buy tickets, track results, and participate in exciting lottery draws
              securely and instantly.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <p>🎟 Buy lottery tickets online</p>
              <p>🏆 Track winning results instantly</p>
              <p>💰 Secure wallet & quick payouts</p>
            </div>
          </div>

          <p className="text-xs text-white/80">© {new Date().getFullYear()} Lottery Platform</p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-gray-900">Register</h2>
          <p className="text-sm text-gray-600">Fill details to create account</p>

          {serverError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* UI FULLY SAME — NOT TOUCHED */}
            {/* TITLE + FIRST NAME + LAST NAME (SECTION BORDER RED IF ANY ERROR) */}
            <div
              className={[
                "rounded-2xl p-3 border transition",
                nameSectionHasError
                  ? "border-red-500 bg-red-50/40 ring-4 ring-red-500/10"
                  : "border-gray-200/70 bg-white/50 hover:border-gray-300",
              ].join(" ")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Title */}
                <div>
                  <label className={label}>Title</label>
                  <select
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={field("title")}
                  >
                    <option value="">Select</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                  </select>
                  {errors.title && (
                    <p className="text-xs text-red-600 mt-1">{errors.title}</p>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label className={label}>First Name</label>
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="First name"
                    className={field("first_name")}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className={label}>Last Name</label>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Last name"
                    className={field("last_name")}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className={label}>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={field("email")}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
{/* PASSWORD */}
<div>
  <div className="flex justify-between items-center">
    <label className={label}>Password</label>

    {errors.password && (
      <span className="text-xs text-red-600 font-medium">
        {errors.password}
      </span>
    )}
  </div>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="Minimum 6 characters"
      className={`${field("password")} pr-16`}
    />

    {/* Show / Hide button */}
    <button
      type="button"
      onClick={() => setShowPassword((p) => !p)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600 hover:text-gray-900"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>

  {!errors.password && (
    <>
      {/* <div className="flex justify-between mt-2 text-xs text-gray-500">
        <p>Password strength: {strengthLabel}</p>
        <p>{form.password.length}/6</p>
      </div> */}

      {/* <div className="h-2 mt-1 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-[#50c2b4] transition-all"
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div> */}
    </>
  )}
</div>



            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white font-semibold bg-[#50c2b4] hover:bg-[#3fa89c] shadow-md disabled:opacity-60"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-[#2f8f84] hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
