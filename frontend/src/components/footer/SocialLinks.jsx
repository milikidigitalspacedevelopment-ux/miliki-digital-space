import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

function SocialLinks() {
  return (
    <div className="d-flex gap-3 mt-3">

      <a href="#" className="text-white">
        <FaFacebookF />
      </a>

      <a href="#" className="text-white">
        <FaInstagram />
      </a>

      <a href="#" className="text-white">
        <FaLinkedinIn />
      </a>

      <a href="#" className="text-white">
        <FaYoutube />
      </a>

    </div>
  );
}

export default SocialLinks;