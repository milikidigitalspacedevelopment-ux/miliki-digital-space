import ContactForm from "../forms/ContactForm";

function ContactSection() {
  return (
    <section className="py-3">

      <div className="container">

        <div className="row">

          <div className="col-lg-5">

            <h2 className="fw-bold mb-4">
              Contact Us
            </h2>

            <p>
              We'd love to hear from you.
            </p>

            <ul className="list-unstyled">
              <li>Email: info@miliki.org</li>
              <li>Phone: +254790171131</li>
              <li>Location: Nairobi, Kenya</li>
            </ul>

          </div>

          <div className="col-lg-7">

            <ContactForm />

          </div>

        </div>

      </div>

    </section>
  );
}

export default ContactSection;