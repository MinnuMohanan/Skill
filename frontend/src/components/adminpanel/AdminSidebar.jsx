import React from "react";
import SkillSwapLogo from "../SkillSwapLogo";

const AdminSidebar = ({ onLogout, onNavigate, activeSection = "overview" }) => {
  const items = [
    {
      id: "overview",
      title: "Dashboard Overview",
      description: "View overall platform insights"
    },
    {
      id: "users",
      title: "Users",
      description: "Monitor user registrations and profiles"
    },
    {
      id: "skills",
      title: "Skills",
      description: "Track skill categories and uploads"
    },
    {
      id: "requests",
      title: "Requests",
      description: "Review exchange requests and statuses"
    },
    {
      id: "feedback",
      title: "Feedback",
      description: "Understand user satisfaction and growth"
    },
    {
      id: "complaints",
      title: "Complaints",
      description: "Resolve user-reported issues quickly"
    }
  ];

  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{
        minHeight: "100vh",
        width: "280px",
        background: "linear-gradient(180deg, #111827 0%, #1f2937 100%)",
        color: "#fff",
        padding: "28px 22px",
        boxShadow: "12px 0 30px rgba(17, 24, 39, 0.12)"
      }}
    >
      <div>
        <div className="mb-4">
          <SkillSwapLogo compact />
        </div>

        <div
          className="rounded-4 p-3 mb-4"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "8px"
            }}
          >
            Admin Panel
          </div>

          <h4 className="fw-bold mb-2">Platform Control</h4>
          <p className="mb-0" style={{ color: "rgba(255,255,255,0.72)" }}>
            Monitor users, skills, requests, and community activity.
          </p>
        </div>

        <div className="d-grid gap-3">
          {items.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className="rounded-4 p-3 text-start border-0"
                onClick={() => onNavigate?.(item.id)}
                style={{
                  background: isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#fff"
                }}
              >
                <div className="fw-semibold">{item.title}</div>
                <small style={{ color: "rgba(255,255,255,0.65)" }}>
                  {item.description}
                </small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <button className="btn btn-danger w-100" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
