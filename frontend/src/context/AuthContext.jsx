import React, { useState } from "react";
import { AuthContext } from "./auth-context";
import { getStoredJson } from "../utils/storage";

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => getStoredJson("currentUser"));
  const [adminUser, setAdminUser] = useState(() => getStoredJson("adminUser"));

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("onboardingDone");
    setCurrentUser(null);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        adminUser,
        setAdminUser,
        logoutUser,
        logoutAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
