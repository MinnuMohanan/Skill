import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackForm from "./FeedbackForm";
import Reviews from "./Reviews";
import ScheduleMeeting from "./ScheduleMeeting";
import api from "../api/api";

const ReceivedRequests = ({ currentUserId }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUserId) {
        setRequests([]);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/requests/received/${currentUserId}`);
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUserId]);

  const fetchRequestsAgain = async () => {
    if (!currentUserId) {
      setRequests([]);
      return;
    }

    try {
      const { data } = await api.get(`/requests/received/${currentUserId}`);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error fetching requests:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      await fetchRequestsAgain();

      if (status === "accepted") {
        const acceptedRequest = requests.find((request) => request._id === id);
        const partnerId = acceptedRequest?.sender?._id;

        alert("Request accepted. Opening chat now.");

        if (partnerId) {
          navigate(`/chat/${partnerId}`);
          return;
        }
      }

      alert(`Request ${status} successfully.`);
    } catch (err) {
      console.log(err);
      alert("Unable to update the request right now.");
    }
  };

  const handleScheduled = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((request) =>
        request._id === updatedRequest._id ? updatedRequest : request
      )
    );
  };

  if (loading) {
    return <h4 className="text-center mt-3">Loading Requests...</h4>;
  }

  if (requests.length === 0) {
    return <p className="text-center text-muted mt-3">No received requests available yet.</p>;
  }

  return (
    <div className="row">
      {requests.map((request) => (
        <div key={request._id} className="col-md-6 mb-4">
          <div className="card shadow-sm p-3 h-100 border-0">
            <h5 className="fw-bold">{request.sender?.name || "Unknown User"}</h5>

            <p>
              Wants to learn: <strong>{request.skill?.name || "Unknown Skill"}</strong>
            </p>

            {request.message && (
              <p className="text-muted">
                Message: {request.message}
              </p>
            )}

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

            {request.status === "pending" && (
              <div>
                <button
                  className="btn btn-success me-2"
                  onClick={() => updateStatus(request._id, "accepted")}
                >
                  Accept
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => updateStatus(request._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}

            {request.status === "accepted" && (
              <div className="mt-3">
                <div className="d-flex gap-2 flex-wrap mb-3">
                  <button
                    className="btn btn-info"
                    onClick={() => {
                      navigate(`/chat/${request.sender._id}`);
                    }}
                  >
                    Chat
                  </button>

                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      navigate(`/video/${request.sender._id}`);
                    }}
                  >
                    Video Call
                  </button>
                </div>

                <ScheduleMeeting
                  requestId={request._id}
                  onScheduled={handleScheduled}
                />

                <FeedbackForm currentUserId={currentUserId} toUserId={request.sender._id} />
                <Reviews userId={request.sender._id} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReceivedRequests;
