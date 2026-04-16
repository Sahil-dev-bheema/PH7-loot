import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Tickets from "./pages/admin/Pools";
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./routes/AdminRoute";

import PlayNow from "./components/PlayNow";
import Footer from "./components/Footer";

import Packages from "./pages/admin/Packages";
import Dashboard from "./pages/admin/Dashboard";
import PackagePayment from "./pages/PackagePayment";
import UserProfile from "./components/UserProfiles/UserProfile";
import AdminProfile from "./pages/admin/AdminProfile";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./features/userSlice"; // adjust path if needed
import UserRoute from "./routes/UserRoute";
import WithdrawlBox from "./pages/admin/withdrawSection/WithdrawlBox.jsx";
import AddToCart from "./components/Carts/AddToCart.jsx";

/* ---------------- Layout ---------------- */
const Layout = () => {
  const location = useLocation();
 const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const hideNavbar = location.pathname.startsWith("/admin");
  const hideFooter = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (user?._id || user?.id) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- User Protected Routes (Redux-based) ---------- */}
        <Route
          path="/playnow"
          element={
            <UserRoute>
              <PlayNow />
            </UserRoute>
          }
        />

        <Route
          path="/purchase"
          element={
            <UserRoute>
              <PackagePayment />
            </UserRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <UserRoute>
              <AddToCart />
            </UserRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <UserRoute>
              <UserProfile />
            </UserRoute>
          }
        />

        {/* ---------- Admin Routes ---------- */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pools" element={<Tickets />} />
          <Route path="packages" element={<Packages />} />
          <Route path="withdrawl" element={<WithdrawlBox />} />
          <Route path="adminprofile" element={<AdminProfile />} />
        </Route>
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
};

/* ---------------- App ---------------- */
const App = () => (
  <BrowserRouter>
    {/* ❌ REMOVED AuthProvider (Redux replaces it) */}

    <Toaster position="top-center" reverseOrder={false} />

    <Layout />
  </BrowserRouter>
);

export default App;