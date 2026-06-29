import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import '../../styles/auth.css';

const countryDialCodes = {
  US: "+1",
  CA: "+1",
  GB: "+44",
  KE: "+254",
  UG: "+256",
  TZ: "+255",
  RW: "+250",
  ZA: "+27",
  NG: "+234",
  GH: "+233",
  ET: "+251",
  IN: "+91",
  AE: "+971",
  SA: "+966",
  QA: "+974",
  AU: "+61",
  NZ: "+64",
};

const getDefaultCountryCode = () => {
  if (typeof window === "undefined") {
    return "+254";
  }

  const languages = [navigator.language, ...(navigator.languages || [])];

  for (const language of languages) {
    const region = language?.split("-")[1]?.toUpperCase();

    if (region && countryDialCodes[region]) {
      return countryDialCodes[region];
    }
  }

  const resolvedRegion = Intl.DateTimeFormat().resolvedOptions().region?.toUpperCase();
  return countryDialCodes[resolvedRegion] || "+254";
};

const normalizeCountryCode = (value) => {
  const cleaned = `${value || ""}`.replace(/[^\d+]/g, "");

  if (!cleaned) {
    return "";
  }

  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
};

function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "student",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const [stepSuccess, setStepSuccess] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneCountryCode, setPhoneCountryCode] = useState(getDefaultCountryCode);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCheckpoint, setVerificationCheckpoint] = useState({
    accountCreated: false,
    verificationEmailSent: false,
    emailVerified: false,
  });

  const stepLabels = ["Details", "Verify Email", "Finish"];

  const handleChange = (e) => {
    const { name, value, checked, type } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const passwordChecks = useMemo(() => {
    const password = formData.password;

    return {
      minLength: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special:
        /[!@#$%^&*(),.?":{}|<>]/.test(
          password
        ),
    };
  }, [formData.password]);

  const strength = Object.values(
    passwordChecks
  ).filter(Boolean).length;

  const strengthLabel = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Excellent",
  ][strength];

  const passwordsMatch =
    formData.password ===
    formData.confirmPassword;

  useEffect(() => {
    const fullPhone = `${phoneCountryCode}${phoneNumber}`.trim();
    setFormData((prev) => ({ ...prev, phone: fullPhone }));
  }, [phoneCountryCode, phoneNumber]);

  useEffect(() => {
    if (!resendTimer) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendTimer]);

  const phonePattern = /^\+\d{1,4}\d{4,14}$/;
  const isPhoneValid = phonePattern.test(`${phoneCountryCode}${phoneNumber}`.trim());

  const formatTimer = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleSendCode = async () => {
    if (!formData.email.trim()) {
      setStepError("Enter your email address before sending a verification email.");
      setStepSuccess("");
      return;
    }

    if (!isPhoneValid) {
      setStepError("Enter a valid phone number with your selected country code.");
      setStepSuccess("");
      return;
    }

    try {
      setSendingCode(true);
      setStepError("");
      setStepSuccess("");

      const response = await authService.resendVerificationEmail(formData.email.trim().toLowerCase());

      setVerificationEmailSent(true);
      setEmailVerified(false);
      setResendTimer(60);
      setVerificationCheckpoint(response?.checkpoint || {
        accountCreated: true,
        verificationEmailSent: true,
        emailVerified: false,
      });
      setStepSuccess(response?.message || "A verification email has been sent. Open it and click the link to verify your address.");
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setStepError(serverMsg || "We could not send the verification email. Please try again.");
      setStepSuccess("");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyEmail = () => {
    if (!verificationEmailSent) {
      setStepError("Send the verification email first.");
      setStepSuccess("");
      return;
    }

    setEmailVerified(true);
    setVerificationCheckpoint((prev) => ({ ...prev, emailVerified: true }));
    setStepError("");
    setStepSuccess("Email verification is pending until you open the link in your inbox.");
  };

  const handleNextStep = () => {
    setStepError("");
    setStepSuccess("");

    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !isPhoneValid) {
        setStepError("Please complete your account details and provide a valid phone number.");
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      if (!verificationEmailSent) {
        setStepError("Please send the verification email before continuing.");
        return;
      }
      if (!passwordsMatch) {
        setStepError("Passwords must match.");
        return;
      }
      if (strength < 4) {
        setStepError("Choose a stronger password before continuing.");
        return;
      }

      setStep(3);
    }
  };

  const handleBackStep = () => {
    setStepError("");
    setStepSuccess("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!passwordsMatch) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (!formData.termsAccepted) {
      setError(
        "Please accept the terms and conditions."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        profile: { phone: formData.phone.trim() },
      };

      const res = await authService.register(payload);

      setSuccess(res?.message || 'Registration successful. Please verify your email.');
      setVerificationCheckpoint(res?.checkpoint || {
        accountCreated: true,
        verificationEmailSent: true,
        emailVerified: false,
      });
      setVerificationEmailSent(Boolean(res?.checkpoint?.verificationEmailSent));

      setTimeout(() => navigate('/verify-email'), 1200);
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      const validationErrors = err?.response?.data?.errors;

      if (validationErrors && typeof validationErrors === 'object') {
        const msgs = Object.values(validationErrors).flat().join(' ');
        setError(msgs || serverMsg || 'Registration failed.');
      } else {
        setError(serverMsg || 'Registration failed.');
      }
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
            <h3>Welcome to Miliki</h3>
            <p className="text-muted">
              Register in a few easy steps to join students, donors, and volunteers building impact.
            </p>
            <ul className="hero-benefits list-unstyled mb-0">
              <li>• Secure account setup</li>
              <li>• Phone verification for your profile</li>
              <li>• Personalized onboarding experience</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="auth-card-body">
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4">
              <div>
                <h2 className="auth-title mb-2">Create Account</h2>
                <p className="text-muted mb-0">Step {step} of {stepLabels.length}</p>
              </div>
              <div className="step-pill text-muted">{stepLabels[step - 1]}</div>
            </div>

              <div className="stepper mb-4">
                {stepLabels.map((label, index) => {
                  const number = index + 1;
                  const active = number === step;
                  const complete = number < step;

                  return (
                    <div key={label} className={`step-item ${active ? 'active' : ''} ${complete ? 'complete' : ''}`}>
                      <div className="step-badge">{number}</div>
                      <div className="step-label">{label}</div>
                    </div>
                  );
                })}
              </div>

              {stepError && <div className="alert alert-danger">{stepError}</div>}
              {stepSuccess && <div className="alert alert-success">{stepSuccess}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                {step === 1 && (
                  <>
                    <div className="row gx-2">
                      <div className="col-12 col-md-6 mb-3">
                        <label className="form-label">First name</label>
                        <input
                          className="form-control"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          aria-label="First name"
                        />
                      </div>

                      <div className="col-12 col-md-6 mb-3">
                        <label className="form-label">Last name</label>
                        <input
                          className="form-control"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          aria-label="Last name"
                        />
                      </div>

                      <div className="col-12 mb-3">
                        <label className="form-label">Email address</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12 mb-3">
                        <label className="form-label">Phone number</label>
                        <div className="row g-2 align-items-start">
                          <div className="col-12 col-sm-4">
                            <label className="form-label small text-muted">Country code</label>
                            <input
                              type="text"
                              className="form-control"
                              value={phoneCountryCode}
                              onChange={(e) => setPhoneCountryCode(normalizeCountryCode(e.target.value))}
                              placeholder="+254"
                              inputMode="tel"
                              aria-label="Country code"
                            />
                          </div>
                          <div className="col-12 col-sm-8">
                            <label className="form-label small text-muted">Mobile number</label>
                            <input
                              type="tel"
                              className="form-control"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                              placeholder="712345678"
                              inputMode="tel"
                              aria-label="Phone number"
                            />
                          </div>
                        </div>
                        <small className="text-muted d-block mt-2">
                          Your country code is detected automatically and works for international numbers.
                        </small>
                      </div>

                      <div className="col-12 mb-4">
                        <label className="form-label">Role</label>
                        <select
                          className="form-select"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="student">Student</option>
                          <option value="donor">Donor</option>
                          <option value="volunteer">Volunteer</option>
                        </select>
                      </div>
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                      <button type="button" className="btn btn-outline-secondary" onClick={handleNextStep}>
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Email verification</label>
                      <div className="d-flex gap-2 flex-column flex-sm-row align-items-start">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={handleSendCode}
                          disabled={sendingCode || resendTimer > 0}
                        >
                          {sendingCode ? 'Sending...' : resendTimer > 0 ? `Resend in ${formatTimer(resendTimer)}` : verificationEmailSent ? 'Resend verification email' : 'Send verification email'}
                        </button>
                        <span className="text-muted align-self-center">
                          A verification link will be sent to {formData.email || 'your email'}.
                        </span>
                      </div>
                    </div>

                    <div className="mb-3 p-3 rounded-3 bg-light">
                      <div className="fw-semibold mb-2">Verification checkpoints</div>
                      <ul className="small mb-0 ps-3">
                        <li className={verificationCheckpoint.accountCreated ? 'text-success' : 'text-muted'}>Account details captured</li>
                        <li className={verificationCheckpoint.verificationEmailSent ? 'text-success' : 'text-muted'}>Verification email requested</li>
                        <li className={verificationCheckpoint.emailVerified ? 'text-success' : 'text-muted'}>Email verified via the link in your inbox</li>
                      </ul>
                    </div>

                    {verificationEmailSent && (
                      <div className="mb-3">
                        <button type="button" className="btn btn-outline-secondary" onClick={handleVerifyEmail}>
                          I’ve opened the verification email
                        </button>
                        {emailVerified && <small className="text-success d-block mt-2">You can continue once you confirm the email link.</small>}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          aria-describedby="passwordHelp"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm password</label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-control"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          aria-invalid={formData.confirmPassword && !passwordsMatch}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      {formData.confirmPassword && !passwordsMatch && (
                        <small className="text-danger">Passwords do not match.</small>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <small id="passwordHelp" className="text-muted">Strength: {strengthLabel}</small>
                        <small className="text-muted">{strength}/5</small>
                      </div>
                      <div className="progress mt-2">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${strength * 20}%` }}
                          aria-valuenow={strength * 20}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                      <ul className="password-checks small mb-0 mt-2">
                        <li className={passwordChecks.minLength ? 'valid' : 'invalid'}>At least 8 characters</li>
                        <li className={passwordChecks.upperCase ? 'valid' : 'invalid'}>Uppercase letter</li>
                        <li className={passwordChecks.lowerCase ? 'valid' : 'invalid'}>Lowercase letter</li>
                        <li className={passwordChecks.number ? 'valid' : 'invalid'}>Number</li>
                        <li className={passwordChecks.special ? 'valid' : 'invalid'}>Special character</li>
                      </ul>
                    </div>

                    <div className="d-flex gap-2 justify-content-between">
                      <button type="button" className="btn btn-outline-secondary" onClick={handleBackStep}>
                        Back
                      </button>
                      <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Review & accept</label>
                      <div className="p-3 rounded-3 bg-light">
                        <p className="mb-1"><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                        <p className="mb-1"><strong>Email:</strong> {formData.email}</p>
                        <p className="mb-1"><strong>Phone:</strong> {formData.phone}</p>
                        <p className="mb-0"><strong>Role:</strong> {formData.role}</p>
                      </div>
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="termsAccepted"
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                      />
                      <label htmlFor="termsAccepted" className="form-check-label">
                        I accept the Terms and Conditions
                      </label>
                    </div>

                    <div className="d-flex gap-2 justify-content-between align-items-center flex-column flex-sm-row">
                      <button type="button" className="btn btn-outline-secondary" onClick={handleBackStep}>
                        Back
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading || !formData.termsAccepted}>
                        {loading ? 'Creating account...' : 'Create account'}
                      </button>
                    </div>
                  </>
                )}
              </form>

              <hr />
              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default RegisterPage;