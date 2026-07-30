import React from "react";

const NotificationBox = ({ notifications = [] }) => {
  return (
    <div className="card shadow-sm border-0 p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <div className="section-eyebrow mb-1">Updates</div>
          <h4 className="fw-bold mb-0">Notifications</h4>
        </div>

        <span className="badge bg-dark fs-6 px-3 py-2">
          {notifications.length}
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 rounded-4 bg-light text-center">
          <p className="text-muted mb-0">No notifications yet</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {notifications.map((note, index) => (
            <div
              key={index}
              className="p-3 rounded-4"
              style={{
                background: "rgba(29, 78, 216, 0.06)",
                border: "1px solid rgba(29, 78, 216, 0.08)"
              }}
            >
              <div className="d-flex align-items-start gap-3">
                <div
                  style={{
                    minWidth: "42px",
                    height: "42px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800
                  }}
                >
                  N
                </div>

                <div className="text-muted" style={{ lineHeight: 1.6 }}>
                  {note}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBox;