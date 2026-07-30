import React from "react";

const AdminSkillsTable = ({ skills = [], onDelete }) => {
  return (
    <div className="card shadow-sm border-0 p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <div className="section-eyebrow mb-1">Skill Management</div>
          <h4 className="fw-bold mb-0">All Skills</h4>
        </div>

        <span className="badge bg-dark fs-6 px-3 py-2">
          {skills.length} Skills
        </span>
      </div>

      {skills.length === 0 ? (
        <p className="text-muted mb-0">No skills found</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle" style={{ minWidth: "950px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.08)" }}>
                <th className="py-3">Skill</th>
                <th className="py-3">Category</th>
                <th className="py-3">Description</th>
                <th className="py-3">User</th>
                <th className="py-3">Email</th>
                <th className="py-3 text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {skills.map((skill) => (
                <tr key={skill._id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <td className="py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={
                          skill.image ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                        }
                        alt={skill.name}
                        className="rounded-4"
                        style={{ width: "64px", height: "64px", objectFit: "cover" }}
                      />

                      <div>
                        <div className="fw-semibold">{skill.name}</div>
                        <small className="text-muted">Skill ID: {skill._id?.slice(-6)}</small>
                      </div>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className="badge bg-primary-subtle text-dark">
                      {skill.category}
                    </span>
                  </td>

                  <td className="py-3 text-muted" style={{ maxWidth: "280px" }}>
                    {skill.description || "No description added"}
                  </td>

                  <td className="py-3">{skill.userId?.name || "N/A"}</td>
                  <td className="py-3">{skill.userId?.email || "N/A"}</td>
                  <td className="py-3 text-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete?.(skill)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSkillsTable;
