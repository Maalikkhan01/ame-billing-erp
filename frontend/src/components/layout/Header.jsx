import { useNavigate } from "react-router-dom";

import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="app-header no-print">
      <div className="header-left">
        <h2>AME ERP</h2>

        <span className="owner-badge">OWNER</span>
      </div>

      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
