import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock3,
  AlertTriangle,
  Eye,
} from "lucide-react";

import volunteerService from "../../services/volunteerService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import TableSearch from "../../components/tables/TableSearch";
import TablePagination from "../../components/tables/TablePagination";

function TasksPage() {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response =
        await volunteerService.getTasks?.();

      setTasks(response || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        task.priority
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        task.status
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const totalPages = Math.ceil(
    filteredTasks.length / pageSize
  );

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return "danger";

      case "Medium":
        return "warning";

      default:
        return "secondary";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "success";

      case "In Progress":
        return "primary";

      default:
        return "secondary";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title="Tasks Error"
        message={error}
        onRetry={fetchTasks}
      />
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="mb-5">
        <h2 className="fw-bold mb-2">
          Volunteer Tasks
        </h2>

        <p className="text-muted">
          Track your assigned activities and progress.
        </p>
      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">

          <TableSearch
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search tasks..."
          />

        </div>
      </div>

      {/* Empty State */}

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckCircle size={55} />}
          title="No Tasks Found"
          message="No volunteer tasks are currently assigned."
        />
      ) : (
        <>
          {/* Table */}

          <div className="card border-0 shadow-sm rounded-5">
            <div className="card-body">

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Deadline</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {paginatedTasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>

                        <td>
                          <Clock3
                            size={15}
                            className="me-2 text-muted"
                          />
                          {task.deadline}
                        </td>

                        <td>
                          <span
                            className={`badge bg-${getPriorityBadge(
                              task.priority
                            )}`}
                          >
                            {task.priority === "High" && (
                              <AlertTriangle
                                size={12}
                                className="me-1"
                              />
                            )}

                            {task.priority}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge bg-${getStatusBadge(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </td>

                        <td style={{ minWidth: "180px" }}>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              style={{
                                width: `${task.progress}%`,
                              }}
                            >
                              {task.progress}%
                            </div>
                          </div>
                        </td>

                        <td>
                          <button className="btn btn-outline-primary btn-sm rounded-pill">
                            <Eye
                              size={15}
                              className="me-1"
                            />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          </div>

          {/* Pagination */}

          <div className="mt-4">

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

          </div>
        </>
      )}
    </div>
  );
}

export default TasksPage;