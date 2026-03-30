import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow">

      {/* Logo */}
      <Link className="navbar-brand fw-bold" to="/">
        SkillSwap
      </Link>

      {/* Mobile toggle */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-between" id="navbarNav">

        {/* CENTER MENU */}
        <ul className="navbar-nav mx-auto">

          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/browse">Browse</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/requests">Requests</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/create-profile">Create Profile</Link>
          </li>

        </ul>

        {/* RIGHT SIDE */}
        <div>

          <Link className="btn btn-outline-light me-2" to="/signup">
            Sign Up
          </Link>

          <Link className="btn btn-light me-2" to="/login">
            Login
          </Link>

        </div>

      </div>

    </nav>

  );
};

export default Navbar;