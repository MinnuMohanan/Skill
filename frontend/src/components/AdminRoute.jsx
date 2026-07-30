import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  const isAdmin = localStorage.getItem("admin") === "true";

  if (!adminToken || !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;
