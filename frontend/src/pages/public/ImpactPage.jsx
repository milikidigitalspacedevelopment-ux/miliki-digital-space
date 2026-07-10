import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import PageBanner from "../../components/common/PageBanner";
import SectionHeader from "../../components/common/SectionHeader";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

import ChartCard from "../../components/charts/ChartCard";
import PieChartComponent from "../../components/charts/PieChartComponent";
import BarChartComponent from "../../components/charts/BarChartComponent";
import AreaChartComponent from "../../components/charts/AreaChartComponent";

import StoryCard from "../../components/cards/StoryCard";
import heroImage from "../../assets/hero.png";

import TestimonialsSection from "../../components/sections/TestimonialsSection";
import GallerySection from "../../components/sections/GallerySection";
import CTASection from "../../components/sections/CTASection";

import analyticsService from "../../services/analyticsService";

function ImpactPage() {
  const [stats, setStats] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({ hero: {}, highlights: [] });

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      setLoading(true);

      const [response, contentResponse] = await Promise.all([
        analyticsService.getImpactOverview().catch(() => null),
        api.get("/content/impact").then((res) => res.data).catch(() => null),
      ]);

      const payload = response?.data ?? response;
      setStats(payload?.stats || null);
      setStories(Array.isArray(payload?.stories) ? payload.stories : []);
      if (contentResponse) {
        setContent({ hero: contentResponse.hero || {}, highlights: contentResponse.highlights || [] });
      }
    } catch (error) {
      console.error(error);
      setStats(null);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // derive chart-friendly data from stats/content when backend doesn't provide explicit series
  const pieData = stats
    ? [
        { name: "Graduates", value: Number(stats.graduates) || 0 },
        { name: "Jobs", value: Number(stats.jobsCreated) || 0 },
        { name: "Communities", value: Number(stats.communities) || 0 },
      ]
    : [];

  const barData = Array.isArray(content.highlights)
    ? content.highlights.map((h, idx) => ({ category: h.label || `Item ${idx + 1}`, value: Number(String(h.value).replace(/[^0-9]/g, "")) || 0 }))
    : [];

  const areaData = stats?.growthOverTime || [];

  const fmt = (val, fallback = "—") => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === "number") return val.toLocaleString();
    return String(val);
  };

  return (
    <>
      <PageBanner
        title="Our Impact"
        subtitle="Transforming Lives Through Sustainable Change"
      />

      <Breadcrumbs />

      {/* HERO */}

      <section className="container py-4">

        <div
          className="shadow overflow-hidden"
          style={{
            borderRadius: "50px",
            background: "linear-gradient(135deg, #198754, #28a745)",
          }}
        >

          <div className="row align-items-center g-0">

            <div className="col-lg-7 p-4 p-lg-5 text-white">

              <span className="badge bg-light text-primary px-3 py-2 mb-3">
                IMPACT REPORT
              </span>

              <h1 className="display-5 fw-bold mb-3">
                {content.hero?.title || "Creating Opportunities"}
              </h1>

              <p className="lead mb-4">
                {content.hero?.subtitle || "Through education, entrepreneurship, digital skills and community empowerment, we continue building sustainable futures for thousands of individuals and families."}
              </p>

              <div className="row gy-3">

                <div className="col-6 col-md-4 mb-4">

                  <h2 className="fw-bold">
                    {stats?.years ? `${stats.years}+` : content.highlights[0]?.value || "—"}
                  </h2>

                  <small>
                    Years of Impact
                  </small>

                </div>

                <div className="col-6 col-md-4 mb-4">

                  <h2 className="fw-bold">
                    {fmt(stats?.communities, content.highlights[1]?.value || "—")}
                  </h2>

                  <small>
                    Communities Served
                  </small>

                </div>

                <div className="col-6 col-md-4">

                  <h2 className="fw-bold">
                    {fmt(stats?.graduates, content.highlights[2]?.value || "—")}
                  </h2>

                  <small>
                    Graduates
                  </small>

                </div>

              </div>

            </div>

            <div className="col-lg-5">

              <img
                src={heroImage}
                alt="Impact"
                className="w-100"
                style={{
                  minHeight: 360,
                  height: "100%",
                  objectFit: "cover",
                }}
              />

            </div>

          </div>

        </div>

      </section>

            {/* IMPACT STATISTICS */}

      <section className="container py-5">

        <SectionHeader
          title="Impact By The Numbers"
          subtitle="Measuring progress through tangible outcomes."
        />

        <div className="row g-4 mt-2">

          <div className="col-6 col-lg-3">

            <div
              className="bg-white shadow-sm p-4 text-center h-100"
              style={{
                borderRadius: "60px 20px 60px 20px",
              }}
            >
              <h2 className="fw-bold text-success">
                {fmt(stats?.livesImpacted)}
              </h2>

              <p className="text-muted mb-0">
                Lives Impacted
              </p>

            </div>

          </div>

          <div className="col-6 col-lg-3">

            <div
              className="bg-white shadow-sm p-4 text-center h-100"
              style={{
                borderRadius: "20px 60px 20px 60px",
              }}
            >
              <h2 className="fw-bold text-primary">
                {fmt(stats?.graduates)}
              </h2>

              <p className="text-muted mb-0">
                Graduates
              </p>

            </div>

          </div>

          <div className="col-6 col-lg-3">

            <div
              className="bg-white shadow-sm p-4 text-center h-100"
              style={{
                borderRadius: "60px 20px 60px 20px",
              }}
            >
              <h2 className="fw-bold text-warning">
                {fmt(stats?.jobsCreated)}
              </h2>

              <p className="text-muted mb-0">
                Jobs Created
              </p>

            </div>

          </div>

          <div className="col-6 col-lg-3">

            <div
              className="bg-white shadow-sm p-4 text-center h-100"
              style={{
                borderRadius: "20px 60px 20px 60px",
              }}
            >
              <h2 className="fw-bold text-danger">
                {fmt(stats?.communities)}
              </h2>

              <p className="text-muted mb-0">
                Communities Served
              </p>

            </div>

          </div>

        </div>

      </section>



      {/* CHARTS */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >

        <div className="container">

          <SectionHeader
            title="Impact Analytics"
            subtitle="Visualizing our progress and reach."
          />

          <div className="row g-4 mt-2">

            {/* Pie Chart */}

            <div className="col-lg-6">

              <ChartCard title="Beneficiary Distribution">

                <PieChartComponent data={pieData} />

              </ChartCard>

            </div>

            {/* Bar Chart */}

            <div className="col-lg-6">

              <ChartCard title="Programs Performance">

                <BarChartComponent data={barData} dataKey="value" xAxisKey="category" />

              </ChartCard>

            </div>

            {/* Area Chart */}

            <div className="col-12">

              <ChartCard title="Growth Over Time">

                <AreaChartComponent data={areaData} dataKey="value" xAxisKey="month" />

              </ChartCard>

            </div>

          </div>

        </div>

      </section>

            {/* IMPACT CATEGORIES */}

      <section className="container py-5">

        <SectionHeader
          title="Areas of Impact"
          subtitle="Our programs focus on sustainable development and long-term transformation."
        />

        <div className="row g-4 mt-2">

          <div className="col-md-6 col-xl-4">

            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "80px 25px 80px 25px",
              }}
            >
              <h3 className="fw-bold text-success mb-3">
                Education
              </h3>

              <p className="text-muted mb-0">
                Expanding access to quality learning opportunities and lifelong skills.
              </p>

            </div>

          </div>

          <div className="col-md-6 col-xl-4">

            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "25px 80px 25px 80px",
              }}
            >
              <h3 className="fw-bold text-primary mb-3">
                Entrepreneurship
              </h3>

              <p className="text-muted mb-0">
                Supporting startups, business training, and financial independence.
              </p>

            </div>

          </div>

          <div className="col-md-6 col-xl-4">

            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "80px 25px 80px 25px",
              }}
            >
              <h3 className="fw-bold text-warning mb-3">
                Technology
              </h3>

              <p className="text-muted mb-0">
                Equipping youth with digital skills for the modern economy.
              </p>

            </div>

          </div>

          <div className="col-md-6 col-xl-4">

            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "25px 80px 25px 80px",
              }}
            >
              <h3 className="fw-bold text-danger mb-3">
                Women Empowerment
              </h3>

              <p className="text-muted mb-0">
                Creating economic opportunities and leadership pathways for women.
              </p>

            </div>

          </div>

          <div className="col-md-6 col-xl-4">

            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "80px 25px 80px 25px",
              }}
            >
              <h3 className="fw-bold text-success mb-3">
                Environment
              </h3>

              <p className="text-muted mb-0">
                Promoting sustainability and responsible use of natural resources.
              </p>

            </div>

          </div>

          <div className="col-md-6 col-xl-4">

            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "25px 80px 25px 80px",
              }}
            >
              <h3 className="fw-bold text-info mb-3">
                Community Development
              </h3>

              <p className="text-muted mb-0">
                Strengthening communities through collaboration and inclusive programs.
              </p>

            </div>

          </div>

        </div>

      </section>



      {/* MILESTONES */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >

        <div className="container">

          <SectionHeader
            title="Our Journey"
            subtitle="Major milestones achieved over the years."
          />

          <div className="position-relative mt-5">

            <div
              style={{
                position: "absolute",
                left: "24px",
                top: 0,
                bottom: 0,
                width: "4px",
                background: "#198754",
              }}
            />

            {/* 2018 */}

            <div className="d-flex mb-5 position-relative">

              <div
                style={{
                  width: 50,
                  height: 50,
                  background: "#198754",
                  borderRadius: "50%",
                  flexShrink: 0,
                  zIndex: 2,
                }}
              />

              <div
                className="bg-white shadow-sm ms-4 p-4 flex-grow-1"
                style={{
                  borderRadius: "50px 20px 50px 20px",
                }}
              >
                <small className="text-success fw-bold">
                  2018
                </small>

                <h5 className="fw-bold mt-2">
                  Organization Founded
                </h5>

                <p className="text-muted mb-0">
                  Started with a mission to transform lives through education and empowerment.
                </p>

              </div>

            </div>

            {/* 2019 */}

            <div className="d-flex mb-5 position-relative">

              <div
                style={{
                  width: 50,
                  height: 50,
                  background: "#198754",
                  borderRadius: "50%",
                  flexShrink: 0,
                  zIndex: 2,
                }}
              />

              <div
                className="bg-white shadow-sm ms-4 p-4 flex-grow-1"
                style={{
                  borderRadius: "20px 50px 20px 50px",
                }}
              >
                <small className="text-success fw-bold">
                  2019
                </small>

                <h5 className="fw-bold mt-2">
                  First Training Program
                </h5>

                <p className="text-muted mb-0">
                  Successfully trained the first cohort of beneficiaries.
                </p>

              </div>

            </div>

            {/* 2021 */}

            <div className="d-flex mb-5 position-relative">

              <div
                style={{
                  width: 50,
                  height: 50,
                  background: "#198754",
                  borderRadius: "50%",
                  flexShrink: 0,
                  zIndex: 2,
                }}
              />

              <div
                className="bg-white shadow-sm ms-4 p-4 flex-grow-1"
                style={{
                  borderRadius: "50px 20px 50px 20px",
                }}
              >
                <small className="text-success fw-bold">
                  2021
                </small>

                <h5 className="fw-bold mt-2">
                  Expansion Across Regions
                </h5>

                <p className="text-muted mb-0">
                  Programs expanded to multiple communities and counties.
                </p>

              </div>

            </div>

            {/* 2023 */}

            <div className="d-flex mb-5 position-relative">

              <div
                style={{
                  width: 50,
                  height: 50,
                  background: "#198754",
                  borderRadius: "50%",
                  flexShrink: 0,
                  zIndex: 2,
                }}
              />

              <div
                className="bg-white shadow-sm ms-4 p-4 flex-grow-1"
                style={{
                  borderRadius: "20px 50px 20px 50px",
                }}
              >
                <small className="text-success fw-bold">
                  2023
                </small>

                <h5 className="fw-bold mt-2">
                  National Reach
                </h5>

                <p className="text-muted mb-0">
                  Thousands of beneficiaries impacted across the country.
                </p>

              </div>

            </div>

            {/* 2025 */}

            <div className="d-flex position-relative">

              <div
                style={{
                  width: 50,
                  height: 50,
                  background: "#198754",
                  borderRadius: "50%",
                  flexShrink: 0,
                  zIndex: 2,
                }}
              />

              <div
                className="bg-white shadow-sm ms-4 p-4 flex-grow-1"
                style={{
                  borderRadius: "50px 20px 50px 20px",
                }}
              >
                <small className="text-success fw-bold">
                  2025
                </small>

                <h5 className="fw-bold mt-2">
                  International Partnerships
                </h5>

                <p className="text-muted mb-0">
                  Collaborations established with organizations and donors worldwide.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

            {/* FEATURED SUCCESS STORIES */}

      <section className="container py-5">

        <SectionHeader
          title="Success Stories"
          subtitle="Real people, real transformation, real impact."
        />

        <div className="row g-4 mt-2">

          {stories.map((story) => (

            <div
              className="col-md-6 col-xl-4"
              key={story.id}
            >

              <StoryCard story={story} />

            </div>

          ))}

        </div>

      </section>



      {/* ANNUAL REPORTS */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >

        <div className="container">

          <SectionHeader
            title="Annual Reports"
            subtitle="Transparency and accountability through published reports."
          />

          <div className="row g-4 mt-4">

            <div className="col-md-4">

              <div
                className="bg-white shadow-sm h-100 p-5 text-center"
                style={{
                  borderRadius: "70px 25px 70px 25px",
                }}
              >

                <h3 className="fw-bold mb-3">
                  2025
                </h3>

                <p className="text-muted">
                  Annual Impact Report
                </p>

                <button className="btn btn-success rounded-pill px-4">
                  Download PDF
                </button>

              </div>

            </div>

            <div className="col-md-4">

              <div
                className="bg-white shadow-sm h-100 p-5 text-center"
                style={{
                  borderRadius: "25px 70px 25px 70px",
                }}
              >

                <h3 className="fw-bold mb-3">
                  2024
                </h3>

                <p className="text-muted">
                  Annual Impact Report
                </p>

                <button className="btn btn-primary rounded-pill px-4">
                  Download PDF
                </button>

              </div>

            </div>

            <div className="col-md-4">

              <div
                className="bg-white shadow-sm h-100 p-5 text-center"
                style={{
                  borderRadius: "70px 25px 70px 25px",
                }}
              >

                <h3 className="fw-bold mb-3">
                  2023
                </h3>

                <p className="text-muted">
                  Annual Impact Report
                </p>

                <button className="btn btn-warning rounded-pill px-4">
                  Download PDF
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* TESTIMONIALS */}

      <TestimonialsSection />



      {/* GALLERY */}

      <GallerySection />



      {/* CALL TO ACTION */}

      <CTASection
        title="Become Part of the Story"
        subtitle="Together we can empower communities, create opportunities, and build sustainable change."
        buttonText="Support Our Mission"
        buttonLink="/donate"
      />

    </>
  );
}

export default ImpactPage;