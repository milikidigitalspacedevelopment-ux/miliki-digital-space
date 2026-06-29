import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="mb-4">
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${
              index === items.length - 1 ? "active" : ""
            }`}
          >
            {index === items.length - 1 ? (
              item.label
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;