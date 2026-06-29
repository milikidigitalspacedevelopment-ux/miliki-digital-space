import { Route } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import GoogleCallbackPage from "../pages/auth/GoogleCallbackPage";

function AuthRoutes() {
  return (
    <Route element={<AuthLayout />}>

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPasswordPage />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmailPage />}
      />

      <Route
        path="/auth/google/callback"
        element={<GoogleCallbackPage />}
      />

    </Route>
  );
}

export default AuthRoutes;