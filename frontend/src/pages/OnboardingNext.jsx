import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const OnboardingNext = () => {
  const navigate = useNavigate();

  const goTo = (path) => {
    localStorage.setItem("onboardingDone", "true");
    navigate(path);
  };

  return (
    <div>
      <Navbar />

      <section
        className="py-5"
        style={{
          minHeight: "calc(100vh - 88px)",
          background:
            "linear-gradient(180deg, rgba(219,234,254,0.85), rgba(255,255,255,0.42))"
        }}
      >
        <div className="container" style={{ maxWidth: "880px" }}>
          <div className="card border-0 shadow-sm p-4 p-lg-5 text-center mb-4">
            <div className="section-eyebrow mb-2">Next Step</div>
            <h2 className="section-title mb-3">Great, profile created successfully</h2>
            <p className="text-muted mb-0">
              Choose your next action. You can either add your skill first or search for skills
              and send requests right now.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-4 h-100">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
                  alt="Add skill"
                  className="rounded-4 mb-3"
                  style={{ height: "190px", objectFit: "cover" }}
                />
                <h4 className="fw-bold">Add Skill</h4>
                <p className="text-muted">
                  Share what you can teach so others can discover and connect with you.
                </p>
                <button className="btn btn-primary mt-auto" onClick={() => goTo("/add-skill")}>
                  Continue to Add Skill
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-4 h-100">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Search skills"
                  className="rounded-4 mb-3"
                  style={{ height: "190px", objectFit: "cover" }}
                />
                <h4 className="fw-bold">Search Skill</h4>
                <p className="text-muted">
                  Explore available skills and send your first learning request instantly.
                </p>
                <button className="btn btn-outline-dark mt-auto" onClick={() => goTo("/browse")}>
                  Continue to Browse
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OnboardingNext;
