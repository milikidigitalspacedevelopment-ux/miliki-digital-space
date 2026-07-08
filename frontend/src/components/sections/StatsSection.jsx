function StatsSection({ stats = [] }) {
  return (
    <section className="py-4 py-md-5">
      <div className="container">
        <div className="d-flex flex-row flex-nowrap justify-content-between align-items-stretch gap-1 gap-sm-2 gap-md-3 overflow-hidden">
          {stats.map((item) => (
            <div
              className="text-center flex-grow-1 flex-shrink-1"
              key={item.label}
              style={{ minWidth: 0 }}
            >
              <h2 className="fw-bold text-primary mb-1 fs-5 fs-sm-4 fs-md-2">{item.value}</h2>
              <p className="text-muted mb-0 small fw-normal lh-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;