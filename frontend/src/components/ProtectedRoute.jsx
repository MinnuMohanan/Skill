import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStoredJson } from "../utils/storage";

const isProfileComplete = (user) => {
  if (!user) return false;
  return Boolean(
    String(user.name || "").trim() &&
      String(user.location || "").trim() &&
      String(user.skillOffered || "").trim() &&
      String(user.skillWanted || "").trim() &&
      String(user.availability || "").trim()
  );
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const currentUserRaw = localStorage.getItem("currentUser");

  if (!token || !currentUserRaw) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = getStoredJson("currentUser");

  if (!currentUser) {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("onboardingDone");
    return <Navigate to="/login" replace />;
  }

  const profileComplete = isProfileComplete(currentUser);

  if (!profileComplete && location.pathname !== "/create-profile") {
    return <Navigate to="/create-profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
