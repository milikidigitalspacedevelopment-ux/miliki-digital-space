import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, UserRound, ShieldCheck, ShieldOff } from "lucide-react";
import donorService from "../../services/donorService";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  avatar_url: "",
  is_active: true,
  is_verified: false,
  password: "",
};

function DonorsPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const data = await donorService.getDonors({ q: searchTerm || undefined });
      setDonors(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load donors right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, [searchTerm]);

  const filteredDonors = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return donors;
    return donors.filter((donor) => {
      const fullText = `${donor.name || ""} ${donor.email || ""} ${donor.phone || ""}`.toLowerCase();
      return fullText.includes(term);
    });
  }, [donors, searchTerm]);

  const resetModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedDonor(null);
    setForm(emptyForm);
    setError("");
    setSuccessMessage("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedDonor(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (donor) => {
    setModalMode("edit");
    setSelectedDonor(donor);
    setForm({
      name: donor.name || "",
      email: donor.email || "",
      phone: donor.phone || "",
      bio: donor.bio || "",
      avatar_url: donor.avatar_url || "",
      is_active: donor.is_active !== false,
      is_verified: donor.is_verified === true,
      password: "",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (donor) => {
    setModalMode("view");
    setSelectedDonor(donor);
    setIsModalOpen(true);
  };

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const response = await donorService.uploadDonorAvatar(file);
      const uploadedUrl = response?.url || response?.secure_url || response?.data?.url || "";
      setForm((prev) => ({ ...prev, avatar_url: uploadedUrl }));
      setSuccessMessage("Avatar uploaded successfully.");
    } catch (err) {
      console.error(err);
      setError("Avatar upload failed. Please try again.");
    } finally {
      setUploadingAvatar(false);
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
        is_active: form.is_active,
        is_verified: form.is_verified,
        ...(form.password ? { password: form.password } : {}),
      };

      if (modalMode === "edit" && selectedDonor?.id) {
        const updated = await donorService.updateDonor(selectedDonor.id, payload);
        setDonors((prev) => prev.map((donor) => (donor.id === updated.id ? updated : donor)));
        setSuccessMessage("Donor updated successfully.");
      } else {
        const created = await donorService.createDonor(payload);
        setDonors((prev) => [created, ...prev]);
        setSuccessMessage("Donor created successfully.");
      }

      resetModal();
      await loadDonors();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to save donor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this donor?")) return;

    try {
      await donorService.deleteDonor(id);
      setDonors((prev) => prev.filter((donor) => donor.id !== id));
      setSuccessMessage("Donor deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete donor.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Donors Management</h2>
          <p className="text-muted mb-0">Create, edit, and manage donor profiles with image support.</p>
        </div>
        <button className="btn btn-success rounded-pill px-4" onClick={openCreateModal}>
          <Plus size={18} className="me-2" />
          New Donor
        </button>
      </div>

      {error ? <div className="alert alert-danger rounded-4">{error}</div> : null}
      {successMessage ? <div className="alert alert-success rounded-4">{successMessage}</div> : null}

      <div className="card border-0 shadow rounded-4 mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><Search size={16} /></span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search donors by name, email or phone"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12"><div className="alert alert-light rounded-4">Loading donors...</div></div>
        ) : filteredDonors.length === 0 ? (
          <div className="col-12"><div className="alert alert-light rounded-4">No donors found.</div></div>
        ) : filteredDonors.map((donor) => (
          <div className="col-lg-4 col-md-6" key={donor.id}>
            <div className="card border-0 shadow rounded-4 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                      {donor.avatar_url ? <img src={donor.avatar_url} alt={donor.name} className="rounded-circle" style={{ width: 48, height: 48, objectFit: "cover" }} /> : <UserRound size={22} />}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">{donor.name || "Unnamed donor"}</h5>
                      <p className="text-muted small mb-0">{donor.email}</p>
                    </div>
                  </div>
                  <span className={`badge rounded-pill ${donor.is_active === false ? "bg-secondary" : "bg-success"}`}>
                    {donor.is_active === false ? "Inactive" : "Active"}
                  </span>
                </div>

                <p className="text-muted small mb-3">{donor.bio || "No bio provided."}</p>

                <div className="d-flex gap-2 mb-3">
                  <span className="badge rounded-pill bg-light text-dark">{donor.phone || "No phone"}</span>
                  {donor.is_verified ? <span className="badge rounded-pill bg-primary-subtle text-primary"><ShieldCheck size={14} className="me-1" />Verified</span> : <span className="badge rounded-pill bg-warning-subtle text-warning"><ShieldOff size={14} className="me-1" />Unverified</span>}
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => openViewModal(donor)}><Eye size={14} className="me-1" />View</button>
                  <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => openEditModal(donor)}><Pencil size={14} className="me-1" />Edit</button>
                  <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => handleDelete(donor.id)}><Trash2 size={14} className="me-1" />Delete</button>
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
                <h5 className="modal-title fw-bold">{modalMode === "view" ? selectedDonor?.name || "Donor details" : modalMode === "edit" ? "Edit Donor" : "Create Donor"}</h5>
                <button type="button" className="btn-close" onClick={resetModal}></button>
              </div>

              {modalMode === "view" && selectedDonor ? (
                <div className="modal-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{ width: 72, height: 72 }}>
                      {selectedDonor.avatar_url ? <img src={selectedDonor.avatar_url} alt={selectedDonor.name} className="rounded-circle" style={{ width: 72, height: 72, objectFit: "cover" }} /> : <UserRound size={30} />}
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1">{selectedDonor.name}</h4>
                      <p className="text-muted mb-0">{selectedDonor.email}</p>
                    </div>
                  </div>
                  <p>{selectedDonor.bio || "No bio provided."}</p>
                  <div className="row g-3 mt-2">
                    <div className="col-md-6"><strong>Phone:</strong> {selectedDonor.phone || "-"}</div>
                    <div className="col-md-6"><strong>Status:</strong> {selectedDonor.is_active === false ? "Inactive" : "Active"}</div>
                    <div className="col-md-6"><strong>Verified:</strong> {selectedDonor.is_verified ? "Yes" : "No"}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Full name</label>
                        <input type="text" className="form-control" name="name" value={form.name} onChange={handleFieldChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" value={form.email} onChange={handleFieldChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleFieldChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" value={form.password} onChange={handleFieldChange} placeholder={modalMode === "edit" ? "Leave blank to keep current password" : "Optional default password"} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Bio</label>
                        <textarea className="form-control" rows="3" name="bio" value={form.bio} onChange={handleFieldChange} />
                      </div>
                      <div className="col-md-6 form-check form-switch">
                        <input className="form-check-input" type="checkbox" name="is_active" checked={form.is_active} onChange={handleFieldChange} />
                        <label className="form-check-label">Active donor</label>
                      </div>
                      <div className="col-md-6 form-check form-switch">
                        <input className="form-check-input" type="checkbox" name="is_verified" checked={form.is_verified} onChange={handleFieldChange} />
                        <label className="form-check-label">Verified donor</label>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Avatar</label>
                        <div className="border rounded-4 p-3">
                          <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
                          <div className="mt-2 text-muted small">{uploadingAvatar ? "Uploading avatar..." : "Upload an image to Cloudinary or local storage."}</div>
                          {form.avatar_url ? <div className="mt-3"><img src={form.avatar_url} alt="Avatar preview" className="img-fluid rounded-3" style={{ maxHeight: 180, objectFit: "cover" }} /></div> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary" onClick={resetModal}>Cancel</button>
                    <button type="submit" className="btn btn-success" disabled={saving || uploadingAvatar}>{saving ? "Saving..." : modalMode === "edit" ? "Save Changes" : "Create Donor"}</button>
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

export default DonorsPage;
