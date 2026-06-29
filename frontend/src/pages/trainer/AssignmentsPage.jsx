// src/pages/trainer/AssignmentsPage.jsx

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import TableSearch from "../../components/tables/TableSearch";
import TablePagination from "../../components/tables/TablePagination";

import courseService from "../../services/courseService";

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = assignments.filter((assignment) =>
        assignment.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
    setCurrentPage(1);
  }, [searchTerm, assignments]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const response =
        await courseService.getAssignments?.();

      setAssignments(response || []);
      setFilteredAssignments(response || []);
    } catch (err) {
      setError("Unable to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-primary";

      case "Graded":
        return "bg-success";

      case "Late":
        return "bg-danger";

      default:
        return "bg-warning";
    }
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentAssignments = filteredAssignments.slice(
    firstIndex,
    lastIndex
  );

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Assignments Error"
        message={error}
        onRetry={fetchAssignments}
      />
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          Assignments
        </h2>

        <p className="text-muted">
          Review submissions and grade assignments.
        </p>
      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">
          <TableSearch
            value={searchTerm}
            placeholder="Search assignments..."
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
      </div>

      {/* Cards */}

      <div className="row g-4">
        {currentAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="col-xl-4 col-md-6"
          >
            <div className="card border-0 shadow-sm rounded-5 h-100">

              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <ClipboardList
                    size={40}
                    className="text-primary"
                  />

                  <span
                    className={`badge ${getStatusBadge(
                      assignment.status
                    )}`}
                  >
                    {assignment.status}
                  </span>

                </div>

                <h5 className="fw-bold mb-3">
                  {assignment.title}
                </h5>

                <div className="mb-2">

                  <small className="text-muted">
                    Course
                  </small>

                  <div className="fw-semibold">
                    {assignment.course}
                  </div>

                </div>

                <div className="mb-2">

                  <small className="text-muted">
                    Due Date
                  </small>

                  <div>
                    {assignment.dueDate}
                  </div>

                </div>

                <div className="mb-3">

                  <small className="text-muted">
                    Submissions
                  </small>

                  <div className="fw-semibold">
                    {assignment.submissions}
                  </div>

                </div>

                <div className="d-flex gap-2">

                  <button className="btn btn-outline-primary flex-fill rounded-pill">

                    <Eye
                      size={16}
                      className="me-2"
                    />

                    View

                  </button>

                  <button className="btn btn-success flex-fill rounded-pill">

                    <CheckCircle
                      size={16}
                      className="me-2"
                    />

                    Grade

                  </button>

                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}

      {!currentAssignments.length && (
        <div className="card border-0 shadow-sm rounded-5 mt-4">

          <div className="card-body text-center py-5">

            <FileText
              size={50}
              className="text-secondary mb-3"
            />

            <h5>
              No assignments found
            </h5>

            <p className="text-muted">
              Try another search.
            </p>

          </div>

        </div>
      )}

      {/* Summary */}

      <div className="row g-4 mt-5">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body text-center">

              <Clock
                size={40}
                className="text-warning mb-3"
              />

              <h4 className="fw-bold">
                {
                  assignments.filter(
                    (a) => a.status === "Pending"
                  ).length
                }
              </h4>

              <p className="text-muted mb-0">
                Pending
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body text-center">

              <CheckCircle
                size={40}
                className="text-success mb-3"
              />

              <h4 className="fw-bold">
                {
                  assignments.filter(
                    (a) => a.status === "Graded"
                  ).length
                }
              </h4>

              <p className="text-muted mb-0">
                Graded
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm rounded-5">

            <div className="card-body text-center">

              <AlertTriangle
                size={40}
                className="text-danger mb-3"
              />

              <h4 className="fw-bold">
                {
                  assignments.filter(
                    (a) => a.status === "Late"
                  ).length
                }
              </h4>

              <p className="text-muted mb-0">
                Late
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Pagination */}

      <div className="mt-5">

        <TablePagination
          currentPage={currentPage}
          totalItems={filteredAssignments.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

      </div>

    </div>
  );
}

export default AssignmentsPage;