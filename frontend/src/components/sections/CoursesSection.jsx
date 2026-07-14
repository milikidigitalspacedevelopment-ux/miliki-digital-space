import { useEffect, useState } from "react";
import CourseCard from "../cards/CourseCard";
import publicCourseService from "../../services/publicCourseService";

function CoursesSection() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const response = await publicCourseService.getPublicCourses();
      setCourses(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="py-3 bg-light">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
          <div>
            <h2 className="fw-bold mb-2">Popular Courses</h2>
            <p className="text-muted mb-0">
              Explore a curated selection of practical courses designed to help you grow.
            </p>
          </div>
        </div>

        <div className="course-grid public-courses-grid">
          {courses.slice(0, 8).map((course) => (
            <div className="course-card-wrapper" key={course.id || course.slug || course.title}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CoursesSection;
