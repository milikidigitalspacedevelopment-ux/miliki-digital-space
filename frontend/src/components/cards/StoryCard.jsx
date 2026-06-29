import { Link } from "react-router-dom";

function StoryCard({ story }) {
  return (
    <div className="card border-0 shadow-sm h-100">

      <img
        src={story.image}
        alt={story.name}
        className="card-img-top"
      />

      <div className="card-body">

        <h5>{story.name}</h5>

        <p className="text-muted">
          {story.excerpt}
        </p>

      </div>

      <div className="card-footer border-0 bg-white">

        <Link
          to={`/stories/${story.slug}`}
          className="btn btn-outline-success w-100"
        >
          Read Story
        </Link>

      </div>

    </div>
  );
}

export default StoryCard;