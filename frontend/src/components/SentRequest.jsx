import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const SentRequests = ({ currentUserId }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentRequests = async () => {
      if (!currentUserId) {
        setRequests([]);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/requests/sent/${currentUserId}`);
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error fetching sent requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, [currentUserId]);

  if (loading) {
    return <h4 className="text-center mt-3">Loading Sent Requests...</h4>;
  }

  if (requests.length === 0) {
    return <p className="text-center text-muted mt-3">You have not sent any requests yet.</p>;
  }

  return (
    <div className="row">
      {requests.map((request) => (
        <div key={request._id} className="col-md-6 mb-4">
          <div className="card shadow-sm p-4 border-0 h-100">
            <h5 className="fw-bold">
              To: {request.receiver?.name || "Unknown User"}
            </h5>

            <p>
              Skill: <strong>{request.skill?.name || "Unknown Skill"}</strong>
            </p>

            <p>
              Status:{" "}
              <span
                className={
                  request.status === "accepted"
                    ? "text-success fw-semibold"
                    : request.status === "rejected"
                      ? "text-danger fw-semibold"
                      : "text-warning fw-semibold"
                }
              >
                {request.status}
              </span>
            </p>

            {request.scheduledAt && (
              <p className="text-primary">
                Scheduled Time: <strong>{request.scheduledAt}</strong>
              </p>
            )}

            {request.message && (
              <p className="text-muted mb-0">
                Message: {request.message}
              </p>
            )}

            {request.status === "accepted" && request.receiver?._id && (
              <div className="d-flex gap-2 flex-wrap mt-3">
                <button
                  className="btn btn-info"
                  onClick={() => {
                    navigate(`/chat/${request.receiver._id}`);
                  }}
                >
                  Chat
                </button>

                <button
                  className="btn btn-warning"
                  onClick={() => {
                    navigate(`/video/${request.receiver._id}`);
                  }}
                >
                  Video Call
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SentRequests;
