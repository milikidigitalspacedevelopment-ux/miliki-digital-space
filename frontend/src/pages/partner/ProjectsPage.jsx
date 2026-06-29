import { useEffect, useState } from "react";
import {
  PlusCircle,
  Edit,
  Eye,
  Trash2,
  FolderKanban,
} from "lucide-react";

import partnerService from "../../services/partnerService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import TableSearch from "../../components/tables/TableSearch";
import TablePagination from "../../components/tables/TablePagination";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response =
        await partnerService.getProjects?.();

      setProjects(response || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this project?"
    );

    if (!confirmed) return;

    try {
      await partnerService.deleteProject?.(id);

      setProjects((prev) =>
        prev.filter((project) => project.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredProjects.length / pageSize
  );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "success";

      case "Planning":
        return "warning";

      case "Completed":
        return "primary";

      case "Suspended":
        return "danger";

      default:
        return "secondary";
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        title="Projects Error"
        message={error}
        onRetry={fetchProjects}
      />
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Projects
          </h2>

          <p className="text-muted mb-0">
            Manage all partner projects.
          </p>
        </div>

        <button className="btn btn-primary rounded-pill">
          <PlusCircle size={18} className="me-2" />
          New Project
        </button>

      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">

          <TableSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
          />

        </div>
      </div>

      {/* Empty */}

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={50} />}
          title="No Projects Found"
          message="There are currently no projects."
        />
      ) : (
        <>
          {/* Cards */}

          <div className="row g-4">

            {paginatedProjects.map((project) => (
              <div
                className="col-lg-6 col-xl-4"
                key={project.id}
              >
                <div className="card border-0 shadow-sm rounded-5 h-100">

                  <div className="card-body">

                    <div className="d-flex justify-content-between mb-3">

                      <h5 className="fw-bold">
                        {project.title}
                      </h5>

                      <span
                        className={`badge bg-${getStatusBadge(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>

                    </div>

                    <div className="mb-2">
                      <small className="text-muted">
                        Program
                      </small>

                      <div>{project.program}</div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">
                        Budget
                      </small>

                      <div>
                        KES {project.budget?.toLocaleString()}
                      </div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">
                        Beneficiaries
                      </small>

                      <div>
                        {project.beneficiaries}
                      </div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">
                        Start Date
                      </small>

                      <div>{project.startDate}</div>
                    </div>

                    <div className="mb-4">
                      <small className="text-muted">
                        End Date
                      </small>

                      <div>{project.endDate}</div>
                    </div>

                    {/* Actions */}

                    <div className="d-flex gap-2">

                      <button className="btn btn-outline-primary flex-fill rounded-pill">
                        <Eye size={16} className="me-1" />
                        View
                      </button>

                      <button className="btn btn-outline-warning flex-fill rounded-pill">
                        <Edit size={16} className="me-1" />
                        Edit
                      </button>

                      <button
                        className="btn btn-outline-danger flex-fill rounded-pill"
                        onClick={() =>
                          handleDelete(project.id)
                        }
                      >
                        <Trash2 size={16} />
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
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

          </div>
        </>
      )}
    </div>
  );
}

export default ProjectsPage;