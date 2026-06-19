import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";

import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await loginUser({
        mobile,
        password,
      });

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>AME ERP</h1>
        </div>

        <p className="login-subtitle">
          Inventory, Billing & Customer Management System
        </p>

        <form onSubmit={handleLogin}>
          <div className="login-group">
            <label className="login-label">Mobile Number</label>

            <input
              type="text"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="login-group">
            <label className="login-label">Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <div className="login-footer">© 2026 A M Enterprises</div>
      </div>
    </div>
  );
}

export default LoginPage;
