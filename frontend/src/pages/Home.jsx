import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const featureCards = [
    {
      icon: "C",
      title: "Connection",
      description:
        "Meet people with different abilities and learning goals in a friendly, growth-focused platform.",
      background: "linear-gradient(160deg, #eff6ff, #dbeafe 52%, #bfdbfe)"
    },
    {
      icon: "Co",
      title: "Communication",
      description:
        "Improve how you explain, discuss, and collaborate while learning directly from others.",
      background: "linear-gradient(160deg, #fff7ed, #ffedd5 52%, #fdba74)"
    },
    {
      icon: "Ex",
      title: "Exchange",
      description:
        "Share what you know and receive value in return through skill-based mutual support.",
      background: "linear-gradient(160deg, #ecfeff, #ccfbf1 52%, #99f6e4)"
    },
    {
      icon: "G",
      title: "Growth",
      description:
        "Build confidence, discover new interests, and create opportunities through shared learning.",
      background: "linear-gradient(160deg, #f5f3ff, #ede9fe 52%, #c4b5fd)"
    }
  ];

  const steps = [
    {
      title: "1. Create Your Account",
      description:
        "Join the platform and set up your profile with your interests and strengths.",
      background: "linear-gradient(160deg, rgba(37,99,235,0.12), rgba(96,165,250,0.2))"
    },
    {
      title: "2. Add Your Skills",
      description:
        "Publish the skills you can offer and the ones you want to learn.",
      background: "linear-gradient(160deg, rgba(249,115,22,0.12), rgba(251,191,36,0.2))"
    },
    {
      title: "3. Match And Request",
      description:
        "Search categories, discover users, and send swap requests.",
      background: "linear-gradient(160deg, rgba(20,184,166,0.12), rgba(45,212,191,0.2))"
    },
    {
      title: "4. Learn Together",
      description:
        "Chat, schedule sessions, use video, and complete your exchange.",
      background: "linear-gradient(160deg, rgba(139,92,246,0.12), rgba(167,139,250,0.2))"
    }
  ];

  return (
    <div style={{ width: "100%" }}>
      <Navbar />

      <section
        className="hero-shell d-flex align-items-center"
        style={{
          minHeight: "94vh",
          width: "100%",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="container hero-content py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="section-eyebrow mb-3">Learn Together</div>

              <h1
                className="fw-bold text-white mb-4"
                style={{
                  fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em"
                }}
              >
                Exchange Skills.
                <br />
                Build Real Connections.
              </h1>

              <p
                className="lead text-white mb-4"
                style={{ maxWidth: "760px", opacity: 0.94 }}
              >
                SkillSwap helps people teach what they know, discover what they
                want to learn, and grow through communication, collaboration,
                and meaningful human exchange.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <button
                  className="btn btn-warning px-4 py-3"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </button>

                <button
                  className="btn btn-outline-light px-4 py-3"
                  onClick={() => navigate("/browse")}
                >
                  Explore Skills
                </button>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="glass-panel p-4 text-white">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 rounded-4 bg-white bg-opacity-10">
                      <div className="fw-bold fs-2">1:1</div>
                      <div>Skill Exchange</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-4 bg-white bg-opacity-10">
                      <div className="fw-bold fs-2">Live</div>
                      <div>Chat & Video</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-4 bg-white bg-opacity-10">
                      <div className="fw-bold fs-2">Smart</div>
                      <div>AI Suggestions</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-4 bg-white bg-opacity-10">
                      <div className="fw-bold fs-2">Grow</div>
                      <div>Learn Together</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5 my-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0)), radial-gradient(circle at top center, rgba(251,191,36,0.12), transparent 32%)"
        }}
      >
        <div className="container">
        <div className="text-center mb-5">
          <div className="section-eyebrow mb-2">Why SkillSwap</div>
          <h2 className="section-title mb-3">A Better Way To Learn And Share</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "820px" }}>
            SkillSwap transforms learning into a two-way experience where
            people connect through knowledge, help each other improve, and
            create stronger communities through real collaboration.
          </p>
        </div>

        <div className="row">
          {featureCards.map((card) => (
            <div key={card.title} className="col-md-6 col-xl-3 mb-4">
              <div
                className="card h-100 p-4"
                style={{
                  background: card.background,
                  border: "1px solid rgba(255,255,255,0.5)"
                }}
              >
                <div className="feature-icon">{card.icon}</div>
                <h4 className="fw-bold">{card.title}</h4>
                <p className="text-muted mb-0">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(219,234,254,0.65), rgba(255,255,255,0.18)), radial-gradient(circle at bottom right, rgba(168,85,247,0.12), transparent 28%)"
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="section-eyebrow mb-2">How It Works</div>
              <h2 className="section-title mb-3">Simple Steps, Strong Outcomes</h2>
              <p className="text-muted">
                From signup to live collaboration, SkillSwap gives users a
                smooth journey for discovering, requesting, scheduling, and
                completing skill exchanges.
              </p>
            </div>

            <div className="col-lg-7">
              <div className="row">
                {steps.map((step) => (
                  <div key={step.title} className="col-md-6 mb-4">
                    <div
                      className="card p-4 h-100"
                      style={{
                        background: step.background,
                        border: "1px solid rgba(255,255,255,0.45)"
                      }}
                    >
                      <h5 className="fw-bold">{step.title}</h5>
                      <p className="text-muted mb-0">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5 my-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(236,253,245,0.48), rgba(255,255,255,0.12)), radial-gradient(circle at left center, rgba(16,185,129,0.12), transparent 24%)"
        }}
      >
        <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
              alt="Digital learning and collaboration"
              className="rounded-5 shadow"
            />
          </div>

          <div className="col-lg-6">
            <div className="section-eyebrow mb-2">Our Mission</div>
            <h2 className="section-title mb-3">Human-Centered Learning That Scales</h2>
            <p className="text-muted">
              We believe learning becomes more powerful when it is built on
              trust, discussion, mentorship, and mutual growth. SkillSwap exists
              to make knowledge sharing accessible, practical, and community-driven.
            </p>
            <p className="text-muted">
              Whether users want to improve technical, creative, or personal
              skills, the goal is the same: connect people and help them grow
              by learning from each other.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <button
                className="btn btn-primary px-4"
                onClick={() => navigate("/about")}
              >
                Read Our Story
              </button>

              <button
                className="btn btn-dark px-4"
                onClick={() => navigate("/add-skill")}
              >
                Add Your Skill
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
