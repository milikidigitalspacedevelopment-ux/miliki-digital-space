import { useEffect, useState } from "react";
import {
  ClipboardList,
  Calendar,
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
  FileText,
  Star,
} from "lucide-react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import courseService from "../../services/courseService";
import uploadService from "../../services/uploadService";

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const response =
        await courseService.getAssignments?.();

      setAssignments(response || []);
    } catch (err) {
      setError("Unable to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (id, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  const handleSubmit = async (assignmentId) => {
    try {
      setSubmittingId(assignmentId);

      let uploadedFile = null;

      if (selectedFiles[assignmentId]) {
        uploadedFile = await uploadService.uploadFile?.(
          selectedFiles[assignmentId]
        );
      }

      await courseService.submitAssignment?.({
        assignmentId,
        file: uploadedFile,
      });

      fetchAssignments();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingId(null);
    }
  };

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

  if (!assignments.length) {
    return (
      <EmptyState
        title="No Assignments"
        description="Assignments will appear here when available."
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      <div className="mb-5">

        <h2 className="fw-bold mb-2">
          Assignments
        </h2>

        <p className="text-muted mb-0">
          Track deadlines, submit work and view feedback.
        </p>

      </div>

      <div className="row g-4">

        {assignments.map((assignment) => (

          <div
            className="col-lg-6"
            key={assignment.id}
          >

            <div className="card border-0 shadow-sm rounded-5 h-100">

              <div className="card-body">

                {/* Header */}

                <div className="d-flex justify-content-between mb-3">

                  <div>

                    <h5 className="fw-bold">
                      {assignment.title}
                    </h5>

                    <small className="text-muted">
                      {assignment.course}
                    </small>

                  </div>

                  {assignment.submitted ? (
                    <span className="badge bg-success rounded-pill">
                      Submitted
                    </span>
                  ) : (
                    <span className="badge bg-warning rounded-pill">
                      Pending
                    </span>
                  )}

                </div>

                {/* Description */}

                <p className="text-muted">
                  {assignment.description}
                </p>

                {/* Due date */}

                <div className="d-flex align-items-center mb-3">

                  <Calendar
                    size={18}
                    className="text-danger me-2"
                  />

                  <small>
                    Due:
                    {" "}
                    {assignment.dueDate}
                  </small>

                </div>

                {/* Grade */}

                {assignment.grade && (

                  <div className="mb-3">

                    <div className="d-flex align-items-center">

                      <Star
                        size={18}
                        className="text-warning me-2"
                      />

                      <span className="fw-semibold">
                        Grade:
                        {" "}
                        {assignment.grade}
                      </span>

                    </div>

                  </div>

                )}

                {/* Feedback */}

                {assignment.feedback && (

                  <div className="alert alert-success rounded-4">

                    <div className="d-flex">

                      <CheckCircle
                        size={18}
                        className="me-2 mt-1"
                      />

                      <div>

                        <strong>
                          Instructor Feedback
                        </strong>

                        <div>
                          {assignment.feedback}
                        </div>

                      </div>

                    </div>

                  </div>

                )}

                {/* Upload */}

                {!assignment.submitted && (

                  <>
                    <div className="mb-3">

                      <label className="form-label">
                        Upload Assignment
                      </label>

                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          handleFileChange(
                            assignment.id,
                            e.target.files[0]
                          )
                        }
                      />

                    </div>

                    <button
                      className="btn btn-success rounded-pill"
                      disabled={submittingId === assignment.id}
                      onClick={() =>
                        handleSubmit(assignment.id)
                      }
                    >

                      <Send
                        size={16}
                        className="me-2"
                      />

                      {submittingId === assignment.id
                        ? "Submitting..."
                        : "Submit Assignment"}

                    </button>
                  </>

                )}

                {/* Submitted file */}

                {assignment.submittedFile && (

                  <div className="mt-3">

                    <div className="border rounded-4 p-3 d-flex justify-content-between align-items-center">

                      <div className="d-flex align-items-center">

                        <FileText
                          size={18}
                          className="text-primary me-2"
                        />

                        {assignment.submittedFile}

                      </div>

                      <Upload size={18} />

                    </div>

                  </div>

                )}

                {/* Late warning */}

                {assignment.overdue && !assignment.submitted && (

                  <div className="alert alert-danger rounded-4 mt-3">

                    <AlertCircle
                      size={18}
                      className="me-2"
                    />

                    Assignment deadline has passed.

                  </div>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AssignmentsPage;