import React, { useState } from "react";

const SkillsList = ({ skills }) => {

  const [search, setSearch] = useState("");

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="container mt-5">

      <h3 className="text-center mb-4">Search Skills</h3>

      {/* Search Box */}

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search skill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Skills Cards */}

      <div className="row">

        {filteredSkills.map((skill) => (

          <div className="col-md-4 mb-3" key={skill._id}>

            <div className="card shadow p-3">

              <h5>{skill.name}</h5>

              <button className="btn btn-primary mt-2">
                Request
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default SkillsList;