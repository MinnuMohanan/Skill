import React from "react";
import Navbar from "../components/Navbar";

const Signup = () => {
  return (
    <div>
      <Navbar />

      <div className="container mt-5">
        <div className="card p-4 shadow mx-auto" style={{maxWidth:"400px"}}>

          <h3 className="text-center mb-3">Sign Up</h3>

          <input className="form-control mb-3" placeholder="Name" />
          <input className="form-control mb-3" placeholder="Email" />
          <input className="form-control mb-3" placeholder="Password" type="password" />

          <button className="btn btn-primary w-100">Sign Up</button>

        </div>
      </div>

    </div>
  );
};

export default Signup;