function PageBanner({ title, subtitle }) {
  return (
    <section className="bg-success text-white py-5">
      <div className="container text-center">
        <h1 className="fw-bold">{title}</h1>

        {subtitle && (
          <p className="lead mt-3">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export default PageBanner;