import { useEffect, useState } from "react";

import PageBanner from "../../components/common/PageBanner";
import SectionHeader from "../../components/common/SectionHeader";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

import StoryCard from "../../components/cards/StoryCard";

import SearchBar from "../../components/filters/SearchBar";
import CategoryPills from "../../components/filters/CategoryPills";

import TestimonialsSection from "../../components/sections/TestimonialsSection";
import GallerySection from "../../components/sections/GallerySection";
import CTASection from "../../components/sections/CTASection";

import analyticsService from "../../services/analyticsService";

function SuccessStoriesPage() {

  const [stories, setStories] = useState([]);

  const [filteredStories, setFilteredStories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const categories = [
    "All",
    "Education",
    "Technology",
    "Women",
    "Entrepreneurship",
    "Youth",
    "Community"
  ];

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {

    let results = stories;

    if (activeCategory !== "All") {

      results = results.filter(
        (story) => story.category === activeCategory
      );

    }

    if (searchTerm) {

      results = results.filter(
        (story) =>
          story.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

    }

    setFilteredStories(results);

  }, [stories, searchTerm, activeCategory]);

  const fetchStories = async () => {

    try {

      const response =
        await analyticsService.getSuccessStories();

      const payload = Array.isArray(response?.data) ? response.data : response?.data?.stories || [];
      setStories(payload);

    } catch (error) {
      console.error(error);
      setStories([]);
    }

  };

    return (
    <>
      <PageBanner
        title="Success Stories"
        subtitle="Real Lives. Real Impact. Real Transformation."
      />

      <Breadcrumbs />

      {/* HERO */}

      <section className="container py-5">

        <div
          className="overflow-hidden shadow"
          style={{
            borderRadius: "90px 30px 90px 30px",
            background:
              "linear-gradient(135deg,#198754,#0d6efd)"
          }}
        >

          <div className="row align-items-center">

            <div className="col-lg-7 p-5 text-white">

              <span className="badge bg-light text-success mb-3 px-3 py-2">
                SUCCESS STORIES
              </span>

              <h1 className="display-4 fw-bold mb-4">

                Transforming
                Lives Through
                Opportunity

              </h1>

              <p className="lead">

                Behind every number is a person whose life
                has changed through education, mentorship,
                entrepreneurship and community support.

              </p>

              <div className="row mt-5">

                <div className="col-4">

                  <h2 className="fw-bold">
                    25K+
                  </h2>

                  <small>
                    Lives Impacted
                  </small>

                </div>

                <div className="col-4">

                  <h2 className="fw-bold">
                    6200+
                  </h2>

                  <small>
                    Graduates
                  </small>

                </div>

                <div className="col-4">

                  <h2 className="fw-bold">
                    1800+
                  </h2>

                  <small>
                    Jobs Created
                  </small>

                </div>

              </div>

            </div>

            <div className="col-lg-5">

              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Stories"
                className="w-100"
                style={{
                  minHeight: 500,
                  objectFit: "cover"
                }}
              />

            </div>

          </div>

        </div>

      </section>

            {/* SEARCH + FILTERS */}

      <section className="container py-5">

        <SectionHeader
          title="Explore Success Stories"
          subtitle="Discover stories from different programs and communities."
        />

        <div className="row mt-4 align-items-center">

          <div className="col-lg-6 mb-3">

            <SearchBar
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search stories..."
            />

          </div>

          <div className="col-lg-6">

            <CategoryPills
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

          </div>

        </div>

      </section>



      {/* FEATURED STORY */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc"
        }}
      >

        <div className="container">

          <SectionHeader
            title="Featured Transformation"
            subtitle="One story that captures the power of opportunity."
          />

          <div
            className="overflow-hidden shadow mt-4 bg-white"
            style={{
              borderRadius: "80px 25px 80px 25px"
            }}
          >

            <div className="row align-items-center">

              <div className="col-lg-5">

                <img
                  src={
                    filteredStories[0]?.image ||
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                  }
                  alt="Featured story"
                  className="w-100"
                  style={{
                    minHeight: 420,
                    objectFit: "cover"
                  }}
                />

              </div>

              <div className="col-lg-7 p-5">

                <span className="badge bg-success mb-3 px-3 py-2">

                  {filteredStories[0]?.category || "Impact"}

                </span>

                <h2 className="fw-bold mb-4">

                  {filteredStories[0]?.title}

                </h2>

                <p className="text-muted lead">

                  {filteredStories[0]?.excerpt}

                </p>

                <button className="btn btn-success rounded-pill px-4 mt-3">

                  Read Full Story

                </button>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* STORIES GRID */}

      <section className="container py-5">

        <SectionHeader
          title="More Inspiring Stories"
          subtitle="Every story represents resilience, growth and transformation."
        />

        <div className="row g-4 mt-3">

          {filteredStories.map((story) => (

            <div
              className="col-md-6 col-xl-4"
              key={story.id}
            >

              <StoryCard story={story} />

            </div>

          ))}

        </div>

        {

          filteredStories.length === 0 && (

            <div className="text-center py-5">

              <h4 className="fw-bold">
                No stories found
              </h4>

              <p className="text-muted">

                Try another search term or category.

              </p>

            </div>

          )

        }

      </section>

            {/* BEFORE & AFTER */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >
        <div className="container">

          <SectionHeader
            title="Before & After"
            subtitle="Transformation is measured not only in numbers but in changed lives."
          />

          <div className="row g-4 mt-3">

            <div className="col-lg-6">

              <div
                className="bg-white shadow-sm overflow-hidden h-100"
                style={{
                  borderRadius: "90px 25px 90px 25px",
                }}
              >
                <div className="row g-0">

                  <div className="col-6">

                    <img
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
                      alt="Before"
                      className="w-100 h-100"
                      style={{
                        minHeight: 300,
                        objectFit: "cover",
                      }}
                    />

                  </div>

                  <div className="col-6 p-4 d-flex flex-column justify-content-center">

                    <span className="badge bg-danger mb-3">
                      Before
                    </span>

                    <h4 className="fw-bold">
                      Limited Opportunities
                    </h4>

                    <p className="text-muted mb-0">
                      Many participants faced unemployment,
                      lack of training, and limited access
                      to resources.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="col-lg-6">

              <div
                className="bg-white shadow-sm overflow-hidden h-100"
                style={{
                  borderRadius: "25px 90px 25px 90px",
                }}
              >
                <div className="row g-0">

                  <div className="col-6">

                    <img
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                      alt="After"
                      className="w-100 h-100"
                      style={{
                        minHeight: 300,
                        objectFit: "cover",
                      }}
                    />

                  </div>

                  <div className="col-6 p-4 d-flex flex-column justify-content-center">

                    <span className="badge bg-success mb-3">
                      After
                    </span>

                    <h4 className="fw-bold">
                      Empowered Futures
                    </h4>

                    <p className="text-muted mb-0">
                      Training, mentorship and community
                      support created new opportunities
                      and sustainable livelihoods.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* VIDEO STORIES */}

      <section className="container py-5">

        <SectionHeader
          title="Video Stories"
          subtitle="Watch inspiring journeys from our beneficiaries."
        />

        <div className="row g-4 mt-3">

          <div className="col-lg-4">

            <div
              className="shadow-sm overflow-hidden bg-white h-100"
              style={{
                borderRadius: "70px 20px 70px 20px",
              }}
            >

              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                className="w-100"
                style={{
                  height: 250,
                  objectFit: "cover",
                }}
                alt=""
              />

              <div className="p-4">

                <h5 className="fw-bold">
                  Digital Skills Journey
                </h5>

                <p className="text-muted">
                  Learn how technology training opened
                  doors to employment.
                </p>

              </div>

            </div>

          </div>

          <div className="col-lg-4">

            <div
              className="shadow-sm overflow-hidden bg-white h-100"
              style={{
                borderRadius: "20px 70px 20px 70px",
              }}
            >

              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                className="w-100"
                style={{
                  height: 250,
                  objectFit: "cover",
                }}
                alt=""
              />

              <div className="p-4">

                <h5 className="fw-bold">
                  Women Entrepreneurship
                </h5>

                <p className="text-muted">
                  From an idea to a thriving business.
                </p>

              </div>

            </div>

          </div>

          <div className="col-lg-4">

            <div
              className="shadow-sm overflow-hidden bg-white h-100"
              style={{
                borderRadius: "70px 20px 70px 20px",
              }}
            >

              <img
                src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df"
                className="w-100"
                style={{
                  height: 250,
                  objectFit: "cover",
                }}
                alt=""
              />

              <div className="p-4">

                <h5 className="fw-bold">
                  Youth Innovation
                </h5>

                <p className="text-muted">
                  Young leaders solving local challenges.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* IMPACT STATISTICS */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >
        <div className="container">

          <SectionHeader
            title="Impact Statistics"
            subtitle="Numbers that represent transformed lives."
          />

          <div className="row g-4 mt-3">

            <div className="col-6 col-lg-3">

              <div
                className="bg-white shadow-sm text-center p-5 h-100"
                style={{
                  borderRadius: "80px 25px 80px 25px",
                }}
              >

                <h2 className="fw-bold text-success">
                  25K+
                </h2>

                <p className="text-muted mb-0">
                  Lives Impacted
                </p>

              </div>

            </div>

            <div className="col-6 col-lg-3">

              <div
                className="bg-white shadow-sm text-center p-5 h-100"
                style={{
                  borderRadius: "25px 80px 25px 80px",
                }}
              >

                <h2 className="fw-bold text-primary">
                  6200+
                </h2>

                <p className="text-muted mb-0">
                  Graduates
                </p>

              </div>

            </div>

            <div className="col-6 col-lg-3">

              <div
                className="bg-white shadow-sm text-center p-5 h-100"
                style={{
                  borderRadius: "80px 25px 80px 25px",
                }}
              >

                <h2 className="fw-bold text-warning">
                  1800+
                </h2>

                <p className="text-muted mb-0">
                  Jobs Created
                </p>

              </div>

            </div>

            <div className="col-6 col-lg-3">

              <div
                className="bg-white shadow-sm text-center p-5 h-100"
                style={{
                  borderRadius: "25px 80px 25px 80px",
                }}
              >

                <h2 className="fw-bold text-danger">
                  54
                </h2>

                <p className="text-muted mb-0">
                  Communities Served
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

            {/* TESTIMONIALS */}

      <TestimonialsSection />


      {/* GALLERY */}

      <GallerySection />


      {/* FINAL CALL TO ACTION */}

      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg,#198754,#0d6efd)"
        }}
      >
        <div className="container">

          <div
            className="text-center text-white mx-auto shadow"
            style={{
              maxWidth: "1000px",
              borderRadius: "100px 30px 100px 30px",
              background: "rgba(255,255,255,.08)",
              padding: "5rem 2rem",
              backdropFilter: "blur(12px)"
            }}
          >

            <span className="badge bg-light text-success px-3 py-2 mb-4">

              JOIN THE MOVEMENT

            </span>

            <h2 className="display-5 fw-bold mb-4">

              Help Create More Success Stories

            </h2>

            <p
              className="lead mx-auto"
              style={{
                maxWidth: 700
              }}
            >

              Every contribution, partnership and act of
              volunteering helps transform lives and build
              stronger communities.

            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3 mt-5">

              <a
                href="/donate"
                className="btn btn-light btn-lg rounded-pill px-5"
              >
                Donate Today
              </a>

              <a
                href="/volunteer"
                className="btn btn-outline-light btn-lg rounded-pill px-5"
              >
                Become a Volunteer
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* REUSABLE CTA SECTION */}

      <CTASection
        title="Together We Build Better Futures"
        subtitle="Empowering communities through education, technology and entrepreneurship."
        buttonText="Support Our Mission"
        buttonLink="/donate"
      />

    </>
  );
}

export default SuccessStoriesPage;