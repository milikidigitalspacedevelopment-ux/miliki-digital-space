function StatsSection({ stats = [] }) {
  return (
    <section className="py-5">
      <div className="container">

        <div className="row">

          {stats.map((item) => (
            <div
              className="col-md-3 text-center mb-4"
              key={item.label}
            >
              <h2 className="fw-bold text-primary">
                {item.value}
              </h2>

              <p className="text-muted">
                {item.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default StatsSection;