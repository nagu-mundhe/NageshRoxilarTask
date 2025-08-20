import React, { useState } from "react";
import "./AdminAddAdmin.css";

export default function AdminAddAdmin() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");
  const [addedAdmins, setAddedAdmins] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(values) {
    const err = {};
    if (!values.name.trim()) err.name = "Name is required.";
    if (!values.email.trim()) err.email = "Email is required.";
    else if (!emailRegex.test(values.email)) err.email = "Invalid email address.";
    if (!values.password) err.password = "Password is required.";
    else if (values.password.length < 6) err.password = "Password must be at least 6 characters.";
    return err;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
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
      const res = await fetch("http://localhost:5000/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add admin");

      const created = { id: data.id, name: form.name, email: form.email };
      setAddedAdmins((prev) => [created, ...prev]);
      setSuccessMsg(data.message);
      setForm({ name: "", email: "", password: "" });
      setErrors({});
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-add-admin">
      <h2>Admin — Add New Admin</h2>

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <label>
          Name
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
          />
        </label>
        {errors.name && <div className="error">{errors.name}</div>}

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
          />
        </label>
        {errors.email && <div className="error">{errors.email}</div>}

        <label>
          Password
          <div className="password-row">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        {errors.password && <div className="error">{errors.password}</div>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Admin"}
          </button>
        </div>

        {serverError && <div className="server-error">{serverError}</div>}
        {successMsg && <div className="success">{successMsg}</div>}
      </form>

      <section className="preview">
        <h3>Recently Added Admins</h3>
        {addedAdmins.length === 0 ? (
          <p>No admins added yet.</p>
        ) : (
          <ul>
            {addedAdmins.map((a) => (
              <li key={a.id}>
                <strong>{a.name}</strong> • {a.email}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
