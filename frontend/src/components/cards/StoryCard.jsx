import { useState } from "react";
import { Link } from "react-router-dom";

function StoryCard({ story }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card border-0 shadow-sm h-100 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 10px 24px rgba(0, 0, 0, 0.12)" : undefined,
      }}
    >
      <div className="overflow-hidden">
        <img
          src={story.image}
          alt={story.name}
          className="card-img-top"
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
      </div>

      <div className="card-body">
        <h5 className="fw-bold">{story.name}</h5>
        <p className="text-muted mb-0">{story.excerpt}</p>
      </div>

      <div className="card-footer border-0 bg-white">
        <Link to={`/blogs/${story.slug}`} className="btn btn-outline-success w-100">
          Read Story
        </Link>
      </div>
    </div>
  );
}

export default StoryCard;