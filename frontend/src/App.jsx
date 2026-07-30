import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import Requests from "./pages/Requests";
import CreateProfile from "./pages/CreateProfile";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import AddSkill from "./pages/AddSkill";
import Profile from "./pages/Profile";
import ComplaintRegister from "./pages/ComplaintRegister";
import OnboardingNext from "./pages/OnboardingNext";

import AdminLogin from "./pages/adminpanel/AdminLogin";
import AdminDashboard from "./pages/adminpanel/AdminDashboard";

import VideoCall from "./components/VideoCall";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import useAuth from "./hooks/useAuth";

const AppRoutes = () => {
  const { currentUser, adminUser } = useAuth();
  const currentUserId = currentUser?._id;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/activity" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/activity" replace /> : <Register />}
        />
        <Route
          path="/admin-login"
          element={adminUser ? <Navigate to="/admin-dashboard" replace /> : <AdminLogin />}
        />

        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <Browse currentUserId={currentUserId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Dashboard currentUserId={currentUserId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests currentUserId={currentUserId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-profile"
          element={
            <ProtectedRoute>
              <CreateProfile currentUserId={currentUserId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/onboarding-next"
          element={
            <ProtectedRoute>
              <OnboardingNext />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-skill"
          element={
            <ProtectedRoute>
              <AddSkill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <Chat currentUserId={currentUserId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <ComplaintRegister />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <ComplaintRegister />
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard" element={<Navigate to="/activity" replace />} />

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;

