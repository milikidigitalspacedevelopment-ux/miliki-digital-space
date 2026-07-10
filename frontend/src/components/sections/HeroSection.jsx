import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/hero.css";

function HeroSection({
  title,
  subtitle,
  primaryText = "Get Started",
  primaryLink = "/register",
  secondaryText = "Learn More",
  secondaryLink = "/about",
  image,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Support both single image and array of images
  const images = Array.isArray(image) ? image : [image];
  const displayImage = images[currentImageIndex];

  // Rotate images every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="hero-section bg-light overflow-hidden">
      <div className="container">
        <div className="row align-items-center">

          {/* ===========================
              LEFT CONTENT
          =========================== */}
          <div className="col-lg-6 hero-text-column">

            <span className="hero-badge">
              Empowering Communities Through Innovation
            </span>

            <h1 className="hero-title">
              {title}
            </h1>

            <p className="hero-subtitle">
              {subtitle}
            </p>

            <div className="hero-buttons">

              <Link
                to={primaryLink}
                className="btn btn-success hero-primary-btn"
              >
                {primaryText}
              </Link>

              <Link
                to={secondaryLink}
                className="btn btn-outline-success hero-secondary-btn"
              >
                {secondaryText}
              </Link>

            </div>

          </div>

          {/* ===========================
              DESKTOP IMAGE
          =========================== */}
          <div className="col-lg-6 hero-image-column">

            <div className="hero-image-container">

              {/* Floating cards (desktop only) */}

              <div className="hero-stat-card stat-card-1">
                <h3>500+</h3>
                <p>Youth Empowered</p>
              </div>

              <div className="hero-stat-card stat-card-2">
                <h3>40+</h3>
                <p>Professional Courses</p>
              </div>

              <div className="hero-stat-card stat-card-3">
                <h3>25+</h3>
                <p>Strategic Partners</p>
              </div>

              <div className="hero-image-wrapper">
                <img
                  src={displayImage}
                  alt={title}
                  className="hero-image"
                />
              </div>

            </div>

          </div>

        </div>

        {/* ===========================
            MOBILE FLOATING IMAGE
        =========================== */}

        <div className="hero-mobile-image d-lg-none">

          <div className="hero-image-glow"></div>

          <div className="hero-image-badge">
            <strong>500+</strong>
            <span>Youth</span>
          </div>

          <div className="hero-image-wrapper">
            <img
              src={displayImage}
              alt={title}
              className="hero-image"
            />
          </div>

        </div>

        {/* ===========================
            MOBILE STATS
        =========================== */}

        <div className="hero-mobile-stats d-lg-none">

          <div className="stat">
            <h3>500+</h3>
            <small>Youth</small>
          </div>

          <div className="stat">
            <h3>40+</h3>
            <small>Courses</small>
          </div>

          <div className="stat">
            <h3>25+</h3>
            <small>Partners</small>
          </div>

          <div className="stat">
            <h3>100+</h3>
            <small>Programs</small>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;