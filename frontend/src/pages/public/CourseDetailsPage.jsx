import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CourseSidebarCard from "../../components/sidebars/CourseSidebarCard";
import CourseCard from "../../components/cards/CourseCard";
import CTASection from "../../components/sections/CTASection";

import courseService from "../../services/courseService";

function CourseDetailsPage() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const response = await courseService.getCourseById(id);
      const courseData = response?.data || response;

      const normalizedCourse = {
        ...courseData,
        title: courseData?.title || "Untitled course",
        image: courseData?.image || "/images/course.jpg",
        overview: courseData?.overview || courseData?.description || "More details coming soon.",
        duration: courseData?.duration || courseData?.duration_hours || "Flexible",
        level: courseData?.level || "Beginner",
        certificate: courseData?.certificate || "Yes",
        language: courseData?.language || "English",
        learn: courseData?.learn || ["Practical skills", "Mentorship", "Hands-on practice"],
        requirements: courseData?.requirements || ["Basic computer literacy"],
        instructor:
          courseData?.instructor ||
          (courseData?.instructor_name && {
            name: courseData.instructor_name,
            title: "Course instructor",
            image: "/images/instructor.jpg",
          }) || {
            name: "Instructor",
            title: "Course instructor",
            image: "/images/instructor.jpg",
          },
      };

      setCourse(normalizedCourse);

      const allPublished = await courseService.getCourses({ status: "Published" });
      const publishedCourses = Array.isArray(allPublished)
        ? allPublished
        : allPublished?.data || [];
      const categoryName = (courseData.category_name || courseData.category || "").toLowerCase();

      setRelatedCourses(
        publishedCourses
          .filter(
            (item) =>
              item.id !== normalizedCourse.id &&
              (item.category_name || item.category || "").toLowerCase() === categoryName
          )
          .slice(0, 3)
      );
    } catch (error) {
      console.error(error);
      setCourse(null);
    }
  };

  if (!course) return null;

  return (
    <>
      <section className="container py-5">

        <Breadcrumbs
          items={[
            {
              label: "Home",
              path: "/"
            },
            {
              label: "Courses",
              path: "/courses"
            },
            {
              label: course.title
            }
          ]}
        />

        <div className="row g-5">

          <div className="col-lg-8">

            <img
              src={course.image}
              alt={course.title}
              className="img-fluid rounded-5 shadow mb-4"
            />

            <h1 className="fw-bold mb-4">
              {course.title}
            </h1>

            <p className="lead text-secondary">
              {course.overview}
            </p>

            <div className="mt-5">

              <h3 className="fw-bold mb-4">
                What You'll Learn
              </h3>

              <div className="row g-3">

                {course.learn.map(item => (
                  <div
                    className="col-md-6"
                    key={item}
                  >
                    <div className="p-4 rounded-5 bg-light shadow-sm">
                      ✓ {item}
                    </div>
                  </div>
                ))}

              </div>

            </div>

            <div className="mt-5">

              <h3 className="fw-bold mb-4">
                Requirements
              </h3>

              <ul className="list-group rounded-4 shadow-sm">

                {course.requirements.map(req => (
                  <li
                    className="list-group-item"
                    key={req}
                  >
                    {req}
                  </li>
                ))}

              </ul>

            </div>

            <div className="mt-5">

              <h3 className="fw-bold mb-4">
                Instructor
              </h3>

              <div className="card border-0 shadow rounded-5 p-4">

                <div className="d-flex align-items-center gap-4">

                  <img
                    src={course.instructor.image}
                    alt=""
                    width="90"
                    height="90"
                    className="rounded-circle"
                  />

                  <div>

                    <h5 className="fw-bold">
                      {course.instructor.name}
                    </h5>

                    <p className="text-muted mb-0">
                      {course.instructor.title}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="mt-5">
              <h3 className="fw-bold mb-4">Related Courses</h3>

              {relatedCourses.length === 0 ? (
                <p className="text-muted">More courses will be added soon.</p>
              ) : (
                <div className="course-grid">
                  {relatedCourses.map((relatedCourse) => (
                    <div className="course-card-wrapper" key={relatedCourse.id}>
                      <CourseCard course={relatedCourse} />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="col-lg-4">

            <CourseSidebarCard
              duration={course.duration}
              level={course.level}
              certificate={course.certificate}
              language={course.language}
            />

          </div>

        </div>

      </section>

      <CTASection />
    </>
  );
}

export default CourseDetailsPage;