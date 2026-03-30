import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Browse = ({ skills, currentUserId }) => {

  const [search, setSearch] = useState("");

  const filtered = skills.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendRequest = async (skill) => {
    try {

      const res = await fetch("http://localhost:8000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender: currentUserId,
          receiver: skill.userId,
          skill: skill._id,
          message: "I want to learn this skill"
        })
      });

      if (res.ok) {
        alert("Request Sent ✅");
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>

      <Navbar />

      <div className="container mt-5">

        <h2 className="text-center mb-4">Browse Skills</h2>

        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search skill..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="row">

          {filtered.map(skill => (

            <div className="col-md-4 mb-3" key={skill._id}>

              <div className="card shadow p-3">

                <h5>{skill.name}</h5>

                <button
                  className="btn btn-primary"
                  onClick={() => sendRequest(skill)}
                >
                  Send Request
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default Browse;