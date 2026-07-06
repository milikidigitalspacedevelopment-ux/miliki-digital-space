import React from "react";

const CourseSidebarCard = ({
  duration,
  level,
  certificate,
  language,
  deliveryMode,
  schedule,
  nextIntake,
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
      <h5 className="fw-bold mb-4">Course Information</h5>

      <div className="mb-3">
        <strong>Duration</strong>
        <div>{duration || "Flexible"}</div>
      </div>

      <div className="mb-3">
        <strong>Level</strong>
        <div>{level || "Beginner"}</div>
      </div>

      <div className="mb-3">
        <strong>Delivery</strong>
        <div>{deliveryMode || "Online"}</div>
      </div>

      <div className="mb-3">
        <strong>Schedule</strong>
        <div>{schedule || "Flexible"}</div>
      </div>

      <div className="mb-3">
        <strong>Next Intake</strong>
        <div>{nextIntake || "To be announced"}</div>
      </div>

      <div className="mb-3">
        <strong>Certificate</strong>
        <div>{certificate || "Certificate provided"}</div>
      </div>

      <div className="mb-4">
        <strong>Language</strong>
        <div>{language || "English"}</div>
      </div>

      <button className="btn btn-primary w-100 rounded-pill">Enroll Now</button>
    </div>
  );
};

export default CourseSidebarCard;