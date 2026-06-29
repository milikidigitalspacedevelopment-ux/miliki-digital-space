import { Link } from "react-router-dom";
import {
  FaClock,
  FaUserGraduate
} from "react-icons/fa";

function CourseCard({ course }) {
  return (
    <div className="card shadow-sm border-0 h-100">

      <img
        src={course.image}
        className="card-img-top"
        alt={course.title}
      />

      <div className="card-body">

        <h5 className="fw-bold">
          {course.title}
        </h5>

        <p className="text-muted">
          Instructor: {course.instructor}
        </p>

        <div className="d-flex justify-content-between mt-3">

          <small>
            <FaClock className="me-2" />
            {course.duration}
          </small>

          <small>
            <FaUserGraduate className="me-2" />
            {course.students_count}
          </small>

        </div>

      </div>

      <div className="card-footer bg-white border-0">
        <Link
          to={`/courses/${course.slug}`}
          className="btn btn-success w-100"
        >
          View Course
        </Link>
      </div>

    </div>
  );
}

export default CourseCard;