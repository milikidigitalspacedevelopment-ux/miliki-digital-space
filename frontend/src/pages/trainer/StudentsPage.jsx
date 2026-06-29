import { useEffect, useState } from "react";
import {
  Users,
  Mail,
  Eye,
  BookOpen,
  Award,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import TableSearch from "../../components/tables/TableSearch";
import TablePagination from "../../components/tables/TablePagination";

import userService from "../../services/userService";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = students.filter((student) =>
        student.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response =
        await userService.getStudents?.();

      setStudents(response || []);
      setFilteredStudents(response || []);
    } catch (err) {
      setError("Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentStudents =
    filteredStudents.slice(firstIndex, lastIndex);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Students Error"
        message={error}
        onRetry={fetchStudents}
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="mb-4">

        <h2 className="fw-bold mb-1">

          Students

        </h2>

        <p className="text-muted">

          Monitor student performance and progress.

        </p>

      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">

        <div className="card-body">

          <TableSearch
            value={searchTerm}
            placeholder="Search students..."
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

      </div>

      {/* Students */}

      <div className="row g-4">

        {currentStudents.map((student) => (

          <div
            key={student.id}
            className="col-xl-4 col-md-6"
          >

            <div className="card border-0 shadow-sm rounded-5 h-100">

              <div className="card-body">

                <div className="text-center mb-4">

                  <img
                    src={
                      student.avatar ||
                      "https://via.placeholder.com/120"
                    }
                    alt={student.fullName}
                    className="rounded-circle border"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                    }}
                  />

                  <h5 className="fw-bold mt-3 mb-1">

                    {student.fullName}

                  </h5>

                  <small className="text-muted">

                    {student.email}

                  </small>

                </div>

                <div className="mb-3">

                  <div className="d-flex align-items-center mb-2">

                    <BookOpen
                      size={18}
                      className="text-primary me-2"
                    />

                    <span>

                      {student.enrolledCourses || 0}
                      {" "}Courses

                    </span>

                  </div>

                  <div className="d-flex align-items-center mb-2">

                    <Award
                      size={18}
                      className="text-success me-2"
                    />

                    <span>

                      Average Grade:
                      {" "}
                      {student.averageGrade || 0}%

                    </span>

                  </div>

                  <div>

                    <div className="d-flex justify-content-between mb-1">

                      <small>Completion</small>

                      <small>

                        {student.completionRate || 0}%

                      </small>

                    </div>

                    <div className="progress">

                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${student.completionRate || 0}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

                <div className="d-flex gap-2">

                  <button className="btn btn-outline-primary rounded-pill flex-fill">

                    <Eye size={16} className="me-2" />

                    View

                  </button>

                  <button className="btn btn-outline-success rounded-pill flex-fill">

                    <Mail size={16} className="me-2" />

                    Contact

                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Empty */}

      {!currentStudents.length && (
        <div className="card border-0 shadow-sm rounded-5 mt-4">

          <div className="card-body text-center py-5">

            <Users
              size={50}
              className="text-secondary mb-3"
            />

            <h5>No students found</h5>

            <p className="text-muted">

              Try another search term.

            </p>

          </div>

        </div>
      )}

      {/* Pagination */}

      <div className="mt-5">

        <TablePagination
          currentPage={currentPage}
          totalItems={filteredStudents.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

      </div>

    </div>
  );
}

export default StudentsPage;