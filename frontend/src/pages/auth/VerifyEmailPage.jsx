import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/authService";
import "../../styles/auth.css";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  const verifyEmail = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Verification token is missing or invalid.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authService.verifyEmail(token);

      if (response?.success || response?.data?.success !== false) {
        setSuccess(true);

        const redirectTimer = setTimeout(() => {
          navigate("/login");
        }, 5000);

        return () => clearTimeout(redirectTimer);
      }
    } catch (err) {
      setSuccess(false);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Verification failed. The link may have expired or already been used."
      );
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    let cleanup;

    const runVerification = async () => {
      cleanup = await verifyEmail();
    };

    runVerification();

    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, [verifyEmail]);

  const resendVerification = async () => {
    if (!email) return;

    try {
      setResending(true);

      await authService.resendVerificationEmail(email);

      alert(
        `A new verification email has been sent to ${email}. Please check your inbox and spam folder.`
      );
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to resend verification email."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="row g-0 align-items-stretch w-100">
        <div className="col-lg-6 d-none d-lg-flex auth-hero-panel">
          <div className="auth-hero-content">
            <img src="/auth-logo.png" alt="Miliki hero" className="auth-hero-image" />
            <h3>Almost there</h3>
            <p className="text-muted mb-4">
              Confirm your email to activate your Miliki account and unlock your dashboard.
            </p>
            <ul className="hero-benefits list-unstyled mb-0">
              <li>• Secure account activation</li>
              <li>• Fast access to your learning and community tools</li>
              <li>• Smooth sign-in after verification</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="auth-card-body p-4 p-sm-5">
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4">
              <div>
                <h2 className="auth-title mb-2">Verify Your Email</h2>
                <p className="text-muted mb-0">We’re confirming your account.</p>
              </div>
              <div className="step-pill text-muted">Verification</div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Loading */}
            {loading && (
              <div className="text-center py-3">
                <div className="spinner-border text-primary mb-4" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>

                <h4 className="fw-bold">Verifying your email...</h4>
                <p className="text-muted mb-0">
                  Please wait while we activate your account.
                </p>
              </div>
            )}

            {/* Success */}
            {!loading && success && (
              <div className="text-center py-3">
                <div className="display-1 text-success mb-3">✓</div>

                <h2 className="fw-bold">Email Verified Successfully</h2>
                <p className="text-muted">
                  Your account has been activated and is ready to use.
                </p>

                <div className="alert alert-success">
                  Redirecting you to the login page in 5 seconds...
                </div>

                <Link to="/login" className="btn btn-primary px-4">
                  Login Now
                </Link>
              </div>
            )}

            {/* Failed */}
            {!loading && !success && (
              <div className="text-center py-3">
                <div className="display-1 text-danger mb-3">✕</div>

                <h2 className="fw-bold">Verification Failed</h2>

                <div className="alert alert-danger">{error}</div>

                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  {email && (
                    <button
                      className="btn btn-warning"
                      disabled={resending}
                      onClick={resendVerification}
                    >
                      {resending ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />
                          Resending...
                        </>
                      ) : (
                        "Resend Verification Email"
                      )}
                    </button>
                  )}

                  <Link to="/login" className="btn btn-primary">
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;