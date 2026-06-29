import { Link } from "react-router-dom";
import NewsletterForm from "./NewsletterForm";
import SocialLinks from "./SocialLinks";

function Footer() {
  console.log("[dev] Footer render");
  return (
    <footer className="bg-success text-light pt-5">

      <div className="container">

        <div className="row g-4">

          {/* About */}
          <div className="col-sm-6 col-lg-4">
            <h4 className="fw-bold text-warning">
              Miliki Digital Space
            </h4>

            <p className="mt-3">
              Empowering youths and women through digital
              skills, entrepreneurship and innovation.
            </p>

            <SocialLinks />
          </div>

          {/* Quick Links */}
          <div className="col-sm-6 col-lg-2">
            <h5>Quick Links</h5>

            <ul className="list-unstyled">

              <li>
                <Link className="text-light" to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link className="text-light" to="/about">
                  About
                </Link>
              </li>

              <li>
                <Link className="text-light" to="/programs">
                  Programs
                </Link>
              </li>

              <li>
                <Link className="text-light" to="/courses">
                  Courses
                </Link>
              </li>

              <li>
                <Link className="text-light" to="/donate">
                  Donate
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div className="col-sm-6 col-lg-3">
            <h5>Contact Us</h5>

            <p>
              📞 +254 790 171131
            </p>

            <p>
              ✉️ milikidigitalspace@gmail.com
            </p>

            <p>
              📍 Gatundu South, Kenya
            </p>

          </div>

          {/* Newsletter */}
          <div className="col-sm-6 col-lg-3">
            <h5>Newsletter</h5>

            <p>
              Stay updated with our latest programs and events.
            </p>

            <NewsletterForm />
          </div>

        </div>

        <hr className="my-4" />

        <div className="d-flex justify-content-between flex-column flex-md-row pb-3">

          <p className="mb-0">
            © {new Date().getFullYear()} Miliki Digital Space.
            All rights reserved.
          </p>

          <div>

            <Link
              className="text-light me-3"
              to="/privacy-policy"
            >
              Privacy Policy
            </Link>

            <Link
              className="text-light"
              to="/terms"
            >
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;