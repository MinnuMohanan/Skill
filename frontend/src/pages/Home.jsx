import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (

    <div>

      <Navbar />

      {/* HERO */}
      <div
        className="d-flex flex-column justify-content-center align-items-center text-white text-center"
        style={{
          height: "90vh",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        <h1 className="display-4 fw-bold text-warning">
          Connect • Exchange • Grow
        </h1>

        <p className="lead">
          Learn new skills by teaching what you know
        </p>

      </div>

      {/* FEATURES */}
      <div className="container mt-5">

        <div className="row text-center">

          <div className="col-md-4">
            <h4>Connect</h4>
            <p>Meet people with skills you want</p>
          </div>

          <div className="col-md-4">
            <h4>Exchange</h4>
            <p>Trade skills with others</p>
          </div>

          <div className="col-md-4">
            <h4>Grow</h4>
            <p>Improve your knowledge</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;