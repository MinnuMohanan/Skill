import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { getStoredJson } from "../utils/storage";
import useAuth from "../hooks/useAuth";

const defaultProfileImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const createProfileBackdrop =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
const trustHighlights = ["Clear photo", "Strong skills", "Fast replies"];

const CreateProfile = ({ currentUserId }) => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const storedUser = getStoredJson("currentUser", {});
  const effectiveUserId = currentUserId || storedUser?._id;
  const [form, setForm] = useState({
    name: storedUser.name || "",
    profileImage: storedUser.profileImage || "",
    location: storedUser.location || "",
    skillOffered: storedUser.skillOffered || "",
    skillWanted: storedUser.skillWanted || "",
    availability: storedUser.availability || ""
  });
  const [loading, setLoading] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const previewImage = !imageLoadFailed && form.profileImage ? form.profileImage : defaultProfileImage;

  const summaryCards = [
    {
      title: "Offer",
      value: form.skillOffered || "Add a skill you can teach",
      background: "linear-gradient(160deg, #eff6ff, #dbeafe 55%, #bfdbfe)"
    },
    {
      title: "Goal",
      value: form.skillWanted || "Add a skill you want to learn",
      background: "linear-gradient(160deg, #fff7ed, #ffedd5 55%, #fdba74)"
    }
  ];
  const completionItems = [
    {
      label: "Identity",
      value: form.name ? "Ready" : "Pending"
    },
    {
      label: "Location",
      value: form.location || "Add city"
    },
    {
      label: "Exchange Match",
      value:
        form.skillOffered && form.skillWanted
          ? `${form.skillOffered} -> ${form.skillWanted}`
          : "Add your teach/learn goals"
    }
  ];

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));

    if (key === "profileImage") {
      setImageLoadFailed(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.location || !form.skillOffered || !form.skillWanted || !form.availability) {
      alert("Please complete all required profile fields.");
      return;
    }

    if (!effectiveUserId) {
      alert("Your session has expired. Please sign in again.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.put(`/users/${effectiveUserId}/profile`, form);
      localStorage.setItem("currentUser", JSON.stringify(data));
      setCurrentUser(data);
      localStorage.setItem("onboardingDone", "true");
      alert("Profile saved successfully.");
      navigate("/onboarding-next", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Unable to save your profile right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <section
        className="py-5"
        style={{
          minHeight: "calc(100vh - 88px)",
          background:
            `linear-gradient(180deg, rgba(241,245,255,0.94), rgba(255,255,255,0.92)), radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 26%), radial-gradient(circle at bottom right, rgba(249,115,22,0.14), transparent 24%), url(${createProfileBackdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div
                className="card border-0 shadow-sm p-4 p-lg-5 h-100"
                style={{
                  position: "relative",
                  background:
                    `linear-gradient(180deg, rgba(15,23,42,0.68), rgba(30,41,59,0.36) 52%, rgba(219,234,254,0.24)), url(${createProfileBackdrop})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "#fff"
                }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div className="section-eyebrow mb-2 text-warning">Profile Setup</div>
                  <h2 className="section-title mb-3 text-white">Create Your Learning Identity</h2>
                  <p className="mb-4" style={{ color: "rgba(255,255,255,0.82)" }}>
                    Set a clean photo, your location, and learning goals so your profile
                    looks complete and other users can trust it quickly.
                  </p>

                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {trustHighlights.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-2 rounded-pill"
                        style={{
                          background: "rgba(255,255,255,0.12)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.92rem"
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div
                    className="text-center rounded-4 p-4"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))",
                      border: "1px solid rgba(255,255,255,0.18)",
                      backdropFilter: "blur(12px)"
                    }}
                  >
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "190px",
                        height: "190px",
                        padding: "8px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(191,219,254,0.84), rgba(253,186,116,0.84))",
                        boxShadow: "0 24px 40px rgba(15,23,42,0.28)"
                      }}
                    >
                      <img
                        src={previewImage}
                        alt="Profile preview"
                        onError={() => setImageLoadFailed(true)}
                        className="rounded-circle shadow"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          border: "4px solid rgba(255,255,255,0.92)"
                        }}
                      />
                    </div>

                    <h4 className="fw-bold mb-1">{form.name || "Your Name"}</h4>
                    <p className="mb-0" style={{ color: "rgba(255,255,255,0.76)" }}>
                      {form.location || "Your Location"}
                    </p>
                    <div className="d-flex justify-content-center gap-2 flex-wrap mt-3">
                      <span className="badge bg-primary px-3 py-2">Live Preview</span>
                      <span
                        className="badge px-3 py-2"
                        style={{
                          background: "rgba(255,255,255,0.16)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.18)"
                        }}
                      >
                        Premium Look
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-4 p-4 mt-4"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
                      border: "1px solid rgba(255,255,255,0.14)"
                    }}
                  >
                    <div className="section-eyebrow text-warning mb-2">First Impression</div>
                    <div className="row g-3">
                      {completionItems.map((item) => (
                        <div key={item.label} className="col-12">
                          <div
                            className="d-flex justify-content-between align-items-center rounded-4 px-3 py-3"
                            style={{
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(255,255,255,0.1)"
                            }}
                          >
                            <span style={{ color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>
                              {item.label}
                            </span>
                            <span className="fw-semibold text-white text-end">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row mt-4">
                    {summaryCards.map((item) => (
                      <div key={item.title} className="col-12 mb-3">
                        <div
                          className="rounded-4 p-3"
                          style={{
                            background: item.background,
                            boxShadow: "0 18px 28px rgba(15,23,42,0.12)"
                          }}
                        >
                          <div className="section-eyebrow mb-1">{item.title}</div>
                          <div className="fw-semibold text-dark">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div
                className="card border-0 shadow-sm p-4 p-lg-5"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.97), rgba(248,250,255,0.97) 52%, rgba(224,231,255,0.92))",
                  boxShadow: "0 28px 60px rgba(37,99,235,0.14)"
                }}
              >
                <div className="section-eyebrow mb-2">Personal Details</div>
                <h3 className="fw-bold mb-4">Tell Us About Yourself</h3>
                <p className="text-muted mb-4">
                  A polished profile gets more trust, better replies, and stronger learning matches.
                </p>

                <form onSubmit={handleSubmit}>
                  <div
                    className="rounded-4 p-3 p-md-4 mb-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(219,234,254,0.58), rgba(255,247,237,0.72))",
                      border: "1px solid rgba(59,130,246,0.12)"
                    }}
                  >
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="section-eyebrow mb-1">Tip 1</div>
                        <div className="fw-semibold">Use your real name</div>
                      </div>
                      <div className="col-md-4">
                        <div className="section-eyebrow mb-1">Tip 2</div>
                        <div className="fw-semibold">Add teach + learn skills</div>
                      </div>
                      <div className="col-md-4">
                        <div className="section-eyebrow mb-1">Tip 3</div>
                        <div className="fw-semibold">Keep photo clear and bright</div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input
                        className="form-control"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Location</label>
                      <input
                        className="form-control"
                        placeholder="Enter your location"
                        value={form.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Profile Image URL</label>
                    <input
                      className="form-control"
                      placeholder="Paste image URL for a clear photo"
                      value={form.profileImage}
                      onChange={(e) => handleChange("profileImage", e.target.value)}
                    />
                    <div className="mt-2" style={{ color: "#64748b", fontSize: "0.92rem" }}>
                      Use a direct image link so the live preview displays clearly.
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Skill Offered</label>
                      <input
                        className="form-control"
                        placeholder="What can you teach?"
                        value={form.skillOffered}
                        onChange={(e) => handleChange("skillOffered", e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Skill Wanted</label>
                      <input
                        className="form-control"
                        placeholder="What do you want to learn?"
                        value={form.skillWanted}
                        onChange={(e) => handleChange("skillWanted", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Availability</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={form.availability}
                      onChange={(e) => handleChange("availability", e.target.value)}
                    />
                  </div>

                  <button className="btn btn-warning px-4" disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateProfile;
