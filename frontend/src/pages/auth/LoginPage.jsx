import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import authService from "../../services/authService";
import useAuthStore from "../../store/authStore";
import redirectByRole from "../../utils/redirectByRole";
import { ENV } from "../../configs/environment";
import "../../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();

  const loginStore = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await authService.login({
        email: formData.email,
        password: formData.password,
          rememberMe: formData.rememberMe,
      });

      const authData = response?.data || response;
        const { user, accessToken, refreshToken } = authData;

        loginStore({ user, token: accessToken, rememberMe: formData.rememberMe });

        try {
          if (formData.rememberMe) {
            localStorage.setItem("refreshToken", refreshToken);
          } else {
            sessionStorage.setItem("refreshToken", refreshToken);
          }
        } catch (err) {
          // ignore storage errors
        }

      navigate(redirectByRole(user.role));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="row g-0 align-items-stretch w-100">
        <div className="col-lg-6 d-none d-lg-flex auth-hero-panel">
          <div className="auth-hero-content">
            <img src="/logo.png" alt="Miliki hero" className="auth-hero-image" />
            <h3>Welcome back to Miliki</h3>
            <p className="text-muted mb-4">
              Sign in to continue managing your learning, donations, and volunteer activities.
            </p>
            <ul className="hero-benefits list-unstyled mb-0">
              <li>• Secure access with token-based login</li>
              <li>• Personalized dashboard for your role</li>
              <li>• Fast recovery and verification flows</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="auth-card-body p-5">
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4">
              <div>
                <h2 className="auth-title mb-2">Welcome Back</h2>
                <p className="text-muted mb-0">Sign in to continue.</p>
              </div>
              <div className="step-pill text-muted">Login</div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <a
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
                href={`${ENV.API_URL || "/api"}/auth/google`}
              >
                <FcGoogle size={20} />
                Continue with Google
              </a>
              <div className="text-center text-muted mb-3">or sign in with your email</div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Remember Me</label>
                </div>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Signing In..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="mb-0 text-muted">Don’t have an account? <Link to="/register">Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;