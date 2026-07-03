import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Star,
  Calendar,
  User,
} from "lucide-react";
import blogService from "../../services/blogService";

const emptyBlog = {
  id: null,
  title: "",
  category: "",
  status: "draft",
  featured: false,
  featured_image: "",
  excerpt: "",
  content: "",
  author: "",
  published_at: "",
  slug: "",
};

function BlogsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(emptyBlog);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getBlogs();
        setBlogs(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load articles.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return blogs.filter((blog) => {
      const title = (blog.title || "").toLowerCase();
      const author = (blog.author || blog.author_name || "").toLowerCase();
      const category = (blog.category || blog.category_name || "").toLowerCase();
      return title.includes(term) || author.includes(term) || category.includes(term);
    });
  }, [blogs, searchTerm]);

  const handleOpenCreate = () => {
    setSelectedBlog(emptyBlog);
    setError("");
  };

  const handleOpenEdit = (blog) => {
    setSelectedBlog({
      ...emptyBlog,
      ...blog,
      category: blog.category || blog.category_name || "",
      author: blog.author || blog.author_name || "",
      published_at: blog.published_at || blog.date || "",
    });
    setError("");
  };

  const handleFieldChange = (field, value) => {
    setSelectedBlog((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const payload = {
        title: selectedBlog.title,
        content: selectedBlog.content,
        category_name: selectedBlog.category,
        author_name: selectedBlog.author,
        status: selectedBlog.status,
        featured_image: selectedBlog.featured_image,
        published_at:
          selectedBlog.status === "published"
            ? selectedBlog.published_at || new Date().toISOString()
            : null,
        slug: selectedBlog.slug || undefined,
        featured: Boolean(selectedBlog.featured),
      };

      let result;
      if (selectedBlog.id) {
        result = await blogService.updateBlog(selectedBlog.id, payload);
        setBlogs((prev) => prev.map((blog) => (blog.id === result.id ? result : blog)));
      } else {
        result = await blogService.createBlog(payload);
        setBlogs((prev) => [result, ...prev]);
      }

      const modalElement = document.getElementById("blogModal");
      const bootstrapModal = window.bootstrap?.Modal.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to save article. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog article?")) return;
    try {
      setLoading(true);
      await blogService.deleteBlog(id);
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog article.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (blog) => {
    navigate(`/blogs/${blog.slug || blog.id}`);
  };

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Blog Management
          </h2>

          <p className="text-muted mb-0">
            Create and manage articles, news and stories.
          </p>
        </div>

        <button
          className="btn btn-success rounded-pill px-4"
          data-bs-toggle="modal"
          data-bs-target="#blogModal"
          onClick={handleOpenCreate}
        >
          <Plus size={18} className="me-2" />
          Create Article
        </button>

      </div>

      {/* STATISTICS */}

      <div className="row g-4 mb-4">

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">

            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: 60,
                    height: 60,
                  }}
                >
                  <FileText size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Total Articles
                  </small>

                  <h3 className="fw-bold mb-0">
                    {blogs.length}
                  </h3>
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
                  style={{
                    width: 60,
                    height: 60,
                  }}
                >
                  <Eye size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Total Views
                  </small>

                  <h3 className="fw-bold mb-0">
                    {blogs.reduce((sum, blog) => sum + (Number(blog.views) || 0), 0).toLocaleString()}
                  </h3>
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
                  style={{
                    width: 60,
                    height: 60,
                  }}
                >
                  <Star size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Featured Posts
                  </small>

                  <h3 className="fw-bold mb-0">
                    {blogs.filter((blog) => blog.featured).length}
                  </h3>
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
                  style={{
                    width: 60,
                    height: 60,
                  }}
                >
                  <Pencil size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Drafts
                  </small>

                  <h3 className="fw-bold mb-0">
                    {blogs.filter((blog) => (blog.status || "").toLowerCase() === "draft").length}
                  </h3>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">

        <div className="card-body">

          <div className="row g-3">

            <div className="col-lg-8">

              <div className="input-group">

                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="col-lg-4">

              <button className="btn btn-outline-secondary rounded-pill w-100">
                <Filter size={18} className="me-2" />
                Filters
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="card border-0 shadow-sm rounded-5">

        <div className="card-body table-responsive">

          <table className="table align-middle">

            <thead>

              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Published</th>
                <th>Views</th>
                <th>Status</th>
                <th>Featured</th>
                <th width="180">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan="8" className="text-center py-4">Loading articles...</td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-danger">{error}</td>
                </tr>
              )}

              {!loading && !error && filteredBlogs.map((blog) => (
                <tr key={blog.id}>

                  <td className="fw-semibold">
                    {blog.title}
                  </td>

                  <td>
                    <User size={15} className="me-1" />
                    {blog.author || blog.author_name || "—"}
                  </td>

                  <td>
                    {blog.category || blog.category_name || "—"}
                  </td>

                  <td>
                    <Calendar
                      size={15}
                      className="me-1"
                    />
                    {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : blog.date || "—"}
                  </td>

                  <td>
                    {(Number(blog.views) || 0).toLocaleString()}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        (blog.status || "").toLowerCase() === "published"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {blog.status}
                    </span>

                  </td>

                  <td>

                    {blog.featured ? (
                      <span className="badge bg-primary">
                        Featured
                      </span>
                    ) : (
                      "-"
                    )}

                  </td>

                  <td>

                    <div className="d-flex gap-2 flex-wrap">

                      <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => handleView(blog)}>
                        <Eye size={15} />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-success rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target="#blogModal"
                        onClick={() => handleOpenEdit(blog)}
                      >
                        <Pencil size={15} />
                      </button>

                      <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(blog.id)}>
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-5 text-muted">
              No blog posts found.
            </div>
          )}

        </div>

      </div>

      <div className="modal fade" id="blogModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedBlog.id ? "Edit Article" : "Create Article"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedBlog.title}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedBlog.category}
                      onChange={(e) => handleFieldChange("category", e.target.value)}
                      placeholder="Category name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Author</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedBlog.author}
                      onChange={(e) => handleFieldChange("author", e.target.value)}
                      placeholder="Author name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={selectedBlog.status}
                      onChange={(e) => handleFieldChange("status", e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Published Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedBlog.published_at?.slice(0, 10) || ""}
                      onChange={(e) => handleFieldChange("published_at", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Featured Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedBlog.featured_image}
                      onChange={(e) => handleFieldChange("featured_image", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Excerpt</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={selectedBlog.excerpt}
                      onChange={(e) => handleFieldChange("excerpt", e.target.value)}
                      placeholder="Short summary for the article"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      rows={6}
                      value={selectedBlog.content}
                      onChange={(e) => handleFieldChange("content", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!!selectedBlog.featured}
                        onChange={(e) => handleFieldChange("featured", e.target.checked)}
                        id="featuredSwitch"
                      />
                      <label className="form-check-label" htmlFor="featuredSwitch">
                        Mark as featured
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? "Saving..." : selectedBlog.id ? "Update Article" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}

export default BlogsPage;