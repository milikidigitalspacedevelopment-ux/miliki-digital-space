import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import "../../styles/auth.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      await authService.forgotPassword(email);

      setSuccess(
        "Password reset instructions have been sent to your email."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="row g-0 justify-content-center w-100">
        <div className="col-lg-5">
          <div className="auth-card-body p-5">
            <div className="mb-4">
              <h2 className="auth-title mb-2">Forgot Password</h2>
              <p className="text-muted mb-3">
                Enter your email address and we'll send instructions to reset your password.
              </p>
            </div>

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-4">
                  <label className="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>

              </form>

              <div className="text-center mt-4">
                <Link to="/login">Back to Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ForgotPasswordPage;