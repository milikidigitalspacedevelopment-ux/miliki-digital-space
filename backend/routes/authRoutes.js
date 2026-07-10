import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";
import {
  register,
  login,
  refresh,
  logout,
  authorizeGoogle,
  authorizeZoho,
  handleGoogleCallback,
  handleZohoCallback,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.get("/google", authorizeGoogle);
router.get("/google/callback", handleGoogleCallback);
router.get("/zoho", authorizeZoho);
router.get("/zoho/callback", handleZohoCallback);
router.get("/me", authenticate, getProfile);

export default router;
