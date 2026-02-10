import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const titleMap = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/users": "Users",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    navigate("/admin/login", { replace: true });
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const title = titleMap[location.pathname] || "Admin";

  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-4">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <span>Admin</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg overflow-hidden">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/admin/profile");
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/admin/settings");
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </button>

            <hr />

            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
