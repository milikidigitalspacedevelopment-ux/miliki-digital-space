import ContactSection from "../../components/sections/ContactSection";
import FAQSection from "../../components/sections/FAQSection";
import NewsletterSection from "../../components/sections/NewsletterSection";

function ContactPage() {
  return (
    <>
      <ContactSection />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="overflow-hidden shadow" style={{ borderRadius: "40px" }}>
            <iframe
              title="location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3988.123456789012!2d36.9003507!3d-1.0078367!2m3!1f0!2f0!3f0!3m2!1m1!2s!5e0!3m2!1sen!2ske!4v0000000000000"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <FAQSection />
      <NewsletterSection />
    </>
  );
}

export default ContactPage;