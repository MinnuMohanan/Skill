import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import NextStepPanel from "../components/NextStepPanel";
import { getStoredJson } from "../utils/storage";

const Profile = () => {
  const currentUser = getStoredJson("currentUser");
  const currentUserId = currentUser?._id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/users/${currentUserId}`);
        setUser(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUserId]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <h4>Loading profile...</h4>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5 text-center">
          <h4 className="text-danger">Profile not found</h4>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(220,252,231,0.82), rgba(255,255,255,0.42))"
        }}
      >
        <div className="container">
          <div className="card border-0 shadow-sm overflow-hidden mb-4">
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80"
                alt="Profile banner"
                style={{ width: "100%", height: "220px", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(17,24,39,0.8), rgba(17,24,39,0.25))",
                  display: "flex",
                  alignItems: "end",
                  padding: "1.25rem",
                  color: "#fff"
                }}
              >
                <div>
                  <div className="section-eyebrow text-warning mb-1">Professional Identity</div>
                  <h5 className="fw-bold mb-0">Build trust with a complete and clear profile</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 p-4 p-lg-5">
            <div className="row align-items-center">
              <div className="col-lg-4 text-center mb-4 mb-lg-0">
                <img
                  src={
                    user.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={user.name}
                  className="rounded-circle mx-auto shadow"
                  style={{
                    width: "160px",
                    height: "160px",
                    objectFit: "cover",
                    border: "5px solid #fff"
                  }}
                />

                <h2 className="fw-bold mt-4 mb-1">{user.name}</h2>
                <p className="text-muted mb-0">{user.email}</p>
                <span className="badge bg-success mt-3 px-3 py-2">My Profile</span>
              </div>

              <div className="col-lg-8">
                <div className="row mb-1">
                  <div className="col-md-4 mb-3">
                    <div className="rounded-4 p-3 bg-light h-100">
                      <div className="section-eyebrow mb-1">Skill Offered</div>
                      <div className="fw-semibold">{user.skillOffered || "Not set"}</div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="rounded-4 p-3 bg-light h-100">
                      <div className="section-eyebrow mb-1">Skill Wanted</div>
                      <div className="fw-semibold">{user.skillWanted || "Not set"}</div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="rounded-4 p-3 bg-light h-100">
                      <div className="section-eyebrow mb-1">Availability</div>
                      <div className="fw-semibold">{user.availability || "Not set"}</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm p-4 h-100">
                      <div className="section-eyebrow mb-2">Personal Info</div>
                      <h4 className="fw-bold mb-3">Profile Details</h4>

                      <p><strong>Location:</strong> {user.location || "Not added"}</p>
                      <p className="mb-0">
                        <strong>Availability:</strong> {user.availability || "Not added"}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm p-4 h-100">
                      <div className="section-eyebrow mb-2">Skill Focus</div>
                      <h4 className="fw-bold mb-3">Learning Details</h4>

                      <p><strong>Skill Offered:</strong> {user.skillOffered || "Not added"}</p>
                      <p className="mb-0">
                        <strong>Skill Wanted:</strong> {user.skillWanted || "Not added"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm p-4">
                  <div className="section-eyebrow mb-2">Growth Journey</div>
                  <h4 className="fw-bold mb-3">Why Your Profile Matters</h4>
                  <p className="text-muted mb-0">
                    A complete profile helps others understand your strengths,
                    interests, and availability, making it easier to connect,
                    exchange knowledge, and create meaningful learning opportunities.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <Link to="/create-profile" className="btn btn-warning px-4">
                Edit Profile
              </Link>
            </div>
          </div>

          <NextStepPanel
            title="Profile ready? Start your next exchange"
            description="A complete profile improves trust. Now browse skills and send your next learning request."
            primaryTo="/browse"
            primaryLabel="Browse Skills"
            secondaryTo="/requests"
            secondaryLabel="Open Requests"
          />
        </div>
      </section>
    </div>
  );
};

export default Profile;
