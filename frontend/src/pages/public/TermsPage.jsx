import { Link } from "react-router-dom";

function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <section className="py-5">
        <div className="container">
          <div className="card border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: "32px" }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div>
                <p className="text-success fw-semibold mb-1">Terms & Conditions</p>
                <h2 className="fw-bold mb-0">The rules for using the Miliki Digital Space website</h2>
              </div>
              <Link to="/" className="btn btn-success rounded-pill">
                Back to Home
              </Link>
            </div>

            <p className="text-muted">
              By accessing and using this website, you agree to comply with these Terms & Conditions. If you do not agree, please do not use the website.
            </p>

            <h5 className="fw-bold mt-4">Use of website</h5>
            <p className="text-muted">
              This website is intended for informational and engagement purposes. You may use it to learn about our programs, contact us, and participate in community initiatives.
            </p>

            <h5 className="fw-bold mt-4">User responsibilities</h5>
            <p className="text-muted">
              You agree not to misuse the site, submit false information, or engage in any activity that may harm the website, our team, or other users.
            </p>

            <h5 className="fw-bold mt-4">Intellectual property</h5>
            <p className="text-muted">
              All content on this site, including text, graphics, logos, and media, belongs to Miliki Digital Space CBO unless otherwise stated. You may not reproduce or distribute it without permission.
            </p>

            <h5 className="fw-bold mt-4">Limitation of liability</h5>
            <p className="text-muted">
              Miliki Digital Space CBO shall not be held liable for any direct, indirect, or incidental damages arising from your use of the website.
            </p>

            <h5 className="fw-bold mt-4">Changes to terms</h5>
            <p className="text-muted mb-0">
              We may update these terms from time to time. Continued use of the website after changes are posted means you accept the revised terms.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsPage;
