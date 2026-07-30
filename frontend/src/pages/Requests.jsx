import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReceivedRequests from "../components/ReceivedRequests";
import SentRequests from "../components/SentRequest";
import NextStepPanel from "../components/NextStepPanel";

const Requests = ({ currentUserId }) => {
  const [activeTab, setActiveTab] = useState("sent");

  return (
    <div>
      <Navbar />

      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(254,226,226,0.82), rgba(255,255,255,0.42))",
          minHeight: "calc(100vh - 88px)"
        }}
      >
        <div className="container">
          <div className="card border-0 shadow-sm overflow-hidden mb-4">
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=80"
                alt="Requests banner"
                style={{ width: "100%", height: "220px", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(17,24,39,0.8), rgba(17,24,39,0.3))",
                  display: "flex",
                  alignItems: "end",
                  padding: "1.25rem",
                  color: "#fff"
                }}
              >
                <div>
                  <div className="section-eyebrow text-warning mb-1">Request Control</div>
                  <h5 className="fw-bold mb-0">Review, accept, and continue your exchanges</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4 p-lg-5 mb-5 text-center">
            <div className="section-eyebrow mb-2">Skill Exchange Flow</div>
            <h2 className="section-title mb-3">Manage Your Requests</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "760px" }}>
              Sent requests are the ones you have submitted. Received requests are
              the ones others sent to you.
            </p>
          </div>

          <div className="card border-0 shadow-sm p-3 p-md-4 mb-4">
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button
                className={`btn px-4 ${
                  activeTab === "sent" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setActiveTab("sent")}
              >
                Sent Requests
              </button>

              <button
                className={`btn px-4 ${
                  activeTab === "received" ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => setActiveTab("received")}
              >
                Received Requests
              </button>
            </div>

            <div className="d-flex justify-content-center mt-3">
              <Link to="/support" className="btn btn-outline-danger btn-sm">
                Need help? Register a complaint
              </Link>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-3 p-md-4">
            {activeTab === "sent" ? (
              <SentRequests currentUserId={currentUserId} />
            ) : (
              <ReceivedRequests currentUserId={currentUserId} />
            )}
          </div>

          <NextStepPanel
            title="Accepted request? Continue with conversation"
            description="After approval, move to chat or video and complete your skill exchange smoothly."
            primaryTo="/activity"
            primaryLabel="Go to Dashboard"
            secondaryTo="/browse"
            secondaryLabel="Find More Skills"
          />
        </div>
      </section>
    </div>
  );
};

export default Requests;
