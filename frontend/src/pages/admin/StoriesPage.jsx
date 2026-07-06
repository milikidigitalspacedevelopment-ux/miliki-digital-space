import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  Clock,
} from "lucide-react";
import api from "../../services/api";

const normalizeStories = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.stories)) return payload.stories;
  return [];
};

const emptyForm = {
  title: "",
  content: "",
  status: "draft",
  image_url: "",
  published_at: "",
};

function StoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedStory, setSelectedStory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadStories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/stories");
      setStories(normalizeStories(response?.data));
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load stories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const filteredStories = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return stories.filter((story) => {
      const title = (story.title || "").toLowerCase();
      const category = (story.category_name || story.category || "").toLowerCase();
      return title.includes(term) || category.includes(term);
    });
  }, [stories, searchTerm]);

  const resetModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedStory(null);
    setForm(emptyForm);
    setError("");
    setSuccessMessage("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedStory(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (story) => {
    setModalMode("edit");
    setSelectedStory(story);
    setForm({
      title: story.title || "",
      content: story.content || "",
      status: story.status || "draft",
      image_url: story.image_url || "",
      published_at: story.published_at || "",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (story) => {
    setModalMode("view");
    setSelectedStory(story);
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
      const formData = new FormData();
      formData.append("image", file);
      const response = await api.post("/uploads/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedUrl = response?.data?.url || response?.data?.secure_url || response?.data?.data?.url || "";
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
        content: form.content.trim(),
        status: form.status,
        image_url: form.image_url || null,
        published_at: form.published_at || null,
      };

      if (modalMode === "edit" && selectedStory?.id) {
        const updated = await api.put(`/stories/${selectedStory.id}`, payload);
        setStories((prev) => prev.map((story) => (story.id === updated.data?.id ? updated.data : story)));
        setSuccessMessage("Story updated successfully.");
      } else {
        const created = await api.post("/stories", payload);
        setStories((prev) => [created.data, ...prev]);
        setSuccessMessage("Story created successfully.");
      }

      resetModal();
      await loadStories();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to save story.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this story?")) return;

    try {
      await api.delete(`/stories/${id}`);
      setStories((prev) => prev.filter((story) => story.id !== id));
      setSuccessMessage("Story deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete story.");
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Success Stories
          </h2>

          <p className="text-muted mb-0">
            Manage impact stories and featured testimonials.
          </p>
        </div>

        <button className="btn btn-success rounded-pill px-4" onClick={openCreateModal}>
          <Plus size={18} className="me-2" />
          New Story
        </button>

      </div>

      {/* Stats */}

      <div className="row g-4 mb-5">

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <small className="text-muted">
                Total Stories
              </small>

              <div className="d-flex align-items-center mt-2">
                <BookOpen className="text-primary me-3" size={32} />
                <h3 className="fw-bold mb-0">
                  {stories.length}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <small className="text-muted">
                Published
              </small>

              <div className="d-flex align-items-center mt-2">
                <Star className="text-success me-3" size={32} />
                <h3 className="fw-bold mb-0">
                  {stories.filter((story) => (story.status || "").toLowerCase() === "published").length}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <small className="text-muted">
                Drafts
              </small>

              <div className="d-flex align-items-center mt-2">
                <Clock className="text-warning me-3" size={32} />
                <h3 className="fw-bold mb-0">
                  {stories.filter((story) => (story.status || "").toLowerCase() === "draft").length}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <small className="text-muted">
                Total Views
              </small>

              <div className="d-flex align-items-center mt-2">
                <Eye className="text-info me-3" size={32} />
                <h3 className="fw-bold mb-0">
                  {stories.reduce((sum, story) => sum + Number(story.views || 0), 0).toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-5">

        <div className="card-body">

          <div className="row g-3">

            <div className="col-lg-9">

              <div className="input-group">

                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

              </div>

            </div>

            <div className="col-lg-3">

              <button className="btn btn-outline-secondary rounded-pill w-100">
                <Filter size={18} className="me-2" />
                Filters
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Featured Story */}

      <div className="card border-0 shadow rounded-5 overflow-hidden mb-5">

        <div className="row g-0">

          <div className="col-lg-5">
            <img
              src="https://picsum.photos/800/500"
              className="w-100 h-100 object-fit-cover"
              alt=""
            />
          </div>

          <div className="col-lg-7">

            <div className="card-body p-5">

              <span className="badge bg-success mb-3">
                Featured Story
              </span>

              <h3 className="fw-bold mb-3">
                {stories[0]?.title || "Inspiring Change Through Digital Skills Training"}
              </h3>

              <p className="text-muted">
                {stories[0]?.excerpt || "Discover how young women transformed their lives and communities through entrepreneurship and digital skills programs."}
              </p>

              <button className="btn btn-success rounded-pill px-4">
                <ExternalLink size={18} className="me-2" />
                View Story
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Stories Grid */}

      <div className="row g-4">

        {loading && <div className="text-center py-4">Loading stories...</div>}
        {!loading && error && <div className="text-center py-4 text-danger">{error}</div>}
        {!loading && !error && filteredStories.map((story) => (
          <div className="col-lg-4 col-md-6" key={story.id}>

            <div className="card border-0 shadow-sm rounded-5 overflow-hidden h-100">

              <img
                src={story.image_url || story.image}
                className="card-img-top"
                style={{
                  height: "220px",
                  objectFit: "cover",
                }}
                alt=""
              />

              <div className="card-body">

                <div className="d-flex justify-content-between mb-3">

                  <span
                    className={`badge ${
                      story.status === "Published"
                        ? "bg-success"
                        : story.status === "Draft"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {story.status}
                  </span>

                  {story.featured && (
                    <span className="badge bg-primary">
                      Featured
                    </span>
                  )}
                </div>

                <h5 className="fw-bold">
                  {story.title}
                </h5>

                <small className="text-muted">
                  {story.category}
                </small>

                <hr />

                <div className="d-flex justify-content-between mb-3">

                  <small className="text-muted">
                    By {story.author}
                  </small>

                  <small className="text-muted">
                    {story.date}
                  </small>

                </div>

                <div className="d-flex justify-content-between text-muted small">

                  <div>
                    <Eye size={15} className="me-1" />
                    {story.views || 0}
                  </div>

                  <div>
                    <Heart size={15} className="me-1" />
                    {story.likes || 0}
                  </div>

                  <div>
                    <MessageCircle size={15} className="me-1" />
                    {story.comments || 0}
                  </div>

                </div>

              </div>

              <div className="card-footer bg-white border-0 pb-4">

                <div className="d-flex justify-content-center gap-2">

                  <button className="btn btn-outline-primary rounded-pill" onClick={() => openViewModal(story)}>
                    <Eye size={16} />
                  </button>

                  <button className="btn btn-outline-success rounded-pill" onClick={() => openEditModal(story)}>
                    <Pencil size={16} />
                  </button>

                  <button className="btn btn-outline-danger rounded-pill" onClick={() => handleDelete(story.id)}>
                    <Trash2 size={16} />
                  </button>

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
                <h5 className="modal-title fw-bold">
                  {modalMode === "view"
                    ? selectedStory?.title || "Story details"
                    : modalMode === "edit"
                      ? "Edit Story"
                      : "Create Story"}
                </h5>
                <button type="button" className="btn-close" onClick={resetModal}></button>
              </div>

              {modalMode === "view" && selectedStory ? (
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      {selectedStory.image_url || selectedStory.image ? <img src={selectedStory.image_url || selectedStory.image} alt={selectedStory.title} className="img-fluid rounded-4 mb-3" style={{ maxHeight: 220, objectFit: "cover" }} /> : null}
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Title</h6>
                      <p>{selectedStory.title}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Content</h6>
                      <p>{selectedStory.content || "No content provided."}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Status</h6>
                      <p>{selectedStory.status}</p>
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
                        <label className="form-label">Content</label>
                        <textarea className="form-control" rows="5" name="content" value={form.content} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" value={form.status} onChange={handleFieldChange}>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Published At</label>
                        <input type="date" className="form-control" name="published_at" value={form.published_at} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Story Image</label>
                        <div className="border rounded-4 p-3">
                          <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
                          <div className="mt-2 text-muted small">
                            {uploadingImage ? "Uploading image..." : "Upload an image to Cloudinary and attach it to this story."}
                          </div>
                          {form.image_url ? <div className="mt-3"><img src={form.image_url} alt="Story preview" className="img-fluid rounded-3" style={{ maxHeight: 180, objectFit: "cover" }} /></div> : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary" onClick={resetModal}>Cancel</button>
                    <button type="submit" className="btn btn-success" disabled={saving || uploadingImage}>
                      {saving ? "Saving..." : modalMode === "edit" ? "Save Changes" : "Create Story"}
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

export default StoriesPage;