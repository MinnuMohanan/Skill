import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import api from "../api/api";
import NextStepPanel from "../components/NextStepPanel";
import { getStoredJson } from "../utils/storage";

const fallbackImages = {
  Care: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846",
  IT: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  Education: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  Cooking: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
  Design: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
  Language: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
  Music: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
  Fitness: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  Business: "https://images.unsplash.com/photo-1552664730-d307ca884978",
  Others: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
};

const skillKeywordImages = [
  {
    keywords: ["cooking", "baking", "chef", "kitchen", "recipe", "food"],
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352"
  },
  {
    keywords: ["python", "coding", "programming", "web", "developer", "javascript", "react", "java", "html", "css"],
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
  },
  {
    keywords: ["excel", "word", "office", "computer", "typing", "ms office"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    keywords: ["photoshop", "design", "graphic", "ui", "figma", "illustrator"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5"
  },
  {
    keywords: ["english", "language", "communication", "speaking", "grammar", "hindi", "french"],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a"
  },
  {
    keywords: ["math", "science", "tuition", "teaching", "education", "physics", "chemistry"],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
  },
  {
    keywords: ["guitar", "piano", "music", "singing", "violin", "keyboard"],
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
  },
  {
    keywords: ["fitness", "yoga", "gym", "workout", "exercise", "zumba"],
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
  },
  {
    keywords: ["business", "marketing", "finance", "accounting", "sales", "startup", "customer care", "help desk", "support"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  }
];

const getSkillImage = (skill) => {
  if (skill.image) {
    return skill.image;
  }

  const skillText = `${skill.name || ""} ${skill.description || ""}`.toLowerCase();

  const matchedImage = skillKeywordImages.find((item) =>
    item.keywords.some((keyword) => skillText.includes(keyword))
  );

  if (matchedImage) {
    return matchedImage.image;
  }

  return fallbackImages[skill.category] || fallbackImages.Others;
};

const Browse = ({ currentUserId }) => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const currentUser = getStoredJson("currentUser", {});
  const wantedSkill = String(currentUser?.skillWanted || "").trim().toLowerCase();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await api.get("/skills");
        setSkills(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSkills();
  }, []);

  const ownSkills = skills.filter((skill) => {
    const ownerId = skill.userId?._id || skill.userId;
    return String(ownerId) === String(currentUserId);
  });

  const filtered = skills.filter((skill) => {
    const ownerId = skill.userId?._id || skill.userId;

    if (!ownerId) {
      return false;
    }

    const belongsToCurrentUser = String(ownerId) === String(currentUserId);
    const matchesCategory = category === "All" || skill.category === category;

    const searchText =
      `${skill.name || ""} ${skill.description || ""} ${skill.category || ""}`.toLowerCase();

    return (
      searchText.includes(search.toLowerCase()) &&
      !belongsToCurrentUser &&
      matchesCategory
    );
  });
  const totalCategories = new Set(skills.map((s) => s.category).filter(Boolean)).size;
  const recommendedSkills = skills
    .filter((skill) => {
      const ownerId = skill.userId?._id || skill.userId;
      const belongsToCurrentUser = String(ownerId) === String(currentUserId);
      const matchesCategory = category === "All" || skill.category === category;
      const skillText =
        `${skill.name || ""} ${skill.description || ""} ${skill.category || ""}`.toLowerCase();
      const matchesWantedSkill = wantedSkill && skillText.includes(wantedSkill);
      const matchesSearch = !search.trim() || skillText.includes(search.toLowerCase());

      return Boolean(
        ownerId &&
          !belongsToCurrentUser &&
          matchesCategory &&
          matchesWantedSkill &&
          matchesSearch
      );
    })
    .slice(0, 6);

  const sendRequest = async (skill) => {
    if (!currentUserId) {
      alert("Please sign in to send a request.");
      return;
    }

    const receiverId = skill.userId?._id || skill.userId;

    if (!receiverId) {
      alert("This skill listing is unavailable right now.");
      return;
    }

    try {
      await api.post("/requests", {
        receiver: receiverId,
        skill: skill._id,
        message: `Hi, I am interested in learning ${skill.name}`
      });

      alert("Request sent successfully.");
      setTimeout(() => {
        navigate("/requests");
      }, 300);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to send the request right now.");
    }
  };

  return (
    <div>
      <Navbar />

      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(219,234,254,0.75), rgba(255,255,255,0.42))"
        }}
      >
        <div className="container">
          <div className="card border-0 shadow-sm overflow-hidden mb-4">
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80"
                alt="Browse skills banner"
                style={{ width: "100%", height: "240px", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(17,24,39,0.78), rgba(17,24,39,0.2))",
                  display: "flex",
                  alignItems: "end",
                  padding: "1.5rem",
                  color: "#fff"
                }}
              >
                <div>
                  <div className="section-eyebrow text-warning mb-1">Smart Discovery</div>
                  <h4 className="fw-bold mb-0">Find the right mentor and send requests quickly</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-5">
            <div className="section-eyebrow mb-2">Discover Skills</div>
            <h2 className="section-title mb-3">Browse Skills That Match Your Goals</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "760px" }}>
              Explore learning opportunities across different categories, find
              people with the knowledge you need, and start your next skill exchange.
            </p>
          </div>

          <div className="card p-4 mb-4 border-0 shadow-sm">
            <div className="row align-items-center g-3">
              <div className="col-lg-8">
                <input
                  className="form-control"
                  placeholder="Search skill, topic, or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-lg-4 text-lg-end">
                <span className="badge bg-primary fs-6 px-3 py-2">
                  {filtered.length} skills found
                </span>
              </div>
            </div>

            <div className="mt-4">
              <CategoryBar selected={category} setSelected={setCategory} />
            </div>

            <div className="row g-3 mt-1">
              <div className="col-md-4">
                <div className="rounded-4 p-3 bg-light h-100">
                  <div className="section-eyebrow mb-1">Total Listings</div>
                  <div className="fw-bold fs-4">{skills.length}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="rounded-4 p-3 bg-light h-100">
                  <div className="section-eyebrow mb-1">Categories</div>
                  <div className="fw-bold fs-4">{totalCategories}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="rounded-4 p-3 bg-light h-100">
                  <div className="section-eyebrow mb-1">Active Filter</div>
                  <div className="fw-bold fs-5">{category}</div>
                </div>
              </div>
            </div>
          </div>

          {wantedSkill && (
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
                <div>
                  <div className="section-eyebrow mb-1">Recommended For You</div>
                  <h4 className="fw-bold mb-1">
                    People offering {currentUser?.skillWanted || "your target skill"}
                  </h4>
                  <p className="text-muted mb-0">
                    Based on your profile, these are the best matches to request first.
                  </p>
                </div>

                <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                  {recommendedSkills.length} best matches
                </span>
              </div>

              {recommendedSkills.length === 0 ? (
                <div className="rounded-4 bg-light p-4">
                  <h6 className="fw-bold mb-2">No direct match found yet</h6>
                  <p className="text-muted mb-0">
                    When someone offers <strong>{currentUser?.skillWanted}</strong>, it will appear
                    here and you can send a request directly.
                  </p>
                </div>
              ) : (
                <div className="row">
                  {recommendedSkills.map((skill) => (
                    <div key={skill._id} className="col-md-6 col-xl-4 mb-4">
                      <div className="card h-100 overflow-hidden border-0 shadow-sm">
                        <div style={{ position: "relative" }}>
                          <img
                            src={getSkillImage(skill)}
                            alt={skill.name}
                            className="card-img-top"
                            style={{ height: "220px", objectFit: "cover" }}
                          />

                          <span
                            className="badge bg-warning text-dark"
                            style={{
                              position: "absolute",
                              top: "16px",
                              left: "16px",
                              fontWeight: 700
                            }}
                          >
                            Best Match
                          </span>
                        </div>

                        <div className="card-body d-flex flex-column">
                          <div className="section-eyebrow mb-1">Matches Your Goal</div>
                          <h4 className="fw-bold mb-2">{skill.name}</h4>
                          <p className="text-muted mb-3" style={{ minHeight: "72px" }}>
                            {skill.description || "A strong match for the skill you want to learn."}
                          </p>

                          <div className="mt-auto">
                            <div className="mb-3">
                              <small className="text-muted d-block">
                                Offered by: <strong>{skill.userId?.name || "Unknown User"}</strong>
                              </small>
                              <small className="text-muted d-block">
                                Category: <strong>{skill.category || "Others"}</strong>
                              </small>
                            </div>

                            <button
                              className="btn btn-primary w-100"
                              onClick={() => sendRequest(skill)}
                            >
                              Send Request
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {ownSkills.length > 0 && (
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <div className="section-eyebrow mb-1">Your Listings</div>
                  <h4 className="fw-bold mb-0">Skills you have already published</h4>
                </div>

                <button className="btn btn-outline-dark" onClick={() => navigate("/add-skill")}>
                  Add Another Skill
                </button>
              </div>

              <div className="row">
                {ownSkills.slice(0, 3).map((skill) => (
                  <div key={skill._id} className="col-md-6 col-xl-4 mb-3">
                    <div className="rounded-4 border p-3 h-100 bg-light">
                      <span className="badge bg-warning text-dark mb-2">{skill.category}</span>
                      <h5 className="fw-bold mb-2">{skill.name}</h5>
                      <p className="text-muted mb-0">
                        {skill.description || "Your skill is now visible to other learners."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center">
              <h4 className="fw-bold mb-2">No matching skills available yet</h4>
              <p className="text-muted mb-0">
                As more users add skills, they will appear here. You can adjust the search,
                change the category, or publish another skill from your profile.
              </p>
            </div>
          ) : (
            <div className="row">
              {filtered.map((skill) => (
                <div key={skill._id} className="col-md-6 col-xl-4 mb-4">
                  <div className="card h-100 overflow-hidden border-0 shadow-sm">
                    <div style={{ position: "relative" }}>
                      <img
                        src={getSkillImage(skill)}
                        alt={skill.name}
                        className="card-img-top"
                        style={{ height: "240px", objectFit: "cover" }}
                      />

                      <span
                        className="badge bg-warning text-dark"
                        style={{
                          position: "absolute",
                          top: "16px",
                          left: "16px",
                          fontWeight: 700
                        }}
                      >
                        {skill.category}
                      </span>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h4 className="fw-bold mb-2">{skill.name}</h4>

                      <p className="text-muted mb-3" style={{ minHeight: "72px" }}>
                        {skill.description || "A great skill exchange opportunity waiting for you."}
                      </p>

                      <div className="mt-auto">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <small className="text-muted">
                            Offered by: <strong>{skill.userId?.name || "Unknown User"}</strong>
                          </small>
                        </div>

                        <button
                          className="btn btn-primary w-100"
                          onClick={() => sendRequest(skill)}
                        >
                          Send Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <NextStepPanel
            title="Request sent? Track approvals and start chat"
            description="Go to Requests to check status, then continue with chat or video call when accepted."
            primaryTo="/requests"
            primaryLabel="Open Requests"
            secondaryTo="/activity"
            secondaryLabel="Go to Dashboard"
          />
        </div>
      </section>
    </div>
  );
};

export default Browse;
