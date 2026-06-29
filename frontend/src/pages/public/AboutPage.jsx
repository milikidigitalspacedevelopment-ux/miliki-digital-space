import heroImage from "../../assets/hero.png";

import PageBanner from "../../components/common/PageBanner";

import StatsSection from "../../components/sections/StatsSection";
import TimelineSection from "../../components/sections/TimelineSection";
import WhyChooseUsSection from "../../components/sections/WhyChooseUsSection";
import ImpactSection from "../../components/sections/ImpactSection";
import TeamSection from "../../components/sections/TeamSection";
import SponsorsSection from "../../components/sections/SponsorsSection";
import FloatingCTASection from "../../components/sections/FloatingCTASection";

function AboutPage() {
  const stats = [
    {
      value: "500+",
      label: "Youth Empowered",
    },
    {
      value: "40+",
      label: "Courses",
    },
    {
      value: "25+",
      label: "Partners",
    },
    {
      value: "100+",
      label: "Volunteers",
    },
  ];

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
                  Our Mission
                </h2>

                <p className="mb-0">
                  To empower youth and communities
                  through practical skills training,
                  mentorship, entrepreneurship, and
                  sustainable development initiatives.
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
                  Our Vision
                </h2>

                <p className="mb-0">
                  A society where every individual
                  has the opportunity and skills
                  needed to achieve economic and
                  social independence.
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