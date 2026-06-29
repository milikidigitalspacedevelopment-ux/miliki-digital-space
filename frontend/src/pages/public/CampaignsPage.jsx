import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  Clock3,
  ArrowRight,
  Target,
  HeartHandshake,
} from "lucide-react";

import PageBanner from "../../components/common/PageBanner";
import CampaignCard from "../../components/cards/CampaignCard";
import CTASection from "../../components/sections/CTASection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";

import campaignService from "../../services/campaignService";

function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      const response = await campaignService.getCampaigns();

      setCampaigns(Array.isArray(response) ? response : response?.data || []);
    } catch {
      setCampaigns([
        {
          id: 1,
          title: "Digital Skills For Youth",
          category: "Technology",
          image:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
          description:
            "Providing digital skills training to underserved youth.",
          raisedAmount: 36500,
          goalAmount: 50000,
          donorsCount: 120,
          daysLeft: 25,
        },
        {
          id: 2,
          title: "Women Entrepreneurship",
          category: "Women Empowerment",
          image:
            "https://images.unsplash.com/photo-1521791136064-7986c2920216",
          description:
            "Supporting women-owned businesses and startups.",
          raisedAmount: 22000,
          goalAmount: 40000,
          donorsCount: 84,
          daysLeft: 19,
        },
        {
          id: 3,
          title: "Agriculture For Communities",
          category: "Agriculture",
          image:
            "https://images.unsplash.com/photo-1500937386664-56d1dfef3854",
          description:
            "Building sustainable food systems and empowering farmers.",
          raisedAmount: 12000,
          goalAmount: 30000,
          donorsCount: 60,
          daysLeft: 30,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    "Education",
    "Technology",
    "Agriculture",
    "Entrepreneurship",
    "Women Empowerment",
  ];

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(
      (campaign) =>
        campaign.title
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (selectedCategory === "All" ||
          campaign.category === selectedCategory)
    );
  }, [campaigns, search, selectedCategory]);

  const featuredCampaign = campaigns[0];

  return (
    <>
      <PageBanner
        title="Campaigns"
        subtitle="Join us in creating lasting change through impactful initiatives."
      />

      {/* Featured Campaign */}

      {featuredCampaign && (
        <section className="container py-5">

          <div
            className="shadow overflow-hidden"
            style={{
              borderRadius: "70px 25px 70px 25px",
              background: "#fff",
            }}
          >
            <div className="row g-0">

              <div className="col-lg-6">
                <img
                  src={featuredCampaign.image}
                  alt={featuredCampaign.title}
                  className="w-100 h-100"
                  style={{
                    objectFit: "cover",
                    minHeight: "400px",
                  }}
                />
              </div>

              <div className="col-lg-6 p-5">

                <span className="badge bg-success mb-3">
                  Featured Campaign
                </span>

                <h2 className="fw-bold mb-3">
                  {featuredCampaign.title}
                </h2>

                <p className="text-muted">
                  {featuredCampaign.description}
                </p>

                <div className="mt-4">

                  <div className="d-flex justify-content-between mb-2">
                    <strong>
                      $
                      {featuredCampaign.raisedAmount.toLocaleString()}
                    </strong>

                    <strong>
                      Goal: $
                      {featuredCampaign.goalAmount.toLocaleString()}
                    </strong>
                  </div>

                  <div
                    className="progress"
                    style={{
                      height: 15,
                      borderRadius: 30,
                    }}
                  >
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${
                          (featuredCampaign.raisedAmount /
                            featuredCampaign.goalAmount) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 text-success fw-bold">
                    {Math.round(
                      (featuredCampaign.raisedAmount /
                        featuredCampaign.goalAmount) *
                        100
                    )}
                    % funded
                  </div>
                </div>

                <Link
                  to={`/campaigns/${featuredCampaign.id}`}
                  className="btn btn-success rounded-pill mt-4 px-4"
                >
                  Donate Now
                </Link>

              </div>

            </div>
          </div>

        </section>
      )}

      {/* Search */}

      <section className="container mb-4">

        <div className="position-relative">

          <Search
            size={18}
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
          />

          <input
            type="text"
            className="form-control rounded-pill py-3 ps-5"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </section>

      {/* Filters */}

      <section className="container mb-5">

        <div className="d-flex flex-wrap gap-3">

          {categories.map((category) => (
            <button
              key={category}
              className={`btn rounded-pill px-4 ${
                selectedCategory === category
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}

        </div>

      </section>

      {/* Campaign Grid */}

      <section className="container pb-5">

        {loading ? (
          <LoadingSpinner />
        ) : filteredCampaigns.length === 0 ? (
          <EmptyState
            title="No Campaigns Found"
            message="Try changing your filters."
          />
        ) : (
          <div className="row g-4">

            {filteredCampaigns.map((campaign) => {
              const percentage = Math.round(
                (campaign.raisedAmount / campaign.goalAmount) * 100
              );

              return (
                <div
                  className="col-md-6 col-xl-4"
                  key={campaign.id}
                >
                  <div
                    className="card border-0 shadow h-100 overflow-hidden"
                    style={{
                      borderRadius: "60px 20px 60px 20px",
                    }}
                  >
                    <img
                      src={campaign.image}
                      className="card-img-top"
                      alt={campaign.title}
                      style={{
                        height: 240,
                        objectFit: "cover",
                      }}
                    />

                    <div className="card-body p-4">

                      <span className="badge bg-primary mb-3">
                        {campaign.category}
                      </span>

                      <h5 className="fw-bold">
                        {campaign.title}
                      </h5>

                      <p className="text-muted">
                        {campaign.description}
                      </p>

                      <div className="d-flex justify-content-between mb-2">
                        <small>
                          $
                          {campaign.raisedAmount.toLocaleString()}
                        </small>

                        <small>
                          $
                          {campaign.goalAmount.toLocaleString()}
                        </small>
                      </div>

                      <div
                        className="progress"
                        style={{
                          height: 10,
                          borderRadius: 20,
                        }}
                      >
                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2 text-success fw-bold">
                        {percentage}% funded
                      </div>

                    </div>

                    <div className="card-footer bg-white border-0 px-4 pb-4">

                      <div className="d-flex justify-content-between mb-4">

                        <small className="text-muted">
                          <Users size={15} /> {campaign.donorsCount}
                        </small>

                        <small className="text-muted">
                          <Clock3 size={15} /> {campaign.daysLeft} days
                        </small>

                      </div>

                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="btn btn-success rounded-pill w-100"
                      >
                        View Campaign
                        <ArrowRight size={16} className="ms-2" />
                      </Link>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* Impact */}

      <section className="bg-light py-5">

        <div className="container">

          <div className="row g-4 text-center">

            <div className="col-md-3">
              <div className="p-4 bg-white shadow rounded-5">
                <Target className="text-primary mb-3" size={40} />
                <h2 className="fw-bold">500+</h2>
                <p className="text-muted mb-0">
                  Scholarships
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 bg-white shadow rounded-5">
                <HeartHandshake
                  className="text-success mb-3"
                  size={40}
                />
                <h2 className="fw-bold">350+</h2>
                <p className="text-muted mb-0">
                  Businesses Supported
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 bg-white shadow rounded-5">
                <Users className="text-danger mb-3" size={40} />
                <h2 className="fw-bold">1200+</h2>
                <p className="text-muted mb-0">
                  Youth Beneficiaries
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 bg-white shadow rounded-5">
                <Globe className="text-warning mb-3" size={40} />
                <h2 className="fw-bold">20+</h2>
                <p className="text-muted mb-0">
                  Communities
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      <CTASection />
    </>
  );
}

export default CampaignsPage;