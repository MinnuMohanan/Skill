import React from "react";

const AdminUsersTable = ({ users = [], onDelete }) => {
  return (
    <div className="card shadow-sm border-0 p-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <div className="section-eyebrow mb-1">User Management</div>
          <h4 className="fw-bold mb-0">All Users</h4>
        </div>

        <span className="badge bg-dark fs-6 px-3 py-2">
          {users.length} Users
        </span>
      </div>

      {users.length === 0 ? (
        <p className="text-muted mb-0">No users found</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle" style={{ minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.08)" }}>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Location</th>
                <th className="py-3">Skill Offered</th>
                <th className="py-3">Skill Wanted</th>
                <th className="py-3 text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <td className="py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={
                          user.profileImage ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={user.name}
                        className="rounded-circle"
                        style={{ width: "44px", height: "44px", objectFit: "cover" }}
                      />

                      <div>
                        <div className="fw-semibold">{user.name}</div>
                        <small className="text-muted">User ID: {user._id?.slice(-6)}</small>
                      </div>
                    </div>
                  </td>

                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.location || "N/A"}</td>
                  <td className="py-3">
                    <span className="badge bg-primary-subtle text-dark">
                      {user.skillOffered || "N/A"}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="badge bg-warning-subtle text-dark">
                      {user.skillWanted || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 text-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete?.(user)}
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

export default AdminUsersTable;
