import PageBanner from "../../components/common/PageBanner";
import SectionHeader from "../../components/common/SectionHeader";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

import VolunteerForm from "../../components/forms/VolunteerForm";

import EventsSection from "../../components/sections/EventsSection";
import TestimonialsSection from "../../components/sections/TestimonialsSection";
import GallerySection from "../../components/sections/GallerySection";
import FAQSection from "../../components/sections/FAQSection";
import CTASection from "../../components/sections/CTASection";

function VolunteerPage() {
  return (
    <>
      <PageBanner
        title="Become a Volunteer"
        subtitle="Use your skills and passion to create meaningful change."
      />

      <div className="container mt-4">
        <Breadcrumbs />
      </div>

      {/* HERO */}

      <section className="container py-5">
        <div
          className="overflow-hidden shadow"
          style={{
            borderRadius: "100px 30px 100px 30px",
            background: "linear-gradient(135deg,#198754,#0d6efd)",
          }}
        >
          <div className="row align-items-center">

            <div className="col-lg-7 p-5 text-white">

              <span className="badge bg-light text-success px-3 py-2 mb-3">
                JOIN OUR COMMUNITY
              </span>

              <h1 className="display-4 fw-bold mb-4">
                Make A Difference Through Volunteering
              </h1>

              <p className="lead">
                Join hundreds of passionate volunteers helping
                communities through education, mentorship,
                technology and outreach programs.
              </p>

              <div className="row mt-5">

                <div className="col-4">
                  <h2 className="fw-bold">800+</h2>
                  <small>Volunteers</small>
                </div>

                <div className="col-4">
                  <h2 className="fw-bold">120</h2>
                  <small>Events</small>
                </div>

                <div className="col-4">
                  <h2 className="fw-bold">54</h2>
                  <small>Communities</small>
                </div>

              </div>
            </div>

            <div className="col-lg-5">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a"
                alt="Volunteer"
                className="w-100"
                style={{
                  minHeight: 500,
                  objectFit: "cover",
                }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* WHY VOLUNTEER */}

      <section className="container py-5">

        <SectionHeader
          title="Why Volunteer With Us?"
          subtitle="Become part of a growing movement creating lasting impact."
        />

        <div className="row g-4 mt-3">

          <div className="col-md-6 col-xl-3">
            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "80px 25px 80px 25px",
              }}
            >
              <h5 className="fw-bold text-success">
                Community Impact
              </h5>

              <p className="text-muted mb-0">
                Transform lives and strengthen communities.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "25px 80px 25px 80px",
              }}
            >
              <h5 className="fw-bold text-primary">
                Grow Skills
              </h5>

              <p className="text-muted mb-0">
                Develop leadership and teamwork abilities.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "80px 25px 80px 25px",
              }}
            >
              <h5 className="fw-bold text-warning">
                Networking
              </h5>

              <p className="text-muted mb-0">
                Connect with professionals and mentors.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div
              className="bg-white shadow-sm p-5 h-100"
              style={{
                borderRadius: "25px 80px 25px 80px",
              }}
            >
              <h5 className="fw-bold text-danger">
                Recognition
              </h5>

              <p className="text-muted mb-0">
                Receive certificates and appreciation.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* OPPORTUNITIES */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >

        <div className="container">

          <SectionHeader
            title="Volunteer Opportunities"
            subtitle="Find where your passion and talents can contribute."
          />

          <div className="row g-4 mt-3">

            <div className="col-md-6 col-lg-3">

              <div
                className="bg-white shadow-sm p-5 h-100"
                style={{
                  borderRadius: "80px 25px 80px 25px",
                }}
              >
                <h5 className="fw-bold text-success">
                  Teaching
                </h5>

                <p className="text-muted mb-0">
                  Mentor and educate young learners.
                </p>
              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div
                className="bg-white shadow-sm p-5 h-100"
                style={{
                  borderRadius: "25px 80px 25px 80px",
                }}
              >
                <h5 className="fw-bold text-primary">
                  Events
                </h5>

                <p className="text-muted mb-0">
                  Support outreach and community programs.
                </p>
              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div
                className="bg-white shadow-sm p-5 h-100"
                style={{
                  borderRadius: "80px 25px 80px 25px",
                }}
              >
                <h5 className="fw-bold text-warning">
                  Technology
                </h5>

                <p className="text-muted mb-0">
                  Apply digital skills to support projects.
                </p>
              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div
                className="bg-white shadow-sm p-5 h-100"
                style={{
                  borderRadius: "25px 80px 25px 80px",
                }}
              >
                <h5 className="fw-bold text-danger">
                  Administration
                </h5>

                <p className="text-muted mb-0">
                  Assist with planning and operations.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* APPLICATION PROCESS */}

      <section className="container py-5">

        <SectionHeader
          title="How To Join"
          subtitle="Becoming a volunteer is simple."
        />

        <div className="row g-4 mt-4">

          <div className="col-md-3">

            <div className="shadow-sm bg-white p-4 text-center h-100 rounded-5">
              <h1 className="text-success">1</h1>
              <h5>Apply</h5>
              <p className="text-muted">
                Submit your volunteer application.
              </p>
            </div>

          </div>

          <div className="col-md-3">

            <div className="shadow-sm bg-white p-4 text-center h-100 rounded-5">
              <h1 className="text-primary">2</h1>
              <h5>Review</h5>
              <p className="text-muted">
                Our team reviews your information.
              </p>
            </div>

          </div>

          <div className="col-md-3">

            <div className="shadow-sm bg-white p-4 text-center h-100 rounded-5">
              <h1 className="text-warning">3</h1>
              <h5>Training</h5>
              <p className="text-muted">
                Attend orientation and onboarding.
              </p>
            </div>

          </div>

          <div className="col-md-3">

            <div className="shadow-sm bg-white p-4 text-center h-100 rounded-5">
              <h1 className="text-danger">4</h1>
              <h5>Serve</h5>
              <p className="text-muted">
                Start creating impact.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FORM */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >

        <div className="container">

          <div className="row justify-content-center">

            <div className="col-xl-8">

              <div
                className="bg-white shadow p-5"
                style={{
                  borderRadius: "100px 30px 100px 30px",
                }}
              >
                <SectionHeader
                  title="Volunteer Application"
                  subtitle="Fill in the form below and our team will contact you."
                />

                <VolunteerForm />
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* EVENTS */}

      <EventsSection />

      {/* TESTIMONIALS */}

      <TestimonialsSection />

      {/* GALLERY */}

      <GallerySection />

      {/* FAQ */}

      <FAQSection />

      {/* CTA */}

      <CTASection
        title="Ready To Make An Impact?"
        subtitle="Join hundreds of volunteers creating change every day."
        buttonText="Become A Volunteer"
        buttonLink="/volunteer"
      />
    </>
  );
}

export default VolunteerPage;