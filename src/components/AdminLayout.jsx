import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/admin/Sidebar"

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      

      <main
        className={`min-h-screen w-full transition-all duration-300
          ${collapsed ? "md:ml-20" : "md:ml-64"}
          ml-0
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
