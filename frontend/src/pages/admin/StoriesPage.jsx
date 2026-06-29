import { useState } from "react";
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

function StoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const stories = [
    {
      id: 1,
      title: "How Sarah Started Her Digital Career",
      author: "Admin",
      category: "Youth Empowerment",
      status: "Published",
      featured: true,
      views: 1245,
      likes: 340,
      comments: 48,
      date: "12 Jun 2026",
      image: "https://picsum.photos/600/400?1",
    },
    {
      id: 2,
      title: "Women Entrepreneurs Changing Communities",
      author: "Grace Wanjiku",
      category: "Women Empowerment",
      status: "Published",
      featured: false,
      views: 832,
      likes: 211,
      comments: 32,
      date: "10 Jun 2026",
      image: "https://picsum.photos/600/400?2",
    },
    {
      id: 3,
      title: "Scholarship Program Success Story",
      author: "John Otieno",
      category: "Education",
      status: "Draft",
      featured: false,
      views: 0,
      likes: 0,
      comments: 0,
      date: "8 Jun 2026",
      image: "https://picsum.photos/600/400?3",
    },
    {
      id: 4,
      title: "Transforming Communities Through Skills",
      author: "Admin",
      category: "Community Development",
      status: "Archived",
      featured: false,
      views: 510,
      likes: 120,
      comments: 17,
      date: "3 Jun 2026",
      image: "https://picsum.photos/600/400?4",
    },
  ];

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <button className="btn btn-success rounded-pill px-4">
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
                  68
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
                  51
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
                  11
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
                  124K
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
                Inspiring Change Through Digital Skills Training
              </h3>

              <p className="text-muted">
                Discover how young women transformed their lives and
                communities through entrepreneurship and digital skills
                programs.
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

        {filteredStories.map((story) => (
          <div className="col-lg-4 col-md-6" key={story.id}>

            <div className="card border-0 shadow-sm rounded-5 overflow-hidden h-100">

              <img
                src={story.image}
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
                    {story.views}
                  </div>

                  <div>
                    <Heart size={15} className="me-1" />
                    {story.likes}
                  </div>

                  <div>
                    <MessageCircle size={15} className="me-1" />
                    {story.comments}
                  </div>

                </div>

              </div>

              <div className="card-footer bg-white border-0 pb-4">

                <div className="d-flex justify-content-center gap-2">

                  <button className="btn btn-outline-primary rounded-pill">
                    <Eye size={16} />
                  </button>

                  <button className="btn btn-outline-success rounded-pill">
                    <Pencil size={16} />
                  </button>

                  <button className="btn btn-outline-danger rounded-pill">
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default StoriesPage;