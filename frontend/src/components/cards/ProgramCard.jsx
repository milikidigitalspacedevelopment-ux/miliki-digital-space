import { Link } from "react-router-dom";

function ProgramCard({ program }) {
  return (
    <div className="card border-0 shadow-sm h-100">

      <img
        src={program.image}
        className="card-img-top"
        alt={program.title}
      />

      <div className="card-body">

        <span className="badge bg-success mb-3">
          {program.category}
        </span>

        <h5 className="fw-bold">
          {program.title}
        </h5>

        <p className="text-muted">
          {program.description}
        </p>

      </div>

      <div className="card-footer bg-white border-0">
        <Link
          to={`/programs/${program.slug}`}
          className="btn btn-outline-success w-100"
        >
          Learn More
        </Link>
      </div>

    </div>
  );
}

export default ProgramCard;