import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import NextStepPanel from "../components/NextStepPanel";
import { getStoredJson } from "../utils/storage";
import useAuth from "../hooks/useAuth";

const categories = ["Care", "IT", "Education", "Cooking", "Design", "Language", "Music", "Fitness", "Business", "Others"];

const AddSkill = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const storedUser = getStoredJson("currentUser");
  const effectiveUser = currentUser || storedUser;
  const currentUserId = effectiveUser?._id;

  const [form, setForm] = useState({
    name: "",
    category: "IT",
    image: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category) {
      alert("Please enter the required skill details.");
      return;
    }

    if (!currentUserId) {
      alert("Your session has expired. Please sign in again.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/skills", form);

      alert("Skill added successfully.");

      setForm({
        name: "",
        category: "IT",
        image: "",
        description: ""
      });

      setTimeout(() => {
        navigate("/browse");
      }, 300);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to add the skill right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(237,233,254,0.85), rgba(255,255,255,0.42))",
          minHeight: "calc(100vh - 88px)"
        }}
      >
        <div className="container" style={{ maxWidth: "720px" }}>
          <div className="card border-0 shadow-sm p-4 mb-4">
            <div className="section-eyebrow mb-2">Current Profile</div>
            <h4 className="fw-bold mb-2">
              Publish a skill for {effectiveUser?.name || "your account"}
            </h4>
            <p className="text-muted mb-0">
              Add one clear skill first. Once it is published, it becomes easier for other users
              to discover you and send requests.
            </p>
          </div>

          <div className="card border-0 shadow-sm overflow-hidden mb-4">
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80"
                alt="Add skill banner"
                style={{ width: "100%", height: "220px", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(17,24,39,0.76), rgba(17,24,39,0.22))",
                  display: "flex",
                  alignItems: "end",
                  padding: "1.25rem",
                  color: "#fff"
                }}
              >
                <div>
                  <div className="section-eyebrow text-warning mb-1">Showcase Expertise</div>
                  <h5 className="fw-bold mb-0">A strong skill profile attracts better matches</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow p-4 p-lg-5 border-0">
            <div className="text-center mb-4">
              <div className="section-eyebrow mb-2">Skill Publishing</div>
              <h2 className="mb-3 fw-bold">Add Skill</h2>
              <p className="text-muted mb-0">
                Share your expertise so others can discover and connect with you.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-3"
                placeholder="Skill Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={80}
              />

              <select
                className="form-select mb-3"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <input
                className="form-control mb-3"
                placeholder="Image URL (optional, leave empty for auto image)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />

              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Skill Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                maxLength={1000}
              />

              <div className="d-flex justify-content-between text-muted small mb-3">
                <span>
                  Examples: Cooking, Excel, Python, Web Design, Guitar, Spoken English
                </span>
                <span>{form.description.length}/1000</span>
              </div>

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Saving..." : "Add Skill"}
              </button>
            </form>
          </div>

          <NextStepPanel
            title="After adding your skill, send your first request"
            description="Browse available skills, connect with users, and start a learning exchange in a few clicks."
            primaryTo="/browse"
            primaryLabel="Go to Browse"
            secondaryTo="/activity"
            secondaryLabel="Back to Dashboard"
          />
        </div>
      </section>
    </div>
  );
};

export default AddSkill;
