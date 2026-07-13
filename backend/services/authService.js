import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken
} from "../repositories/userRepository.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../config/email.js";

const VERIFY_EMAIL_SECRET = process.env.JWT_VERIFY_EMAIL_SECRET || "verify-email-secret";
const PASSWORD_RESET_SECRET = process.env.JWT_PASSWORD_RESET_SECRET || "password-reset-secret";
const VERIFY_EMAIL_EXPIRES = process.env.JWT_VERIFY_EMAIL_EXPIRES || "1d";
const PASSWORD_RESET_EXPIRES = process.env.JWT_PASSWORD_RESET_EXPIRES || "1h";

function getGoogleAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function getZohoAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.ZOHO_CLIENT_ID,
    redirect_uri: process.env.ZOHO_REDIRECT_URI,
    response_type: "code",
    // `offline_access` is required for Zoho to include a refresh token in the
    // authorization-code exchange.
    scope: "ZohoMail.accounts.READ,offline_access",
    access_type: "offline",
    prompt: "consent",
  });
  
  console.log("Generating Zoho authorization URL with params:", params.toString());
  // ZOHO_ACCOUNTS_HOST is like https://accounts.zoho.eu
  return `${process.env.ZOHO_ACCOUNTS_HOST.replace(/\/$/, "")}/oauth/v2/auth?${params.toString()}`;
}

async function readZohoResponse(response) {
  const body = await response.text();

  try {
    return JSON.parse(body);
  } catch {
    const contentType = response.headers.get("content-type") || "unknown";
    const error = new Error(
      `Zoho returned a non-JSON response (HTTP ${response.status}, content type: ${contentType}). ` +
        "Check that ZOHO_ACCOUNTS_HOST uses your Zoho data-center domain."
    );
    error.status = 502;
    throw error;
  }
}

async function exchangeZohoCode(code) {
  const tokenUrl = `${process.env.ZOHO_ACCOUNTS_HOST.replace(/\/$/, "")}/oauth/v2/token`;
  console.log("Token URL:", tokenUrl);

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: process.env.ZOHO_REDIRECT_URI,
    }),
  });

  const data = await readZohoResponse(response);
  console.log("Status:", response.status);
  console.log("Token response:", data);
  if (!response.ok || !data.access_token) {
    const error = new Error(data.error_description || "Zoho token exchange failed");
    error.status = 400;
    throw error;
  }

  return data;
}

async function loginWithZohoCode(code) {
  const tokenData = await exchangeZohoCode(code);
  const accessToken = tokenData.access_token;

  // Try to get account info (email) from Zoho Mail API
  const mailHost = process.env.ZOHO_MAIL_HOST || "https://mail.zoho.com";
  const res = await fetch(`${mailHost.replace(/\/$/, "")}/api/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  });
  
  console.log("Mail status:", res.status);

  
  const accountData = await readZohoResponse(res);
  console.log(accountData);
  const account = accountData?.data?.[0] || accountData?.data || {};
  const email = account?.email || account?.accountName || account?.accountId || null;

  if (!email) {
    const error = new Error("Zoho account email not available");
    error.status = 400;
    throw error;
  }

  const name = account?.accountName || email.split("@")[0];

  let user = await findUserByEmail(email);
  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(randomPassword, salt);

    user = await createUser({
      name,
      email,
      password,
      role: "public",
      profile: { provider: "zoho" },
    });
  }

  const access = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

  const decoded = jwt.decode(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;
  if (expiresAt) await saveRefreshToken(user.id, refreshToken, expiresAt);

  return { user, accessToken: access, refreshToken };
}

async function exchangeGoogleCode(code) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.id_token) {
    const error = new Error(data.error_description || "Google token exchange failed");
    error.status = 400;
    throw error;
  }

  return data;
}

async function verifyGoogleIdToken(idToken) {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );

  const tokenInfo = await response.json();
  if (!response.ok || !tokenInfo.email_verified) {
    const error = new Error("Google account verification failed");
    error.status = 400;
    throw error;
  }

  return tokenInfo;
}

async function loginWithGoogleCode(code) {
  const tokenData = await exchangeGoogleCode(code);
  const tokenInfo = await verifyGoogleIdToken(tokenData.id_token);

  const email = tokenInfo.email;
  const name = tokenInfo.name || tokenInfo.email.split("@")[0];
  const googleId = tokenInfo.sub;

  let user = await findUserByEmail(email);
  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(randomPassword, salt);

    user = await createUser({
      name,
      email,
      password,
      role: "public",
      profile: { provider: "google", googleId },
    });
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

  const decoded = jwt.decode(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;
  if (expiresAt) await saveRefreshToken(user.id, refreshToken, expiresAt);

  return { user, accessToken, refreshToken };
}

function generateVerifyEmailToken(userId) {
  return jwt.sign({ userId }, VERIFY_EMAIL_SECRET, { expiresIn: VERIFY_EMAIL_EXPIRES });
}

function generateResetPasswordToken(userId) {
  return jwt.sign({ userId }, PASSWORD_RESET_SECRET, { expiresIn: PASSWORD_RESET_EXPIRES });
}

function verifyEmailToken(token) {
  return jwt.verify(token, VERIFY_EMAIL_SECRET);
}

function verifyResetPasswordToken(token) {
  return jwt.verify(token, PASSWORD_RESET_SECRET);
}

async function forgotPassword(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    return { message: "If an account exists for that email, password reset instructions have been sent." };
  }

  const resetToken = generateResetPasswordToken(user.id);

  try {
    await sendPasswordResetEmail({ to: user.email, name: user.name, token: resetToken });
    return { message: "Password reset instructions have been sent to your email." };
  } catch (err) {
    console.error("Password reset email failed:", err.message);
    return { message: "We could not send the password reset email right now. Please try again." };
  }
}

async function resetPassword({ token, password }) {
  const payload = verifyResetPasswordToken(token);
  const user = await findUserById(payload.userId);
  if (!user) {
    const error = new Error("Invalid reset token.");
    error.status = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  await updateUserById(user.id, { password: hashed });

  return { message: "Password has been updated successfully." };
}

async function verifyEmail(token) {
  const payload = verifyEmailToken(token);
  const user = await findUserById(payload.userId);
  if (!user) {
    const error = new Error("Invalid verification token.");
    error.status = 400;
    throw error;
  }

  await updateUserById(user.id, { is_verified: true });
  return { message: "Email verified successfully." };
}

async function resendVerificationEmail(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    return {
      message: "If an account exists for that email, verification instructions have been sent.",
      checkpoint: {
        accountCreated: false,
        verificationEmailSent: false,
        emailVerified: false,
      },
    };
  }

  const verificationToken = generateVerifyEmailToken(user.id);
  const emailDebug = {
    recipient: user.email,
    verificationTokenPreview: verificationToken.slice(0, 20),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    zohoConfigured: Boolean(process.env.ZOHO_REFRESH_TOKEN && process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_FROM),
  };

  console.log("[AUTH_DEBUG] verification email resend", emailDebug);

  try {
    await sendVerificationEmail({ to: user.email, name: user.name, token: verificationToken });
    console.log("[AUTH_DEBUG] verification email resend success", {
      ...emailDebug,
      status: "sent",
    });

    return {
      message: "Verification instructions have been sent to your email.",
      checkpoint: {
        accountCreated: true,
        verificationEmailSent: true,
        emailVerified: false,
      },
      debug: emailDebug,
    };
  } catch (err) {
    console.error("[AUTH_DEBUG] verification email resend failed", {
      ...emailDebug,
      status: "failed",
      error: err.message,
    });
    return {
      message: "We could not send the verification email right now. Please try again.",
      checkpoint: {
        accountCreated: true,
        verificationEmailSent: false,
        emailVerified: false,
        error: err.message,
      },
      debug: emailDebug,
    };
  }
}

async function register({ name, email, password, role, profile = {} }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    const error = new Error("Email already in use");
    error.status = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await createUser({ name, email, password: hashed, role, profile });
  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

  const verificationToken = generateVerifyEmailToken(user.id);

  let verificationEmailSent = false;
  let verificationError = null;
  const emailDebug = {
    recipient: user.email,
    verificationTokenPreview: verificationToken.slice(0, 20),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    zohoConfigured: Boolean(process.env.ZOHO_REFRESH_TOKEN && process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_FROM),
  };

  console.log("[AUTH_DEBUG] registration email attempt", emailDebug);

  try {
    await sendVerificationEmail({ to: user.email, name: user.name, token: verificationToken });
    verificationEmailSent = true;
    console.log("[AUTH_DEBUG] verification email sent successfully", {
      ...emailDebug,
      status: "sent",
    });
  } catch (err) {
    verificationError = err.message;
    console.error("[AUTH_DEBUG] verification email dispatch failed", {
      ...emailDebug,
      status: "failed",
      error: verificationError,
    });
  }

  const decoded = jwt.decode(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;
  if (expiresAt) await saveRefreshToken(user.id, refreshToken, expiresAt);

  return {
    user,
    accessToken,
    refreshToken,
    message: "Account created successfully. Please check your inbox for the verification email.",
    checkpoint: {
      accountCreated: true,
      verificationEmailSent: verificationEmailSent,
      emailVerified: false,
    },
    details: verificationError ? { verificationError } : undefined,
    debug: emailDebug,
  };
}

async function login({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  // Support rememberMe by allowing longer refresh token expiry when requested
  // Default behaviour uses REFRESH_EXPIRES in utils/generateToken.js
  const remember = arguments[0]?.rememberMe;
  const refreshToken = remember
    ? generateRefreshToken({ userId: user.id, role: user.role }, process.env.JWT_REFRESH_REMEMBER_EXPIRES || "30d")
    : generateRefreshToken({ userId: user.id, role: user.role });

  const decoded = jwt.decode(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;
  if (expiresAt) await saveRefreshToken(user.id, refreshToken, expiresAt);

  return { user, accessToken, refreshToken };
}

async function refresh({ token }) {
  const stored = await findRefreshToken(token);
  if (!stored) {
    const error = new Error("Invalid refresh token");
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken({ userId: stored.user_id, role: null });
  return { accessToken };
}

async function logout({ token }) {
  await deleteRefreshToken(token);
}

export {
  getGoogleAuthUrl,
  getZohoAuthUrl,
  loginWithZohoCode,
  loginWithGoogleCode,
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};
