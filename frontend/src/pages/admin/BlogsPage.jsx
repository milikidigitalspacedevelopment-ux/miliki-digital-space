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

function BlogsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Blog Management</h2>
          <p className="text-muted mb-0">Create and manage articles, news and stories.</p>
        </div>

        <button
          className="btn btn-success rounded-pill px-4"
          onClick={() => navigate("/admin/blogs/new")}
        >
          <Plus size={18} className="me-2" />
          Create Article
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <FileText size={28} />
                </div>
                <div>
                  <small className="text-muted">Total Articles</small>
                  <h3 className="fw-bold mb-0">{blogs.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <Eye size={28} />
                </div>
                <div>
                  <small className="text-muted">Total Views</small>
                  <h3 className="fw-bold mb-0">{blogs.reduce((sum, blog) => sum + (Number(blog.views) || 0), 0).toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <Star size={28} />
                </div>
                <div>
                  <small className="text-muted">Featured Posts</small>
                  <h3 className="fw-bold mb-0">{blogs.filter((blog) => blog.featured).length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-info text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <Pencil size={28} />
                </div>
                <div>
                  <small className="text-muted">Drafts</small>
                  <h3 className="fw-bold mb-0">{blogs.filter((blog) => (blog.status || "").toLowerCase() === "draft").length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <th width="180">Actions</th>
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
                  <td className="fw-semibold">{blog.title}</td>
                  <td>
                    <User size={15} className="me-1" />
                    {blog.author || blog.author_name || "—"}
                  </td>
                  <td>{blog.category || blog.category_name || "—"}</td>
                  <td>
                    <Calendar size={15} className="me-1" />
                    {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : blog.date || "—"}
                  </td>
                  <td>{(Number(blog.views) || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${(blog.status || "").toLowerCase() === "published" ? "bg-success" : "bg-warning text-dark"}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td>{blog.featured ? <span className="badge bg-primary">Featured</span> : "-"}</td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => handleView(blog)}>
                        <Eye size={15} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success rounded-pill"
                        onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
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
            <div className="text-center py-5 text-muted">No blog posts found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogsPage;
