import React, { useEffect, useState } from "react";
import api from "../api/api";

const StarDisplay = ({ value }) => {
  const rounded = Math.round(Number(value) || 0);
  return (
    <span style={{ color: "#f59e0b", letterSpacing: "1px" }}>
      {"★".repeat(rounded)}
      <span style={{ color: "#cbd5e1" }}>{"★".repeat(5 - rounded)}</span>
    </span>
  );
};

const Reviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) return;
      try {
        const { data } = await api.get(`/feedback/${userId}`);
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();
  }, [userId]);

  const avg =
    reviews.length > 0
      ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1)
      : "0.0";

  return (
    <div className="mt-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="fw-bold mb-0">Reviews</h5>
        <span className="badge bg-light text-dark border">
          <StarDisplay value={avg} /> {avg} ({reviews.length})
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="card p-3 border-0 shadow-sm text-muted">No reviews yet.</div>
      ) : (
        reviews.map((item) => (
          <div key={item._id} className="card p-3 mb-2 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <strong>{item.fromUser?.name || "Anonymous"}</strong>
              <StarDisplay value={item.rating} />
            </div>
            <p className="mb-0 text-muted">{item.review || "No written review"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;
