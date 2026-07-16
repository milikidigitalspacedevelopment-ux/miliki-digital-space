import { useState } from "react";
import { Link } from "react-router-dom";

function BlogCard({ blog = {} }) {
  const image = blog.featured_image || blog.image || "/images/blog.jpg";
  const category = blog.category || blog.category_name || "Updates";
  const title = blog.title || "Untitled article";
  const excerpt = blog.excerpt || (blog.content ? `${String(blog.content).slice(0, 45).trim()}...` : "");
  const slugOrId = blog.slug || blog.id || "";
  const articlePath = slugOrId ? `/blogs/${slugOrId}` : "/blogs";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card shadow-sm h-100 border-0 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        maxWidth: 320,
        margin: "0 auto",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 10px 24px rgba(0, 0, 0, 0.12)" : undefined,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img
        src={image}
        className="card-img-top"
        alt={title}
        style={{
          height: 180,
          width: "100%",
          objectFit: "cover",
          objectPosition: "center",
          transition: "transform 0.3s ease, filter 0.3s ease",
          transform: isHovered ? "scale(1.04)" : "scale(1)",
          filter: isHovered ? "brightness(1.04)" : "brightness(1)",
        }}
      />

      <div className="card-body p-2 px-3 pb-2">

        <span className="badge bg-warning text-dark">
          {category}
        </span>

        <h6 className="fw-bold mt-2 mb-1" style={{ lineHeight: 1.3 }}>
          {title}
        </h6>

        <p className="text-muted small mb-0">
          {excerpt}
        </p>

      </div>

      <div className="card-footer bg-white border-0 pt-0 pb-2">

        <Link
          to={articlePath}
          className="btn btn-outline-success btn-sm w-100"
        >
          Read More
        </Link>

      </div>

    </div>
  );
}

export default BlogCard;