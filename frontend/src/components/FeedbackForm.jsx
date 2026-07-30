import React, { useState } from "react";
import api from "../api/api";

const FeedbackForm = ({ currentUserId, toUserId }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!currentUserId || !toUserId) {
      alert("Feedback cannot be submitted for this user.");
      return;
    }

    if (String(currentUserId) === String(toUserId)) {
      alert("You cannot submit feedback for your own account.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/feedback", {
        toUser: toUserId,
        rating,
        review: review.trim()
      });

      alert("Feedback submitted successfully.");
      setReview("");
      setRating(5);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to submit feedback right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-3 mt-3 border-0 shadow-sm">
      <h5 className="fw-bold mb-2">Give Feedback</h5>

      <div className="d-flex align-items-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="btn btn-sm p-0 border-0 bg-transparent"
            onClick={() => setRating(star)}
            aria-label={`Rate ${star}`}
            style={{ fontSize: "1.4rem", lineHeight: 1, color: star <= rating ? "#f59e0b" : "#cbd5e1" }}
          >
            ★
          </button>
        ))}
        <span className="text-muted small">{rating}/5</span>
      </div>

      <textarea
        className="form-control mb-2"
        placeholder="Write your review..."
        rows="3"
        value={review}
        maxLength={500}
        onChange={(e) => setReview(e.target.value)}
      />

      <div className="text-muted small mb-2 text-end">{review.length}/500</div>

      <button className="btn btn-success" onClick={submitFeedback} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default FeedbackForm;
