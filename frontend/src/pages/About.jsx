import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <div>
      <Navbar />

      <section
        className="hero-shell d-flex align-items-center"
        style={{
          minHeight: "72vh",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1517048676732-d65bc937f952)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="container hero-content py-5 text-white">
          <div className="section-eyebrow mb-3">About SkillSwap</div>
          <h1
            className="fw-bold mb-4"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              maxWidth: "820px"
            }}
          >
            A Platform Built For Learning Through People
          </h1>

          <p className="lead mb-0" style={{ maxWidth: "760px", opacity: 0.94 }}>
            SkillSwap brings people together to teach, learn, communicate, and
            grow through real collaboration. It turns knowledge sharing into a
            practical, human-centered experience.
          </p>
        </div>
      </section>

      <section className="container py-5 my-4">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4">
            <div className="section-eyebrow mb-2">Who We Are</div>
            <h2 className="section-title mb-3">Learning Should Feel Connected, Not Isolated</h2>
            <p className="text-muted">
              SkillSwap is a collaborative platform where people exchange knowledge
              directly with each other. Instead of depending only on formal courses,
              users can offer what they know, discover what they want to learn,
              and build valuable relationships through shared growth.
            </p>
            <p className="text-muted mb-0">
              The platform supports communication, exchange, and real-world
              learning by helping users connect around meaningful skills and
              practical goals.
            </p>
          </div>

          <div className="col-lg-6 mb-4">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              alt="Collaborative learning"
              className="rounded-5 shadow"
            />
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: "rgba(255,255,255,0.56)" }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-eyebrow mb-2">Core Values</div>
            <h2 className="section-title mb-3">What Defines SkillSwap</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "780px" }}>
              Our platform is guided by collaboration, accessibility, and the belief
              that people grow faster when they learn from one another.
            </p>
          </div>

          <div className="row">
            <div className="col-md-6 col-xl-3 mb-4">
              <div className="card h-100 p-4">
                <div className="feature-icon">C</div>
                <h4 className="fw-bold">Connection</h4>
                <p className="text-muted mb-0">
                  We help people meet others with useful knowledge, shared interests,
                  and different perspectives.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-xl-3 mb-4">
              <div className="card h-100 p-4">
                <div className="feature-icon">Co</div>
                <h4 className="fw-bold">Communication</h4>
                <p className="text-muted mb-0">
                  Learning becomes more meaningful when users can discuss, explain,
                  and ask questions in real conversations.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-xl-3 mb-4">
              <div className="card h-100 p-4">
                <div className="feature-icon">Ex</div>
                <h4 className="fw-bold">Exchange</h4>
                <p className="text-muted mb-0">
                  Everyone has something valuable to offer, and knowledge becomes
                  stronger when it is shared both ways.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-xl-3 mb-4">
              <div className="card h-100 p-4">
                <div className="feature-icon">G</div>
                <h4 className="fw-bold">Growth</h4>
                <p className="text-muted mb-0">
                  SkillSwap supports personal confidence, practical ability, and
                  long-term development through mutual learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5 my-4">
        <div className="text-center mb-5">
          <div className="section-eyebrow mb-2">Why It Matters</div>
          <h2 className="section-title mb-3">A More Accessible Way To Build Skills</h2>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card border-0 p-4 h-100">
              <h4 className="fw-bold">Affordable Learning</h4>
              <p className="text-muted mb-0">
                Users can improve their skills without relying only on expensive,
                traditional learning systems.
              </p>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card border-0 p-4 h-100">
              <h4 className="fw-bold">Community Building</h4>
              <p className="text-muted mb-0">
                The platform encourages support, trust, and shared progress through
                human connection.
              </p>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card border-0 p-4 h-100">
              <h4 className="fw-bold">Real Communication</h4>
              <p className="text-muted mb-0">
                Teaching and learning through people helps users grow in clarity,
                confidence, and collaboration.
              </p>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card border-0 p-4 h-100">
              <h4 className="fw-bold">Practical Growth</h4>
              <p className="text-muted mb-0">
                SkillSwap connects learning with real goals, real people, and
                real outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: "linear-gradient(135deg, #1f2937, #111827)" }}>
        <div className="container text-center text-white">
          <div className="section-eyebrow mb-2">Our Mission</div>
          <h2 className="section-title mb-3 text-white">Connect People Through Shared Learning</h2>
          <p className="lead mx-auto mb-0" style={{ maxWidth: "860px", opacity: 0.92 }}>
            Our mission is to create a platform where communication, collaboration,
            and skill exchange help people teach what they know, learn what they need,
            and grow together in a more meaningful way.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
