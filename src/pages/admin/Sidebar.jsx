// src/pages/admin/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { TbPackages } from "react-icons/tb";

import {
  MdOutlinePostAdd,
  MdOutlineMail,
  MdDashboard,
  MdChevronLeft,
  MdChevronRight,
  MdPayments,
} from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <MdDashboard className="h-6 w-6" />,
  },
  {
    name: "Pools",
    path: "/admin/pools",
    icon: <MdOutlinePostAdd className="h-6 w-6" />,
  },

  {
    name: "Packages",
    path: "/admin/packages", // ✅ FIXED
    icon: <TbPackages className="h-6 w-6" />,
  },
  {
    name: "Settings",
    path: "/admin/settings", // ✅ FIXED
    icon: <IoSettingsSharp className="h-6 w-6" />,
  },
];


const Sidebar = ({ collapsed, setCollapsed }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* ✅ Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-black text-[#F0B100] px-3 py-2 rounded-lg"
        onClick={() => setIsMobileOpen(true)}
      >
        ☰
      </button>

      {/* ✅ Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#50c2b4] text-black z-40
          transition-all duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${collapsed ? "md:w-20" : "md:w-64"}
          w-64
        `}
      >

        {/* ✅ Desktop Toggle */}
        <button
          className="
    hidden md:flex absolute -right-3 top-6
    bg-[#ff9800] text-black
    rounded-full p-1 shadow-lg
    hover:scale-105 transition
  "
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MdChevronRight size={30} /> : <MdChevronLeft size={30} />}
        </button>


        {/* ✅ Logo / Title */}
        <div className="h-[70px] flex items-center px-4 border-b border-black/20">
          <Link
            to="/admin/dashboard"
            className="flex items-center font-extrabold tracking-wide"
          >
            {collapsed ? (
              <span className="text-2xl">
                pH7
              </span>
            ) : (
              <span className="text-3xl">
                pH7<span className="text-[#ff9800]">Loot</span>
              </span>
            )}
          </Link>
        </div>


        {/* ✅ Menu */}
        <nav className="mt-4 px-2 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `
    flex items-center gap-3 rounded-lg px-3 py-2
    font-semibold transition-all duration-200
    ${isActive
                  ? "bg-[#ff9800] text-black"
                  : "text-black/80 hover:bg-[#ff9800] hover:text-black"
                }
  `
              }
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </NavLink>

          ))}
        </nav>
      </aside>

      {/* ✅ Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
