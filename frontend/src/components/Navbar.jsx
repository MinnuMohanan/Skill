import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SkillSwapLogo from "./SkillSwapLogo";

const Navbar = () => {
  const { currentUser, adminUser, logoutUser, logoutAdmin } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4 py-3 sticky-top">
      <div className="container-fluid">
        <SkillSwapLogo />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/about">
                About
              </Link>
            </li>

            {currentUser && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/browse">
                    Browse
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link px-3" to="/add-skill">
                    Add Skill
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link px-3" to="/requests">
                    Requests
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link px-3" to="/profile">
                    Profile
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link px-3 text-warning fw-bold" to="/activity">
                    Dashboard
                  </Link>
                </li>
              </>
            )}

            {adminUser && (
              <li className="nav-item">
                <Link className="nav-link px-3 text-info fw-bold" to="/admin-dashboard">
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex gap-2">
            {currentUser && (
              <Link to="/support" className="btn btn-outline-danger">
                Support
              </Link>
            )}

            {!currentUser && !adminUser && (
              <>
                <Link to="/login" className="btn btn-outline-light">
                  Sign In
                </Link>
              </>
            )}

            {currentUser && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  logoutUser();
                  window.location.href = "/login";
                }}
              >
                Sign Out
              </button>
            )}

            {adminUser && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  logoutAdmin();
                  window.location.href = "/admin-login";
                }}
              >
                Admin Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

