import React, { useState } from "react";
import "./AdminAddStore.css";

export default function AdminAddStore() {
  const [form, setForm] = useState({ name: "", email: "", address: "", rating: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");
  const [addedStores, setAddedStores] = useState([]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(values) {
    const err = {};
    if (!values.name.trim()) err.name = "Store name is required.";
    if (!values.email.trim()) err.email = "Email is required.";
    else if (!emailRegex.test(values.email)) err.email = "Invalid email address.";
    if (!values.address.trim()) err.address = "Address is required.";
    if (!values.rating.trim()) err.rating = "Rating is required.";
    else if (isNaN(values.rating) || values.rating < 0 || values.rating > 5)
      err.rating = "Rating must be a number between 0 and 5.";
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
      const res = await fetch("http://localhost:5000/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add store");

      const created = {
        id: data.id,
        name: form.name,
        email: form.email,
        address: form.address,
        rating: form.rating,
      };

      setAddedStores((prev) => [created, ...prev]);
      setSuccessMsg(data.message);
      setForm({ name: "", email: "", address: "", rating: "" });
      setErrors({});
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-add-store">
      <h2>Admin — Add New Store</h2>

      <form className="store-form" onSubmit={handleSubmit} noValidate>
        <label>
          Store Name
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Store name"
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
            placeholder="store@example.com"
          />
        </label>
        {errors.email && <div className="error">{errors.email}</div>}

        <label>
          Address
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, City, State, ZIP..."
            rows={3}
          />
        </label>
        {errors.address && <div className="error">{errors.address}</div>}

        <label>
          Rating
          <input
            name="rating"
            type="number"
            value={form.rating}
            onChange={handleChange}
            placeholder="0-5"
            step="0.1"
            min="0"
            max="5"
          />
        </label>
        {errors.rating && <div className="error">{errors.rating}</div>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Store"}
          </button>
        </div>

        {serverError && <div className="server-error">Error: {serverError}</div>}
        {successMsg && <div className="success">{successMsg}</div>}
      </form>

      <section className="preview">
        <h3>Recently Added Stores</h3>
        {addedStores.length === 0 ? (
          <p>No stores added yet.</p>
        ) : (
          <ul>
            {addedStores.map((s) => (
              <li key={s.id}>
                <strong>{s.name}</strong> • {s.email}
                <div className="small">{s.address}</div>
                <div className="small">Rating: {s.rating}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
