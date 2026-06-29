import PageBanner from "../../components/common/PageBanner";
import CTASection from "../../components/sections/CTASection";

function ResourcesPage() {
  const resources = [
    {
      id: 1,
      title: "Entrepreneurship Guide",
      type: "PDF",
    },
    {
      id: 2,
      title: "Digital Skills Handbook",
      type: "PDF",
    },
    {
      id: 3,
      title: "Career Development Toolkit",
      type: "Video",
    },
  ];

  return (
    <>
      <PageBanner
        title="Resources"
        subtitle="Download useful materials and learning guides."
      />

      <section className="container py-5">

        <div className="row g-4">

          {resources.map((resource) => (
            <div
              className="col-md-6 col-xl-4"
              key={resource.id}
            >
              <div className="card border-0 shadow rounded-5 h-100">

                <div className="card-body p-4">

                  <span className="badge bg-success mb-3">
                    {resource.type}
                  </span>

                  <h5 className="fw-bold">
                    {resource.title}
                  </h5>

                  <button className="btn btn-primary rounded-pill mt-3">
                    Download
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>

      </section>

      <CTASection />
    </>
  );
}

export default ResourcesPage;