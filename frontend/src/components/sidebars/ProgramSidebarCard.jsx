import React from "react";

const ProgramSidebarCard = ({
  duration,
  category,
  students,
  startDate,
}) => {
  return (
    <div
      className="p-4 shadow"
      style={{
        borderRadius: "30px",
        position: "sticky",
        top: "100px",
        background: "rgba(255,255,255,.9)",
        backdropFilter: "blur(15px)",
      }}
    >
      <h5 className="fw-bold mb-4">
        Program Details
      </h5>

      <div className="mb-3">
        <strong>Duration</strong>
        <div>{duration}</div>
      </div>

      <div className="mb-3">
        <strong>Category</strong>
        <div>{category}</div>
      </div>

      <div className="mb-3">
        <strong>Students</strong>
        <div>{students}</div>
      </div>

      <div className="mb-4">
        <strong>Start Date</strong>
        <div>{startDate}</div>
      </div>

      <button className="btn btn-success w-100 rounded-pill">
        Apply Now
      </button>
    </div>
  );
};

export default ProgramSidebarCard;