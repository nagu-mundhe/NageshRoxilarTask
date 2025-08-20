import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import StoreDetails from "./User/StoreDetails";
import StoreUserMainPage from "./StoreUser/StoreUserMainPage";


import AdminMainPage from "./Admin/AdminMainPage";
import AdminAddUser from "./Admin/AdminAddUser";
import AdminAddStore from "./Admin/AdminAddStore";
import AdminAddAdmin from "./Admin/AdminAddAdmin";
import AdminAnalytics from "./Admin/AdminAnalytics";
import AllUsers from "./Admin/AllUsers";
import AllStores from "./Admin/AllStores";

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("loggedInRole");
    if (savedRole) setUserRole(savedRole);
  }, []);

  const handleLogin = (role) => setUserRole(role);

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem("loggedInRole");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !userRole ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate
                to={
                  userRole === "admin"
                    ? "/admin-main"
                    : userRole === "store"
                    ? "/store-main"
                    : "/user/store-details"
                }
                replace
              />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />

        
        <Route path="/admin-main" element={userRole === "admin" ? <AdminMainPage onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/admin-add-user" element={userRole === "admin" ? <AdminAddUser onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/admin-add-store" element={userRole === "admin" ? <AdminAddStore onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/admin-add-admin" element={userRole === "admin" ? <AdminAddAdmin onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/admin-analytics" element={userRole === "admin" ? <AdminAnalytics onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/users" element={userRole === "admin" ? <AllUsers onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/stores" element={userRole === "admin" ? <AllStores onLogout={handleLogout} /> : <Navigate to="/login" replace />} />

        
        <Route path="/user/store-details" element={userRole === "user" ? <StoreDetails onLogout={handleLogout} /> : <Navigate to="/login" replace />} />

       
        <Route path="/store-main" element={userRole === "store" ? <StoreUserMainPage onLogout={handleLogout} /> : <Navigate to="/login" replace />} />

        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
