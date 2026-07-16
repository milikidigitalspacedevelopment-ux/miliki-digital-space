import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Users, Share2, MessageCircle } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

import PageBanner from "../../components/common/PageBanner";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import CTASection from "../../components/sections/CTASection";
import CampaignCard from "../../components/cards/CampaignCard";

import campaignService from "../../services/campaignService";

function CampaignDetailsPage() {
  const { id } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  const [relatedCampaigns, setRelatedCampaigns] = useState([]);

  const [amount, setAmount] = useState(50);

const [frequency, setFrequency] =
  useState("one-time");

const [paymentMethod, setPaymentMethod] =
  useState("mpesa");

const [commentName, setCommentName] = useState("");
const [commentMessage, setCommentMessage] = useState("");

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);

      const response = await campaignService.getCampaignById(id);
      const campaignData = response?.data ?? response;

      setCampaign({
        ...campaignData,
        raisedAmount:
          campaignData?.raisedAmount ?? campaignData?.raised_amount ?? 0,
        goalAmount:
          campaignData?.goalAmount ?? campaignData?.goal_amount ?? 1,
        location: campaignData?.location || "Nairobi, Kenya",
        beneficiaries: campaignData?.beneficiaries ?? campaignData?.beneficiary_count ?? 0,
      });
      setRelatedCampaigns(response?.relatedCampaigns || []);
    } catch (error) {
      console.log(error);

      setCampaign({
        id: 1,
        title: "Digital Skills For Youth",
        category: "Technology",
        location: "Nairobi, Kenya",

        beneficiaries: 1200,

        image:
          "/impact.png",

        description:
          "Empowering underserved youth through digital literacy, entrepreneurship and employability training.",

        raisedAmount: 36500,
        goalAmount: 50000,
        donorsCount: 120,
        daysLeft: 25,

        background:
          "Many young people lack access to technology and digital education.",

        problem:
          "Limited access to skills prevents economic empowerment.",

        solution:
          "Provide practical training and mentorship.",

        impact:
          "Create employment opportunities and sustainable livelihoods.",

        gallery: [
          "/impact.png",
          "/impact.png",
          "/impact.png",
          "/impact.png",
        ],

        updates: [
          {
            date: "2026-06-01",
            title: "Equipment Delivered",
            content: "50 laptops delivered successfully.",
          },

          {
            date: "2026-06-10",
            title: "Training Started",
            content: "First cohort officially launched.",
          },
        ],

        recentDonors: [
          {
            name: "Anonymous",
            amount: 100,
          },

          {
            name: "Mary W.",
            amount: 50,
          },

          {
            name: "John K.",
            amount: 75,
          },
        ],

        comments: [
          {
            name: "Grace",
            message: "Amazing initiative.",
            createdAt: "2026-06-12",
          },

          {
            name: "Peter",
            message: "Happy to support.",
            createdAt: "2026-06-15",
          },
        ],
      });

      setRelatedCampaigns([
        {
          id: 2,
          title: "Women Entrepreneurship",
          image:
            "/impact.png",
          category: "Women Empowerment",
          raisedAmount: 22000,
          goalAmount: 40000,
        },

        {
          id: 3,
          title: "Agriculture Support",
          image:
            "/impact.png",
          category: "Agriculture",
          raisedAmount: 18000,
          goalAmount: 30000,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const percentage = Math.round(
    (campaign.raisedAmount / campaign.goalAmount) * 100
  );

  return (
    <>
      <PageBanner
        title={campaign.title}
        subtitle={campaign.category}
      />

      {/* HERO */}

      <section className="container py-5">

        <div
          className="overflow-hidden shadow"
          style={{
            borderRadius: "80px 25px 80px 25px",
          }}
        >
          <div className="row g-0">

            <div className="col-lg-7">

              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-100 h-100"
                style={{
                  minHeight: 500,
                  objectFit: "cover",
                }}
              />

            </div>

            <div className="col-lg-5 bg-white p-5">

              <span className="badge bg-success mb-3">
                {campaign.category}
              </span>

              <h1 className="fw-bold mb-4">
                {campaign.title}
              </h1>

              <p className="text-muted">
                {campaign.description}
              </p>

              <div className="mt-4">

                <div className="d-flex align-items-center mb-3">
                  <MapPin
                    size={18}
                    className="me-2 text-success"
                  />

                  {campaign.location}
                </div>

                <div className="d-flex align-items-center">

                  <Users
                    size={18}
                    className="me-2 text-primary"
                  />

                  {campaign.beneficiaries.toLocaleString()}
                  &nbsp;beneficiaries

                </div>

              </div>

              <hr className="my-4" />

              <h6 className="fw-bold mb-3">
                Share Campaign
              </h6>

              <div className="d-flex gap-3">


                <button className="btn btn-outline-primary rounded-circle">
                  <FaFacebookF size={18} />
                </button>

                <button className="btn btn-outline-info rounded-circle">
                  <FaTwitter size={18} />
                </button>

                <button className="btn btn-outline-success rounded-circle">
                  <MessageCircle size={18} />
                </button>

                <button className="btn btn-outline-dark rounded-circle">
                  <FaLinkedinIn size={18} />
                </button>

              </div>

            </div>

          </div>
        </div>

      </section>

            {/* PROGRESS + DONATION */}

      <section className="container pb-5">

        <div className="row g-5">

          {/* LEFT */}

          <div className="col-lg-8">

            <div
              className="bg-white shadow-sm p-5"
              style={{
                borderRadius: "60px 20px 60px 20px",
              }}
            >
              <div className="row text-center mb-4">

                <div className="col-md-3 mb-3">
                  <h3 className="fw-bold text-success">
                    $
                    {campaign.raisedAmount.toLocaleString()}
                  </h3>

                  <small className="text-muted">
                    Raised
                  </small>
                </div>

                <div className="col-md-3 mb-3">
                  <h3 className="fw-bold text-primary">
                    $
                    {campaign.goalAmount.toLocaleString()}
                  </h3>

                  <small className="text-muted">
                    Goal
                  </small>
                </div>

                <div className="col-md-3 mb-3">
                  <h3 className="fw-bold text-warning">
                    {campaign.donorsCount}
                  </h3>

                  <small className="text-muted">
                    Donors
                  </small>
                </div>

                <div className="col-md-3 mb-3">
                  <h3 className="fw-bold text-danger">
                    {campaign.daysLeft}
                  </h3>

                  <small className="text-muted">
                    Days Left
                  </small>
                </div>

              </div>

              <div
                className="progress"
                style={{
                  height: 18,
                  borderRadius: 30,
                }}
              >
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <div className="mt-3">

                <span className="fw-bold text-success">
                  {percentage}% funded
                </span>

              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR */}

          <div className="col-lg-4">

            <div
              className="shadow position-lg-sticky p-4"
              style={{
                top: "100px",
                borderRadius: "80px 25px 80px 25px",
                background: "#fff",
              }}
            >
              <h4 className="fw-bold mb-4">
                Support This Campaign
              </h4>

              {/* QUICK AMOUNTS */}

              <div className="mb-4">

                <label className="fw-semibold mb-3">
                  Select Amount
                </label>

                <div className="row g-2">

                  {[10, 25, 50, 100, 250].map((amount) => (
                    <div
                      className="col-4"
                      key={amount}
                    >
                      <button
                        className="btn btn-outline-success rounded-pill w-100"
                      >
                        ${amount}
                      </button>
                    </div>
                  ))}

                </div>

              </div>

              {/* CUSTOM AMOUNT */}

              <div className="mb-4">

                <label className="fw-semibold mb-2">
                  Custom Amount
                </label>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                />

              </div>

              {/* FREQUENCY */}

              <div className="mb-4">

                <label className="fw-semibold mb-2">
                  Frequency
                </label>

                <select className="form-select">

                  <option>
                    One Time
                  </option>

                  <option>
                    Monthly
                  </option>

                </select>

              </div>

              {/* PAYMENT */}

              <div className="mb-4">

                <label className="fw-semibold mb-2">
                  Payment Method
                </label>

                <select className="form-select">

                  <option>
                    MPESA
                  </option>

                  <option>
                    Card
                  </option>

                  <option>
                    PayPal
                  </option>

                  <option>
                    Bank Transfer
                  </option>

                </select>

              </div>

              <button
                className="btn btn-success w-100 rounded-pill py-3"
              >
                Donate Now
              </button>

              <div className="mt-4 text-center">

                <small className="text-muted">

                  Secure donations powered by our payment gateway.

                </small>

              </div>

            </div>

          </div>

        </div>

      </section>

            {/* STORY */}

      <section className="container py-5">

        <div className="text-center mb-5">

          <h2 className="fw-bold">
            Campaign Story
          </h2>

          <p className="text-muted">
            Learn why this initiative matters and the impact it aims to create.
          </p>

        </div>

        <div className="row g-4">

          <div className="col-md-6">

            <div
              className="shadow-sm bg-white p-5 h-100"
              style={{
                borderRadius: "70px 25px 70px 25px",
              }}
            >
              <h4 className="fw-bold text-success mb-4">
                Background
              </h4>

              <p className="text-muted mb-0">
                {campaign.background}
              </p>

            </div>

          </div>

          <div className="col-md-6">

            <div
              className="shadow-sm bg-white p-5 h-100"
              style={{
                borderRadius: "25px 70px 25px 70px",
              }}
            >
              <h4 className="fw-bold text-danger mb-4">
                Problem
              </h4>

              <p className="text-muted mb-0">
                {campaign.problem}
              </p>

            </div>

          </div>

          <div className="col-md-6">

            <div
              className="shadow-sm bg-white p-5 h-100"
              style={{
                borderRadius: "80px 20px 80px 20px",
              }}
            >
              <h4 className="fw-bold text-primary mb-4">
                Our Solution
              </h4>

              <p className="text-muted mb-0">
                {campaign.solution}
              </p>

            </div>

          </div>

          <div className="col-md-6">

            <div
              className="shadow-sm bg-white p-5 h-100"
              style={{
                borderRadius: "20px 80px 20px 80px",
              }}
            >
              <h4 className="fw-bold text-warning mb-4">
                Expected Impact
              </h4>

              <p className="text-muted mb-0">
                {campaign.impact}
              </p>

            </div>

          </div>

        </div>

      </section>



      {/* GALLERY */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              Gallery
            </h2>

            <p className="text-muted">
              Highlights from the campaign activities and beneficiaries.
            </p>

          </div>

          <div className="row g-4">

            {campaign.gallery.map((image, index) => (

              <div
                className="col-md-6 col-xl-3"
                key={index}
              >

                <div
                  className="overflow-hidden shadow h-100"
                  style={{
                    borderRadius: "80px 25px 80px 25px",
                  }}
                >

                  <img
                    src={image}
                    alt={`Gallery ${index}`}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      minHeight: "280px",
                      transition: ".4s",
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>
           {/* STATISTICS */}

      <section className="container py-5">

        <div className="text-center mb-5">

          <h2 className="fw-bold">
            Campaign Impact
          </h2>

          <p className="text-muted">
            Measuring success through real outcomes.
          </p>

        </div>

        <div className="row g-4">

          <div className="col-md-6 col-xl-3">

            <div
              className="bg-white shadow-sm p-5 text-center h-100"
              style={{
                borderRadius: "60px 20px 60px 20px",
              }}
            >
              <h1 className="fw-bold text-success">
                500+
              </h1>

              <p className="text-muted mb-0">
                Beneficiaries
              </p>

            </div>

          </div>

          <div className="col-md-6 col-xl-3">

            <div
              className="bg-white shadow-sm p-5 text-center h-100"
              style={{
                borderRadius: "20px 60px 20px 60px",
              }}
            >
              <h1 className="fw-bold text-primary">
                45
              </h1>

              <p className="text-muted mb-0">
                Volunteers
              </p>

            </div>

          </div>

          <div className="col-md-6 col-xl-3">

            <div
              className="bg-white shadow-sm p-5 text-center h-100"
              style={{
                borderRadius: "60px 20px 60px 20px",
              }}
            >
              <h1 className="fw-bold text-warning">
                20
              </h1>

              <p className="text-muted mb-0">
                Communities
              </p>

            </div>

          </div>

          <div className="col-md-6 col-xl-3">

            <div
              className="bg-white shadow-sm p-5 text-center h-100"
              style={{
                borderRadius: "20px 60px 20px 60px",
              }}
            >
              <h1 className="fw-bold text-danger">
                92%
              </h1>

              <p className="text-muted mb-0">
                Success Rate
              </p>

            </div>

          </div>

        </div>

      </section>

            {/* UPDATES */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              Campaign Updates
            </h2>

            <p className="text-muted">
              Follow the journey and milestones achieved.
            </p>

          </div>

          <div className="position-relative">

            {/* vertical line */}

            <div
              style={{
                position: "absolute",
                left: "25px",
                top: 0,
                bottom: 0,
                width: "4px",
                background: "#198754",
              }}
            />

            {campaign.updates.map((update, index) => (

              <div
                key={index}
                className="d-flex mb-5 position-relative"
              >

                {/* circle */}

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

                {/* content */}

                <div
                  className="bg-white shadow-sm ms-4 p-4 flex-grow-1"
                  style={{
                    borderRadius: "50px 20px 50px 20px",
                  }}
                >

                  <small className="text-success fw-semibold">
                    {update.date}
                  </small>

                  <h5 className="fw-bold mt-2">
                    {update.title}
                  </h5>

                  <p className="text-muted mb-0">
                    {update.content}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

            {/* DONOR WALL */}

      <section className="container py-5">

        <div className="text-center mb-5">

          <h2 className="fw-bold">
            Recent Supporters
          </h2>

          <p className="text-muted">
            Thank you to everyone making this campaign possible.
          </p>

        </div>

        <div className="row g-4">

          {campaign.recentDonors.map((donor, index) => (

            <div
              className="col-md-6 col-xl-4"
              key={index}
            >

              <div
                className="bg-white shadow-sm p-4 h-100"
                style={{
                  borderRadius: "60px 20px 60px 20px",
                }}
              >

                <div className="d-flex align-items-center">

                  <div
                    className="d-flex justify-content-center align-items-center me-3"
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      background: "#198754",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 22,
                    }}
                  >
                    {donor.name.charAt(0)}
                  </div>

                  <div>

                    <h5 className="fw-bold mb-1">
                      {donor.name}
                    </h5>

                    <span className="text-success fw-semibold">
                      ${donor.amount}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* COMMENTS */}

      <section
        className="py-5"
        style={{
          background: "#f8fafc",
        }}
      >

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              Community Messages
            </h2>

            <p className="text-muted">
              Encouragement and support from our community.
            </p>

          </div>

          <div className="row g-5">

            {/* Existing Comments */}

            <div className="col-lg-7">

              {campaign.comments.map((comment, index) => (

                <div
                  key={index}
                  className="bg-white shadow-sm p-4 mb-4"
                  style={{
                    borderRadius: "50px 20px 50px 20px",
                  }}
                >

                  <div className="d-flex justify-content-between mb-3">

                    <h6 className="fw-bold">
                      {comment.name}
                    </h6>

                    <small className="text-muted">
                      {comment.createdAt}
                    </small>

                  </div>

                  <p className="mb-0 text-muted">
                    {comment.message}
                  </p>

                </div>

              ))}

            </div>

            {/* Leave Comment */}

            <div className="col-lg-5">

              <div
                className="bg-white shadow p-4"
                style={{
                  borderRadius: "80px 25px 80px 25px",
                }}
              >

                <h4 className="fw-bold mb-4">
                  Leave a Message
                </h4>

                <div className="mb-3">

                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={commentName}
                    onChange={(e) =>
                      setCommentName(e.target.value)
                    }
                  />

                </div>

                <div className="mb-4">

                  <label className="form-label">
                    Message
                  </label>

                  <textarea
                    rows="5"
                    className="form-control"
                    value={commentMessage}
                    onChange={(e) =>
                      setCommentMessage(e.target.value)
                    }
                  />

                </div>

                <button
                  className="btn btn-success rounded-pill px-4"
                >
                  Post Message
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

            {/* RELATED CAMPAIGNS */}

      <section className="container py-5">

        <div className="text-center mb-5">

          <h2 className="fw-bold">
            Related Campaigns
          </h2>

          <p className="text-muted">
            Explore other initiatives making a difference.
          </p>

        </div>

        <div className="row g-4">

          {relatedCampaigns.map((item) => (

            <div
              className="col-md-6 col-xl-4"
              key={item.id}
            >

              <CampaignCard
                campaign={item}
              />

            </div>

          ))}

        </div>

      </section>

            <CTASection />

    </>
  );
}

export default CampaignDetailsPage;