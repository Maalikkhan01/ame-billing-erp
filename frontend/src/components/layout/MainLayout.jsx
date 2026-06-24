import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";

import "./layout.css";

function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

const hideBottomNav =
  location.pathname.startsWith("/invoice");
  return (
    <div className="main-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        closeSidebar={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div className="layout-content">
        <Header openSidebar={() => setMobileOpen(true)} />

        <div className="page-content">{children}</div>
      </div>

      {!hideBottomNav && <MobileBottomNav />}
    </div>
  );
}

export default MainLayout;
