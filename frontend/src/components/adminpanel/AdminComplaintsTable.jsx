import React from "react";

const statusStyles = {
  open: "bg-danger-subtle text-danger",
  in_progress: "bg-warning-subtle text-dark",
  resolved: "bg-success-subtle text-success"
};

const AdminComplaintsTable = ({
  complaints = [],
  onStatusChange
}) => {
  return (
    <div className="card shadow-sm border-0 p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <div className="section-eyebrow mb-1">Complaint Management</div>
          <h4 className="fw-bold mb-0">User Complaints</h4>
        </div>

        <span className="badge bg-dark fs-6 px-3 py-2">
          {complaints.length} Complaints
        </span>
      </div>

      {complaints.length === 0 ? (
        <p className="text-muted mb-0">No complaints found</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle" style={{ minWidth: "1050px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.08)" }}>
                <th className="py-3">User</th>
                <th className="py-3">Subject</th>
                <th className="py-3">Category</th>
                <th className="py-3">Description</th>
                <th className="py-3">Status</th>
                <th className="py-3">Created</th>
                <th className="py-3 text-end">Update</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <td className="py-3">
                    <div>
                      <div className="fw-semibold">{complaint.user?.name || "Unknown User"}</div>
                      <small className="text-muted">{complaint.user?.email || ""}</small>
                    </div>
                  </td>

                  <td className="py-3 fw-semibold">{complaint.subject}</td>

                  <td className="py-3">
                    <span className="badge bg-primary-subtle text-dark">
                      {complaint.category}
                    </span>
                  </td>

                  <td className="py-3 text-muted" style={{ maxWidth: "320px" }}>
                    {complaint.description}
                  </td>

                  <td className="py-3">
                    <span className={`badge px-3 py-2 ${statusStyles[complaint.status] || "bg-light text-dark"}`}>
                      {complaint.status}
                    </span>
                  </td>

                  <td className="py-3">
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="py-3 text-end">
                    <select
                      className="form-select form-select-sm"
                      style={{ maxWidth: "170px", marginLeft: "auto" }}
                      value={complaint.status}
                      onChange={(e) => onStatusChange?.(complaint, e.target.value)}
                    >
                      <option value="open">open</option>
                      <option value="in_progress">in_progress</option>
                      <option value="resolved">resolved</option>
                    </select>
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

export default AdminComplaintsTable;
