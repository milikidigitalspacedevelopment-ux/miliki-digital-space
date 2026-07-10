import NewsletterForm from "../footer/NewsletterForm";

function NewsletterSection() {
  return (
    <section className="bg-primary text-white py-3">

      <div className="container text-center">

        <h2 className="fw-bold">
          Stay Updated
        </h2>

        <p>
          Subscribe to our newsletter.
        </p>

        <div className="row justify-content-center">

          <div className="col-lg-6">
            <NewsletterForm />
          </div>

        </div>

      </div>

    </section>
  );
}

export default NewsletterSection;