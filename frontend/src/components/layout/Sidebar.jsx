import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">AME ERP</div>

      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/billing"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Billing
        </NavLink>

        <NavLink
          to="/hold-bills"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Hold Bills
        </NavLink>

        <NavLink
          to="/bills"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Bills History
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Customers
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/due-report"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Due Report
        </NavLink>

        <div className="sidebar-section">Reports</div>

        <NavLink
          to="/daily-report"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Daily Report
        </NavLink>

        <NavLink
          to="/range-report"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Range Report
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
