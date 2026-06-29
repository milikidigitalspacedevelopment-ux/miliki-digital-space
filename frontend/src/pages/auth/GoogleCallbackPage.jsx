import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import redirectByRole from "../../utils/redirectByRole";

function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginStore = useAuthStore((state) => state.login);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userEncoded = searchParams.get("user");

    if (!accessToken || !userEncoded) {
      setError("Google login failed: missing authentication data.");
      return;
    }

    try {
      const userJson = decodeURIComponent(userEncoded);
      const userString = atob(userJson);
      const user = JSON.parse(userString);

      loginStore({ user, token: accessToken });
      localStorage.setItem("refreshToken", refreshToken);

      navigate(redirectByRole(user.role));
    } catch (err) {
      console.error(err);
      setError("Unable to process Google login response.");
    }
  }, [loginStore, navigate, searchParams]);

  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
      <div className="card shadow border-0 p-4" style={{ maxWidth: 500, width: "100%" }}>
        <div className="card-body text-center">
          {error ? (
            <>
              <h2 className="auth-title mb-3">Google Login Failed</h2>
              <p className="text-muted mb-4">{error}</p>
            </>
          ) : (
            <>
              <div className="spinner-border text-primary mb-3" role="status" />
              <h2 className="auth-title mb-3">Signing you in...</h2>
              <p className="text-muted">Completing your Google sign-in and redirecting now.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoogleCallbackPage;
