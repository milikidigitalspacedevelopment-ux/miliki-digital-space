import React from "react";

const CourseSidebarCard = ({
  duration,
  level,
  certificate,
  language,
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
        Course Information
      </h5>

      <div className="mb-3">
        <strong>Duration</strong>
        <div>{duration}</div>
      </div>

      <div className="mb-3">
        <strong>Level</strong>
        <div>{level}</div>
      </div>

      <div className="mb-3">
        <strong>Certificate</strong>
        <div>{certificate}</div>
      </div>

      <div className="mb-4">
        <strong>Language</strong>
        <div>{language}</div>
      </div>

      <button className="btn btn-primary w-100 rounded-pill">
        Enroll Now
      </button>
    </div>
  );
};

export default CourseSidebarCard;