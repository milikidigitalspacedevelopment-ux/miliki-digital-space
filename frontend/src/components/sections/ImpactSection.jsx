function ImpactSection() {

  return (
    <section className="py-3">

      <div className="container">

        <div className="row align-items-center g-5">

          <div className="col-lg-6">
            <div
              className="position-relative mx-auto"
              style={{ maxWidth: "540px" }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "1rem",
                  borderRadius: "2rem",
                  background:
                    "linear-gradient(135deg, rgba(25, 135, 84, 0.18), rgba(34, 197, 94, 0.16))",
                  transform: "rotate(-3deg)",
                  zIndex: 0,
                }}
              />
              <img
                src="/impact.png"
                className="img-fluid w-100"
                style={{
                  position: "relative",
                  zIndex: 1,
                  borderRadius: "2rem",
                  objectFit: "cover",
                  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
                  border: "6px solid rgba(255, 255, 255, 0.9)",
                  transform: "rotate(-2deg)",
                  maxHeight: "520px",
                }}
                alt="Community impact and volunteer work"
              />
            </div>
          </div>

          <div className="col-lg-6">

            <h2 className="display-5 fw-bold">
              Creating Lasting Impact
            </h2>

            <p className="text-muted fs-5">

              Through skills development and
              empowerment we are transforming
              communities and building futures.

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ImpactSection;