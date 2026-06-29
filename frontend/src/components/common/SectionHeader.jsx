function SectionHeader({
  title,
  subtitle,
  centered = true,
}) {
  return (
    <div className={`mb-5 ${centered ? "text-center" : ""}`}>
      <h2 className="fw-bold">{title}</h2>

      {subtitle && (
        <p className="text-muted mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;