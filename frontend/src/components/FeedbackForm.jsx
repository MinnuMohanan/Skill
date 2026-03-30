import React, { useState } from "react";

const FeedbackForm = () => {

  const [review, setReview] = useState("");

  return (
    <div className="card p-3 mt-3">
      <h5>Feedback</h5>

      <textarea
        className="form-control mb-2"
        placeholder="Write review..."
        onChange={(e) => setReview(e.target.value)}
      />

      <button className="btn btn-warning">Submit</button>
    </div>
  );
};

export default FeedbackForm;