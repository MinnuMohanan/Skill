import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  if (isAdminPage) {
    return null;
  }

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #111827, #1f2937)",
        color: "#fff",
        marginTop: "48px"
      }}
    >
      <div className="container py-5">
        <div className="row g-4 align-items-start">
          <div className="col-lg-5">
            <div className="section-eyebrow text-warning mb-2">SkillSwap</div>
            <h4 className="fw-bold mb-3">Learn, Exchange, And Grow Together</h4>
            <p style={{ color: "rgba(255,255,255,0.72)", maxWidth: "460px" }}>
              SkillSwap connects people through practical learning, meaningful
              conversations, and real skill exchange experiences.
            </p>
          </div>

          <div className="col-sm-6 col-lg-3">
            <h6 className="fw-bold mb-3">Explore</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/" style={{ color: "rgba(255,255,255,0.72)" }}>
                Home
              </Link>
              <Link to="/about" style={{ color: "rgba(255,255,255,0.72)" }}>
                About
              </Link>
              <Link to="/browse" style={{ color: "rgba(255,255,255,0.72)" }}>
                Browse Skills
              </Link>
            </div>
          </div>

          <div className="col-sm-6 col-lg-4">
            <h6 className="fw-bold mb-3">Platform Focus</h6>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-light text-dark">AI Recommendations</span>
              <span className="badge bg-light text-dark">Chat</span>
              <span className="badge bg-light text-dark">Video Call</span>
              <span className="badge bg-light text-dark">Certificates</span>
            </div>
          </div>
        </div>

        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 pt-4 mt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <small style={{ color: "rgba(255,255,255,0.58)" }}>
            {"© 2026 SkillSwap. Built for collaborative learning."}
          </small>
          <small style={{ color: "rgba(255,255,255,0.58)" }}>
            {"Connect • Exchange • Grow"}
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
