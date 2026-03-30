import React, { useState } from "react";

const RequestForm = ({ users = [], skills = [], currentUserId }) => {

  const [receiver, setReceiver] = useState("");
  const [skill, setSkill] = useState("");
  const [message, setMessage] = useState("");

  // ❗ Fix 1: Remove current user from receiver list
  const filteredUsers = users.filter(u => u._id !== currentUserId);

  // ❗ Fix 2: Show ALL skills (temporary debugging)
  const filteredSkills = skills; 
  // later: skills.filter(s => s.userId === receiver)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receiver || !skill || !message) {
      alert("All fields required");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender: currentUserId,
          receiver,
          skill,
          message
        })
      });

      if (res.ok) {
        alert("Request sent successfully!");
        setReceiver("");
        setSkill("");
        setMessage("");
      } else {
        alert("Error sending request");
      }

    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "700px" }}>

        <h3 className="text-center mb-4">Send Skill Request</h3>

        <form onSubmit={handleSubmit}>

          {/* RECEIVER */}
          <div className="mb-3">
            <label className="form-label">Select Receiver</label>

            <select
              className="form-select"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            >
              <option value="">--Select Receiver--</option>

              {filteredUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* SKILL */}
          <div className="mb-3">
            <label className="form-label">Select Skill</label>

            <select
              className="form-select"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            >
              <option value="">--Select Skill--</option>

              {filteredSkills.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* MESSAGE */}
          <div className="mb-3">
            <label className="form-label">Message</label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Send Request
          </button>

        </form>

      </div>
    </div>
  );
};

export default RequestForm;