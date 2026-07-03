import { Link } from "react-router-dom";
import {
  FaClock,
  FaUserGraduate
} from "react-icons/fa";

function CourseCard({ course }) {
  const title = course.title || course.name || "Untitled course";
  const instructor = course.instructor || course.instructor_name || "Instructor";
  const duration = course.duration || (course.duration_hours ? `${course.duration_hours} hrs` : "Flexible");
  const students = course.students_count || course.students || course.enrollments || 0;
  const category = course.category_name || course.category || "Course";
  const image = course.image || course.thumbnail || "/images/course.jpg";
  const courseId = course.slug || course.id;

  return (
    <article className="course-card shadow-sm">
      <div className="course-card-media">
        <img src={image} alt={title} />
        <span className="course-card-badge">{category}</span>
      </div>

      <div className="course-card-body">
        <p className="course-card-subtitle">{instructor}</p>
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-text">
          {course.description || course.overview || "Learn the skills that matter most."}
        </p>
      </div>

      <div className="course-card-footer">
        <div className="course-card-stats">
          <span className="course-card-chip">
            <FaClock className="me-2" />
            {duration}
          </span>
          <span className="course-card-chip">
            <FaUserGraduate className="me-2" />
            {students} students
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