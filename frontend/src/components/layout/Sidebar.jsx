import { NavLink } from "react-router-dom";

function Sidebar({ mobileOpen, closeSidebar }) {
  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-header">AME ERP</div>

      <nav className="sidebar-menu">
        <NavLink
          onClick={closeSidebar}
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/billing"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Billing
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/hold-bills"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Hold Bills
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/bills"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Bills History
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/customers"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Customers
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/products"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Products
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/due-report"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Due Report
        </NavLink>

        <div className="sidebar-section">Reports</div>

        <NavLink
          onClick={closeSidebar}
          to="/daily-report"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Daily Report
        </NavLink>

        <NavLink
          onClick={closeSidebar}
          to="/range-report"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Range Report
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Settings
        </NavLink>

        <NavLink
          to="/security"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Security Center
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
