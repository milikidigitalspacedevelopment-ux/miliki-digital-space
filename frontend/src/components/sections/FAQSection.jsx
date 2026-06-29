function FAQSection() {
  return (
    <section className="py-5">

      <div className="container">

        <div className="text-center mb-5">

          <h2 className="fw-bold">
            Frequently Asked Questions
          </h2>

        </div>

        <div className="accordion" id="faqAccordion">

          <div
            className="accordion-item border-0 shadow-sm mb-3"
            style={{ borderRadius: "25px" }}
          >
            <h2 className="accordion-header">
              <button
                className="accordion-button rounded-4"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                How do I register?
              </button>
            </h2>

            <div
              id="faq1"
              className="accordion-collapse collapse show"
            >
              <div className="accordion-body">
                Create an account and choose your preferred program.
              </div>
            </div>
          </div>

          <div
            className="accordion-item border-0 shadow-sm mb-3"
            style={{ borderRadius: "25px" }}
          >
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed rounded-4"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                Can I volunteer?
              </button>
            </h2>

            <div
              id="faq2"
              className="accordion-collapse collapse"
            >
              <div className="accordion-body">
                Yes. Volunteers are always welcome.
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

export default FAQSection;