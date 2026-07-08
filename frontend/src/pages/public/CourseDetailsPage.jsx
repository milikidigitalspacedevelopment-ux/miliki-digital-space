import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CourseSidebarCard from "../../components/sidebars/CourseSidebarCard";
import CourseCard from "../../components/cards/CourseCard";
import CTASection from "../../components/sections/CTASection";

import courseService from "../../services/courseService";
import useAuth from "../../hooks/useAuth";

const getSummaryText = (value, maxLength = 160) => {
  if (!value) return "More details coming soon.";

  const normalized = String(value).replace(/\s+/g, " ").trim();
  if (!normalized) return "More details coming soon.";

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

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.content || item?.title || "";
      })
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);
  const [enrollSuccess, setEnrollSuccess] = useState(null);

  useEffect(() => {
    loadCourse();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    if (isAuthenticated) {
      loadEnrollment();
    } else {
      setIsEnrolled(false);
    }
  }, [id, isAuthenticated]);

  const loadCourse = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await courseService.getCourseById(id);
      const courseData = response?.data || response;

      const normalizedCourse = {
        ...courseData,
        title: courseData?.title || "Untitled course",
        image:
          courseData?.image_url ||
          courseData?.image ||
          courseData?.thumbnail ||
          "/images/course.jpg",
        overview: getSummaryText(
          courseData?.description ||
            courseData?.short_description ||
            courseData?.overview ||
            "More details coming soon.",
          180
        ),
        duration: getDurationText(courseData),
        level: courseData?.level || courseData?.difficulty || "Beginner",
        certificate: courseData?.certificate || "Certificate provided",
        language: courseData?.language || "English",
        delivery_mode: courseData?.delivery_mode || "Online",
        class_schedule: courseData?.class_schedule || "Flexible",
        next_intake: courseData?.next_intake || "To be announced",
        instructor_name: courseData?.instructor_name || courseData?.instructor || "TBD",
        category_name: courseData?.category_name || courseData?.category || "General",
        program_name: courseData?.program_name || courseData?.program || "Core Program",
        learn: normalizeList(courseData?.learning_outcomes || courseData?.learn || []),
        requirements: normalizeList(courseData?.requirements || courseData?.prerequisites || []),
        opportunities: normalizeList(courseData?.career_opportunities || courseData?.opportunities || []),
      };

      setCourse(normalizedCourse);

      // Track popularity (fire-and-forget)
      courseService.trackPopularity(id).catch(() => null);

      const coursesResponse = await courseService.getCourses({ status: "published" });
      const publishedCourses = Array.isArray(coursesResponse)
        ? coursesResponse
        : coursesResponse?.data || [];

      const categoryName = normalizedCourse.category_name?.toLowerCase() || "";

      setRelatedCourses(
        publishedCourses
          .filter(
            (item) =>
              item.id !== normalizedCourse.id &&
              (item.category_name || item.category || "").toLowerCase() === categoryName
          )
          .slice(0, 3)
      );
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load course details at this time.");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollment = async () => {
    try {
      const enrolled = await courseService.getCourseEnrollmentStatus(id);
      setIsEnrolled(Boolean(enrolled));
    } catch (err) {
      console.warn("Unable to load enrollment status", err);
      setIsEnrolled(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    setEnrollError(null);
    setEnrollSuccess(null);

    try {
      await courseService.enrollCourse(id);
      setIsEnrolled(true);
      setEnrollSuccess("You are now enrolled in this course.");
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      if (err?.response?.status === 409) {
        setIsEnrolled(true);
        setEnrollError(serverMessage || "You are already enrolled in this course.");
      } else {
        setEnrollError(serverMessage || "Unable to enroll at this time.");
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <section className="container py-5">
        <div className="text-center py-5">Loading course details…</div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section className="container py-5">
        <div className="text-center py-5 text-danger">
          {error || "Course not found."}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="container py-5">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Courses", path: "/courses" },
            { label: course.title },
          ]}
        />

        <div className="row gx-4 gy-5">
          <div className="col-12 col-xl-8">
            <div className="mb-4 rounded-5 overflow-hidden shadow-sm">
              <img
                src={course.image}
                alt={course.title}
                className="img-fluid w-100"
              />
            </div>

            <div className="mb-5">
              <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start">
                <div>
                  <span className="text-uppercase text-muted small">{course.category_name}</span>
                  <h1 className="fw-bold mt-2 mb-3">{course.title}</h1>
                  <div className="text-secondary mb-3">{course.overview}</div>
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row flex-wrap gap-3">
                <div className="badge bg-primary bg-opacity-15 text-primary rounded-pill py-2 px-3">
                  {course.program_name}
                </div>
                <div className="badge bg-secondary bg-opacity-15 text-secondary rounded-pill py-2 px-3">
                  {course.instructor_name}
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="fw-bold mb-4">What You&rsquo;ll Learn</h3>
              <div className="row g-3">
                {course.learn.length > 0 ? (
                  course.learn.map((item) => (
                    <div className="col-12 col-sm-6" key={item}>
                      <div className="p-3 rounded-4 bg-light border border-1 border-white shadow-sm small text-secondary">
                        <strong className="me-2 text-success">✓</strong>
                        {item}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-muted">No learning outcomes listed yet.</div>
                )}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="fw-bold mb-4">Requirements</h3>
              <div className="row g-3">
                {course.requirements.length > 0 ? (
                  course.requirements.map((item) => (
                    <div className="col-12 col-sm-6" key={item}>
                      <div className="p-3 rounded-4 border border-light shadow-sm small text-secondary">
                        <span className="me-2">•</span>
                        {item}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-muted">No prerequisites are required.</div>
                )}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="fw-bold mb-4">Career Opportunities</h3>
              <div className="row g-3">
                {course.opportunities.length > 0 ? (
                  course.opportunities.map((item) => (
                    <div className="col-12 col-sm-6" key={item}>
                      <div className="p-3 rounded-4 bg-white border border-1 border-light shadow-sm small text-secondary">
                        <span className="me-2">→</span>
                        {item}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-muted">Career paths will be added soon.</div>
                )}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="fw-bold mb-4">Related Courses</h3>
              {relatedCourses.length > 0 ? (
                <div className="course-grid">
                  {relatedCourses.map((relatedCourse) => (
                    <div className="course-card-wrapper" key={relatedCourse.id}>
                      <CourseCard course={relatedCourse} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted">No related courses found in this category.</div>
              )}
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <CourseSidebarCard
              duration={course.duration}
              level={course.level}
              certificate={course.certificate}
              language={course.language}
              deliveryMode={course.delivery_mode}
              schedule={course.class_schedule}
              nextIntake={course.next_intake}
              isEnrolled={isEnrolled}
              enrolling={enrolling}
              onEnroll={handleEnroll}
              enrollError={enrollError}
              enrollSuccess={enrollSuccess}
            />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

export default CourseDetailsPage;
