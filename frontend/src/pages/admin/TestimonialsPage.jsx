import { useEffect, useMemo, useState } from "react";
import { Plus, Search, CheckCircle2, Clock3, Trash2 } from "lucide-react";
import testimonialService from "../../services/testimonialService";

function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", organization: "", email: "", quote: "", status: "pending" });
  const [saving, setSaving] = useState(false);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getTestimonials();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const filteredTestimonials = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return testimonials.filter((item) => `${item.name} ${item.quote} ${item.role}`.toLowerCase().includes(term));
  }, [testimonials, searchTerm]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await testimonialService.createTestimonial(formData);
      await loadTestimonials();
      setShowModal(false);
      setFormData({ name: "", role: "", organization: "", email: "", quote: "", status: "pending" });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testimonial) => {
    if (!window.confirm(`Delete this testimonial from ${testimonial.name || "Anonymous"}?`)) return;

    try {
      await testimonialService.deleteTestimonial(testimonial.id);
      await loadTestimonials();
    } catch (err) {
      console.error(err);
      setError("Unable to delete testimonial.");
    }
  };

  const updateStatus = async (testimonial, status) => {
    try {
      await testimonialService.updateTestimonial(testimonial.id, { ...testimonial, status });
      await loadTestimonials();
    } catch (err) {
      console.error(err);
      setError("Unable to update testimonial status.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Testimonials</h2>
          <p className="text-muted mb-0">Review and manage community testimonials.</p>
        </div>
        <button className="btn btn-success rounded-pill px-4" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" />
          Add testimonial
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><Search size={18} /></span>
            <input className="form-control border-start-0" placeholder="Search testimonials..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Person</th>
                <th>Quote</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="4" className="text-center py-4">Loading testimonials...</td></tr>}
              {!loading && error && <tr><td colSpan="4" className="text-center py-4 text-danger">{error}</td></tr>}
              {!loading && !error && filteredTestimonials.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="fw-semibold">{item.name || "Anonymous"}</div>
                    <div className="small text-muted">{item.role || ""}</div>
                  </td>
                  <td>{item.quote}</td>
                  <td>
                    <span className={`badge ${item.status === "approved" ? "bg-success" : item.status === "rejected" ? "bg-success" : "bg-success"}`}>
                      {item.status || "pending"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-success rounded-pill" onClick={() => updateStatus(item, "approved")}>
                        <CheckCircle2 size={15} />
                      </button>
                      <button className="btn btn-sm btn-outline-success rounded-pill" onClick={() => updateStatus(item, "pending")}>
                        <Clock3 size={15} />
                      </button>
                      <button className="btn btn-sm btn-outline-success rounded-pill" onClick={() => handleDelete(item)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredTestimonials.length === 0 && <div className="text-center py-5 text-muted">No testimonials found.</div>}
        </div>
      </div>

      {showModal ? (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Add testimonial</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input className="form-control" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <input className="form-control" value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Organization</label>
                    <input className="form-control" value={formData.organization} onChange={(event) => setFormData({ ...formData, organization: event.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Testimonial</label>
                    <textarea className="form-control" rows="5" value={formData.quote} onChange={(event) => setFormData({ ...formData, quote: event.target.value })} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success rounded-pill" disabled={saving}>{saving ? "Saving..." : "Save testimonial"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TestimonialsPage;
