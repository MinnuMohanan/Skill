import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import AIRecommendation from "../components/AIRecommendation";
import CertificateCard from "../components/CertificateCard";
import NotificationBox from "../components/NotificationBox";
import NextStepPanel from "../components/NextStepPanel";

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

const getSkillImage = (skill) => skill.image || fallbackImages[skill.category] || fallbackImages.Others;

const Dashboard = ({ currentUserId }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await api.get(`/users/${currentUserId}`);
        setUser(userRes.data);

        const [receivedRes, sentRes, skillsRes] = await Promise.all([
          api.get(`/requests/received/${currentUserId}`),
          api.get(`/requests/sent/${currentUserId}`),
          api.get("/skills")
        ]);

        const receivedData = Array.isArray(receivedRes.data) ? receivedRes.data : [];
        const sentData = Array.isArray(sentRes.data) ? sentRes.data : [];
        const skillsData = Array.isArray(skillsRes.data) ? skillsRes.data : [];

        setReceivedRequests(receivedData);
        setSentRequests(sentData);
        setSkills(skillsData);

        const generatedNotifications = [];

        [...receivedData, ...sentData].forEach((request) => {
          if (request.status === "accepted") {
            generatedNotifications.push(
              `${request.sender?.name || request.receiver?.name || "A user"} accepted a skill exchange for ${request.skill?.name || "a skill"}`
            );
          }

          if (request.status === "rejected") {
            generatedNotifications.push(
              `${request.sender?.name || "A user"} rejected the request for ${request.skill?.name || "a skill"}`
            );
          }

          if (request.scheduledAt) {
            generatedNotifications.push(
              `Meeting scheduled on ${request.scheduledAt} for ${request.skill?.name || "your skill exchange"}`
            );
          }
        });

        setNotifications(generatedNotifications);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [currentUserId]);

  const requests = [...receivedRequests, ...sentRequests];
  const activeReceivedRequest = receivedRequests.find((request) => request.status === "accepted");
  const activeSentRequest = sentRequests.find((request) => request.status === "accepted");
  const activeExchange = activeReceivedRequest || activeSentRequest || null;
  const activePartner = activeReceivedRequest
    ? activeReceivedRequest.sender
    : activeSentRequest?.receiver;
  const activePartnerId = activePartner?._id;
  const acceptedCount = requests.filter((r) => r.status === "accepted").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const completionRate = requests.length
    ? Math.round((acceptedCount / requests.length) * 100)
    : 0;
  const requestedSkillIds = new Set(sentRequests.map((request) => String(request.skill?._id || request.skill)));
  const wantedKeyword = String(user?.skillWanted || "").trim().toLowerCase();
  const matchedSkills = skills
    .filter((skill) => {
      const ownerId = skill.userId?._id || skill.userId;
      const belongsToCurrentUser = String(ownerId) === String(currentUserId);
      const skillText = `${skill.name || ""} ${skill.description || ""} ${skill.category || ""}`.toLowerCase();

      if (belongsToCurrentUser || requestedSkillIds.has(String(skill._id))) {
        return false;
      }

      if (!wantedKeyword) {
        return false;
      }

      return skillText.includes(wantedKeyword);
    })
    .slice(0, 3);

  const sendRequest = async (skill) => {
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
      navigate("/requests");
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
            "linear-gradient(180deg, rgba(254,243,199,0.75), rgba(255,255,255,0.42))"
        }}
      >
        <div className="container">
          <div
            className="card border-0 shadow-sm p-4 p-lg-5 mb-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(17,24,39,0.9), rgba(31,41,55,0.84)), url(https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff"
            }}
          >
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
              <div>
              <div className="section-eyebrow mb-2">Your Space</div>
              <h2 className="section-title mb-2">Welcome Back</h2>
              <p className="mb-0" style={{ color: "rgba(255,255,255,0.74)" }}>
                Track your activity, manage requests, and explore your next learning opportunity.
              </p>
              </div>

              <div className="mt-4 mt-lg-0 d-flex gap-2 flex-wrap">
                <Link to="/add-skill" className="btn btn-warning">
                  Add Skill
                </Link>
                <Link to="/browse" className="btn btn-outline-light">
                  Explore Skills
                </Link>
              </div>
            </div>
          </div>

          {!currentUserId && (
            <p className="text-center text-danger">Your session is missing. Please sign in again.</p>
          )}

          {user && (
            <div className="card p-4 mb-4 border-0 shadow-sm">
              <div className="row align-items-center">
                <div className="col-md-2 text-center mb-3 mb-md-0">
                  <img
                    src={
                      user.profileImage ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={user.name}
                    className="rounded-circle mx-auto"
                    style={{ width: "110px", height: "110px", objectFit: "cover" }}
                  />
                </div>

                <div className="col-md-10">
                  <h3 className="fw-bold mb-2">{user.name}</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                      <p className="mb-2"><strong>Location:</strong> {user.location || "Not added"}</p>
                      <p className="mb-2"><strong>Availability:</strong> {user.availability || "Not added"}</p>
                    </div>

                    <div className="col-md-6">
                      <p className="mb-2"><strong>Skill Offered:</strong> {user.skillOffered || "Not added"}</p>
                      <p className="mb-2"><strong>Skill Wanted:</strong> {user.skillWanted || "Not added"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row mb-4">
            <div className="col-md-6 col-xl-3 mb-3">
              <div className="card p-4 border-0 shadow-sm h-100">
                <div className="section-eyebrow mb-2">Requests</div>
                <h3 className="fw-bold">{requests.length}</h3>
                <p className="text-muted mb-0">Requests received from other learners</p>
              </div>
            </div>

            <div className="col-md-6 col-xl-3 mb-3">
              <div className="card p-4 border-0 shadow-sm h-100">
                <div className="section-eyebrow mb-2">Accepted</div>
                <h3 className="fw-bold">{acceptedCount}</h3>
                <p className="text-muted mb-0">Exchanges currently active</p>
              </div>
            </div>

            <div className="col-md-6 col-xl-3 mb-3">
              <div className="card p-4 border-0 shadow-sm h-100">
                <div className="section-eyebrow mb-2">Pending</div>
                <h3 className="fw-bold">{pendingCount}</h3>
                <p className="text-muted mb-0">Requests waiting for your response</p>
              </div>
            </div>

            <div className="col-md-6 col-xl-3 mb-3">
              <div className="card p-4 border-0 shadow-sm h-100">
                <div className="section-eyebrow mb-2">Conversion</div>
                <h3 className="fw-bold">{completionRate}%</h3>
                <p className="text-muted mb-0">Accepted share of total requests</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-7 mb-4">
              <NotificationBox notifications={notifications} />
            </div>

            <div className="col-lg-5 mb-4">
              <AIRecommendation />
            </div>
          </div>

          {user?.skillWanted && (
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
                <div>
                  <div className="section-eyebrow mb-2">Matched For You</div>
                  <h4 className="fw-bold mb-1">People offering {user.skillWanted}</h4>
                  <p className="text-muted mb-0">
                    Send a request directly from here without going through extra pages.
                  </p>
                </div>

                <Link to="/browse" className="btn btn-outline-dark">
                  See All Skills
                </Link>
              </div>

              {matchedSkills.length === 0 ? (
                <div className="rounded-4 bg-light p-4">
                  <p className="text-muted mb-2">
                    No direct match is available yet for <strong>{user.skillWanted}</strong>.
                  </p>
                  <p className="text-muted mb-0">
                    You can still browse all skills and send a request manually.
                  </p>
                </div>
              ) : (
                <div className="row">
                  {matchedSkills.map((skill) => (
                    <div key={skill._id} className="col-md-6 col-xl-4 mb-3">
                      <div className="card h-100 border-0 shadow-sm overflow-hidden">
                        <img
                          src={getSkillImage(skill)}
                          alt={skill.name}
                          style={{ height: "180px", objectFit: "cover" }}
                        />

                        <div className="card-body d-flex flex-column">
                          <span className="badge bg-warning text-dark align-self-start mb-2">
                            {skill.category}
                          </span>
                          <h5 className="fw-bold mb-2">{skill.name}</h5>
                          <p className="text-muted mb-2">
                            Offered by <strong>{skill.userId?.name || "Unknown User"}</strong>
                          </p>
                          <p className="text-muted" style={{ minHeight: "48px" }}>
                            {skill.description || "A matching skill offer is available for you."}
                          </p>

                          <button
                            className="btn btn-primary mt-auto"
                            onClick={() => sendRequest(skill)}
                          >
                            Send Request
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeExchange && activePartnerId && (
            <div className="card border-0 shadow-sm p-4 mb-4">
              <div className="section-eyebrow mb-2">Continue Instantly</div>
              <h4 className="fw-bold mb-2">
                Your exchange with {activePartner?.name || "your skill partner"} is active
              </h4>
              <p className="text-muted mb-3">
                No extra login is needed. Continue directly with chat or video call from here.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to={`/chat/${activePartnerId}`} className="btn btn-primary">
                  Open Chat
                </Link>

                <Link to={`/video/${activePartnerId}`} className="btn btn-warning">
                  Start Video Call
                </Link>

                <Link to="/requests" className="btn btn-outline-dark">
                  View All Requests
                </Link>
              </div>
            </div>
          )}

          {activeExchange && user && (
            <CertificateCard
              userName={user.name}
              partnerName={activePartner?.name || "Skill Partner"}
              skillName={activeExchange.skill?.name || "Skill Exchange"}
            />
          )}

          <div className="card border-0 shadow-sm p-4 mt-4">
            <h4 className="fw-bold mb-3">Quick Actions</h4>

            <div className="d-flex flex-wrap gap-3">
              <Link to="/browse" className="btn btn-primary">
                Browse Skills
              </Link>

              <Link to="/requests" className="btn btn-success">
                View Requests
              </Link>

              <Link to="/profile" className="btn btn-warning">
                My Profile
              </Link>

              <Link to="/create-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            </div>
          </div>

          <NextStepPanel
            title={
              activePartnerId
                ? "Your next step is ready"
                : "Follow guided flow without page hunting"
            }
            description={
              activePartnerId
                ? "You already have an accepted request. Continue directly to chat or jump into a video session."
                : "Add a skill, send a request, then track approvals and continue with chat/video."
            }
            primaryTo={activePartnerId ? `/chat/${activePartnerId}` : "/add-skill"}
            primaryLabel={activePartnerId ? "Continue to Chat" : "Step 1: Add Skill"}
            secondaryTo={activePartnerId ? `/video/${activePartnerId}` : "/browse"}
            secondaryLabel={activePartnerId ? "Open Video Call" : "Step 2: Send Request"}
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
