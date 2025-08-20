import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './styles.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    
    if (role === "admin" && trimmedUsername === "admin@gmail.com" && trimmedPassword === "admin123") {
      onLogin("admin");
      navigate("/admin-main", { replace: true });
      return;
    }

    
    const user = users.find(
      (u) =>
        u.email === trimmedUsername &&
        u.password === trimmedPassword &&
        u.role === role
    );

    if (user) {
      onLogin(role);
      
      if (role === "user") navigate("/user/store-details", { replace: true });
      else if (role === "store") navigate("/store-main", { replace: true });
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="app-fullscreen">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="store">Store Owner</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: "93%", paddingRight: "40px" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "#4f46e5"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        {role !== "admin" && (
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
