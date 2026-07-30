import React, { useEffect, useState } from "react";
import api from "../api/api";
import { getStoredJson } from "../utils/storage";

const AIRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const currentUser = getStoredJson("currentUser");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await api.post("/recommendations", {
          skillOffered: currentUser?.skillOffered || "",
          skillWanted: currentUser?.skillWanted || ""
        });

        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      fetchRecommendations();
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="card shadow-sm p-4 mt-4 border-0">
      <h4 className="mb-3">AI Recommended Skills</h4>

      {recommendations.length === 0 ? (
        <p className="text-muted">No recommendations available.</p>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {recommendations.map((skill, index) => (
            <span key={index} className="badge bg-primary p-2 fs-6">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendation;
