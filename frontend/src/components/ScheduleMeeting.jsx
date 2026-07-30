import React, { useState } from "react";
import api from "../api/api";

const ScheduleMeeting = ({ requestId, onScheduled }) => {
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!scheduledAt) {
      alert("Please select a date and time.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.put(`/requests/${requestId}/schedule`, {
        scheduledAt
      });

      alert("Meeting scheduled successfully.");

      if (onScheduled) {
        onScheduled(data);
      }

      setScheduledAt("");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to schedule the meeting right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <label className="form-label fw-semibold">Schedule Meeting</label>

      <input
        type="datetime-local"
        className="form-control mb-2"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
      />

      <button className="btn btn-secondary w-100" onClick={handleSchedule} disabled={loading}>
        {loading ? "Scheduling..." : "Set Time"}
      </button>
    </div>
  );
};

export default ScheduleMeeting;
