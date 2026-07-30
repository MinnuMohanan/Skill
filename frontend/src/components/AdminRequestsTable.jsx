import React from "react";

const AdminRequestsTable = ({ requests = [], title = "All Requests", onDelete }) => {
  return (
    <div className="card shadow-sm border-0 p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <div className="section-eyebrow mb-1">Request Monitoring</div>
          <h4 className="fw-bold mb-0">{title}</h4>
        </div>

        <span className="badge bg-dark fs-6 px-3 py-2">
          {requests.length} Requests
        </span>
      </div>

      {requests.length === 0 ? (
        <p className="text-muted mb-0">No requests found</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle" style={{ minWidth: "980px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.08)" }}>
                <th className="py-3">Sender</th>
                <th className="py-3">Receiver</th>
                <th className="py-3">Skill</th>
                <th className="py-3">Status</th>
                <th className="py-3">Scheduled Time</th>
                <th className="py-3 text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request._id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <td className="py-3">
                    <div>
                      <div className="fw-semibold">{request.sender?.name || "N/A"}</div>
                      <small className="text-muted">{request.sender?.email || ""}</small>
                    </div>
                  </td>

                  <td className="py-3">
                    <div>
                      <div className="fw-semibold">{request.receiver?.name || "N/A"}</div>
                      <small className="text-muted">{request.receiver?.email || ""}</small>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className="badge bg-primary-subtle text-dark">
                      {request.skill?.name || "N/A"}
                    </span>
                  </td>

                  <td className="py-3">
                    <span
                      className={`badge px-3 py-2 ${
                        request.status === "accepted"
                          ? "bg-success-subtle text-success"
                          : request.status === "rejected"
                            ? "bg-danger-subtle text-danger"
                            : "bg-warning-subtle text-dark"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  <td className="py-3">
                    {request.scheduledAt ? (
                      <span className="text-primary fw-semibold">{request.scheduledAt}</span>
                    ) : (
                      <span className="text-muted">Not Scheduled</span>
                    )}
                  </td>
                  <td className="py-3 text-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete?.(request)}
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

export default AdminRequestsTable;
