import React from "react";
import { Link } from "react-router-dom";

const SkillSwapLogo = ({ compact = false }) => {
  return (
    <Link
      to="/"
      className="d-inline-flex align-items-center gap-3 text-decoration-none"
    >
      <div
        style={{
          width: compact ? "42px" : "50px",
          height: compact ? "42px" : "50px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f59e0b, #1d4ed8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 24px rgba(29, 78, 216, 0.18)"
        }}
      >
        <svg
          width={compact ? "22" : "26"}
          height={compact ? "22" : "26"}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 7H17L14.5 4.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 17H7L9.5 19.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 7C13 7 11 9 11 12"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 17C11 17 13 15 13 12"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <div
          style={{
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            fontSize: compact ? "1.05rem" : "1.35rem",
            lineHeight: 1
          }}
        >
          SkillSwap
        </div>

        {!compact && (
          <div
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: "4px"
            }}
          >
            {"Connect • Exchange • Grow"}
          </div>
        )}
      </div>
    </Link>
  );
};

export default SkillSwapLogo;
