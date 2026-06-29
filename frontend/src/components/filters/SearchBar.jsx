import React from "react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="position-relative">
      <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>

      <input
        type="text"
        className="form-control ps-5 py-3 rounded-pill shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;