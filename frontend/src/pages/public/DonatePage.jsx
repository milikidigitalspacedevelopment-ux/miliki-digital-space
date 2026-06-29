import {
  Heart,
  GraduationCap,
  Laptop,
  Sprout,
  Briefcase,
  ShieldCheck,
  Globe,
  HandCoins,
} from "lucide-react";

import PageBanner from "../../components/common/PageBanner";
import DonationForm from "../../components/forms/DonationForm";
import StatsSection from "../../components/sections/StatsSection";
import FAQSection from "../../components/sections/FAQSection";
import CTASection from "../../components/sections/CTASection";

function DonatePage() {
  const causes = [
    {
      title: "Education",
      description:
        "Provide training materials, scholarships, and learning opportunities.",
      icon: <GraduationCap size={40} />,
      color: "primary",
    },
    {
      title: "Technology",
      description:
        "Equip youth with digital skills and access to modern tools.",
      icon: <Laptop size={40} />,
      color: "success",
    },
    {
      title: "Agriculture",
      description:
        "Support sustainable farming and food security initiatives.",
      icon: <Sprout size={40} />,
      color: "warning",
    },
    {
      title: "Entrepreneurship",
      description:
        "Help young people start businesses and become self-reliant.",
      icon: <Briefcase size={40} />,
      color: "danger",
    },
  ];

  const reasons = [
    {
      title: "Transparency",
      description:
        "Every contribution is tracked and impact reports are shared with donors.",
      icon: <ShieldCheck size={38} />,
    },
    {
      title: "Community Impact",
      description:
        "Your support creates opportunities and transforms lives.",
      icon: <Heart size={38} />,
    },
    {
      title: "Sustainability",
      description:
        "We focus on long-term solutions that empower communities.",
      icon: <Globe size={38} />,
    },
    {
      title: "Accountability",
      description:
        "Donors receive updates, receipts, and measurable outcomes.",
      icon: <HandCoins size={38} />,
    },
  ];

  return (
    <>
      <PageBanner
        title="Support Our Mission"
        subtitle="Every contribution helps transform lives and communities."
      />

      {/* Impact Stats */}
      <StatsSection />

      {/* Causes */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Where Your Donation Goes</h2>
          <p className="text-muted">
            Support programs that create sustainable change.
          </p>
        </div>

        <div className="row g-4">
          {causes.map((cause) => (
            <div
              className="col-sm-6 col-xl-3"
              key={cause.title}
            >
              <div
                className="bg-white shadow-sm h-100 p-4 border"
                style={{
                  borderRadius: "50px 50px 15px 50px",
                  transition: ".3s",
                }}
              >
                <div className={`text-${cause.color} mb-3`}>
                  {cause.icon}
                </div>

                <h5 className="fw-bold mb-3">
                  {cause.title}
                </h5>

                <p className="text-muted mb-0">
                  {cause.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Section */}
      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >
        <div className="container">

          <div className="row g-5 align-items-center">

            <div className="col-lg-5">

              <div
                className="p-5 shadow bg-white"
                style={{
                  borderRadius: "80px 30px 80px 30px",
                }}
              >
                <span className="badge bg-success mb-3">
                  Make a Difference
                </span>

                <h2 className="fw-bold mb-4">
                  Your generosity creates opportunities.
                </h2>

                <p className="text-muted mb-4">
                  Support education, entrepreneurship, digital literacy,
                  agriculture, and community empowerment initiatives.
                </p>

                <div className="d-flex mb-4">
                  <div className="me-3 text-danger">
                    <Heart size={28} />
                  </div>

                  <div>
                    <h6 className="fw-bold">
                      One-Time Donations
                    </h6>

                    <small className="text-muted">
                      Support immediate needs.
                    </small>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div className="me-3 text-success">
                    <Heart size={28} />
                  </div>

                  <div>
                    <h6 className="fw-bold">
                      Monthly Giving
                    </h6>

                    <small className="text-muted">
                      Create sustainable impact.
                    </small>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="me-3 text-primary">
                    <Heart size={28} />
                  </div>

                  <div>
                    <h6 className="fw-bold">
                      Corporate Sponsorship
                    </h6>

                    <small className="text-muted">
                      Partner for greater change.
                    </small>
                  </div>
                </div>

              </div>

            </div>

            <div className="col-lg-7">
              <div
                className="bg-white shadow-lg p-4 p-md-5"
                style={{
                  borderRadius: "40px",
                }}
              >
                <DonationForm />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Why Donate */}
      <section className="container py-5">

        <div className="text-center mb-5">
          <h2 className="fw-bold">
            Why Support Us?
          </h2>

          <p className="text-muted">
            We are committed to creating measurable impact.
          </p>
        </div>

        <div className="row g-4">

          {reasons.map((item) => (
            <div
              className="col-md-6 col-xl-3"
              key={item.title}
            >
              <div
                className="h-100 p-4 shadow-sm border bg-white"
                style={{
                  borderRadius: "70px 25px 70px 25px",
                }}
              >
                <div className="text-success mb-3">
                  {item.icon}
                </div>

                <h5 className="fw-bold mb-3">
                  {item.title}
                </h5>

                <p className="text-muted mb-0">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

        </div>

      </section>

      {/* Impact Timeline */}
      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Your Donations Create Real Change
            </h2>
          </div>

          <div className="row g-4">

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100 rounded-5 p-4 text-center">
                <h1 className="text-primary fw-bold">
                  1200+
                </h1>
                <p className="text-muted mb-0">
                  Youth Trained
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100 rounded-5 p-4 text-center">
                <h1 className="text-success fw-bold">
                  350+
                </h1>
                <p className="text-muted mb-0">
                  Businesses Started
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100 rounded-5 p-4 text-center">
                <h1 className="text-warning fw-bold">
                  85%
                </h1>
                <p className="text-muted mb-0">
                  Employment Success
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100 rounded-5 p-4 text-center">
                <h1 className="text-danger fw-bold">
                  20+
                </h1>
                <p className="text-muted mb-0">
                  Communities Reached
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <CTASection />
    </>
  );
}

export default DonatePage;