import { useState } from "react";
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

function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const blogs = [
    {
      id: 1,
      title: "Empowering Youth Through Digital Skills",
      author: "Admin",
      category: "Education",
      status: "Published",
      featured: true,
      date: "2025-06-15",
      views: 1450,
    },
    {
      id: 2,
      title: "Women Leading Community Transformation",
      author: "Grace Wanjiku",
      category: "Women Empowerment",
      status: "Published",
      featured: false,
      date: "2025-06-10",
      views: 980,
    },
    {
      id: 3,
      title: "Upcoming Entrepreneurship Bootcamp",
      author: "John Mwangi",
      category: "Events",
      status: "Draft",
      featured: false,
      date: "2025-06-05",
      views: 0,
    },
    {
      id: 4,
      title: "Success Story: From Training to Employment",
      author: "Mary Achieng",
      category: "Success Stories",
      status: "Published",
      featured: true,
      date: "2025-05-29",
      views: 2120,
    },
  ];

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      blog.author
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      blog.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

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

        <button className="btn btn-success rounded-pill px-4">
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
                    84
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
                    45.2K
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
                    12
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
                    8
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

              {filteredBlogs.map((blog) => (
                <tr key={blog.id}>

                  <td className="fw-semibold">
                    {blog.title}
                  </td>

                  <td>
                    <User size={15} className="me-1" />
                    {blog.author}
                  </td>

                  <td>
                    {blog.category}
                  </td>

                  <td>
                    <Calendar
                      size={15}
                      className="me-1"
                    />
                    {blog.date}
                  </td>

                  <td>
                    {blog.views.toLocaleString()}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        blog.status === "Published"
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

                      <button className="btn btn-sm btn-outline-primary rounded-pill">
                        <Eye size={15} />
                      </button>

                      <button className="btn btn-sm btn-outline-success rounded-pill">
                        <Pencil size={15} />
                      </button>

                      <button className="btn btn-sm btn-outline-danger rounded-pill">
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

    </div>
  );
}

export default BlogsPage;