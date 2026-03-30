import React, { useState } from "react";

const CreateProfile = () => {

  const [form, setForm] = useState({
    name: "",
    location: "",
    skillsOffered: "",
    skillsWanted: "",
    availability: ""
  });

  return (
    <div className="container mt-5">

      <h2>Create Profile</h2>

      <input placeholder="Name" className="form-control mb-2" />
      <input placeholder="Location" className="form-control mb-2" />
      <input placeholder="Skills Offered" className="form-control mb-2" />
      <input placeholder="Skills Wanted" className="form-control mb-2" />
      <input placeholder="Availability" className="form-control mb-2" />

      <button className="btn btn-primary">Save</button>

    </div>
  );
};

export default CreateProfile;