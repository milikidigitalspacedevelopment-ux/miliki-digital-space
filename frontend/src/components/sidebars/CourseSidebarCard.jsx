import React from "react";

const CourseSidebarCard = ({
  duration,
  level,
  certificate,
  language,
  deliveryMode,
  schedule,
  nextIntake,
  isEnrolled = false,
  enrolling = false,
  onEnroll,
  enrollError,
  enrollSuccess,
}) => {
  const buttonText = isEnrolled
    ? "Enrolled"
    : enrolling
    ? "Enrolling..."
    : "Enroll Now";

  return (
    <div
      className="p-4 shadow course-sidebar-card"
      style={{
        borderRadius: "30px",
        position: "sticky",
        top: "100px",
        background: "rgba(255,255,255,.9)",
        backdropFilter: "blur(15px)",
      }}
    >
      <h5 className="fw-bold mb-4">Course Information</h5>

      {/** Render helper to show strings or lists when value contains multiple points */}
      {(() => {
        const splitIntoPoints = (value) =>
          String(value || "")
            .split(/\r?\n|;|(?<=[.!?])\s+/)
            .map((item) => item.trim())
            .filter(Boolean);

        const renderField = (label, value, fallback) => {
          const points = Array.isArray(value) ? value.flatMap(splitIntoPoints) : splitIntoPoints(value);
          return (
            <div className="mb-3" key={label}>
              <strong>{label}</strong>
              {points.length > 1 ? (
                <ul className="course-info-list mt-1 mb-0 small">
                  {points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              ) : (
                <div className="mt-1">{points[0] || fallback}</div>
              )}
            </div>
          );
        };

        return (
          <>
            {renderField("Duration", duration, "Flexible")}
            {renderField("Level", level, "Beginner")}
            {renderField("Delivery", deliveryMode, "Online")}
            {renderField("Schedule", schedule, "Flexible")}
            {renderField("Next Intake", nextIntake, "To be announced")}
            {renderField("Certificate", certificate, "Certificate provided")}
            {renderField("Language", language, "English")}
          </>
        );
      })()}

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

      <button
        className="btn btn-primary w-100 rounded-pill enroll-btn"
        onClick={onEnroll}
        disabled={isEnrolled || enrolling}
      >
        {buttonText}
      </button>

      {enrollError ? (
        <div className="mt-3 text-danger small">{enrollError}</div>
      ) : null}

      {enrollSuccess ? (
        <div className="mt-3 text-success small">{enrollSuccess}</div>
      ) : null}

      <div className="course-enroll-fixed d-none d-lg-block">
        <button
          className="btn btn-primary w-100 rounded-pill"
          onClick={onEnroll}
          disabled={isEnrolled || enrolling}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CourseSidebarCard;