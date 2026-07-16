import { Link } from "react-router-dom";

function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <section className="py-5">
        <div className="container">
          <div className="card border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: "32px" }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div>
                <p className="text-success fw-semibold mb-1">Privacy Policy</p>
                <h2 className="fw-bold mb-0">How Miliki Digital Space handles your information</h2>
              </div>
              <Link to="/" className="btn btn-success rounded-pill">
                Back to Home
              </Link>
            </div>

            <p className="text-muted">
              At Miliki Digital Space CBO, we respect your privacy and are committed to protecting the personal information you share with us through this website.
            </p>

            <h5 className="fw-bold mt-4">Information we collect</h5>
            <p className="text-muted">
              We may collect your name, email address, phone number, and other contact information when you register, contact us, subscribe to updates, or participate in our programs.
            </p>

            <h5 className="fw-bold mt-4">How we use your information</h5>
            <p className="text-muted">
              Your information may be used to respond to your inquiries, provide updates about our programs, improve our services, and support community engagement activities.
            </p>

            <h5 className="fw-bold mt-4">Data protection</h5>
            <p className="text-muted">
              We take reasonable steps to protect your personal data against unauthorized access, loss, misuse, or disclosure. However, no method of transmission over the internet is completely secure.
            </p>

            <h5 className="fw-bold mt-4">Third parties</h5>
            <p className="text-muted">
              We do not sell your personal information. We may share it with trusted service providers only when necessary to operate our website or deliver our services.
            </p>

            <h5 className="fw-bold mt-4">Your choices</h5>
            <p className="text-muted">
              You may contact us at any time to request access to, correction of, or deletion of your personal information, subject to applicable law.
            </p>

            <h5 className="fw-bold mt-4">Contact us</h5>
            <p className="text-muted mb-0">
              If you have questions about this policy, please contact us through the contact page on our website.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicyPage;
