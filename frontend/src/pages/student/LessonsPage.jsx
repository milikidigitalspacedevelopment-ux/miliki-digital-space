import { useEffect, useState } from "react";
import {
  PlayCircle,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

import CourseSidebarCard from "../../components/sidebars/CourseSidebarCard";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import courseService from "../../services/courseService";

function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);

      const response = await courseService.getLessons?.();

      setLessons(response || []);

      if (response?.length) {
        setSelectedLesson(response[0]);
      }
    } catch (err) {
      setError("Unable to load lessons.");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = lessons.findIndex(
    (lesson) => lesson.id === selectedLesson?.id
  );

  const goPrevious = () => {
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
    }
  };

  const goNext = () => {
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
    }
  };

  const markComplete = async () => {
    try {
      await courseService.markLessonComplete?.(selectedLesson.id);

      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === selectedLesson.id
            ? {
                ...lesson,
                completed: true,
              }
            : lesson
        )
      );

      setSelectedLesson((prev) => ({
        ...prev,
        completed: true,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Lessons Error"
        message={error}
        onRetry={fetchLessons}
      />
    );
  }

  if (!lessons.length) {
    return (
      <EmptyState
        title="No Lessons Found"
        description="Lessons will appear once a course becomes available."
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      <div className="row g-4">

        {/* Sidebar */}

        <div className="col-lg-3">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body">

              <h5 className="fw-bold mb-4">
                Course Lessons
              </h5>

              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="mb-3"
                  onClick={() => setSelectedLesson(lesson)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <CourseSidebarCard
                    title={lesson.title}
                    active={lesson.id === selectedLesson?.id}
                  />
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* Main Content */}

        <div className="col-lg-9">

          {/* Video */}

          <div className="card border-0 shadow-sm rounded-5 mb-4">

            <div className="card-body">

              <div
                className="bg-dark rounded-4 d-flex justify-content-center align-items-center"
                style={{
                  height: "400px",
                }}
              >
                <PlayCircle
                  size={90}
                  className="text-white"
                />
              </div>

            </div>

          </div>

          {/* Lesson Details */}

          <div className="card border-0 shadow-sm rounded-5 mb-4">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h3 className="fw-bold mb-0">
                  {selectedLesson.title}
                </h3>

                {selectedLesson.completed && (
                  <span className="badge bg-success rounded-pill">
                    Completed
                  </span>
                )}

              </div>

              <p className="text-muted">
                {selectedLesson.description}
              </p>

            </div>

          </div>

          {/* Attachments */}

          <div className="card border-0 shadow-sm rounded-5 mb-4">

            <div className="card-body">

              <h5 className="fw-bold mb-4">
                Resources
              </h5>

              {(selectedLesson.resources || []).length === 0 ? (
                <p className="text-muted mb-0">
                  No resources available.
                </p>
              ) : (
                selectedLesson.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center border rounded-4 p-3 mb-3"
                  >
                    <div className="d-flex align-items-center">

                      <FileText
                        size={20}
                        className="text-primary me-3"
                      />

                      {resource.name}

                    </div>

                    <button className="btn btn-light rounded-pill">

                      <Download size={16} />

                    </button>

                  </div>
                ))
              )}

            </div>

          </div>

          {/* Navigation */}

          <div className="d-flex justify-content-between">

            <button
              className="btn btn-outline-secondary rounded-pill"
              disabled={currentIndex === 0}
              onClick={goPrevious}
            >
              <ChevronLeft size={18} className="me-2" />
              Previous
            </button>

            <button
              className="btn btn-success rounded-pill"
              onClick={markComplete}
            >
              <CheckCircle size={18} className="me-2" />
              Mark Complete
            </button>

            <button
              className="btn btn-primary rounded-pill"
              disabled={currentIndex === lessons.length - 1}
              onClick={goNext}
            >
              Next
              <ChevronRight size={18} className="ms-2" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LessonsPage;