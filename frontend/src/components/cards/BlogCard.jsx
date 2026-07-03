import { Link } from "react-router-dom";

function BlogCard({ blog }) {
  const image = blog.featured_image || blog.image || "/images/blog.jpg";
  const category = blog.category || blog.category_name || "Updates";
  const excerpt = blog.excerpt || (blog.content ? `${String(blog.content).slice(0, 120).trim()}...` : "");

  return (
    <div className="card shadow-sm h-100 border-0">
      <img src={image} className="card-img-top" alt={blog.title} />

      <div className="card-body">

        <span className="badge bg-warning text-dark">
          {category}
        </span>

        <h5 className="fw-bold mt-3">
          {blog.title}
        </h5>

        <p className="text-muted">
          {excerpt}
        </p>

      </div>

      <div className="card-footer bg-white border-0">

        <Link
          to={`/blogs/${blog.slug || blog.id}`}
          className="btn btn-outline-success w-100"
        >
          Read More
        </Link>

      </div>

    </div>
  );
}

export default BlogCard;