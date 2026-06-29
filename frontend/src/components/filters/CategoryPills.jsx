import React from "react";

const CategoryPills = ({
  categories = [],
  activeCategory,
  onSelect,
}) => {
  return (
    <div className="d-flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          className={`btn rounded-pill px-4 ${
            activeCategory === category
              ? "btn-success"
              : "btn-outline-secondary"
          }`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;