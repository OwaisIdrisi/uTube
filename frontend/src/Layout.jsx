import { Outlet } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import { useState } from "react";
import { Sidebar } from "./components/shared/Sidebar";

function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar setCollapsed={setCollapsed} setMobileOpen={setMobileOpen} />
      <div className="flex flex-1">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main content */}
        <main className={`flex flex-1`}>
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer>
        <p className="text-sm text-gray-500">© 2025 My Practice App</p>
      </footer>
    </div>
  );
}

export default Layout;
