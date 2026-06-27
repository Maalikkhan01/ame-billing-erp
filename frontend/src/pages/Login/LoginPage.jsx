import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

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
          <h1>A M</h1>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-group">
            <label className="login-label">Mobile Number</label>

            <FormField
              type="text"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div className="login-group">
            <label className="login-label">Password</label>

            <FormField
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="login-submit-btn">
            {loading ? "Logging In..." : "Login"}
          </Button>
        </form>

        <div className="login-footer">© 2026 A M </div>
      </div>
    </div>
  );
}

export default LoginPage;
