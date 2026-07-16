const milestones = [
  {
    year: "2024",
    title: "Founded",
    description: "Miliki Digital Space CBO was established to empower youth and women through digital literacy, content creation, and entrepreneurship.",
  },
  {
    year: "2025",
    title: "Official Registration",
    description: "The organization became formally registered and strengthened its community presence in Gatundu South Town.",
  },
  {
    year: "Sep 2025",
    title: "DEYEP Launch",
    description: "The Digital Skills Empowerment for Youth, Women & PWDs Employment program began with stakeholder engagement, mobilization, and the first cohort preparations.",
  },
  {
    year: "2025–2026",
    title: "Training & Mentorship",
    description: "Bootcamps and practical sessions were delivered in digital marketing, AI, freelancing, data entry, graphic design, and content monetization.",
  },
  {
    year: "2026",
    title: "Growth & Impact",
    description: "The program expanded through mentorship, digital job support, innovation hub activities, portfolio exhibitions, and graduation events.",
  },
];

function TimelineSection() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <p className="text-success fw-semibold mb-2">Our journey</p>
          <h2 className="fw-bold">Miliki’s path from community roots to digital impact</h2>
          <p className="text-muted mb-0">A timeline of how the organization is building skills, opportunities, and sustainable digital livelihoods.</p>
        </div>

        <div className="row g-4">
          {milestones.map((item, index) => {
            const isLast = index === milestones.length - 1;
            return (
              <div className="col-md-6 col-lg-4" key={item.year}>
                <div className="card border-0 shadow-sm h-100 p-4 position-relative" style={{ borderRadius: "28px" }}>
                  <div className="d-flex align-items-center mb-3">
                    <span className="badge bg-success rounded-pill me-2">{item.year}</span>
                    <span className="text-muted small">Step {index + 1}</span>
                  </div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted mb-0">{item.description}</p>
                  {!isLast && (
                    <div className="mt-3 text-success small fw-semibold">
                      Next: {milestones[index + 1].title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
