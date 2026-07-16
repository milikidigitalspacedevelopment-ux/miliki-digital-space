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

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm h-100 p-4 p-md-5" style={{ borderRadius: "36px" }}>
                <p className="text-success fw-semibold mb-2">Who we are</p>
                <h2 className="fw-bold mb-3">Miliki Digital Space CBO</h2>
                <p className="text-muted mb-3">
                  Miliki Digital Space CBO is a grassroots community-based organization founded in 2024 and officially registered in 2025. We are based in Gatundu South Town, behind the DCC Building Block, sharing the compound with the NG-CDF Office, DCC Offices, and the Youth Centre.
                </p>
                <p className="text-muted mb-0">
                  Our work is rooted in empowering youth and women through digital literacy, content creation, innovation, and entrepreneurship. We focus on building practical opportunities for young people to thrive in the digital economy and contribute meaningfully to their communities.
                </p>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-sm h-100 p-4 p-md-5" style={{ borderRadius: "36px" }}>
                <p className="text-primary fw-semibold mb-2">Our focus</p>
                <h3 className="fw-bold mb-3">DEYEP Program</h3>
                <ul className="text-muted mb-0 ps-3">
                  <li>Digital Skills Empowerment for Youth, Women & PWDs Employment</li>
                  <li>Serving Gatundu South, Gatundu North, and nearby constituencies in Kiambu County</li>
                  <li>Training in AI, freelancing, digital marketing, data entry, graphic design, and content monetization</li>
                  <li>Creating pathways to online work, local SMEs, digital businesses, and innovation hubs</li>
                </ul>
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