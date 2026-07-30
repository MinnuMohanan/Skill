import React from "react";

const cardThemes = {
  primary: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    shadow: "0 16px 30px rgba(37, 99, 235, 0.22)"
  },
  success: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    shadow: "0 16px 30px rgba(16, 185, 129, 0.22)"
  },
  warning: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    shadow: "0 16px 30px rgba(245, 158, 11, 0.22)"
  },
  danger: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    shadow: "0 16px 30px rgba(239, 68, 68, 0.22)"
  }
};

const AdminStatsCard = ({ title, value, color = "primary", onClick, hint }) => {
  const theme = cardThemes[color] || cardThemes.primary;

  return (
    <div className="col-md-6 col-xl-3 mb-4">
      <button
        type="button"
        className="text-white p-4 h-100 w-100 border-0 text-start"
        onClick={onClick}
        style={{
          borderRadius: "24px",
          background: theme.background,
          boxShadow: theme.shadow,
          position: "relative",
          overflow: "hidden",
          cursor: onClick ? "pointer" : "default"
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-24px",
            top: "-24px",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)"
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "22px",
            bottom: "-18px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)"
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              opacity: 0.8,
              marginBottom: "10px"
            }}
          >
            {title}
          </div>

          <div
            className="fw-bold"
            style={{
              fontSize: "2.4rem",
              lineHeight: 1
            }}
          >
            {value}
          </div>

          {hint && (
            <div className="mt-3" style={{ fontSize: "0.92rem", opacity: 0.82 }}>
              {hint}
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

export default AdminStatsCard;
