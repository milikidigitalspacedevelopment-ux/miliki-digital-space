import { Link } from "react-router-dom";

function ProgramCard({ program }) {
  const title = program.title || program.name || "Untitled program";
  const description = program.description || program.summary || "";
  const category = program.category || program.category_name || "Program";
  const image = program.image || program.thumbnail || "/images/program.jpg";
  const programId = program.slug || program.id;

  return (
    <div className="card border-0 shadow-sm h-100">
      <img
        src={image}
        className="card-img-top"
        alt={title}
      />

      <div className="card-body">
        <span className="badge bg-success mb-3">
          {category}
        </span>

        <h5 className="fw-bold">{title}</h5>

        {description ? (
          <p className="text-muted">{description}</p>
        ) : null}
      </div>

      <div className="card-footer bg-white border-0">
        <Link
          to={`/programs/${programId}`}
          className="btn btn-outline-success w-100"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}

export default ProgramCard;