import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../../services/authService";
import "../../styles/auth.css";

function ResetPasswordPage() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const checks = useMemo(() => {
    const password =
      formData.password;

    return {
      minLength:
        password.length >= 8,
      upperCase:
        /[A-Z]/.test(password),
      lowerCase:
        /[a-z]/.test(password),
      number:
        /\d/.test(password),
      special:
        /[!@#$%^&*]/.test(password),
    };
  }, [formData.password]);

  const passwordsMatch =
    formData.password ===
    formData.confirmPassword;

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");

    if (!passwordsMatch) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword(
        token,
        formData.password
      );

      setSuccess(
        "Password changed successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Reset failed."
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
              <h2 className="auth-title mb-2">Reset Password</h2>
              <p className="text-muted mb-3">
                Choose a new password for your account.
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

              {/* password */}

              <form onSubmit={handleSubmit}>
                {/* New Password */}

                <div className="mb-3">
                  <label>
                    New Password
                  </label>

                  <div className="input-group">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      className="form-control"
                      name="password"
                      value={
                        formData.password
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>
                </div>

                {/* Confirm Password */}

                <div className="mb-4">

                  <label>
                    Confirm Password
                  </label>

                  <div className="input-group">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      className="form-control"
                      name="confirmPassword"
                      value={
                        formData.confirmPassword
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>

                  </div>

                  {!passwordsMatch &&
                    formData.confirmPassword && (
                      <small className="text-danger">
                        Passwords do not match.
                      </small>
                    )}
                </div>

                <button
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Updating..."
                    : "Reset Password"}
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ResetPasswordPage;