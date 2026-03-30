import React, { useEffect, useState } from "react";
import { getReceivedRequests } from "../api/requestApi";

const ReceivedRequests = ({ currentUserId }) => {

  const [requests, setRequests] = useState([]);

  // 🔥 Fetch Requests
  const fetchRequests = async () => {
    const data = await getReceivedRequests(currentUserId);
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, [currentUserId]);

  // 🔥 Accept / Reject function
  const updateStatus = async (id, status) => {
    try {

      await fetch(`http://localhost:8000/api/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      alert(`Request ${status} ✅`);

      // 🔁 Refresh list
      fetchRequests();

    } catch (err) {
      console.log(err);
      alert("Error updating request ❌");
    }
  };

  return (

    <div className="container">


      {requests.length === 0 ? (

        <p className="text-center">No requests found</p>

      ) : (

        <div className="row">

          {requests.map((r) => (

            <div className="col-md-6 mb-4" key={r._id}>

              <div className="card shadow p-3">

                <h5>{r.sender?.name}</h5>

                <p className="mb-1">
                  Wants to learn: <strong>{r.skill?.name}</strong>
                </p>

                <p className="text-muted">
                  Message: {r.message || "No message"}
                </p>

                <p>
                  Status:{" "}
                  <span
                    className={
                      r.status === "accepted"
                        ? "text-success"
                        : r.status === "rejected"
                        ? "text-danger"
                        : "text-warning"
                    }
                  >
                    {r.status}
                  </span>
                </p>

                {/* 🔥 Buttons only if pending */}
                {r.status === "pending" && (
                  <div>

                    <button
                      className="btn btn-success me-2"
                      onClick={() => updateStatus(r._id, "accepted")}
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => updateStatus(r._id, "rejected")}
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
};

export default ReceivedRequests;