import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <div>
      <Navbar />

      <section
        className="py-5 d-flex align-items-center"
        style={{ minHeight: "calc(100vh - 88px)", background: "rgba(255,255,255,0.42)" }}
      >
        <div className="container text-center">
          <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: "760px" }}>
            <div className="section-eyebrow mb-2">404 Error</div>
            <h1 className="section-title mb-3">This page could not be found</h1>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: "540px" }}>
              The page you are looking for may have been moved, removed, or never
              existed. Let&apos;s get you back to the learning flow.
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/" className="btn btn-primary px-4">
                Go Home
              </Link>
              <Link to="/browse" className="btn btn-warning px-4">
                Browse Skills
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
