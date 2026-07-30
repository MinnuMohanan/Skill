import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import useAuth from "../hooks/useAuth";

const isProfileComplete = (user) =>
  Boolean(
    String(user?.name || "").trim() &&
      String(user?.location || "").trim() &&
      String(user?.skillOffered || "").trim() &&
      String(user?.skillWanted || "").trim() &&
      String(user?.availability || "").trim()
  );

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setAdminUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const highlights = [
    {
      title: "Real Collaboration",
      description: "Chat, video calls, and scheduling in one place.",
      background: "linear-gradient(160deg, #eff6ff, #dbeafe 55%, #bfdbfe)"
    },
    {
      title: "Smart Learning Flow",
      description: "Discover skills, connect with peers, and grow faster.",
      background: "linear-gradient(160deg, #fff7ed, #ffedd5 55%, #fdba74)"
    }
  ];

  const handleLogin = async () => {
    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const { data } = await api.post("/login", {
        email: normalizedEmail,
        password: normalizedPassword
      });

      localStorage.setItem("user", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setCurrentUser(data.user);
      setAdminUser(null);

      if (!isProfileComplete(data.user)) {
        localStorage.removeItem("onboardingDone");
      }

      alert("Signed in successfully.");
      navigate(isProfileComplete(data.user) ? "/activity" : "/create-profile", {
        replace: true
      });
    } catch (error) {
      alert(error.response?.data?.message || "Unable to sign in right now.");
    }
  };

  return (
    <div>
      <Navbar />

      <section
        className="py-5 d-flex align-items-center"
        style={{
          minHeight: "calc(100vh - 88px)",
          background:
            "linear-gradient(180deg, rgba(219,234,254,0.72), rgba(255,255,255,0.16)), radial-gradient(circle at top left, rgba(96,165,250,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(251,146,60,0.16), transparent 24%)"
        }}
      >
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div
                className="card border-0 shadow-sm p-4 p-lg-5"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.94), rgba(239,246,255,0.96) 58%, rgba(219,234,254,0.98))"
                }}
              >
                <div className="section-eyebrow mb-2">Welcome Back</div>
                <h1 className="section-title mb-3">Continue Your Skill Journey</h1>
                <p className="text-muted mb-4">
                  Sign in to manage requests, connect with learners, and continue
                  your skill exchange experience.
                </p>

                <div className="d-flex flex-column gap-3">
                  {highlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-4 p-3"
                      style={{ background: item.background }}
                    >
                      <h6 className="fw-bold mb-1">{item.title}</h6>
                      <p className="text-muted mb-0">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="card border-0 shadow-sm p-4 p-lg-5 mx-auto"
                style={{
                  maxWidth: "520px",
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.96), rgba(255,247,237,0.96) 60%, rgba(254,215,170,0.55))"
                }}
              >
                <div className="section-eyebrow mb-2">User Login</div>
                <h3 className="fw-bold mb-4">Sign In</h3>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                  />
                </div>

                <button className="btn btn-primary w-100" onClick={handleLogin}>
                  Login
                </button>

                <p className="mt-4 mb-0 text-muted text-center">
                  Need another account?{" "}
                  <Link to="/register" className="fw-semibold">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
