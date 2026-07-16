import ContactSection from "../../components/sections/ContactSection";
import FAQSection from "../../components/sections/FAQSection";
import NewsletterSection from "../../components/sections/NewsletterSection";

function ContactPage() {
  return (
    <>
      <ContactSection />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body p-4">
                  <h3 className="fw-bold mb-3">Visit us</h3>
                  <p className="text-muted mb-4">We are based in Nairobi and welcome visits from partners, volunteers, and supporters.</p>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2"><strong>Address:</strong> Nairobi, Kenya</li>
                    <li className="mb-2"><strong>Email:</strong> info@miliki.org</li>
                    <li className="mb-2"><strong>Phone:</strong> +254790171131</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body p-4">
                  <h3 className="fw-bold mb-3">Prefer a quick call?</h3>
                  <p className="text-muted mb-4">We aim to respond within one working day and can help you with volunteering, partnerships, or program enquiries.</p>
                  <a href="mailto:info@miliki.org" className="btn btn-success rounded-pill">Email us now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
      <NewsletterSection />
    </>
  );
}

export default ContactPage;