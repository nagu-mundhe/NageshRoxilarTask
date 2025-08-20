import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminMainPage.css";

function AdminMainPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-mainpage">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, stores, and view analytics</p>
      </header>

      <div className="cards-container">
        <div className="card add-card" onClick={() => navigate("/admin-add-user")}>
          <div className="card-icon">👤</div>
          <h2>Add User</h2>
          <p>Create new user accounts</p>
        </div>

        <div className="card add-card" onClick={() => navigate("/admin-add-store")}>
          <div className="card-icon">🏪</div>
          <h2>Add Store</h2>
          <p>Register new stores</p>
        </div>

        <div className="card add-card" onClick={() => navigate("/admin-add-admin")}>
          <div className="card-icon">👨‍💼</div>
          <h2>Add Admin</h2>
          <p>Create admin accounts</p>
        </div>

        <div className="card view-card" onClick={() => navigate("/admin-analytics")}>
          <div className="card-icon">📊</div>
          <h2>Analytics</h2>
          <p>View counts and statistics</p>
        </div>

        <div className="card view-card" onClick={() => navigate("/users")}>
          <div className="card-icon">👥</div>
          <h2>All Users</h2>
          <p>View and manage users</p>
        </div>

        <div className="card view-card" onClick={() => navigate("/stores")}>
          <div className="card-icon">🏬</div>
          <h2>All Stores</h2>
          <p>View and manage stores</p>
        </div>
      </div>
    </div>
  );
}

export default AdminMainPage;