import React from "react";

const EmptyState = ({ text = "No data found" }) => {
  return <p className="text-center text-muted mt-4">{text}</p>;
};

export default EmptyState;
