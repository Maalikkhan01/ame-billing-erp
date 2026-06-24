import { NavLink } from "react-router-dom";
import { FiHome, FiFileText, FiBox, FiUsers, FiMenu } from "react-icons/fi";

import "./MobileBottomNav.css";

function MobileBottomNav() {
  return (
    <div className="mobile-nav">
      <NavLink to="/dashboard">
        <FiHome />
      </NavLink>

      <NavLink to="/billing">
        <FiFileText />
      </NavLink>

      <NavLink to="/products">
        <FiBox />
      </NavLink>

      <NavLink to="/customers">
        <FiUsers />
      </NavLink>

      <NavLink to="/due-report">
        <FiMenu />
      </NavLink>
    </div>
  );
}

export default MobileBottomNav;
