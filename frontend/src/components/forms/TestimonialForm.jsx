import { useState } from "react";
import testimonialService from "../../services/testimonialService";
import api from "../../services/api";

function TestimonialForm() {
  const [formData, setFormData] = useState({ name: "", role: "", organization: "", email: "", quote: "", image_url: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);
      const response = await api.post("/uploads/image", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, image_url: response.data?.url || "" }));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await testimonialService.createTestimonial({ ...formData, status: "pending" });
      setSubmitted(true);
      setFormData({ name: "", role: "", organization: "", email: "", quote: "", image_url: "" });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to submit testimonial right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-5">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-2">Share your story</h5>
        <p className="text-muted mb-3">Tell us how Miliki has impacted you. Your message will be reviewed before it appears publicly.</p>

        {submitted ? (
          <div className="alert alert-success mb-0">Thank you! Your testimonial has been received and is pending approval.</div>
        ) : (
          <form onSubmit={handleSubmit} className="row g-3">
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
              <label className="form-label">Upload a photo (optional)</label>
              <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
              {uploading ? <small className="text-muted">Uploading image...</small> : null}
              {formData.image_url ? <small className="text-success d-block mt-2">Photo ready to be attached.</small> : null}
            </div>
            <div className="col-12">
              <label className="form-label">Your testimonial</label>
              <textarea rows="5" className="form-control" value={formData.quote} onChange={(event) => setFormData({ ...formData, quote: event.target.value })} required />
            </div>
            {error ? <div className="col-12 alert alert-danger mb-0">{error}</div> : null}
            <div className="col-12">
              <button type="submit" className="btn btn-primary rounded-pill" disabled={saving}>{saving ? "Submitting..." : "Submit testimonial"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TestimonialForm;
