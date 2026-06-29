// src/pages/admin/ProgramsPage.jsx

import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import programService from "../../services/programService";

function ProgramsPage() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await programService.getPrograms();
        setPrograms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Derived lists
  const categories = useMemo(() => {
    const set = new Set(programs.map((p) => p.category).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [programs]);

  const statuses = useMemo(() => {
    const set = new Set(programs.map((p) => p.status).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    return programs
      .filter((program) => {
        if (statusFilter && program.status !== statusFilter) return false;
        if (categoryFilter && program.category !== categoryFilter) return false;
        if (!searchTerm) return true;

        const q = searchTerm.toLowerCase();
        return (
          (program.title || "").toLowerCase().includes(q) ||
          (program.category || "").toLowerCase().includes(q) ||
          String(program.id).includes(q)
        );
      })
      .sort((a, b) => b.id - a.id);
  }, [programs, searchTerm, statusFilter, categoryFilter]);

  const total = filteredPrograms.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paged = filteredPrograms.slice((page - 1) * perPage, page * perPage);

  const stats = useMemo(() => {
    const totalPrograms = programs.length;
    const participants = programs.reduce((s, p) => s + (p.participants || 0), 0);
    const active = programs.filter((p) => p.status === "Active").length;
    const completed = programs.filter((p) => p.status === "Completed").length;
    return { totalPrograms, participants, active, completed };
  }, [programs]);

  const handleView = (id) => navigate(`/admin/programs/${id}`);
  const handleEdit = (id) => navigate(`/admin/programs/${id}/edit`);

  const handleDelete = async (id) => {
    if (!confirm("Delete this program?")) return;
    try {
      // call service if available, otherwise simulate removal
      if (typeof programService.deleteProgram === "function") {
        await programService.deleteProgram(id);
      }
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete program");
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Programs Management
          </h2>

          <p className="text-muted mb-0">
            Create, organize and monitor all programs.
          </p>
        </div>

        <button className="btn btn-success rounded-pill px-4">
          <Plus size={18} className="me-2" />
          Add Program
        </button>
      </div>

      {/* Statistics */}

      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <GraduationCap size={28} />
                </div>

                <div>
                  <small className="text-muted">Total Programs</small>

                  <h3 className="fw-bold mb-0">{stats.totalPrograms}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <Users size={28} />
                </div>

                <div>
                  <small className="text-muted">Participants</small>

                  <h3 className="fw-bold mb-0">{stats.participants.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <GraduationCap size={28} />
                </div>

                <div>
                  <small className="text-muted">Active Programs</small>

                  <h3 className="fw-bold mb-0">{stats.active}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div
                  className="bg-info text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <Users size={28} />
                </div>

                <div>
                  <small className="text-muted">Completed</small>

                  <h3 className="fw-bold mb-0">{stats.completed}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by title, id or category..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s || "All Statuses"}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c || "All Categories"}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2 text-end">
              <button
                className="btn btn-outline-secondary rounded-pill"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setCategoryFilter("");
                }}
              >
                <Filter size={16} className="me-2" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Program</th>
                <th>Category</th>
                <th>Participants</th>
                <th>Duration</th>
                <th>Status</th>
                <th width="180">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading programs...
                  </td>
                </tr>
              )}

              {!loading && paged.map((program) => (
                <tr key={program.id}>
                  <td className="fw-semibold">{program.title}</td>
                  <td>{program.category}</td>
                  <td>{program.participants?.toLocaleString() || 0}</td>
                  <td>{program.duration || "-"}</td>
                  <td>
                    <span
                      className={`badge ${
                        program.status === "Active"
                          ? "bg-success"
                          : program.status === "Completed"
                          ? "bg-primary"
                          : "bg-warning"
                      }`}
                    >
                      {program.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill"
                        onClick={() => handleView(program.id)}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-success rounded-pill"
                        onClick={() => handleEdit(program.id)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => handleDelete(program.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && paged.length === 0 && (
            <div className="text-center py-5 text-muted">No programs found.</div>
          )}
        </div>

        <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">Showing {Math.min((page-1)*perPage+1, total)} - {Math.min(page*perPage, total)} of {total} programs</small>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <select
              className="form-select form-select-sm"
              style={{ width: 80 }}
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <div className="btn-group">
              <button className="btn btn-sm btn-outline-secondary" disabled={page<=1} onClick={() => setPage((p) => Math.max(1, p-1))}>Prev</button>
              <button className="btn btn-sm btn-outline-secondary" disabled={page>=totalPages} onClick={() => setPage((p) => Math.min(totalPages, p+1))}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramsPage;