// src/StoreUser/StoreUserMainPage.jsx
import React, { useEffect, useState } from "react";
import "./StoreUserMainPage.css";

function StoreUserMainPage({ onLogout }) {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with the store owner's email stored in localStorage after login
  const storeOwnerEmail = localStorage.getItem("storeOwnerEmail");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/stores?owner=${storeOwnerEmail}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (!data || data.length === 0) throw new Error("Store not found for this user");

        setStoreData(data[0]); // assuming API returns an array of stores
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeOwnerEmail]);

  if (loading) return <div className="loading">Loading store data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const ratings = storeData.ratings || [];
  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : "N/A";

  return (
    <div className="store-dashboard-container">
      <div className="header">
        <h1>Welcome, {storeData.name || "Store Owner"}</h1>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="store-info">
        <p>
          <strong>Store Name:</strong> {storeData.name}
        </p>
        <p>
          <strong>Address:</strong> {storeData.address}
        </p>
        <p>
          <strong>Average Rating:</strong> {averageRating}⭐
        </p>
      </div>

      <div className="ratings-section">
        <h2>User Ratings</h2>
        {ratings.length === 0 ? (
          <p>No ratings submitted yet.</p>
        ) : (
          <table className="ratings-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r, index) => (
                <tr key={index}>
                  <td>{r.user}</td>
                  <td>{r.rating}⭐</td>
                  <td>{r.review || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StoreUserMainPage;
