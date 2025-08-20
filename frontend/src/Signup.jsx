import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './styles.css';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ name, email, address, password, role });
    localStorage.setItem("users", JSON.stringify(users));

    alert(`Account created for ${name} (${role})`);
    navigate("/login");
  };

  return (
    <div className="app-fullscreen">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="store">Store Owner</option>
          </select>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            maxLength={400}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$"
            title="8-16 chars, 1 uppercase & 1 special char"
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
