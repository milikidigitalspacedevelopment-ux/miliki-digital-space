import { useEffect, useState } from "react";
import api from "../../services/api";
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
import analyticsService from "../../services/analyticsService";

function DonatePage() {
  const [causes, setCauses] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const [dashboard, payload] = await Promise.all([
          analyticsService.getDashboardStats().catch(() => null),
          api.get("/content/donate").then((res) => res.data).catch(() => null),
        ]);

        if (!active) return;

        if (Array.isArray(dashboard?.stats)) {
          setStats(
            dashboard.stats.map((item) => ({
              value: item.value || item.count || item.total || "0",
              label: item.title || "Metric",
            }))
          );
        }

        if (payload?.causes) {
          setCauses(payload.causes.map((cause) => ({ ...cause, icon: iconByName(cause.icon) })));
        }

        if (payload?.reasons) {
          setReasons(payload.reasons.map((reason) => ({ ...reason, icon: iconByName(reason.icon) })));
        }
      } catch (error) {
        console.error("Failed to load donation page data", error);
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  const impactHighlights = [
    { value: stats[0]?.value || "0", label: "Community members reached" },
    { value: stats[1]?.value || "0", label: "Programs delivered" },
    { value: stats[2]?.value || "0", label: "Courses offered" },
    { value: stats[3]?.value || "0", label: "Donations received" },
  ];

  const iconByName = (name) => {
    const icons = {
      GraduationCap: <GraduationCap size={40} />,
      Laptop: <Laptop size={40} />,
      Sprout: <Sprout size={40} />,
      Briefcase: <Briefcase size={40} />,
      ShieldCheck: <ShieldCheck size={38} />,
      Heart: <Heart size={38} />,
      Globe: <Globe size={38} />,
      HandCoins: <HandCoins size={38} />,
    };
    return icons[name] || <Heart size={38} />;
  };

  return (
    <>
      <PageBanner
        title="Support Our Mission"
        subtitle="Every contribution helps transform lives and communities."
      />

      {/* Impact Stats */}
      <StatsSection stats={stats} />

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
            {impactHighlights.map((item, index) => (
              <div className="col-md-3" key={item.label}>
                <div className="card border-0 shadow-sm h-100 rounded-5 p-4 text-center">
                  <h1 className={`fw-bold ${index === 0 ? "text-primary" : index === 1 ? "text-success" : index === 2 ? "text-warning" : "text-danger"}`}>
                    {item.value}
                  </h1>
                  <p className="text-muted mb-0">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
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