import { Link } from "react-router-dom";

function ProgramCard({ program }) {
  const title = program.title || program.name || "Untitled program";
  const rawDescription = program.description || program.summary || "";
  const category = program.category || program.category_name || "Program";
  const image = program.image || program.thumbnail || "/images/program.jpg";
  const programId = program.slug || program.id;

  const getSummary = (value, maxLength = 140) => {
    if (!value) return "";
    const normalized = String(value).replace(/\s+/g, " ").trim();
    if (!normalized) return "";
    if (normalized.length <= maxLength) return normalized;
    return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
  };

  const description = getSummary(rawDescription, 140);

  return (
    <div className="card program-card border-0 shadow-sm h-100">
      <div className="program-card-media">
        <img
          src={image}
          className="card-img-top"
          alt={title}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <span className="badge bg-success mb-3 align-self-start">
          {category}
        </span>

        <h5 className="fw-bold mb-3">{title}</h5>

        {description ? (
          <p className="text-muted small mb-4">{description}</p>
        ) : null}

        <div className="mt-auto">
          <Link
            to={`/programs/${programId}`}
            className="btn btn-outline-success w-100 rounded-pill"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProgramCard;