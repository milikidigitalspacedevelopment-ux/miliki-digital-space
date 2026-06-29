import { Link } from "react-router-dom";

function BlogCard({ blog }) {
  return (
    <div className="card shadow-sm h-100 border-0">

      <img
        src={blog.image}
        className="card-img-top"
        alt={blog.title}
      />

      <div className="card-body">

        <span className="badge bg-warning text-dark">
          {blog.category}
        </span>

        <h5 className="fw-bold mt-3">
          {blog.title}
        </h5>

        <p className="text-muted">
          {blog.excerpt}
        </p>

      </div>

      <div className="card-footer bg-white border-0">

        <Link
          to={`/blog/${blog.slug}`}
          className="btn btn-outline-success w-100"
        >
          Read More
        </Link>

      </div>

    </div>
  );
}

export default BlogCard;