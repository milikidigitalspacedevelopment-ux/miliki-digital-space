import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-primary text-white py-3">

      <div className="container text-center">

        <h2 className="fw-bold mb-3">
          Empower Communities Through Skills
        </h2>

        <p className="mb-4">
          Join as a learner, volunteer, donor, or partner.
        </p>

        <Link
          to="/register"
          className="btn btn-light btn-lg"
        >
          Join Today
        </Link>

      </div>

    </section>
  );
}

export default CTASection;