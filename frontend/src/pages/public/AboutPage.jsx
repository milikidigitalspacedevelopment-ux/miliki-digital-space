import { useEffect, useState } from "react";
import heroImage from "../../assets/hero.png";
import api from "../../services/api";

import PageBanner from "../../components/common/PageBanner";

import StatsSection from "../../components/sections/StatsSection";
import TimelineSection from "../../components/sections/TimelineSection";
import WhyChooseUsSection from "../../components/sections/WhyChooseUsSection";
import ImpactSection from "../../components/sections/ImpactSection";
import TeamSection from "../../components/sections/TeamSection";
import SponsorsSection from "../../components/sections/SponsorsSection";
import FloatingCTASection from "../../components/sections/FloatingCTASection";
import analyticsService from "../../services/analyticsService";

function AboutPage() {
  const [stats, setStats] = useState([]);
  const [content, setContent] = useState({ mission: {}, vision: {} });

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const [dashboard, payload] = await Promise.all([
          analyticsService.getDashboardStats().catch(() => null),
          api.get("/content/about").then((res) => res.data).catch(() => null),
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

        if (payload) {
          setContent({ mission: payload.mission || {}, vision: payload.vision || {} });
        }
      } catch (error) {
        console.error("Failed to load about page data", error);
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageBanner
        title="About Us"
        subtitle="Transforming communities through skills, mentorship and opportunities."
        backgroundImage={heroImage}
      />

      {/* Mission + Vision */}
      <section className="py-5">
        <div className="container">

          <div className="row g-4">

            <div className="col-md-6">
              <div
                className="shadow-sm h-100 p-5 bg-primary text-white"
                style={{
                  borderRadius:
                    "50px 15px 50px 15px",
                }}
              >
                <h2 className="fw-bold mb-4">
                  {content.mission?.title || "Our Mission"}
                </h2>

                <p className="mb-0">
                  {content.mission?.body || "To empower youth and communities through practical skills training, mentorship, entrepreneurship and sustainable development initiatives."}
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className="shadow-sm h-100 p-5 bg-light"
                style={{
                  borderRadius:
                    "15px 50px 15px 50px",
                }}
              >
                <h2 className="fw-bold mb-4">
                  {content.vision?.title || "Our Vision"}
                </h2>

                <p className="mb-0">
                  {content.vision?.body || "A society where every individual has the opportunity and skills needed to achieve economic and social independence."}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <StatsSection stats={stats} />

      <TimelineSection />

      <WhyChooseUsSection />

      <ImpactSection />

      <TeamSection />

      <SponsorsSection />

      <FloatingCTASection />
    </>
  );
}

export default AboutPage;