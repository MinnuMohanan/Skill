import React from "react";

const categories = [
  { name: "All", label: "ALL" },
  { name: "Care", label: "CARE/SITTING" },
  { name: "IT", label: "COMPUTER/IT" },
  { name: "Education", label: "EDUCATION" },
  { name: "Cooking", label: "COOKING" },
  { name: "Design", label: "DESIGN" },
  { name: "Language", label: "LANGUAGE" },
  { name: "Music", label: "MUSIC" },
  { name: "Fitness", label: "FITNESS" },
  { name: "Business", label: "BUSINESS" },
  { name: "Others", label: "OTHERS" }
];

const CategoryBar = ({ selected, setSelected }) => {
  return (
    <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
      {categories.map((cat) => (
        <button
          key={cat.name}
          className={`btn ${
            selected === cat.name ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setSelected(cat.name)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
