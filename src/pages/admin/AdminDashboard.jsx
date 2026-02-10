// src/pages/admin/AdminDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const adminUser = JSON.parse(localStorage.getItem("adminUser")) || {
    name: "Admin",
    role: "Administrator",
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("adminUser");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/admin", { replace: true });
  };

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300
        ${collapsed ? "md:ml-20" : "md:ml-64"} ml-0`}
      >
        {/* 🔹 Top Admin Header */}
        <div className="  px-4 py-3 flex justify-end">
          <div className="relative" ref={dropdownRef}>
            {/* Avatar */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 focus:outline-none"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${adminUser.name}&background=2563eb&color=fff`}
                alt="Admin Avatar"
                className="w-10 h-10 rounded-full border"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {adminUser.name}
                </p>
                <p className="text-xs text-gray-500">{adminUser.role}</p>
              </div>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-red-600 font-medium hover:bg-red-50 transition"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
