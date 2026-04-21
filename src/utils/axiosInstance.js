import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.29.233:3000/api",
 
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    let token = "";

    // ✅ ADMIN APIs (ONLY /admin)
    if (url.startsWith("/admin")) {
      token = localStorage.getItem("admin_token");
    }
    // ✅ USER APIs (everything else)
    else {
      token =
        localStorage.getItem("user_token") ||
        localStorage.getItem("token");
    }

    // ✅ sanitize token
    token = String(token || "")
      .replace(/^"|"$/g, "")
      .replace(/^Bearer\s+/i, "");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAdminApi = url.startsWith("/admin");

    if (status === 401) {
      console.warn("⚠️ 401 Unauthorized:", url);

      const message =
        error.response?.data?.message?.toLowerCase() || "";

      // ✅ ONLY logout if token is truly invalid/expired
      const shouldLogout =
        message.includes("invalid token") ||
        message.includes("token expired") ||
        message.includes("unauthorized");

      if (shouldLogout) {
        console.warn("🔒 Logging out due to invalid/expired token");

        if (isAdminApi) {
          localStorage.removeItem("adminUser");
          localStorage.removeItem("admin_token");
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("user_token");
          localStorage.removeItem("token");
          localStorage.removeItem("bonus");
        }

        window.dispatchEvent(new Event("authChanged"));
      } else {
        // ❗ DO NOT logout for normal 401 (timing / race issues)
        console.warn("⏸ Skipping logout (likely early request or timing issue)");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
