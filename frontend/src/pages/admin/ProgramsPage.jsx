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
import programService from "../../services/programService";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  status: "draft",
  start_date: "",
  end_date: "",
  image_url: "",
};

function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await programService.getPrograms();
      setPrograms(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load programs right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const getProgramStatus = (program) =>
    program.status || (program.featured ? "Active" : "Draft") || "Unknown";

  const getProgramCategory = (program) =>
    program.category || program.category_name || "Uncategorized";

  const getProgramDuration = (program) =>
    program.duration || program.duration_hours || "-";

  const getProgramParticipants = (program) =>
    program.participants || program.enrollments || 0;

  const categories = useMemo(() => {
    const set = new Set(programs.map((p) => getProgramCategory(p)).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [programs]);

  const statuses = useMemo(() => {
    const set = new Set(programs.map((p) => getProgramStatus(p)).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    return programs
      .filter((program) => {
        const status = getProgramStatus(program);
        const category = getProgramCategory(program);

        if (statusFilter && status !== statusFilter) return false;
        if (categoryFilter && category !== categoryFilter) return false;
        if (!searchTerm) return true;

        const q = searchTerm.toLowerCase();
        return (
          (program.title || "").toLowerCase().includes(q) ||
          category.toLowerCase().includes(q) ||
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

  const resetModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedProgram(null);
    setForm(emptyForm);
    setError(null);
    setSuccessMessage("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedProgram(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (program) => {
    setModalMode("edit");
    setSelectedProgram(program);
    setForm({
      title: program.title || "",
      description: program.description || "",
      category: program.category || program.category_name || "",
      status: program.status || "draft",
      start_date: program.start_date || "",
      end_date: program.end_date || "",
      image_url: program.image_url || "",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (program) => {
    setModalMode("view");
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await programService.uploadProgramImage(file);
      const uploadedUrl = response?.url || response?.secure_url || response?.data?.url || "";
      setForm((prev) => ({ ...prev, image_url: uploadedUrl }));
      setSuccessMessage("Image uploaded successfully.");
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("A title is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        status: form.status,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        image_url: form.image_url || null,
      };

      if (modalMode === "edit" && selectedProgram?.id) {
        const updated = await programService.updateProgram(selectedProgram.id, payload);
        setPrograms((prev) => prev.map((program) => (program.id === updated.id ? updated : program)));
        setSuccessMessage("Program updated successfully.");
      } else {
        const created = await programService.createProgram(payload);
        setPrograms((prev) => [created, ...prev]);
        setSuccessMessage("Program created successfully.");
      }

      resetModal();
      await loadPrograms();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to save program.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program?")) return;

    try {
      await programService.deleteProgram(id);
      setPrograms((prev) => prev.filter((program) => program.id !== id));
      setSuccessMessage("Program deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete program.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Programs Management</h2>
          <p className="text-muted mb-0">Create, organize and monitor all programs.</p>
        </div>

        <button className="btn btn-success rounded-pill px-4" onClick={openCreateModal}>
          <Plus size={18} className="me-2" />
          Add Program
        </button>
      </div>

      {error ? <div className="alert alert-danger rounded-4" role="alert">{error}</div> : null}
      {successMessage ? <div className="alert alert-success rounded-4" role="alert">{successMessage}</div> : null}

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
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status || "All Statuses"}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setPage(1);
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category || "All Categories"}
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
                  <td>{getProgramCategory(program)}</td>
                  <td>{getProgramParticipants(program).toLocaleString()}</td>
                  <td>{getProgramDuration(program)}</td>
                  <td>
                    <span
                      className={`badge ${
                        getProgramStatus(program) === "Active"
                          ? "bg-success"
                          : getProgramStatus(program) === "Completed"
                            ? "bg-primary"
                            : "bg-warning"
                      }`}
                    >
                      {getProgramStatus(program)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill"
                        onClick={() => openViewModal(program)}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-success rounded-pill"
                        onClick={() => openEditModal(program)}
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
            <small className="text-muted">
              Showing {Math.min((page - 1) * perPage + 1, total)} - {Math.min(page * perPage, total)} of {total} programs
            </small>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <select
              className="form-select form-select-sm"
              style={{ width: 80 }}
              value={perPage}
              onChange={(event) => {
                setPerPage(Number(event.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <div className="btn-group">
              <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                Prev
              </button>
              <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {modalMode === "view"
                    ? selectedProgram?.title || "Program details"
                    : modalMode === "edit"
                      ? "Edit Program"
                      : "Add Program"}
                </h5>
                <button type="button" className="btn-close" onClick={resetModal}></button>
              </div>

              {modalMode === "view" && selectedProgram ? (
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      {selectedProgram.image_url ? (
                        <img src={selectedProgram.image_url} alt={selectedProgram.title} className="img-fluid rounded-4 mb-3" style={{ maxHeight: 220, objectFit: "cover" }} />
                      ) : null}
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Title</h6>
                      <p>{selectedProgram.title}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Description</h6>
                      <p>{selectedProgram.description || "No description provided."}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Category</h6>
                      <p>{getProgramCategory(selectedProgram)}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Status</h6>
                      <p>{getProgramStatus(selectedProgram)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" value={form.title} onChange={handleFieldChange} required />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="4" name="description" value={form.description} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Category</label>
                        <input type="text" className="form-control" name="category" value={form.category} onChange={handleFieldChange} placeholder="e.g. Education" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" value={form.status} onChange={handleFieldChange}>
                          <option value="draft">Draft</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Start Date</label>
                        <input type="date" className="form-control" name="start_date" value={form.start_date} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">End Date</label>
                        <input type="date" className="form-control" name="end_date" value={form.end_date} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Program Image</label>
                        <div className="border rounded-4 p-3">
                          <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
                          <div className="mt-2 text-muted small">
                            {uploadingImage ? "Uploading image..." : "Upload an image to Cloudinary and attach it to this program."}
                          </div>
                          {form.image_url ? (
                            <div className="mt-3">
                              <img src={form.image_url} alt="Program preview" className="img-fluid rounded-3" style={{ maxHeight: 180, objectFit: "cover" }} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary" onClick={resetModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success" disabled={saving || uploadingImage}>
                      {saving ? "Saving..." : modalMode === "edit" ? "Save Changes" : "Create Program"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProgramsPage;