import { forwardRef } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

const TopBar = forwardRef(function TopBar(_, ref) {
  return (
    <div ref={ref} className="topbar bg-primary text-light small py-2 w-100">
      <div className="container">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 flex-wrap">

          {/* Contact Info */}
          <div className="d-flex flex-column flex-sm-row align-items-center text-center text-sm-start gap-2 flex-wrap">
            <span className="topbar-phone">
              <FaPhoneAlt className="me-2" />
              +254 790 171131
            </span>

            <span className="d-none d-sm-inline">|</span>

            <span>
              <FaEnvelope className="me-2" />
              milikidigitalspace@gmail.com
            </span>
          </div>

          {/* Social Icons */}
          <div className="d-flex align-items-center gap-2 gap-md-3 mt-2 mt-md-0">
            <a
              href="#"
              className="text-dark me-2"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>

            <a
              href="#"
              className="text-dark"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
});

export default TopBar;