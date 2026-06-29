function ChartCard({
  title,
  subtitle,
  children
}) {
  return (
    <div className="card shadow-sm border-0 h-100">

      <div className="card-header bg-white border-0">

        <h5 className="fw-bold mb-1">
          {title}
        </h5>

        {subtitle && (
          <small className="text-muted">
            {subtitle}
          </small>
        )}

      </div>

      <div className="card-body">
        {children}
      </div>

    </div>
  );
}

export default ChartCard;