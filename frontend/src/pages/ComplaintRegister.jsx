import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";

const ComplaintRegister = () => {
  const [form, setForm] = useState({
    subject: "",
    category: "general",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.description.trim()) {
      alert("Subject and description are required");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/complaints", {
        subject: form.subject.trim(),
        category: form.category,
        description: form.description.trim()
      });

      alert("Complaint registered successfully");
      setForm({ subject: "", category: "general", description: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to register complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(254,226,226,0.82), rgba(255,255,255,0.42))",
          minHeight: "calc(100vh - 88px)"
        }}
      >
        <div className="container">
          <div className="card border-0 shadow-sm p-4 p-lg-5 mb-4">
            <div className="section-eyebrow mb-2">Support Center</div>
            <h2 className="section-title mb-2">Register a Complaint</h2>
            <p className="text-muted mb-0">
              Tell us what went wrong. Our team will review and respond as soon as possible.
            </p>
          </div>

          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-2">Need to add a skill?</h5>
                <p className="text-muted mb-3">
                  Publish your skill first so other users can discover your profile properly.
                </p>
                <Link to="/add-skill" className="btn btn-primary mt-auto">
                  Open Add Skill
                </Link>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-2">Looking for users?</h5>
                <p className="text-muted mb-3">
                  Browse the available skills, matches, and requests from one place.
                </p>
                <Link to="/browse" className="btn btn-outline-dark mt-auto">
                  Open Browse
                </Link>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-2">Track your activity</h5>
                <p className="text-muted mb-3">
                  Use the dashboard to continue the next correct step in your exchange flow.
                </p>
                <Link to="/activity" className="btn btn-warning mt-auto">
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4 p-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  placeholder="Short title of your issue"
                  value={form.subject}
                  onChange={handleChange}
                  maxLength={120}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="general">General</option>
                  <option value="chat">Chat</option>
                  <option value="video">Video Call</option>
                  <option value="payment">Payment</option>
                  <option value="account">Account</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="6"
                  placeholder="Explain your issue in detail"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={2000}
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger px-4"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComplaintRegister;
