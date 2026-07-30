import React from "react";
import { Link } from "react-router-dom";

const NextStepPanel = ({ title, description, primaryTo, primaryLabel, secondaryTo, secondaryLabel }) => {
  return (
    <div className="card border-0 shadow-sm p-4 mt-4">
      <div className="section-eyebrow mb-2">Next Step</div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted mb-3">{description}</p>
      <div className="d-flex flex-wrap gap-2">
        <Link to={primaryTo} className="btn btn-primary">
          {primaryLabel}
        </Link>
        {secondaryTo && secondaryLabel && (
          <Link to={secondaryTo} className="btn btn-outline-dark">
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
};

export default NextStepPanel;
