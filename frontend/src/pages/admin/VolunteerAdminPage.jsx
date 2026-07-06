import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, UserRound, ShieldCheck, ShieldOff } from "lucide-react";
import volunteerService from "../../services/volunteerService";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  avatar_url: "",
  skills: "",
  availability: "",
  status: "pending",
  is_active: true,
};

function VolunteerAdminPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const data = await volunteerService.listVolunteers({ q: searchTerm || undefined });
      setVolunteers(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load volunteers right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, [searchTerm]);

  const filteredVolunteers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return volunteers;
    return volunteers.filter((volunteer) => {
      const text = `${volunteer.name || ""} ${volunteer.email || ""} ${volunteer.skills || ""}`.toLowerCase();
      return text.includes(term);
    });
  }, [volunteers, searchTerm]);

  const resetModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedVolunteer(null);
    setForm(emptyForm);
    setError("");
    setSuccessMessage("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedVolunteer(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (volunteer) => {
    setModalMode("edit");
    setSelectedVolunteer(volunteer);
    setForm({
      name: volunteer.name || "",
      email: volunteer.email || "",
      phone: volunteer.phone || "",
      bio: volunteer.bio || "",
      avatar_url: volunteer.avatar_url || "",
      skills: volunteer.skills || "",
      availability: volunteer.availability || "",
      status: volunteer.status || "pending",
      is_active: volunteer.is_active !== false,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (volunteer) => {
    setModalMode("view");
    setSelectedVolunteer(volunteer);
    setIsModalOpen(true);
  };

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await volunteerService.uploadVolunteerImage(file);
      const uploadedUrl = response?.url || response?.secure_url || response?.data?.url || "";
      setForm((prev) => ({ ...prev, avatar_url: uploadedUrl }));
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
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        bio: form.bio.trim() || null,
        avatar_url: form.avatar_url || null,
        skills: form.skills.trim() || null,
        availability: form.availability.trim() || null,
        status: form.status,
        is_active: form.is_active,
      };

      if (modalMode === "edit" && selectedVolunteer?.id) {
        const updated = await volunteerService.updateVolunteer(selectedVolunteer.id, payload);
        setVolunteers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setSuccessMessage("Volunteer updated successfully.");
      } else {
        const created = await volunteerService.createVolunteer(payload);
        setVolunteers((prev) => [created, ...prev]);
        setSuccessMessage("Volunteer created successfully.");
      }

      resetModal();
      await loadVolunteers();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to save volunteer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this volunteer?")) return;

    try {
      await volunteerService.deleteVolunteer(id);
      setVolunteers((prev) => prev.filter((item) => item.id !== id));
      setSuccessMessage("Volunteer deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete volunteer.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Volunteer Management</h2>
          <p className="text-muted mb-0">Create, edit, and manage volunteers with image upload support.</p>
        </div>
        <button className="btn btn-success rounded-pill px-4" onClick={openCreateModal}>
          <Plus size={18} className="me-2" />
          New Volunteer
        </button>
      </div>

      {error ? <div className="alert alert-danger rounded-4">{error}</div> : null}
      {successMessage ? <div className="alert alert-success rounded-4">{successMessage}</div> : null}

      <div className="card border-0 shadow rounded-4 mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><Search size={16} /></span>
            <input type="text" className="form-control border-start-0" placeholder="Search volunteers by name, email or skills" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12"><div className="alert alert-light rounded-4">Loading volunteers...</div></div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="col-12"><div className="alert alert-light rounded-4">No volunteers found.</div></div>
        ) : filteredVolunteers.map((volunteer) => (
          <div className="col-lg-4 col-md-6" key={volunteer.id}>
            <div className="card border-0 shadow rounded-4 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                      {volunteer.avatar_url ? <img src={volunteer.avatar_url} alt={volunteer.name} className="rounded-circle" style={{ width: 48, height: 48, objectFit: "cover" }} /> : <UserRound size={22} />}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">{volunteer.name || "Unnamed volunteer"}</h5>
                      <p className="text-muted small mb-0">{volunteer.email}</p>
                    </div>
                  </div>
                  <span className={`badge rounded-pill ${volunteer.is_active === false ? "bg-secondary" : "bg-success"}`}>{volunteer.is_active === false ? "Inactive" : "Active"}</span>
                </div>
                <p className="text-muted small mb-3">{volunteer.bio || "No bio provided."}</p>
                <div className="d-flex gap-2 mb-3">
                  <span className="badge rounded-pill bg-light text-dark">{volunteer.skills || "No skills"}</span>
                  {volunteer.status === "approved" ? <span className="badge rounded-pill bg-primary-subtle text-primary"><ShieldCheck size={14} className="me-1" />Approved</span> : <span className="badge rounded-pill bg-warning-subtle text-warning"><ShieldOff size={14} className="me-1" />{volunteer.status || "Pending"}</span>}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => openViewModal(volunteer)}><Eye size={14} className="me-1" />View</button>
                  <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => openEditModal(volunteer)}><Pencil size={14} className="me-1" />Edit</button>
                  <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => handleDelete(volunteer.id)}><Trash2 size={14} className="me-1" />Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen ? (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">{modalMode === "view" ? selectedVolunteer?.name || "Volunteer details" : modalMode === "edit" ? "Edit Volunteer" : "Create Volunteer"}</h5>
                <button type="button" className="btn-close" onClick={resetModal}></button>
              </div>

              {modalMode === "view" && selectedVolunteer ? (
                <div className="modal-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: 72, height: 72 }}>
                      {selectedVolunteer.avatar_url ? <img src={selectedVolunteer.avatar_url} alt={selectedVolunteer.name} className="rounded-circle" style={{ width: 72, height: 72, objectFit: "cover" }} /> : <UserRound size={30} />}
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1">{selectedVolunteer.name}</h4>
                      <p className="text-muted mb-0">{selectedVolunteer.email}</p>
                    </div>
                  </div>
                  <p>{selectedVolunteer.bio || "No bio provided."}</p>
                  <div className="row g-3 mt-2">
                    <div className="col-md-6"><strong>Phone:</strong> {selectedVolunteer.phone || "-"}</div>
                    <div className="col-md-6"><strong>Status:</strong> {selectedVolunteer.status || "Pending"}</div>
                    <div className="col-md-6"><strong>Availability:</strong> {selectedVolunteer.availability || "-"}</div>
                    <div className="col-md-6"><strong>Skills:</strong> {selectedVolunteer.skills || "-"}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6"><label className="form-label">Full name</label><input type="text" className="form-control" name="name" value={form.name} onChange={handleFieldChange} required /></div>
                      <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" name="email" value={form.email} onChange={handleFieldChange} required /></div>
                      <div className="col-md-6"><label className="form-label">Phone</label><input type="text" className="form-control" name="phone" value={form.phone} onChange={handleFieldChange} /></div>
                      <div className="col-md-6"><label className="form-label">Status</label><select className="form-select" name="status" value={form.status} onChange={handleFieldChange}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div>
                      <div className="col-12"><label className="form-label">Bio</label><textarea className="form-control" rows="3" name="bio" value={form.bio} onChange={handleFieldChange} /></div>
                      <div className="col-md-6"><label className="form-label">Skills</label><input type="text" className="form-control" name="skills" value={form.skills} onChange={handleFieldChange} placeholder="e.g. Teaching, Design" /></div>
                      <div className="col-md-6"><label className="form-label">Availability</label><input type="text" className="form-control" name="availability" value={form.availability} onChange={handleFieldChange} placeholder="Weekends, mornings" /></div>
                      <div className="col-md-6 form-check form-switch"><input className="form-check-input" type="checkbox" name="is_active" checked={form.is_active} onChange={handleFieldChange} /><label className="form-check-label">Active volunteer</label></div>
                      <div className="col-12">
                        <label className="form-label">Image</label>
                        <div className="border rounded-4 p-3">
                          <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
                          <div className="mt-2 text-muted small">{uploadingImage ? "Uploading image..." : "Upload an image to Cloudinary or local storage."}</div>
                          {form.avatar_url ? <div className="mt-3"><img src={form.avatar_url} alt="Volunteer preview" className="img-fluid rounded-3" style={{ maxHeight: 180, objectFit: "cover" }} /></div> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary" onClick={resetModal}>Cancel</button>
                    <button type="submit" className="btn btn-success" disabled={saving || uploadingImage}>{saving ? "Saving..." : modalMode === "edit" ? "Save Changes" : "Create Volunteer"}</button>
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

export default VolunteerAdminPage;
