import React from "react";
import Navbar from "../components/Navbar";

const Login = () => {
  return (
    <div>
      <Navbar />

      <div className="container mt-5">
        <div className="card p-4 shadow mx-auto" style={{maxWidth:"400px"}}>

          <h3 className="text-center mb-3">Login</h3>

          <input className="form-control mb-3" placeholder="Email" />
          <input className="form-control mb-3" placeholder="Password" type="password" />

          <button className="btn btn-dark w-100">Login</button>

        </div>
      </div>

    </div>
  );
};

export default Login;