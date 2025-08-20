import React, { useState } from "react";
import "./AdminAddUser.css";  // Import the CSS file

export default function AdminAddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: ""
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [addedUsers, setAddedUsers] = useState([]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(values) {
    const err = {};
    if (!values.name.trim()) err.name = "Name is required.";
    if (!values.email.trim()) err.email = "Email is required.";
    else if (!emailRegex.test(values.email)) err.email = "Invalid email address.";
    if (!values.password) err.password = "Password is required.";
    else if (values.password.length < 6) err.password = "Password must be at least 6 characters.";
    if (!values.address.trim()) err.address = "Address is required.";
    return err;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setSuccessMsg("");
    setServerError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    setServerError("");
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      // ✅ Call backend API (Express + MySQL)
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        // Add newly created user (from backend) to preview list
        const created = {
          id: data.id,
          name: form.name,
          email: form.email,
          address: form.address
        };

        setAddedUsers(prev => [created, ...prev]);
        setSuccessMsg(`User "${created.name}" added successfully.`);
        setForm({ name: "", email: "", password: "", address: "" });
        setErrors({});
      } else {
        setServerError(data.error || "Server error occurred.");
      }
    } catch (err) {
      setServerError(err.message || "Unexpected error while adding user.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-add-user">
      <h2>Admin — Add New User</h2>

      <form className="user-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">
          Name
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
          />
        </label>
        {errors.name && <div className="error">{errors.name}</div>}

        <label htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
          />
        </label>
        {errors.email && <div className="error">{errors.email}</div>}

        <label htmlFor="password" className="password-label">
          Password
          <div className="password-row">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowPassword(s => !s)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        {errors.password && <div className="error">{errors.password}</div>}

        <label htmlFor="address">
          Address
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, City, State, ZIP..."
            rows={3}
          />
        </label>
        {errors.address && <div className="error">{errors.address}</div>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add User"}
          </button>
        </div>

        {serverError && <div className="server-error">Error: {serverError}</div>}
        {successMsg && <div className="success">{successMsg}</div>}
      </form>

      <section className="preview">
        <h3>Recently Added Users (from DB)</h3>
        {addedUsers.length === 0 ? (
          <p>No users added yet.</p>
        ) : (
          <ul>
            {addedUsers.map(u => (
              <li key={u.id}>
                <strong>{u.name}</strong> • {u.email}
                <div className="small">{u.address}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
