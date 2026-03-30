import React from "react";
import Navbar from "../components/Navbar";
import ReceivedRequests from "../components/ReceivedRequests";

const Requests = ({ currentUserId }) => {
  return (
    <div>
      <Navbar />
      <ReceivedRequests currentUserId={currentUserId} />
    </div>
  );
};

export default Requests;