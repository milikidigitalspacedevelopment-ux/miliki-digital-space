import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";

const getSummaryText = (value, maxLength = 90) => {
  if (!value) return "Learn the skills that matter most.";

  const normalized = String(value).replace(/\s+/g, " ").trim();
  if (!normalized) return "Learn the skills that matter most.";

  const firstLine = normalized
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);

  const source = firstLine || normalized;
  if (source.length <= maxLength) return source;

  return `${source.slice(0, maxLength - 3).trimEnd()}...`;
};

const getDurationText = (course) => {
  if (course?.duration) return course.duration;

  const months = Number(course?.duration_months ?? 0);
  const weeks = Number(course?.duration_weeks_remaining ?? course?.duration_weeks ?? 0);

  if (months > 0 || weeks > 0) {
    const parts = [];
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
    return parts.join(" ") || "Flexible";
  }

  return "Flexible";
};

function CourseCard({ course }) {
  const title = course.title || course.name || "Untitled course";
  const duration = getDurationText(course);
  const category = course.category_name || course.category || "Course";
  const image = course.image_url || course.image || course.thumbnail || "/images/course.jpg";
  const courseId = course.slug || course.id;
  const description = getSummaryText(course.short_description || course.description || course.overview || "Learn the skills that matter most.");

  return (
    <article className="course-card shadow-sm">
      <div className="course-card-media">
        <img src={image} alt={title} />
        <span className="course-card-badge">{category}</span>
      </div>

      <div className="course-card-body">
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-text">{description}</p>
      </div>

      <div className="course-card-footer">
        <div className="course-card-stats">
          <span className="course-card-chip">
            <FaClock className="me-2" />
            {duration}
          </span>
        </div>

        <Link
          to={`/courses/${courseId}`}
          className="btn btn-success rounded-pill w-100 course-card-button"
        >
          Explore course
        </Link>
      </div>
    </article>
  );
}

export default CourseCard;
