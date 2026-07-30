import React, { useEffect, useState } from "react";
import api from "../../api/api";
import AdminSidebar from "../../components/adminpanel/AdminSidebar";
import AdminStatsCard from "../../components/adminpanel/AdminStatsCard";
import AdminUsersTable from "../../components/adminpanel/AdminUsersTable";
import AdminRequestsTable from "../../components/AdminRequestsTable";
import AdminSkillsTable from "../../components/adminpanel/AdminSkillsTable";
import AdminComplaintsTable from "../../components/adminpanel/AdminComplaintsTable";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [requestView, setRequestView] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.get("/admin/stats");
      setStats(statsRes.data);

      const usersRes = await api.get("/admin/users");
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

      const requestsRes = await api.get("/admin/requests");
      setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);

      const skillsRes = await api.get("/admin/skills");
      setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);

      const complaintsRes = await api.get("/admin/complaints");
      setComplaints(Array.isArray(complaintsRes.data) ? complaintsRes.data : []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load admin dashboard");
    }
  };

  useEffect(() => {
    const loadAdminData = async () => {
      await fetchAdminData();
    };

    loadAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin-login";
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCardNavigation = (sectionId, filter = "all") => {
    if (sectionId === "requests") {
      setRequestView(filter);
    }

    scrollToSection(sectionId);
  };

  const filteredRequests =
    requestView === "pending"
      ? requests.filter((request) => request.status === "pending")
      : requests;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleUsers = users.filter((user) => {
    if (!normalizedSearch) return true;

    const userText =
      `${user.name || ""} ${user.email || ""} ${user.location || ""} ${user.skillOffered || ""} ${user.skillWanted || ""}`.toLowerCase();

    return userText.includes(normalizedSearch);
  });
  const visibleSkills = skills.filter((skill) => {
    if (!normalizedSearch) return true;

    const skillText =
      `${skill.name || ""} ${skill.category || ""} ${skill.description || ""} ${skill.userId?.name || ""} ${skill.userId?.email || ""}`.toLowerCase();

    return skillText.includes(normalizedSearch);
  });
  const visibleRequests = filteredRequests.filter((request) => {
    if (!normalizedSearch) return true;

    const requestText =
      `${request.sender?.name || ""} ${request.sender?.email || ""} ${request.receiver?.name || ""} ${request.receiver?.email || ""} ${request.skill?.name || ""} ${request.status || ""}`.toLowerCase();

    return requestText.includes(normalizedSearch);
  });
  const visibleComplaints = complaints.filter((complaint) => {
    if (!normalizedSearch) return true;

    const complaintText =
      `${complaint.user?.name || ""} ${complaint.user?.email || ""} ${complaint.subject || ""} ${complaint.description || ""} ${complaint.category || ""} ${complaint.status || ""}`.toLowerCase();

    return complaintText.includes(normalizedSearch);
  });

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete user "${user.name}" and all related data?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/users/${user._id}`);
      alert("User deleted successfully.");
      await fetchAdminData();
      scrollToSection("users");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete the user right now.");
    }
  };

  const handleDeleteRequest = async (request) => {
    const confirmed = window.confirm("Delete this request?");

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/requests/${request._id}`);
      alert("Request deleted successfully.");
      await fetchAdminData();
      scrollToSection("requests");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete the request right now.");
    }
  };

  const handleDeleteSkill = async (skill) => {
    const confirmed = window.confirm(`Delete skill "${skill.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/skills/${skill._id}`);
      alert("Skill deleted successfully.");
      await fetchAdminData();
      scrollToSection("skills");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete the skill right now.");
    }
  };

  const handleComplaintStatusChange = async (complaint, status) => {
    if (complaint.status === status) {
      return;
    }

    try {
      await api.put(`/admin/complaints/${complaint._id}`, { status });
      alert("Complaint status updated successfully.");
      await fetchAdminData();
      scrollToSection("complaints");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update complaint status right now.");
    }
  };

  if (!stats) {
    return <h3 className="text-center mt-5">Loading admin dashboard...</h3>;
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f6f3ee" }}>
      <AdminSidebar
        onLogout={handleLogout}
        onNavigate={(section) => {
          if (section === "requests") {
            setRequestView("all");
          }

          scrollToSection(section);
        }}
        activeSection={activeSection}
      />

      <div className="flex-grow-1 p-4 p-lg-5">
        <div
          id="overview"
          className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-5"
        >
          <div>
            <div className="section-eyebrow mb-2">Platform Control</div>
            <h2 className="section-title mb-2">Admin Dashboard</h2>
            <p className="text-muted mb-0">
              Monitor platform growth, skill activity, user participation, and exchange requests.
            </p>
          </div>

          <div className="mt-4 mt-lg-0">
            <span className="badge bg-dark fs-6 px-3 py-2">
              SkillSwap Admin View
            </span>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-lg-8">
              <input
                className="form-control"
                placeholder="Search users, requests, skills, complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-lg-4 text-lg-end">
              <span className="badge bg-primary fs-6 px-3 py-2">
                Admin quick search
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <AdminStatsCard
            title="Total Users"
            value={stats.totalUsers}
            color="primary"
            hint="Tap to open all users"
            onClick={() => handleCardNavigation("users")}
          />
          <AdminStatsCard
            title="Total Skills"
            value={stats.totalSkills}
            color="success"
            hint="Tap to open all skills"
            onClick={() => handleCardNavigation("skills")}
          />
          <AdminStatsCard
            title="Total Requests"
            value={stats.totalRequests}
            color="warning"
            hint="Tap to open all requests"
            onClick={() => handleCardNavigation("requests", "all")}
          />
          <AdminStatsCard
            title="Pending Requests"
            value={stats.pendingRequests}
            color="danger"
            hint="Tap to view pending only"
            onClick={() => handleCardNavigation("requests", "pending")}
          />
        </div>

        <div className="row mt-4">
          <div className="col-xl-8 mb-4">
            <div className="card border-0 shadow-sm p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">Platform Summary</h4>
                <span className="badge bg-primary fs-6 px-3 py-2">
                  {stats.totalFeedbacks} Feedbacks
                </span>
              </div>

              <p className="text-muted mb-4">
                SkillSwap is growing through user registrations, skill sharing,
                request activity, and direct collaboration between learners.
              </p>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card border-0 p-3 bg-light">
                    <h6 className="fw-bold">Latest Users</h6>
                    {stats.latestUsers.length === 0 ? (
                      <p className="text-muted mb-0">No users found</p>
                    ) : (
                      stats.latestUsers.map((user) => (
                        <div key={user._id} className="border-bottom py-2">
                          <strong>{user.name}</strong> - {user.email}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card border-0 p-3 bg-light">
                    <h6 className="fw-bold">Latest Requests</h6>
                    {stats.latestRequests.length === 0 ? (
                      <p className="text-muted mb-0">No requests found</p>
                    ) : (
                      stats.latestRequests.map((request) => (
                        <div key={request._id} className="border-bottom py-2">
                          <strong>{request.sender?.name}</strong> to{" "}
                          <strong>{request.receiver?.name}</strong> - {request.status}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 mb-4">
            <div className="card border-0 shadow-sm p-4 h-100">
              <h4 className="fw-bold mb-3">Admin Insights</h4>

              <div className="mb-3 p-3 rounded-4 bg-light">
                <h6 className="fw-bold">Community Growth</h6>
                <p className="text-muted mb-0">
                  Track how many users are joining and participating actively.
                </p>
              </div>

              <div className="mb-3 p-3 rounded-4 bg-light">
                <h6 className="fw-bold">Skill Activity</h6>
                <p className="text-muted mb-0">
                  Monitor what categories are becoming more active on the platform.
                </p>
              </div>

              <div className="p-3 rounded-4 bg-light">
                <h6 className="fw-bold">Exchange Quality</h6>
                <p className="text-muted mb-0">
                  Watch accepted, rejected, and scheduled swaps to understand user engagement.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="users">
          <AdminUsersTable users={visibleUsers} onDelete={handleDeleteUser} />
        </div>

        <div id="requests">
          <AdminRequestsTable
            requests={visibleRequests}
            title={requestView === "pending" ? "Pending Requests" : "All Requests"}
            onDelete={handleDeleteRequest}
          />
        </div>

        <div id="skills">
          <AdminSkillsTable skills={visibleSkills} onDelete={handleDeleteSkill} />
        </div>

        <div id="complaints">
          <AdminComplaintsTable
            complaints={visibleComplaints}
            onStatusChange={handleComplaintStatusChange}
          />
        </div>

        <div id="feedback" className="card shadow-sm border-0 p-4 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <div className="section-eyebrow mb-1">Feedback Overview</div>
              <h4 className="fw-bold mb-0">Community Feedback</h4>
            </div>

            <span className="badge bg-dark fs-6 px-3 py-2">
              {stats.totalFeedbacks} Feedbacks
            </span>
          </div>

          <p className="text-muted mb-0">
            Feedback insights are summarized in the dashboard metrics for presentation-ready admin monitoring.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
