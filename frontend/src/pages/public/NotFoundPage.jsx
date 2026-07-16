import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section
      className="d-flex align-items-center position-relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#198754 0%,#2e8b57 50%,#22c55e 100%)"
      }}
    >
      {/* blobs */}
      <div
        className="position-absolute"
        style={{
          width: 300,
          height: 300,
          background: "rgba(255,255,255,.15)",
          top: "-100px",
          left: "-100px",
          borderRadius:
            "50% 50% 70% 30% / 40% 60% 30% 70%"
        }}
      />

      <div
        className="position-absolute"
        style={{
          width: 250,
          height: 250,
          background: "rgba(255,255,255,.1)",
          bottom: "-70px",
          right: "-70px",
          borderRadius:
            "60% 40% 60% 40% / 40% 60% 40% 60%"
        }}
      />

      <div className="container text-center text-white">

        <h1
          className="fw-bold"
          style={{
            fontSize: "8rem"
          }}
        >
          404
        </h1>

        <h2 className="fw-bold mb-3">
          Page Not Found
        </h2>

        <p className="lead mb-5">
          The page you are looking for does not exist.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">

          <Link
            to="/"
            className="btn btn-light btn-lg px-4"
          >
            Home
          </Link>

          <Link
            to="/contact"
            className="btn btn-outline-light btn-lg px-4"
          >
            Contact Support
          </Link>

        </div>

      </div>
    </section>
  );
}

export default NotFoundPage;