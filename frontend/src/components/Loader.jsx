import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return <div className="text-center mt-5">{text}</div>;
};

export default Loader;
