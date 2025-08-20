
import React, { useEffect, useState } from "react";

function AdminAnalytics() {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalStores: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-analytics">
      <h1>Analytics Dashboard</h1>
      <div className="analytics-cards">
        <div className="analytics-card">
          <h2>Total Users</h2>
          <p>{dashboard.totalUsers}</p>
        </div>
        <div className="analytics-card">
          <h2>Total Stores</h2>
          <p>{dashboard.totalStores}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
