import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import TableSearch from "../../components/tables/TableSearch";
import TablePagination from "../../components/tables/TablePagination";
import ConfirmModal from "../../components/modals/ConfirmModal";

import courseService from "../../services/courseService";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = courses.filter((course) =>
        course.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response =
        await courseService.getTrainerCourses?.();

      setCourses(response || []);
      setFilteredCourses(response || []);
    } catch (err) {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await courseService.deleteCourse?.(
        selectedCourse.id
      );

      fetchCourses();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentCourses =
    filteredCourses.slice(firstIndex, lastIndex);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Courses Error"
        message={error}
        onRetry={fetchCourses}
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold mb-1">
            My Courses
          </h2>

          <p className="text-muted mb-0">
            Manage and monitor your courses.
          </p>

        </div>

        <button className="btn btn-primary rounded-pill">

          <Plus size={18} className="me-2" />

          New Course

        </button>

      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">

        <div className="card-body">

          <TableSearch
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Search courses..."
          />

        </div>

      </div>

      {/* Courses */}

      <div className="row g-4">

        {currentCourses.map((course) => (

          <div
            className="col-xl-4 col-md-6"
            key={course.id}
          >

            <div className="card border-0 shadow-sm rounded-5 h-100">

              <div className="card-body">

                <div className="d-flex justify-content-between mb-3">

                  <BookOpen
                    size={42}
                    className="text-primary"
                  />

                  <span
                    className={`badge ${
                      course.status === "Published"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {course.status}
                  </span>

                </div>

                <h5 className="fw-bold">

                  {course.title}

                </h5>

                <p className="text-muted">

                  {course.description}

                </p>

                <div className="d-flex align-items-center mb-4">

                  <Users
                    size={18}
                    className="text-secondary me-2"
                  />

                  <span>

                    {course.studentsCount || 0}
                    {" "}Students

                  </span>

                </div>

                <div className="d-flex gap-2">

                  <button className="btn btn-outline-primary flex-fill rounded-pill">

                    <Edit size={16} className="me-2" />

                    Edit

                  </button>

                  <button
                    className="btn btn-outline-danger flex-fill rounded-pill"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowDeleteModal(true);
                    }}
                  >

                    <Trash2 size={16} className="me-2" />

                    Delete

                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Pagination */}

      <div className="mt-5">

        <TablePagination
          currentPage={currentPage}
          totalItems={filteredCourses.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

      </div>

      {/* Delete Modal */}

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Course"
        message={`Delete "${selectedCourse?.title}"?`}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />

    </div>
  );
}

export default CoursesPage;