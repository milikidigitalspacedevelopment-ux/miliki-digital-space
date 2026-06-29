import heroImage from "../../assets/hero.png";

import PageBanner from "../../components/common/PageBanner";

import ContactSection from "../../components/sections/ContactSection";
import FAQSection from "../../components/sections/FAQSection";
import NewsletterSection from "../../components/sections/NewsletterSection";

function ContactPage() {
  return (
    <>
      <PageBanner
        title="Contact Us"
        subtitle="We'd love to hear from you."
        backgroundImage={heroImage}
      />

      <ContactSection />

      {/* Map Section */}
      <section className="py-5 bg-light">

        <div className="container">

          <div
            className="overflow-hidden shadow"
            style={{
              borderRadius: "40px"
            }}
          >
            <iframe
              title="location"
              src="https://maps.google.com/maps?q=Nairobi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
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