import { useEffect, useState } from "react";
import CourseCard from "../cards/CourseCard";
import courseService from "../../services/courseService";

function CoursesSection() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">

        <h2 className="fw-bold mb-4">
          Popular Courses
        </h2>

        <div className="row">

          {courses.slice(0, 6).map((course) => (
            <div
              className="col-lg-4 mb-4"
              key={course.id}
            >
              <CourseCard course={course} />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default CoursesSection;