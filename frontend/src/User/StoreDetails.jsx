
import React, { useEffect, useState } from "react";
import "./StoreDetails.css";

function StoreDetails({ onLogout }) {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stores");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid stores data");
        setStores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleRatingChange = (storeId, rating) => {
    if (rating < 1 || rating > 5) return;
    setUserRatings((prev) => ({ ...prev, [storeId]: rating }));
  };

  if (loading) return <div className="loading">Loading stores...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="store-details-container">
      <div className="header">
        <h1>All Stores ({stores.length})</h1>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <table className="stores-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Submit / Modify Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => {
              const storeId = store._id || store.id || store.name;
              const overallRating =
                store.rating !== undefined && !isNaN(store.rating)
                  ? `${Number(store.rating).toFixed(1)}⭐`
                  : "N/A";
              const userRating = userRatings[storeId] ? `${userRatings[storeId]}⭐` : "Not rated";

              return (
                <tr key={storeId}>
                  <td>{store.name || "Unnamed Store"}</td>
                  <td>{store.address || "N/A"}</td>
                  <td>{overallRating}</td>
                  <td>{userRating}</td>
                  <td>
                    <select
                      value={userRatings[storeId] || ""}
                      onChange={(e) => handleRatingChange(storeId, Number(e.target.value))}
                    >
                      <option value="">Rate 1-5</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StoreDetails;