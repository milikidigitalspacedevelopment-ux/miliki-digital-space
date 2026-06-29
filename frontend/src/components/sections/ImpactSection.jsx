function ImpactSection() {

  return (
    <section className="py-5">

      <div className="container">

        <div className="row align-items-center g-5">

          <div className="col-lg-6">

            <img
              src="/impact.jpg"
              className="img-fluid"
              style={{
                borderRadius:
                  "60% 40% 60% 40% / 40% 60% 40% 60%"
              }}
              alt=""
            />

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