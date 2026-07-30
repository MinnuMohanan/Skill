import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setAdminUser } = useAuth();
  const highlights = [
    {
      title: "Teach What You Know",
      description: "Share your expertise with people who want to learn.",
      background: "linear-gradient(160deg, #fff7ed, #ffedd5 55%, #fdba74)"
    },
    {
      title: "Learn What You Need",
      description: "Find practical help through direct skill exchange.",
      background: "linear-gradient(160deg, #ecfeff, #ccfbf1 55%, #99f6e4)"
    }
  ];
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim()
    };

    if (!payload.name || !payload.email || !payload.password) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const { data } = await api.post("/register", payload);

      localStorage.setItem("user", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setCurrentUser(data.user);
      setAdminUser(null);
      localStorage.removeItem("onboardingDone");

      alert("Account created successfully.");
      navigate("/create-profile", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Unable to create your account right now.");
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
            "linear-gradient(180deg, rgba(255,247,237,0.76), rgba(255,255,255,0.16)), radial-gradient(circle at top left, rgba(251,146,60,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(45,212,191,0.16), transparent 24%)"
        }}
      >
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div
                className="card border-0 shadow-sm p-4 p-lg-5"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.96), rgba(255,247,237,0.97) 56%, rgba(254,215,170,0.68))"
                }}
              >
                <div className="section-eyebrow mb-2">Join SkillSwap</div>
                <h1 className="section-title mb-3">Create Your Account</h1>
                <p className="text-muted mb-4">
                  Start your profile, share your strengths, discover new skills,
                  and become part of a collaborative learning community.
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

            <div className="col-lg-7">
              <div
                className="card border-0 shadow-sm p-4 p-lg-5 mx-auto"
                style={{
                  maxWidth: "620px",
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.96), rgba(236,253,245,0.96) 58%, rgba(153,246,228,0.42))"
                }}
              >
                <div className="section-eyebrow mb-2">Registration</div>
                <h3 className="fw-bold mb-4">Get Started</h3>

                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      className="form-control"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                  </div>

                  <button className="btn btn-warning w-100" type="submit">
                    Register
                  </button>
                </form>

                <p className="mt-4 mb-0 text-muted text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="fw-semibold">
                    Login here
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

export default Register;
