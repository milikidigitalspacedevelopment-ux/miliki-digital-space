import React from "react";

const SortDropdown = ({
  value,
  onChange,
}) => {
  return (
    <select
      className="form-select rounded-pill shadow-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="popular">Most Popular</option>
      <option value="alphabetical">Alphabetical</option>
    </select>
  );
};

export default SortDropdown;