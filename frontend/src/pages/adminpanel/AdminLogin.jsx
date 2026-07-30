import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import SkillSwapLogo from "../../components/SkillSwapLogo";
import useAuth from "../../hooks/useAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setAdminUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      alert("Please enter the admin email and password.");
      return;
    }

    try {
      const { data } = await api.post("/admin/login", {
        email: normalizedEmail,
        password: normalizedPassword
      });

      localStorage.setItem("admin", "true");
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("onboardingDone");
      setAdminUser(data.admin);
      setCurrentUser(null);

      navigate("/admin-dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Unable to sign in to the admin panel right now.");
    }
  };

  return (
    <section
      className="py-5 d-flex align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(29, 78, 216, 0.12), transparent 28%), radial-gradient(circle at bottom right, rgba(217, 119, 6, 0.14), transparent 24%), #f6f3ee"
      }}
    >
      <div className="container">
        <div className="card border-0 shadow-sm p-4 p-lg-5 mx-auto" style={{ maxWidth: "560px" }}>
          <div className="d-flex justify-content-center mb-4">
            <SkillSwapLogo compact />
          </div>

          <div className="text-center mb-4">
            <div className="section-eyebrow mb-2">Admin Access</div>
            <h2 className="fw-bold mb-2">SkillSwap Control Panel</h2>
            <p className="text-muted mb-0">
              Sign in to manage platform activity, users, skills, and requests.
            </p>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Admin Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Admin Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdminLogin();
                }
              }}
            />
          </div>

          <button className="btn btn-dark w-100" onClick={handleAdminLogin}>
            Login as Admin
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
